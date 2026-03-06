# ZOME Ai — Complete Project Documentation

> **Purpose of this document:** This is a self-contained reference for both humans and AI agents. If you are an AI resuming work on this project (e.g. after session reset), read this document first to understand the full codebase, architecture, data flow, and conventions.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | ZOME Ai (internal package name: `z_temp`) |
| **Type** | AI Chat Web Application |
| **Description** | A modern, responsive chat UI that connects to open-source AI models hosted on HuggingFace via the HuggingFace Router (OpenAI-compatible API). Users authenticate via Firebase, chat with multiple AI models, and have their conversations persisted in Firestore. |
| **Workspace Path** | `/Users/hari-19343/HuggingFace/ZomeAi` |

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | React | 19.2 |
| **Bundler** | Vite | 8 (beta) |
| **Styling** | Tailwind CSS | 4.2 (via `@tailwindcss/vite` plugin) |
| **Animations** | Framer Motion | 12.35 |
| **Icons** | Lucide React | 0.577 |
| **AI API Client** | OpenAI Node SDK | 6.27 (used for HuggingFace Router) |
| **Markdown** | react-markdown + remark-gfm + react-syntax-highlighter | — |
| **Auth / DB** | Firebase Auth + Firestore | firebase 12.10 |
| **Backend (unused)** | Firebase Cloud Functions | firebase-functions 7.0 (Node 24) |
| **Future DB** | Firebase Data Connect (PostgreSQL) | Configured but not active yet |
| **Font** | Plus Jakarta Sans (Google Fonts) | — |

---

## 3. Supported AI Models

The app supports model switching. Models are defined in `src/App.jsx` as UI aliases and mapped to HuggingFace Router endpoints in `src/services/api.js`:

| UI Alias | HuggingFace Model ID | Provider |
|---|---|---|
| GPT-OSS (GROQ) | `openai/gpt-oss-120b:groq` | Groq |
| Qwen 3.5 | `Qwen/Qwen3.5-35B-A3B:novita` | Novita |
| Kimi-K2.5 | `moonshotai/Kimi-K2.5:novita` | Novita |

**API Base URL:** `https://router.huggingface.co/v1`

---

## 4. Environment Variables

Create a `.env` file at the project root. All variables are prefixed with `VITE_` for Vite's client-side exposure:

