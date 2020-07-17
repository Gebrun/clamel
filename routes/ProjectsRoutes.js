// Importing express into the file

const express = require('express');
const router = express.Router();
const ProjectsModel = require('../models/ProjectsModel');

router.post(
    '/', 
    (req, res) => {

        // Reading 'body' within the post request

        const formData = { 
            category: req.body.category, 
            style: req.body.style
        }

        const newProjectsModel = new ProjectsModel(formData);
        newProjectsModel.save();
    }
);

// Exporting the router

module.exports = router;