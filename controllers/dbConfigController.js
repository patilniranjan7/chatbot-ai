const DbConfig = require("../models/DbConfig");

exports.addDbConfig = async (req, res) => {
    const { dbName, dbUser, dbPassword, dbHost, dbPort } = req.body;

    if (!dbName || !dbUser || !dbPassword || !dbHost || !dbPort) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newConfig = new DbConfig({
            dbName,
            dbUser,
            dbPassword,
            dbHost,
            dbPort,
            createdBy: req.user.id, // User from JWT
        });

        await newConfig.save();
        res.status(201).json({ message: "DB config saved successfully", config: newConfig });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
