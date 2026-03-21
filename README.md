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
3. Set up your environment variables. Create a `.env` file in the root of the project:
   ```env
   VITE_HF_TOKEN=your_huggingface_token_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   - Get your [Hugging Face Token](https://huggingface.co/settings/tokens)
   - Get your Firebase config from the [Firebase Console](https://console.firebase.google.com/)

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
