#!/usr/bin/env node

/**
 * LangChain MongoDB Chatbot
 * 
 * A command-line chatbot that uses LangChain.js to process natural language questions
 * and generate MongoDB queries or suggestions based on database schema and sample data.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install dependencies: npm install langchain @langchain/openai @langchain/mongodb readline-sync
 * 2. Set environment variables:
 *    - OPENAI_API_KEY: Your OpenAI API key
 *    - MONGO_URI: Your MongoDB connection string (e.g., mongodb://localhost:27017/yourdb)
 * 3. Run: node langchainMongoChatbot.js
 * 
 * FEATURES:
 * - Connects to MongoDB to analyze schema and sample data
 * - Uses LangChain.js with OpenAI for natural language processing
 * - Generates MongoDB query suggestions based on user questions
 * - Interactive command-line interface
 * - Provides both natural language explanations and MongoDB syntax
 */

require('./config/dotenv'); // Load environment variables
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { MongoClient } = require('mongodb');
const readlineSync = require('readline-sync');

class LangChainMongoChatbot {
    constructor() {
        this.mongoClient = null;
        this.db = null;
        this.llm = null;
        this.chain = null;
        this.collections = new Map();
        this.schemaInfo = '';
    }

    /**
     * Initialize the chatbot by setting up LangChain and MongoDB connections
     */
    async initialize() {
        console.log('🤖 Initializing LangChain MongoDB Chatbot...\n');
        
        // Check required environment variables
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is required');
        }