```env
# HuggingFace API Token — required for AI model calls
VITE_HF_TOKEN=hf_xxxxxxxxxxxxx

# Firebase Configuration — required for auth and chat persistence
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 5. Project Structure (Annotated)

```
ZomeAi/
├── index.html                  # Vite entry — loads /src/main.jsx, sets font
├── package.json                # Dependencies & scripts (dev, build, lint, preview)
├── vite.config.js              # Vite config — React + Tailwind CSS plugins
├── eslint.config.js            # ESLint flat config — React Hooks + Refresh rules
├── firebase.json               # Firebase project config (Firestore: asia-south2, Auth: Email+Google)
├── firestore.rules             # Security: users can only read/write their own /users/{uid}/chats/*
├── firestore.indexes.json      # Firestore indexes (currently empty/default)
├── task.md                     # Development task checklist (all complete)
├── README.md                   # Basic project README
│
├── src/                        # === FRONTEND SOURCE ===
│   ├── main.jsx                # React 19 entry — StrictMode → <App />
│   ├── App.jsx                 # Root component — auth gate, state management, routing
│   ├── index.css               # Tailwind imports + custom theme tokens + base styles
│   │
│   ├── services/               # === SERVICE LAYER ===
│   │   ├── firebase.js         # Firebase initialization (app, auth, firestore, googleProvider)
│   │   ├── api.js              # OpenAI SDK client → HuggingFace Router (model aliases, chatCompletion)
│   │   └── chatService.js      # Firestore CRUD: loadChats, saveChat, deleteChat, updateChatTitle
│   │
│   ├── hooks/                  # === CUSTOM HOOKS ===
│   │   └── useAuth.js          # Auth state hook: user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout
│   │
│   ├── components/             # === UI COMPONENTS ===
│   │   ├── auth/
│   │   │   └── Login.jsx       # Full auth page (email/password + Google OAuth, sign-up/sign-in toggle)
│   │   │
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx  # Shell: Sidebar + TopHeader + children (main content area)
│   │   │   ├── Sidebar.jsx     # Chat history list, new chat button, edit/delete/rename, logout
│   │   │   └── LeftNav.jsx     # Expandable icon-based left spine nav (NOT currently used in MainLayout)
│   │   │
│   │   ├── chat/
│   │   │   ├── TopHeader.jsx   # Model selector dropdown, light/dark theme toggle, active chat title
│   │   │   ├── MainChat.jsx    # Active chat: message state, API calls, auto-fetch first response
│   │   │   ├── MessageList.jsx # Renders user/AI messages with Markdown, code highlighting, action buttons
│   │   │   ├── ChatInput.jsx   # Text input with send button, attachment dropdown (media/code upload)
│   │   │   └── EmptyState.jsx  # Shown when no chat is active — greeting + initial input to start chat
│   │   │
│   │   ├── common/
│   │   │   └── UserAvatar.jsx  # User avatar (photo URL or initial-based gradient fallback)
│   │   │
│   │   └── ui/                 # (Empty — reserved for shared UI primitives)
│   │
│   ├── features/               # (Empty — reserved for feature modules)
│   ├── pages/                  # (Empty — reserved for page-level components)
│   └── assets/                 # (Empty — reserved for static assets)
│
├── functions/                  # === FIREBASE CLOUD FUNCTIONS (UNUSED) ===
│   ├── index.js                # Placeholder — no deployed functions, maxInstances: 10
│   └── package.json            # Node 24, firebase-functions 7.0
│
├── dataconnect/                # === FIREBASE DATA CONNECT (FUTURE) ===
│   ├── dataconnect.yaml        # Service config: "zomeai", us-east4, PostgreSQL via CloudSQL
│   ├── schema/
│   │   └── schema.gql          # GraphQL schema: User, Model, ChatSession, Message, Feedback tables
│   ├── example/
│   │   ├── connector.yaml      # JS SDK codegen config (output → src/dataconnect-generated)
│   │   └── queries.gql         # GraphQL queries/mutations: GetMyChatSessions, CreateChatSession, SendChatMessage
│   └── seed_data.gql           # Demo data: 2 users, 2 models, 2 chat sessions, sample messages
│
└── public/                     # === STATIC PUBLIC ASSETS ===
    └── plugins/situ-design/    # Situ Design plugin bundles (third-party, pre-built)
```

---

## 6. Architecture & Data Flow

### 6.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Vite Dev)                │
│                                                     │
│  ┌──────────┐   ┌───────────┐   ┌───────────────┐  │
│  │  Login   │──▶│   App.jsx  │──▶│  MainLayout   │  │
│  │  (Auth)  │   │ (State Hub)│   │  ┌─────────┐  │  │
│  └──────────┘   └───────────┘   │  │ Sidebar  │  │  │
│                       │         │  └─────────┘  │  │
│                       ▼         │  ┌─────────┐  │  │
│              ┌────────────────┐ │  │TopHeader│  │  │
│              │   MainChat     │ │  └─────────┘  │  │
│              │  or EmptyState │ └───────────────┘  │
│              └───────┬────────┘                     │
│                      │                              │
│          ┌───────────┴──────────┐                   │
│          ▼                      ▼                   │
│  ┌──────────────┐    ┌─────────────────┐            │
│  │  api.js      │    │ chatService.js  │            │
│  │  (OpenAI SDK)│    │  (Firestore)    │            │
│  └──────┬───────┘    └────────┬────────┘            │
└─────────┼─────────────────────┼─────────────────────┘
          │                     │
          ▼                     ▼
 HuggingFace Router     Firebase Firestore
 (AI Model Inference)   (Chat Persistence)
```

