const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateSQLQuery = async (question, tableDescription= "") => {
    const prompt = `
You are an assistant that generates SQL queries based on questions.
${tableDescription ? `Here is a table schema: ${tableDescription}` : ""}
Question: ${question}
Respond only with the SQL query.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
    });

    let sql = completion.choices[0].message.content.trim();
    sql = sql.replace(/^```sql\s*/, '')  // remove opening ```sql
    .replace(/```$/, '')        // remove closing ```
    .trim();                    // remove extra whitespace
    return sql;
};

module.exports = generateSQLQuery;
