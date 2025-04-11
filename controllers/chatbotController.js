const DbConfig = require("../models/DbConfig");
const mysql = require("mysql2/promise");
const generateSQLQuery = require("../utils/generateSQLQuery");

exports.handleChatbotRequest = async (req, res) => {
  const { questions, dbConfigId } = req.body;

  if (!questions || !dbConfigId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const dbConfig = await DbConfig.findById(dbConfigId).then((config) => {
      if (config) {
        return {
          ...config._doc,
          dbQueries: JSON.stringify(config?.dbQueries)
        };
      }
      return null;
    });
    if (!dbConfig) {
      return res.status(404).json({ message: "DB Config not found" });
    }
    const sqlQuery = await generateSQLQuery(questions, dbConfig?.dbQueries);

    console.log("Generated SQL Query:", sqlQuery);
    // Step 3: Connect to MySQL and execute
    if (!global.dbConnections) {
      global.dbConnections = new Map();
    }

    let connection = global.dbConnections.get(dbConfigId);

    if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: dbConfig?.dbHost,
        user: dbConfig.dbUser,
        password: dbConfig.dbPassword,
        database: dbConfig.dbName,
        port: dbConfig.dbPort,
      });
    } catch (error) {
      throw new Error(`Failed to create database connection: ${error.message}`);
    }
      if (global.dbConnections.size >= 7) {
        const leastUsedKey = global.dbConnections.keys().next().value;
        const leastUsedConnection = global.dbConnections.get(leastUsedKey);
        await leastUsedConnection.end();
        global.dbConnections.delete(leastUsedKey);
      }
      global.dbConnections.set(dbConfigId, connection);
    } else {
      // Move the recently used connection to the end of the Map
      global.dbConnections.delete(dbConfigId);
      global.dbConnections.set(dbConfigId, connection);
    }

    const [rows] = await connection.execute(sqlQuery);

    // Step 4: Format result
    const formattedResult = {data: rows }

    // Step 5: Return result
    res.json({
      message: "Query executed successfully",
      sql: sqlQuery,
      result: formattedResult,
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message});
  }
};
