# ZomeAi - HuggingFace Chat UI

ZomeAi is a modern, responsive React + Vite chat web application built to interface with various open-source AI models via the HuggingFace Router using the OpenAI SDK.

## Features

- **Sleek UI/UX:** Responsive design powered by Tailwind CSS and Framer Motion micro-animations.
- **Model Switching:** Easily swap between supported AI models during chat sessions.
- **Dark Mode Support:** Built-in Light/Dark mode toggling. 
- **HuggingFace Router Integration:** Fully configured to consume models using your Hugging Face Token over the standardized OpenAI structure.

## Currently Supported Models

The frontend exposes the following user-friendly model aliases in the UI which map to precise HuggingFace endpoints:
- `GPT-OSS (GROQ)` -> `openai/gpt-oss-120b:groq`
- `Qwen 3.5` -> `Qwen/Qwen3.5-35B-A3B:novita`
- `Kimi-K2.5` -> `moonshotai/Kimi-K2.5:novita`

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A valid [Hugging Face Token](https://huggingface.co/settings/tokens)

### Installation

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the root of the project with your Hugging Face token:
   ```env
   VITE_HF_TOKEN=your_token_here
   ```
   *Note: If deploying to a Node.js backend environment in the future, the app is also configured to read `HF_TOKEN` from the shell process.*

4. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- React 19
- Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React (Icons)
- OpenAI Node SDK (for HuggingFace routing)