### 6.2 Authentication Flow

1. `App.jsx` calls `useAuth()` hook which listens to `onAuthStateChanged`.
2. If `user` is null → render `<Login />` page.
3. `Login.jsx` offers: **Email/Password** (sign-in or sign-up) and **Google OAuth** via popup.
4. On successful auth → `user` state updates → `App.jsx` renders `<MainLayout>`.
5. On login, chats are loaded from Firestore via `loadChats(user.uid)`.

### 6.3 Chat Flow

1. **No active chat:** `EmptyState` renders with a greeting and input bar.
2. **User types a message in EmptyState:** Creates a new chat object `{ id: Date.now(), title: first30chars, messages: [userMsg] }` → sets it as `activeChat` → persists to Firestore.
3. **MainChat mounts:** Detects `activeChat.messages.length === 1` → triggers `chatCompletion()` to get AI's first response → appends assistant message → updates state + Firestore.
4. **Subsequent messages:** User types in `ChatInput` → `handleSendMessage` appends user message → calls `chatCompletion()` with full conversation history → appends assistant response → persists.
5. **API call:** `api.js` creates an OpenAI client pointed at `https://router.huggingface.co/v1`, maps the UI model alias to the actual model ID, and calls `chat.completions.create()` with `temperature: 0.7, max_tokens: 1024`.

### 6.4 Firestore Data Model (Current)

```
Firestore Root
└── users/
    └── {userId}/
        └── chats/
            └── {chatId}
                ├── title: string
                ├── model: string
                ├── messages: array<{ role: string, content: string }>
                ├── createdAt: timestamp
                └── updatedAt: timestamp
```

**Security Rules:** Users can only read/write documents under their own `users/{uid}/chats/*`.

### 6.5 Firebase Data Connect Schema (Future / Not Yet Active)

A more normalized relational schema is defined in `dataconnect/schema/schema.gql`:

- **User** — displayName, email, photoUrl
- **Model** — name, identifier, description, version, modelParameters
- **ChatSession** — name, user (FK), model (FK), description
- **Message** — content, role, chatSession (FK), user (FK), metadata
- **Feedback** — rating, message (FK), user (FK), comment

This uses Firebase Data Connect backed by PostgreSQL (CloudSQL instance: `zomeai-fdc`, region: `us-east4`). The JS SDK would be codegen'd to `src/dataconnect-generated/`.

---

## 7. Component Reference

### 7.1 `App.jsx` — Root Component & State Hub

**Location:** `src/App.jsx`

**State managed here (lifted state):**
- `historyItems` — array of all chat objects loaded from Firestore
- `activeChat` — the currently selected chat object (or null)
- `activeModel` — currently selected model alias (default: first model)

**Behavior:**
- Shows loading spinner while Firebase auth initializes
- Shows `<Login />` if not authenticated
- Shows `<MainLayout>` wrapping either `<MainChat>` or `<EmptyState>` based on `activeChat`

### 7.2 `Login.jsx` — Authentication Page

**Location:** `src/components/auth/Login.jsx`

- Toggle between Sign In / Sign Up modes
- Email + Password form with validation (password confirmation for sign-up)
- Show/hide password toggle
- Google OAuth button
- Error display with Firebase error message cleaning
- Animated entrance (Framer Motion)

### 7.3 `MainLayout.jsx` — App Shell

**Location:** `src/components/layout/MainLayout.jsx`

- Horizontal flex: `<Sidebar>` + main area
- Main area: `<TopHeader>` + children content area
- Full-screen, no-overflow layout

### 7.4 `Sidebar.jsx` — Chat History & Navigation

**Location:** `src/components/layout/Sidebar.jsx`

