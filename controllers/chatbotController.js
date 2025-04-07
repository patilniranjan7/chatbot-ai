const DbConfig = require("../models/DbConfig");
const mysql = require("mysql2/promise");
const generateSQLQuery = require("../utils/generateSQLQuery");

exports.handleChatbotRequest = async (req, res) => {
    const { questions, sessionId, dbConfigId } = req.body;

    if (!questions || !sessionId || !dbConfigId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Step 1 & 2: Generate SQL & fetch DB config concurrently
        const [sqlQuery, dbConfig] = await Promise.all([
            generateSQLQuery(questions),
            DbConfig.findById(dbConfigId),
        ]);

        if (!dbConfig) {
            return res.status(404).json({ message: "DB Config not found" });
        }

        // Step 3: Connect to MySQL and execute
        const connection = await mysql.createConnection({
            host: dbConfig.dbHost,
            user: dbConfig.dbUser,
            password: dbConfig.dbPassword,
            database: dbConfig.dbName,
            port: dbConfig.dbPort,
        });

        const [rows] = await connection.execute(sqlQuery);

        // Step 4: Format result
        const formattedResult = Array.isArray(rows) && rows.length > 1
            ? { type: "table", data: rows }
            : { type: "text", data: rows[0] || "No data found" };

        // Step 5: Return result
        res.json({
            message: "Query executed successfully",
            sql: sqlQuery,
            result: formattedResult,
        });

        await connection.end();
    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
