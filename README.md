# 🚀 HintForge – AI-Powered DSA Mentor

HintForge is a full-stack AI-powered platform designed to help students learn Data Structures & Algorithms through structured guidance instead of direct solutions.

Unlike general AI tools, HintForge focuses on **teaching problem-solving**, providing multiple approaches, complexity analysis, and progressive hints.

---

## 🌐 Live Demo

👉 https://hintforge.netlify.app/

---

## ✨ Features

### 🧠 AI-Powered Learning

* Structured responses (no random chat output)
* Brute → Better → Optimal approaches
* Step-by-step hints (without giving full code)
* Time & Space complexity analysis

### 🔥 Smart Dual Input System

* Provide **Problem + Code** for best results
* Only Problem → Get approaches & hints
* Only Code → Get evaluation & improvements

### 🏷️ Tags & Difficulty

* Automatic topic classification (Array, DP, Graph, etc.)
* Difficulty estimation (Easy / Medium / Hard)

### 🔐 Authentication System

* User Signup & Login
* JWT-based authentication
* Secure cookie handling

### 📜 History Tracking

* Save past analyses
* View previous results
* User-specific data storage

### 🎨 Modern UI/UX

* Clean and minimal design (Tailwind CSS)
* Loading states and smooth transitions
* Responsive layout

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### AI Integration

* Groq API (LLM)
* Prompt engineering for structured outputs

---

## ⚙️ How It Works

1. User inputs a problem and/or code
2. Backend constructs a structured prompt
3. LLM processes and returns JSON response
4. Backend cleans and parses the response
5. Frontend displays structured insights

---

## 🔥 What Makes HintForge Unique?

* Dual input system (Problem + Code) for better AI accuracy
* Structured JSON responses instead of chat-style output
* Learning-focused hints instead of direct answers
* Automatic tagging and difficulty estimation
* Context-aware code evaluation

---

## 🧩 Key Engineering Highlights

* Designed a **dual-input system** to improve LLM accuracy
* Implemented **robust JSON parsing and error handling**
* Engineered prompts for **consistent structured output**
* Built **user-specific history with authentication**
* Developed a **context-aware evaluation system**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hintforge
```

### 2. Install Dependencies

#### Frontend

```bash
cd client
npm install
npm run dev
```

#### Backend

```bash
cd server
npm install
node index.js
```

---

### 3. Environment Variables

Create a `.env` file in the server:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_api_key
```

---

## 📌 Usage

* Enter a DSA problem
* (Optional) Paste your code
* Click **Analyze**
* Get structured guidance, not just answers

---

## 🎯 Project Vision

HintForge aims to bridge the gap between:

* ❌ Copy-pasting solutions
* ✅ Actually understanding problem-solving

It acts as an **AI mentor**, not just an answer generator.

---

## 💼 Author

Built by Pranav Savant

