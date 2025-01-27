var express = require('express');
var router = express.Router();
const {branch} = require('../modules/schema');
/* create Branch listing. */
router.post('/create_branch', async function(req, res, next) {
    try {
        const { branch_Id, branch_Name, branch_address, branch_phone } = req.body;
    
        // Create a new branch document
        const newBranch = new branch({
          branch_Id,
          branch_Name,
          branch_address,
          branch_phone,
        });
    
        // Save the branch to the database
        await newBranch.save();
    
        res.status(201).json({ message: 'Branch added successfully', branch: newBranch });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Example: Fetch all branches
    router.get('/branch_list', async (req, res) => {
      try {
        const branches = await branch.find();
        res.status(200).json(branches);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

module.exports = router;
