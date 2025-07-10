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
- **NEW**: LangChain.js MongoDB Chatbot - Command-line interface for natural language database queries

---

## Tech Stack

- Node.js  
- Express.js
- LangChain.js
- MongoDB/Mongoose
- OpenAI API

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)  
- npm or yarn package manager
- MongoDB database (local or cloud-based like MongoDB Atlas)
- OpenAI API key (for LangChain.js integration)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/patilniranjan7/chatbot-ai.git
   cd chatbot-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. Start the Express server:

   ```bash
   npm start
   ```

   Or for development:

   ```bash
   npm run dev
   ```

---

## LangChain MongoDB Chatbot

The repository now includes a standalone command-line chatbot that uses LangChain.js to process natural language questions about MongoDB databases.

### Features

- **Natural Language Processing**: Uses LangChain.js with OpenAI to understand user questions
- **MongoDB Integration**: Connects to any MongoDB database and analyzes schema
- **Query Generation**: Generates MongoDB queries based on natural language input
- **Interactive CLI**: Command-line interface for real-time interaction
- **Schema Analysis**: Automatically inspects database collections and field types
- **Query Execution**: Option to execute generated queries and see results

### Setup

1. Install additional dependencies (if not already installed):

   ```bash
   npm install langchain @langchain/openai @langchain/mongodb readline-sync
   ```

2. Configure environment variables in `.env`:

   ```bash
   OPENAI_API_KEY=your-openai-api-key-here
   MONGO_URI=mongodb://localhost:27017/your-database-name
   ```

3. Run the chatbot:

   ```bash
   npm run chatbot
   # or
   node langchainMongoChatbot.js
   ```

4. Try the demo (works without API keys):

   ```bash
   npm run demo
   ```

### Usage Examples

Once running, you can ask questions like:

- "How many users are in the database?"
- "Show me all products with price greater than 100"
- "Find customers from New York"
- "What are the different categories in the products collection?"

The chatbot will:
1. Analyze your question
2. Generate appropriate MongoDB queries
3. Provide natural language explanations
4. Optionally execute queries and show results

### Commands

- `schema` - Display database schema information
- `help` - Show available commands
- `exit` - Quit the chatbot
