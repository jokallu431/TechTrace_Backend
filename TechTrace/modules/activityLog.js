const mongoose = require('mongoose');
const express = require('express');


const ActivityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the User model
        ref: 'profiles',  // This links to the 'User' model (profiles collection)
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    requestBody: {
        type: Object,
        default: {}
    }
});

const ActivityLogModel = mongoose.model('ActivityLog', ActivityLogSchema);
module.exports = { ActivityLogModel };