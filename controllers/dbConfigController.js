const DbConfig = require("../models/DbConfig");

exports.addDbConfig = async (req, res) => {
    console.log("Received request to add DB config:", req.body); // Log the request body
    const { dbName, dbUser, dbPassword, dbHost, dbPort, dbQueries, uiName } = req.body;

    if (!dbName || !dbUser || !dbPassword || !dbHost || !dbPort || !dbQueries) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // check in db ui name should be unique for each user
    const existingConfig = await DbConfig.findOne({ uiName, createdBy: req.user.id });
    if (existingConfig) {
        return res.status(400).json({ message: "UI Name already exists for this user" });
    }

    try {
        const newConfig = new DbConfig({
            uiName,
            dbName,
            dbUser,
            dbPassword,
            dbHost,
            dbPort,
            dbQueries, // Initialize with an empty array
            createdBy: req.user.id, // User from JWT
        });

        await newConfig.save();
        res.status(201).json({ message: "DB config saved successfully", config: newConfig });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// updateDbQueries will update the dbQueries field in the DbConfig collection

exports.updateDbQueries = async (req, res) => {
    const { dbConfigId, dbQueries } = req.body;

    if (!dbConfigId || !dbQueries) {
        return res.status(400).json({ message: "DB Config ID and queries are required" });
    }

    try {
        const updatedConfig = await DbConfig.findByIdAndUpdate(
            dbConfigId,
            { dbQueries },
            { new: true }
        );

        if (!updatedConfig) {
            return res.status(404).json({ message: "DB Config not found" });
        }

        res.status(200).json({ message: "DB queries updated successfully", config: updatedConfig });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
