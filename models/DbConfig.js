const mongoose = require("mongoose");

const DbConfigSchema = new mongoose.Schema({
    uiName: { type: String, required: true, index: true },
    dbName: { type: String, required: true },
    dbUser: { type: String, required: true },
    dbPassword: { type: String, required: true },
    dbHost: { type: String, required: true },
    dbPort: { type: Number, required: true },
    dbQueries: { type: Object, required: true }, // JSON string of queries
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to user
}, { timestamps: true });

module.exports = mongoose.model("DbConfig", DbConfigSchema);