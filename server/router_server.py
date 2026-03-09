"""
Arch-Router-1.5B — FastAPI Server for ZomeAi

This server loads the local Arch-Router-1.5B model and provides:
  1. POST /api/route  — classify a user query into a route category
  2. POST /api/chat   — route the query, then forward to the best cloud model

Start with:
    cd server
    pip install -r requirements.txt
    python router_server.py
"""

import asyncio
import json
import os
import time
from typing import Any, Dict, List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
from transformers import AutoModelForCausalLM, AutoTokenizer

# ──────────────────────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────────────────────

MODEL_PATH = "/Users/hari-19343/HuggingFace/localModel/Arch-Router-1.5B"

HF_TOKEN = os.environ.get("HF_TOKEN", "")

# Route → cloud model mapping
ROUTE_MODEL_MAP = {
    "code_generation": "openai/gpt-oss-120b:groq",
    "bug_fixing": "openai/gpt-oss-120b:groq",
    "performance_optimization": "Qwen/Qwen3.5-35B-A3B:novita",
    "api_help": "moonshotai/Kimi-K2.5:novita",
    "programming": "openai/gpt-oss-120b:groq",
    "other": "openai/gpt-oss-120b:groq",
}

# Route display names (for the frontend)
ROUTE_DISPLAY_MAP = {
    "code_generation": "GPT-OSS (GROQ)",
    "bug_fixing": "GPT-OSS (GROQ)",
    "performance_optimization": "Qwen 3.5",
    "api_help": "Kimi-K2.5",
    "programming": "GPT-OSS (GROQ)",
    "other": "GPT-OSS (GROQ)",
}

ROUTE_CONFIG = [
    {
        "name": "code_generation",
        "description": "Generating new code snippets, functions, or boilerplate based on user prompts or requirements",
    },
    {
        "name": "bug_fixing",
        "description": "Identifying and fixing errors or bugs in the provided code across different programming languages",
    },
    {
        "name": "performance_optimization",
        "description": "Suggesting improvements to make code more efficient, readable, or scalable",
    },
    {
        "name": "api_help",
        "description": "Assisting with understanding or integrating external APIs and libraries",
    },
    {
        "name": "programming",
        "description": "Answering general programming questions, theory, or best practices",
    },
]

# ──────────────────────────────────────────────────────────────────────────────
# Prompt Templates
# ──────────────────────────────────────────────────────────────────────────────

TASK_INSTRUCTION = """
You are a helpful assistant designed to find the best suited route.
You are provided with route description within <routes></routes> XML tags:
<routes>

{routes}

</routes>

<conversation>

{conversation}

</conversation>
"""

FORMAT_PROMPT = """
Your task is to decide which route is best suit with user intent on the conversation in <conversation></conversation> XML tags.  Follow the instruction:
1. If the latest intent from user is irrelevant or user intent is full filled, response with other route {"route": "other"}.
2. You must analyze the route descriptions and find the best match route for user latest intent. 
3. You only response the name of the route that best matches the user's request, use the exact name in the <routes></routes>.

Based on your analysis, provide your response in the following JSON formats if you decide to match any route:
{"route": "route_name"} 
"""

# ──────────────────────────────────────────────────────────────────────────────
# App & Model Initialization
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(title="ZomeAi Arch-Router Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model references (loaded on startup)
router_model = None
router_tokenizer = None


@app.on_event("startup")
async def load_model():
    global router_model, router_tokenizer
    print("🔄 Loading Arch-Router-1.5B model...")
    print(f"   Path: {MODEL_PATH}")
    router_model = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH, device_map="auto", torch_dtype="auto", trust_remote_code=True
    )
    router_tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    print("✅ Arch-Router-1.5B loaded successfully!")


# ──────────────────────────────────────────────────────────────────────────────
# Helper Functions
# ──────────────────────────────────────────────────────────────────────────────


def format_prompt(
    route_config: List[Dict[str, Any]], conversation: List[Dict[str, Any]]
) -> str:
    return (
        TASK_INSTRUCTION.format(
            routes=json.dumps(route_config), conversation=json.dumps(conversation)
        )
        + FORMAT_PROMPT
    )


def run_routing(conversation: List[Dict[str, Any]]) -> str:
    """Run the router model to classify the conversation."""
    route_prompt = format_prompt(ROUTE_CONFIG, conversation)
    messages = [{"role": "user", "content": route_prompt}]

    tokenized = router_tokenizer.apply_chat_template(
        messages, add_generation_prompt=True, return_tensors="pt", return_dict=True
    )
    input_ids = tokenized["input_ids"].to(router_model.device)
    attention_mask = tokenized["attention_mask"].to(router_model.device)

    generated_ids = router_model.generate(
        input_ids=input_ids, attention_mask=attention_mask, max_new_tokens=128
    )

    prompt_length = input_ids.shape[1]
    generated_only = [ids[prompt_length:] for ids in generated_ids]
    response = router_tokenizer.batch_decode(generated_only, skip_special_tokens=True)[
        0
    ]

    # Parse the JSON response
    try:
        result = json.loads(response.strip())
        return result.get("route", "other")
    except json.JSONDecodeError:
        # Try to extract route name from partial response
        for route in ROUTE_CONFIG:
            if route["name"] in response:
                return route["name"]
        return "other"


