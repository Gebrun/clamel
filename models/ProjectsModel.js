// Importing mongoose

const mongoose = require("mongoose");

// Schema

const ProjectsSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true
        },
        style: {
            type: String,
            required: true
        },

    }
);

const ProjectsModel = mongoose.model('projects', ProjectsSchema);

module.exports = ProjectsModel;