- ZOME Ai branding + new chat button (SquarePen icon)
- Scrollable chat history list grouped under "Today" with total count
- Each chat item: click to activate, hover to show edit/delete actions
- Inline rename editing (with Enter to save)
- User profile section at bottom with sign-out button
- Logout confirmation modal (rendered via React Portal to `document.body`)
- All CRUD operations also persist to Firestore

### 7.5 `TopHeader.jsx` — Model Selector & Theme Toggle

**Location:** `src/components/chat/TopHeader.jsx`

- Model selection dropdown (click outside to close)
- Light/Dark mode toggle (adds/removes `dark` class on `<html>`)
- Sub-header bar showing active chat title (only when a chat is active)

### 7.6 `MainChat.jsx` — Active Chat Container

**Location:** `src/components/chat/MainChat.jsx`

- Manages local `messages` state synced to `activeChat`
- Auto-fetches AI response when chat has exactly 1 message (initial response)
- `handleSendMessage`: appends user msg → calls API → appends AI response → persists
- Renders `<MessageList>` + `<ChatInput>`

### 7.7 `MessageList.jsx` — Message Rendering

**Location:** `src/components/chat/MessageList.jsx`

- Maps over messages array. Two layouts:
  - **User messages:** UserAvatar + plain text bubble (rounded, left-aligned)
  - **AI messages:** AI icon + Markdown-rendered bubble with:
    - Code blocks with syntax highlighting (Prism + oneDark theme) and copy button
    - GFM tables, blockquotes, lists, headings, links
    - Action bar: Volume, Copy, Retry, Thumbs Down (UI-only, not wired to functionality)
- Loading state: bouncing dots animation with spinning AI icon

### 7.8 `ChatInput.jsx` — Message Input

**Location:** `src/components/chat/ChatInput.jsx`

- Text input with Enter key to send
- Attachment dropdown (+ icon): "Attach media" (images/video) and "Upload code" (code files) — opens file picker but upload not implemented
- Send button (arrow up icon) — disabled when loading
- Disclaimer text at bottom

### 7.9 `EmptyState.jsx` — New Chat Landing

**Location:** `src/components/chat/EmptyState.jsx`

- Personalized greeting: "Hi {firstName}, how can I help?"
- Rounded input bar with same attachment dropdown as ChatInput
- On send: creates new chat object from input text → sets as activeChat → persists to Firestore

### 7.10 `UserAvatar.jsx` — User Avatar Component

**Location:** `src/components/common/UserAvatar.jsx`

- If `user.photoURL` exists → renders `<img>`
- Otherwise → renders initial letter on gradient background
- Supports sizes: sm (32px), md (40px), lg (48px)

### 7.11 `LeftNav.jsx` — Expandable Icon Nav (UNUSED)

**Location:** `src/components/layout/LeftNav.jsx`

- Expandable sidebar (16px → 224px on hover)
- ZOME branding, Home button, user profile
- **Not currently rendered** in MainLayout (Sidebar is used instead)

---

## 8. Styling Conventions

- **Tailwind CSS v4** via Vite plugin (no `tailwind.config.js` needed)
- **Custom dark mode variant:** `@custom-variant dark (&:is(.dark *))` — toggled by adding/removing `dark` class on `<html>`
- **Theme tokens** defined in `index.css` under `@theme {}`:
  - `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-primary`, `--color-ai-bubble`
- **Brand color:** Indigo-600 (`#5C45FD` in login, `#3b82f6` as primary token)
- **Font:** Plus Jakarta Sans
- **Utility libraries:** `clsx` + `tailwind-merge` (installed but not heavily used yet)
- **Animations:** Framer Motion for page transitions, list animations, dropdown entrances

---