def call_cloud_model(
    messages: List[Dict[str, str]], model_id: str
) -> str:
    """Forward the conversation to a HuggingFace cloud model."""
    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=HF_TOKEN,
    )

    response = client.chat.completions.create(
        model=model_id,
        messages=messages,
        temperature=0.7,
    )

    return response.choices[0].message.content

def stream_cloud_model(
    messages: List[Dict[str, str]], model_id: str
):
    """Forward the conversation to a HuggingFace cloud model and stream."""
    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=HF_TOKEN,
    )

    response = client.chat.completions.create(
        model=model_id,
        messages=messages,
        temperature=0.7,
        stream=True
    )

    for chunk in response:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


# ──────────────────────────────────────────────────────────────────────────────
# Request/Response Models
# ──────────────────────────────────────────────────────────────────────────────


class Message(BaseModel):
    role: str
    content: str


class RouteRequest(BaseModel):
    messages: List[Message]


class RouteResponse(BaseModel):
    route: str
    model: str
    display_name: str


class ChatRequest(BaseModel):
    messages: List[Message]
    model_override: Optional[str] = None


class ChatResponse(BaseModel):
    route: str
    routed_model: str
    routed_display_name: str
    content: str


# ──────────────────────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────────────────────


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": router_model is not None,
    }


@app.post("/api/route", response_model=RouteResponse)
async def route_query(request: RouteRequest):
    """Classify a user query into a route category."""
    if router_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    conversation = [{"role": m.role, "content": m.content} for m in request.messages]
    route = await asyncio.to_thread(run_routing, conversation)

    return RouteResponse(
        route=route,
        model=ROUTE_MODEL_MAP.get(route, ROUTE_MODEL_MAP["other"]),
        display_name=ROUTE_DISPLAY_MAP.get(route, ROUTE_DISPLAY_MAP["other"]),
    )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Route the query, then forward to the best cloud model and return the response."""
    if router_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    conversation = [{"role": m.role, "content": m.content} for m in request.messages]

    # Step 1: Route the query
    t0 = time.time()
    route = await asyncio.to_thread(run_routing, conversation)
    t1 = time.time()
    target_model = request.model_override or ROUTE_MODEL_MAP.get(
        route, ROUTE_MODEL_MAP["other"]
    )
    display_name = ROUTE_DISPLAY_MAP.get(route, ROUTE_DISPLAY_MAP["other"])

    print(f"🔀 Route: {route} → {display_name} ({target_model}) [{t1-t0:.2f}s]")

    # Step 2: Forward to cloud model
    try:
        t2 = time.time()
        content = await asyncio.to_thread(call_cloud_model, conversation, target_model)
        t3 = time.time()
        print(f"✅ Cloud response received [{t3-t2:.2f}s]")
    except Exception as e:
        raise HTTPException(
            status_code=502, detail=f"Cloud model error: {str(e)}"
        )

    return ChatResponse(
        route=route,
        routed_model=target_model,
        routed_display_name=display_name,
        content=content,
    )


@app.post("/api/chat_stream")
async def chat_stream(request: ChatRequest):
    """Route the query then stream the response using Server-Sent Events."""
    if router_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    conversation = [{"role": m.role, "content": m.content} for m in request.messages]

    # Pre-route synchronously since generator needs async wrapper
    route = await asyncio.to_thread(run_routing, conversation)
    target_model = request.model_override or ROUTE_MODEL_MAP.get(
        route, ROUTE_MODEL_MAP["other"]
    )
    display_name = ROUTE_DISPLAY_MAP.get(route, ROUTE_DISPLAY_MAP["other"])

    async def stream_generator():
        # First send the routing metadata
        meta = {
            "type": "metadata",
            "route": route,
            "routed_model": target_model,
            "routed_display_name": display_name
        }
        yield f"data: {json.dumps(meta)}\n\n"

        # Then stream chunks from cloud model
        try:
            for text_chunk in stream_cloud_model(conversation, target_model):
                chunk_data = {
                    "type": "chunk",
                    "content": text_chunk
                }
                yield f"data: {json.dumps(chunk_data)}\n\n"
        except Exception as e:
            error_data = {"type": "error", "error": str(e)}
            yield f"data: {json.dumps(error_data)}\n\n"
        
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream_generator(), media_type="text/event-stream")


# ──────────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("  ZomeAi — Arch-Router Server")
    print("=" * 60)
    print(f"  Model path : {MODEL_PATH}")
    print(f"  Server     : http://localhost:8000")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