        // Initialize LangChain with OpenAI
        this.llm = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'gpt-4o-mini',
            temperature: 0.1,
        });

        // Create the prompt template for MongoDB query generation
        const template = `You are a MongoDB expert assistant. Based on the provided database schema and user question, generate helpful responses.

Database Schema Information:
{schema}

User Question: {question}

Please provide:
1. A natural language explanation of what the user is asking for
2. A MongoDB query (or queries) that would answer their question
3. Any suggestions or clarifications if the question is ambiguous

Format your response as:
**Understanding:** [Natural language explanation]
**MongoDB Query:** [Query in MongoDB syntax]
**Suggestions:** [Any additional suggestions or clarifications]

MongoDB Query:`;

        const prompt = PromptTemplate.fromTemplate(template);
        
        // Create a simple chain using the newer LangChain approach
        this.chain = prompt.pipe(this.llm);

        // Connect to MongoDB
        await this.connectToMongoDB();
        
        // Analyze database schema
        await this.analyzeSchema();
        
        console.log('✅ Initialization complete!\n');
    }

    /**
     * Connect to MongoDB using the provided URI
     */
    async connectToMongoDB() {
        try {
            console.log('📊 Connecting to MongoDB...');
            this.mongoClient = new MongoClient(process.env.MONGO_URI);
            await this.mongoClient.connect();
            
            // Extract database name from URI or use default
            const dbName = process.env.MONGO_URI.split('/').pop().split('?')[0] || 'test';
            this.db = this.mongoClient.db(dbName);
            
            console.log(`✅ Connected to MongoDB database: ${dbName}`);
        } catch (error) {
            throw new Error(`Failed to connect to MongoDB: ${error.message}`);
        }
    }

    /**
     * Analyze the MongoDB database schema and collect sample data
     */
    async analyzeSchema() {
        try {
            console.log('🔍 Analyzing database schema...');
            
            // Get list of collections
            const collections = await this.db.listCollections().toArray();
            
            if (collections.length === 0) {
                console.log('⚠️  No collections found in the database.');
                this.schemaInfo = 'No collections found in the database.';
                return;
            }

            let schemaDetails = `Database contains ${collections.length} collection(s):\n\n`;

            for (const collectionInfo of collections) {
                const collectionName = collectionInfo.name;
                console.log(`  📁 Analyzing collection: ${collectionName}`);
                
                const collection = this.db.collection(collectionName);
                
                // Get collection stats
                const stats = await this.db.command({ collStats: collectionName }).catch(() => null);
                const documentCount = stats ? stats.count : await collection.countDocuments();
                
                // Get sample documents to understand structure
                const sampleDocs = await collection.find({}).limit(3).toArray();
                
                // Analyze field structure
                const fields = new Set();
                const fieldTypes = {};
                
                sampleDocs.forEach(doc => {
                    Object.keys(doc).forEach(key => {
                        fields.add(key);
                        if (!fieldTypes[key]) {
                            fieldTypes[key] = typeof doc[key];
                        }
                    });
                });

                schemaDetails += `Collection: ${collectionName}\n`;
                schemaDetails += `  - Document count: ${documentCount}\n`;
                schemaDetails += `  - Fields: ${Array.from(fields).join(', ')}\n`;
                schemaDetails += `  - Field types: ${JSON.stringify(fieldTypes, null, 2)}\n`;
                
                if (sampleDocs.length > 0) {
                    schemaDetails += `  - Sample document: ${JSON.stringify(sampleDocs[0], null, 2)}\n`;
                }
                schemaDetails += '\n';

                // Store collection info for future reference
                this.collections.set(collectionName, {
                    count: documentCount,
                    fields: Array.from(fields),
                    fieldTypes,
                    sampleDoc: sampleDocs[0] || null
                });
            }

            this.schemaInfo = schemaDetails;
            console.log('✅ Schema analysis complete!');
            
        } catch (error) {
            console.error('❌ Error analyzing schema:', error.message);
            this.schemaInfo = 'Error analyzing database schema.';
        }
    }

    /**
     * Process a user question using LangChain and generate MongoDB query suggestions
     */
    async processQuestion(question) {
        try {
            console.log('\n🤔 Processing your question...');
            
            const response = await this.chain.invoke({
                schema: this.schemaInfo,
                question: question
            });

            return response.content || response.text || response;
        } catch (error) {
            console.error('❌ Error processing question:', error.message);
            return 'Sorry, I encountered an error while processing your question. Please try again.';
        }
    }

    /**
     * Execute a MongoDB query if the user wants to test it
     */
    async executeQuery(query, collectionName) {
        try {
            const collection = this.db.collection(collectionName);
            
            // Parse and execute the query (basic implementation)
            // Note: This is a simplified implementation for demonstration
            let result;
            
            if (query.includes('find(')) {
                // Extract find parameters
                const findMatch = query.match(/find\((.*?)\)/);
                if (findMatch) {
                    const params = findMatch[1] || '{}';
                    const queryObj = params === '{}' ? {} : JSON.parse(params);
                    result = await collection.find(queryObj).limit(5).toArray();
                }
            } else if (query.includes('countDocuments(')) {
                const countMatch = query.match(/countDocuments\((.*?)\)/);
                if (countMatch) {
                    const params = countMatch[1] || '{}';
                    const queryObj = params === '{}' ? {} : JSON.parse(params);
                    result = await collection.countDocuments(queryObj);
                }
            } else {
                return 'Query execution not supported for this type of query. Please execute manually.';
            }

            return result;
        } catch (error) {
            return `Error executing query: ${error.message}`;
        }
    }

    /**
     * Start the interactive chat session
     */
    async startChat() {
        console.log('💬 Starting interactive chat session...');
        console.log('Type "exit" to quit, "schema" to see database schema, or "help" for commands.\n');

        while (true) {
            const question = readlineSync.question('🧑 You: ');

            if (question.toLowerCase() === 'exit') {
                console.log('👋 Goodbye!');
                break;
            }

            if (question.toLowerCase() === 'schema') {
                console.log('\n📊 Database Schema:');
                console.log(this.schemaInfo);
                continue;
            }

            if (question.toLowerCase() === 'help') {
                console.log('\n📚 Available commands:');
                console.log('  - Type any question about your MongoDB data');
                console.log('  - "schema" - Show database schema information');
                console.log('  - "exit" - Quit the chatbot');
                console.log('  - "help" - Show this help message\n');
                continue;
            }

            if (question.trim() === '') {
                continue;
            }

            // Process the question
            const response = await this.processQuestion(question);
            console.log('\n🤖 Chatbot:', response);

            // Ask if user wants to execute a query
            if (response.includes('db.') || response.includes('find(') || response.includes('aggregate(')) {
                const execute = readlineSync.question('\n❓ Would you like me to try executing this query? (y/n): ');
                if (execute.toLowerCase() === 'y' || execute.toLowerCase() === 'yes') {
                    // Extract collection name and query for execution
                    const collectionMatch = response.match(/db\.(\w+)\./);
                    if (collectionMatch) {
                        const collectionName = collectionMatch[1];
                        const queryMatch = response.match(/\.(find\([^}]*\}[^)]*\)|countDocuments\([^}]*\}[^)]*\))/);
                        if (queryMatch) {
                            const query = queryMatch[1];
                            console.log('\n⚙️ Executing query...');
                            const result = await this.executeQuery(query, collectionName);
                            console.log('📄 Result:', JSON.stringify(result, null, 2));
                        }
                    }
                }
            }

            console.log('\n' + '-'.repeat(50) + '\n');
        }
    }

    /**
     * Clean up resources
     */
    async cleanup() {
        if (this.mongoClient) {
            await this.mongoClient.close();
            console.log('🔒 MongoDB connection closed.');
        }
    }
}

// Main execution function
async function main() {
    const chatbot = new LangChainMongoChatbot();
    
    try {
        await chatbot.initialize();
        await chatbot.startChat();
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        console.log('\n📋 Please check:');
        console.log('1. OPENAI_API_KEY is set in your environment variables');
        console.log('2. MONGO_URI is set and pointing to a valid MongoDB instance');
        console.log('3. MongoDB is running and accessible');
        console.log('4. You have the required dependencies installed');
    } finally {
        await chatbot.cleanup();
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    process.exit(0);
});

// Run the chatbot if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = LangChainMongoChatbot;