## 9. Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Firebase Cloud Functions (from /functions directory)
cd functions && npm install
npm run serve     # Local emulator
npm run deploy    # Deploy to Firebase
```

---

## 10. Key Behaviors & Patterns

### State Management
- **No external state library** — all state is lifted to `App.jsx` and passed down via props.
- `historyItems`, `activeChat`, `activeModel` are the three core state values.
- Components update global state via setter functions passed as props.

### API Calls (Client-Side)
- The OpenAI SDK runs **directly in the browser** (`dangerouslyAllowBrowser: true`).
- The HuggingFace token is exposed to the client via `VITE_HF_TOKEN`.
- **Security note:** This is suitable for development/prototyping. For production, API calls should be proxied through a backend (e.g., Firebase Cloud Functions).

### Chat Persistence
- Chats are saved to Firestore under `users/{uid}/chats/{chatId}`.
- Chat ID is generated via `Date.now()` (timestamp-based).
- Messages are stored as an array within the chat document (not subcollections).
- Firestore security rules enforce user-scoped access.

### Dark Mode
- Controlled by `TopHeader.jsx` toggling `dark` class on `document.documentElement`.
- State is local to `TopHeader` (not persisted across sessions).

### File Attachments
- UI for media and code file upload exists but is **not yet functional** — file inputs trigger but no upload/processing logic is implemented.

### Action Buttons on AI Messages
- Volume, Copy, Retry, ThumbsDown buttons are rendered but **not wired** to functionality (UI-only).

---

## 11. Known Limitations & TODOs

| Area | Status | Notes |
|---|---|---|
| File upload | UI only | File picker opens but upload not implemented |
| Message action buttons | UI only | Copy, Volume, Retry, ThumbsDown not wired |
| Dark mode persistence | Missing | Theme resets on page reload |
| Streaming responses | Not implemented | API returns full response, no streaming |
| Chat categorization | Not implemented | All chats shown under "Today", no date grouping |
| LeftNav component | Built but unused | `LeftNav.jsx` exists but not rendered |
| Cloud Functions | Placeholder | `functions/index.js` has no active functions |
| Data Connect | Schema only | Full relational schema designed but not integrated |
| Production API proxy | Missing | HF token exposed client-side |
| Error handling | Basic | API errors shown as inline messages |
| Mobile responsiveness | Partial | Layout designed responsively but not fully tested on all breakpoints |
| Chat search | Not implemented | No search across chat history |

---

## 12. Firebase Configuration

| Service | Details |
|---|---|
| **Auth Providers** | Email/Password + Google Sign-In |
| **Firestore Location** | asia-south2 |
| **Firestore Rules** | User-scoped: `users/{uid}/chats/*` — read/write only by owner |
| **Data Connect** | Service: "zomeai", Region: us-east4, DB: fdcdb on CloudSQL instance `zomeai-fdc` |

---

## 13. Quick Reference for AI Agents

If you are an AI resuming work on this project:

1. **Entry point:** `src/main.jsx` → `src/App.jsx`
2. **All state lives in `App.jsx`** — lifted state pattern, no Redux/Zustand
3. **Models are defined in two places:**
   - UI aliases: `src/App.jsx` → `models` array
   - API mapping: `src/services/api.js` → `MODEL_ALIASES` object
4. **Auth:** Firebase Auth via `src/hooks/useAuth.js` — returns `{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }`
5. **Chat persistence:** `src/services/chatService.js` — CRUD on Firestore `users/{uid}/chats`
6. **AI API:** `src/services/api.js` → `chatCompletion(messages, activeModelAlias)` — OpenAI SDK → HuggingFace Router
7. **Styling:** Tailwind CSS v4 with custom dark mode variant, Plus Jakarta Sans font
8. **Key components flow:** `App → MainLayout → [Sidebar + TopHeader + (MainChat | EmptyState)]`
9. **To add a new model:** Add alias to `models` array in `App.jsx` AND add mapping to `MODEL_ALIASES` in `api.js`
10. **To run:** Create `.env` with tokens → `npm install` → `npm run dev`
