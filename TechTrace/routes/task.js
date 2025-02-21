var express = require('express');
var router = express.Router();
const {task} = require('../modules/schema');
/* create Branch listing. */
router.post('/create_task', async function(req, res, next) {
    try {
        const { task_Name, task_Address, task_Phone, task_Desc } = req.body;

        const task_Id = await task.generateTaskId();
        const task_Status ="Unassigned";
        // Create a new branch document
        const newTask = new task({
          task_Id,
          task_Name,
          task_Address,
          task_Phone,
          task_Desc,
          task_Status,
        });
    
        // Save the branch to the database
        await newTask.save();
        res.status(201).json({ message: 'Task added successfully', newTask: newTask });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Example: Fetch all branches
    router.get('/task_list', async (req, res) => {
      try {
        const tasks = await task.find().populate({
          path: 'branch_Id',
          select: 'branch_Address' // Only fetch branch_Address
        });
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

module.exports = router;
