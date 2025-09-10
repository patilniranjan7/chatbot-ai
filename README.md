# Chatbot AI - Proof of Concept (PoC)

A simple chatbot builder proof of concept designed to help companies and B2B products quickly create and deploy AI-powered chatbots.

---

## Overview

This project started as a PoC about 2 months ago to create a more **scalable** and **flexible** chatbot platform. Previously, my team had built a chatbot tailored for a single project, but it wasn’t efficient or reusable across different use cases. This PoC aims to address those limitations by providing a foundation to build customizable chatbots.

---

## Features

- Basic chatbot framework with conversational capabilities  
- Easily extendable with your own intents and responses  
- Designed for B2B use cases and company websites  
- Built with scalability and flexibility in mind  

---

## Tech Stack

- Node.js  
- Express.js

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)  
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/patilniranjan7/chatbot-ai.git
   cd chatbot-ai



```
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/{db name}
JWT_SECRET=supersecretkey123
# OpenAI API key for the AI model
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

4. Start the server:

```bash
npm start
```