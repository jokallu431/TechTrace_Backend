var express = require('express');
var router = express.Router();
const {branch} = require('../modules/schema');
/* create Branch listing. */
router.post('/create_branch', async function(req, res, next) {
    try {
        const { branch_Name, branch_Address, branch_Phone } = req.body;
    
        console.log("Calling generateBranchId()...");
        const branch_Id = await branch.generateBranchId();
        console.log("Received branch_Id:", branch_Id); // Debug log
        // Create a new branch document
        const newBranch = new branch({
          branch_Id,
          branch_Name,
          branch_Address,
          branch_Phone,
        });
    console.log("newBranch",newBranch);
    
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

    router.get("/branch_list/:branch_Id", async (req, res) => {
      try {
        const branch_Id = req.params.branch_Id;
        const branchData = await branch.findOne({ branch_Id });
    
        if (!branchData) {
          return res.status(404).json({ message: "Branch not found" });
        }
    
        res.status(200).json(branchData);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    


    // PATCH: Update a branch by branch_Id
router.patch('/update_branch/:branch_Id', async (req, res) => {
  try {
    const { branch_Id } = req.params;
    const updates = req.body;
    const updatedBranch = await branch.findOneAndUpdate(
      { branch_Id },
      updates,
      { new: true, runValidators: true }
    );
    if (!updatedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json(updatedBranch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a branch by branch_Id
router.delete('/delete_branch/:branch_Id', async (req, res) => {
  try {
    const { branch_Id } = req.params;
    const deletedBranch = await branch.findOneAndDelete({ branch_Id });
    if (!deletedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
