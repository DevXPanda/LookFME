const express = require('express');
const router = express.Router();
const careerController = require('../controller/career.controller');

// Submit a new application (public)
router.post('/submit', careerController.submitApplication);

// Get all applications (admin)
router.get('/', careerController.getApplications);

// Get single application by ID (admin)
router.get('/:id', careerController.getApplicationById);

// Admin reply to application
router.post('/reply/:id', careerController.replyToApplication);

module.exports = router;
