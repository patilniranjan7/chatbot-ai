#!/usr/bin/env node

/**
 * Demo script for LangChain MongoDB Chatbot
 * 
 * This script demonstrates the chatbot functionality with mock data
 * when real MongoDB and OpenAI connections are not available.
 */

const LangChainMongoChatbot = require('./langchainMongoChatbot');

// Mock data for demonstration
const mockSchemaInfo = `Database contains 3 collection(s):

Collection: users
  - Document count: 150
  - Fields: _id, name, email, age, city, createdAt
  - Field types: {"_id":"object","name":"string","email":"string","age":"number","city":"string","createdAt":"object"}
  - Sample document: {"_id":"507f1f77bcf86cd799439011","name":"John Doe","email":"john@example.com","age":30,"city":"New York","createdAt":"2023-01-15T10:30:00.000Z"}

Collection: products
  - Document count: 75
  - Fields: _id, name, price, category, inStock, description
  - Field types: {"_id":"object","name":"string","price":"number","category":"string","inStock":"boolean","description":"string"}
  - Sample document: {"_id":"507f1f77bcf86cd799439012","name":"Laptop","price":999.99,"category":"Electronics","inStock":true,"description":"High-performance laptop"}

Collection: orders
  - Document count: 220
  - Fields: _id, userId, productId, quantity, totalAmount, orderDate, status
  - Field types: {"_id":"object","userId":"object","productId":"object","quantity":"number","totalAmount":"number","orderDate":"object","status":"string"}
  - Sample document: {"_id":"507f1f77bcf86cd799439013","userId":"507f1f77bcf86cd799439011","productId":"507f1f77bcf86cd799439012","quantity":2,"totalAmount":1999.98,"orderDate":"2023-02-01T14:20:00.000Z","status":"completed"}

`;

// Mock response generator
function generateMockResponse(question) {
    const responses = {
        "how many users": `**Understanding:** You want to know the total number of users in the database.

**MongoDB Query:** 
\`\`\`javascript
db.users.countDocuments({})
\`\`\`

**Suggestions:** This will return the total count of all user documents. If you want to count users with specific criteria, you can add conditions inside the countDocuments() method.`,

        "price greater": `**Understanding:** You're looking for products that have a price higher than a specific value.

**MongoDB Query:** 
\`\`\`javascript
db.products.find({ price: { $gt: 100 } })
\`\`\`

**Suggestions:** This query finds all products with price greater than 100. You can adjust the number or add additional filters like category or availability.`,

        "new york": `**Understanding:** You want to find all users who are located in New York.

**MongoDB Query:** 
\`\`\`javascript
db.users.find({ city: "New York" })
\`\`\`

**Suggestions:** This will return all users where the city field exactly matches "New York". For case-insensitive search, you can use regex: { city: /new york/i }`,

        "categories": `**Understanding:** You want to see the different categories available in the products collection.

**MongoDB Query:** 
\`\`\`javascript
db.products.distinct("category")
\`\`\`

**Suggestions:** This will return an array of unique category values. You can also use aggregation for more complex grouping operations.`
    };

    // Find matching response based on keywords
    for (const [keywords, response] of Object.entries(responses)) {
        if (question.toLowerCase().includes(keywords)) {
            return response;
        }
    }

    return `**Understanding:** I understand you're asking about "${question}".

**MongoDB Query:** 
\`\`\`javascript
// Based on your question, here's a suggested approach:
db.collection.find({ /* your query criteria */ })
\`\`\`

**Suggestions:** Please provide more specific details about what you're looking for, and I can generate a more targeted MongoDB query.`;
}

console.log('🎬 LangChain MongoDB Chatbot Demo');
console.log('=====================================\n');

console.log('📋 This demo shows how the chatbot works with sample data.');
console.log('   In real usage, it would connect to your actual MongoDB database.\n');

console.log('📊 Sample Database Schema:');
console.log(mockSchemaInfo);

console.log('💬 Demo Conversations:');
console.log('======================\n');

const demoQuestions = [
    "How many users are in the database?",
    "Show me products with price greater than 100",
    "Find users from New York", 
    "What are the different categories in the products collection?"
];

demoQuestions.forEach((question, index) => {
    console.log(`🧑 User: ${question}`);
    console.log(`🤖 Chatbot: ${generateMockResponse(question)}\n`);
    
    if (index < demoQuestions.length - 1) {
        console.log('-'.repeat(60) + '\n');
    }
});

console.log('🚀 To run the actual chatbot with your data:');
console.log('   1. Set up your .env file with OPENAI_API_KEY and MONGO_URI');
console.log('   2. Run: npm run chatbot');
console.log('   3. Ask questions about your MongoDB database!\n');

console.log('📖 For setup instructions, see README.md');