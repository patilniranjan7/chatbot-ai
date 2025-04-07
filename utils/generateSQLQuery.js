const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateSQLQuery = async (question, tableDescription = "") => {
    const prompt = `
You are an assistant that generates SQL queries based on questions.
${tableDescription ? `Here is a table schema: ${tableDescription}` : ""}
Question: ${question}
Respond only with the SQL query.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
    });

    const sql = completion.choices[0].message.content.trim();
    return sql;
};

module.exports = generateSQLQuery;
