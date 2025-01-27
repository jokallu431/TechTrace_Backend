// modules/branchSchema.js
const mongoose = require('mongoose');

// Define the schema
const branchSchema = new mongoose.Schema({
  branch_Id: { type: String, required: true },
  branch_Name: { type: String, required: true },
  branch_address: { type: String, required: true },
  branch_phone: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    email:{ type: String, required: true },
    password:{ type: String, required: true },
    phone:{ type: String, required: true },
    role:{ type: String, required: true },
    branch:{ type: String, required: true }
    });

// Export the model
const user = mongoose.model('profiles',userSchema);
const branch = mongoose.model('branch', branchSchema);
module.exports = {branch ,user};
