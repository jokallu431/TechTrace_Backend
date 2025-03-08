var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
const { task, branch, user,accessoriess } = require("../modules/schema");
/* create Branch listing. */

// router.post("/create_task", async function (req, res, next) {
//   try {
//     const {
//       task_Name,
//       task_Address,
//       task_Phone,
//       task_Desc,
//       branch_Id,
//       technician,
//       accessories,
//     } = req.body;

//     // Validate if the branch_Id is provided
//     if (!branch_Id) {
//       return res.status(400).json({ message: "Branch ID is required" });
//     }

//     // Check if the branch_Id exists in the Branch collection
//     const branchExists = await branch.findById(branch_Id);
//     if (!branchExists) {
//       return res.status(404).json({ message: "Branch not found" });
//     }

//     // Check if the technician exists (if provided)
//     if (technician) {
//       const technicianExists = await user.findById(technician);
//       if (!technicianExists || technicianExists.role !== "Technician") {
//         return res
//           .status(404)
//           .json({ message: "Technician not found or invalid role" });
//       }
//     }

//     // Generate task ID
//     const task_Id = await task.generateTaskId();
//     const task_Status = technician ? "Assigned" : "Unassigned";

//     // Create a new task document
//     const newTask = new task({
//       task_Id,
//       task_Name,
//       task_Address,
//       task_Phone,
//       task_Desc: Array.isArray(task_Desc) ? task_Desc : [task_Desc], // Ensure array format
//       task_Status,
//       branch_Id, // Assign branch
//       technician: technician || null, // Assign technician if provided
//       accessories: Array.isArray(accessories) ? accessories : [], // Initialize accessories array
//     });

//     // Save the task to the database
//     await newTask.save();

//     // Return success response
//     res.status(201).json({ message: "Task added successfully", newTask });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/create_task", async function (req, res, next) {
//   try {
//     const {
//       task_Name,
//       task_Address,
//       task_Phone,
//       task_Desc,
//       branch_Id,
//       technician,
//       accessories, // Accessories array from request
//     } = req.body;

//     if (!branch_Id) {
//       return res.status(400).json({ message: "Branch ID is required" });
//     }

//     const branchExists = await branch.findById(branch_Id);
//     if (!branchExists) {
//       return res.status(404).json({ message: "Branch not found" });
//     }

//     if (technician) {
//       const technicianExists = await user.findById(technician);
//       if (!technicianExists || technicianExists.role !== "Technician") {
//         return res
//           .status(404)
//           .json({ message: "Technician not found or invalid role" });
//       }
//     }

//     const task_Id = await task.generateTaskId();
//     const task_Status = technician ? "Assigned" : "Unassigned";

//     // Ensure accessories are in an array format
//     const validAccessories = Array.isArray(accessories) ? accessories : [];
//     console.log("validAccessories", validAccessories);
    
//     // Validate and update accessory quantity
//     const updatedAccessories = [];
//     for (const item of validAccessories) {
//       const accessory = await accessoriess.findOne({ accessories_Id: item.accessories});

//       if (!accessory) {
//         return res.status(404).json({ message: `Accessory with ID ${item.accessories} not found` });
//       }

//       if (accessory.accessories_Quantity < item.quantity) {
//         return res.status(400).json({
//           message: `Not enough stock for ${accessory.accessories_Name}. Available: ${accessory.accessories_Quantity}, Required: ${item.quantity}`,
//         });
//       }

//       // Deduct the accessory quantity
//       accessory.accessories_Quantity -= item.quantity;
//       await accessory.save();

//       updatedAccessories.push({
//         accessories_Id: item.accessories_Id,
//         quantity: item.quantity,
//       });
//     }

//     // Create a new task document
//     const newTask = new task({
//       task_Id,
//       task_Name,
//       task_Address,
//       task_Phone,
//       task_Desc: Array.isArray(task_Desc) ? task_Desc : [task_Desc], 
//       task_Status,
//       branch_Id,
//       technician: technician || null,
//       accessories: updatedAccessories, // Store the accessories used in the task
//     });

//     await newTask.save();

//     res.status(201).json({ message: "Task added successfully", newTask });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/create_task", async function (req, res, next) {
  try {
    const {
      task_Name,
      task_Address,
      task_Phone,
      task_Desc,
      branch_Id,
      technician,
      accessories, // Expecting an array of objects [{ accessories_Id, quantity }]
    } = req.body;

    if (!branch_Id) {
      return res.status(400).json({ message: "Branch ID is required" });
    }

    const branchExists = await branch.findById(branch_Id);
    if (!branchExists) {
      return res.status(404).json({ message: "Branch not found" });
    }

    if (technician) {
      const technicianExists = await user.findById(technician);
      if (!technicianExists || technicianExists.role !== "Technician") {
        return res
          .status(404)
          .json({ message: "Technician not found or invalid role" });
      }
    }

    const task_Id = await task.generateTaskId();
    const task_Status = technician ? "Assigned" : "Unassigned";

    // Ensure accessories are properly formatted
    const validAccessories = Array.isArray(accessories) ? accessories : [];
    console.log("validAccessories", validAccessories,);

    // Validate and update accessory quantity
    const updatedAccessories = [];
    for (const item of validAccessories) {
      const accessory = await accessoriess.findOne({ _id: item.accessories_Id });

      if (!accessory) {
        return res
          .status(404)
          .json({ message: `Accessory with ID ${item.accessories_Id} not found` });
      }

      if (accessory.accessories_Quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${accessory.accessories_Name}. Available: ${accessory.accessories_Quantity}, Required: ${item.quantity}`,
        });
      }

      // Deduct the accessory quantity
      accessory.accessories_Quantity -= item.quantity;
      await accessory.save();

      updatedAccessories.push({
        accessories_Id: item.accessories_Id,
        quantity: item.quantity,
      });
    }

    // Create a new task document
    const newTask = new task({
      task_Id,
      task_Name,
      task_Address,
      task_Phone,
      task_Desc: Array.isArray(task_Desc) ? task_Desc : [task_Desc],
      task_Status,
      branch_Id,
      technician: technician || null,
      accessories: updatedAccessories, // Store the accessories with correct IDs and quantities
    });

    await newTask.save();

    res.status(201).json({ message: "Task added successfully", newTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/task_list", async (req, res) => {
  try {
    const tasks = await task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/task_list/:task_Id", async (req, res) => {
  try {
    const task_Id = req.params.task_Id;

    const taskById = await task.findOne({ task_Id });
    res.status(200).json(taskById);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // PATCH API to update a task by task_Id
// router.patch("/update_task/:task_Id", async (req, res) => {
//   try {
//     const { task_Id } = req.params;
//     const updateData = req.body;

//     const task_update = await task.findOne({ task_Id: task_Id });

//     if (!task_update) {
//       return res.status(404).send({ message: "Task not found" });
//     }

//     if (updateData.task_Desc && Array.isArray(updateData.task_Desc)) {
//       task_update.task_Desc = [
//         ...task_update.task_Desc,
//         ...updateData.task_Desc,
//       ];
//     }

//     Object.assign(task_update, updateData);

//     const updatedTask = await task_update.save();

//     return res.status(200).send(updatedTask);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Server error" });
//   }
// });

// router.patch("/update_task/:task_Id", async (req, res) => {
//   try {
//     const { task_Id } = req.params;
//     const updateData = req.body;
//     console.log("updateData", updateData);
    
//     const task_update = await task.findOne({ task_Id });

//     if (!task_update) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     // Ensure task_Desc is updated correctly without overwriting existing values
//     if (updateData.task_Desc && Array.isArray(updateData.task_Desc)) {
//       task_update.task_Desc = [...task_update.task_Desc, ...updateData.task_Desc];
//     }

//     // Update only allowed fields (excluding task_Desc, which was handled separately)
//     const allowedUpdates = ["task_Name", "task_Address", "task_Phone", "task_Status", "technician", "accessories"];
//     allowedUpdates.forEach((field) => {
//       if (updateData[field] !== undefined) {
//         task_update[field] = updateData[field];
//       }
//     });

//     // Save the updated task
//     const updatedTask = await task_update.save();

//     return res.status(200).json({ message: "Task updated successfully", updatedTask });
//   } catch (error) {
//     console.error("Error updating task:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// router.patch("/update_task/:task_Id", async (req, res) => {
//   try {
//     const { task_Id } = req.params;
//     const updateData = req.body;
//     console.log("updateData", updateData);

//     // Check if the task exists
//     const task_update = await task.findOne({ task_Id });
//     if (!task_update) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     // If task_Desc is in the update request, append new values
//     if (updateData.task_Desc && Array.isArray(updateData.task_Desc)) {
//       await task.updateOne(
//         { task_Id },
//         { $push: { task_Desc: { $each: updateData.task_Desc } } } // Append values to task_Desc array
//       );
//       console.log("task_Desc updated successfully", updateData.task_Desc);
      
//     }

//     // Define allowed fields to update
//     const allowedUpdates = [
//       "task_Name",
//       "task_Address",
//       "task_Phone",
//       "task_Status",
//       "technician",
//       "accessories",
//     ];
    
//     // Prepare update object dynamically
//     const filteredUpdates = {};
//     allowedUpdates.forEach((field) => {
//       if (updateData[field] !== undefined) {
//         filteredUpdates[field] = updateData[field];
//       }
//     });

//     // Update other fields if needed
//     if (Object.keys(filteredUpdates).length > 0) {
//       await task.updateOne({ task_Id }, { $set: filteredUpdates });
//     }

//     // Fetch updated task
//     const updatedTask = await task.findOne({ task_Id });

//     return res.status(200).json({ message: "Task updated successfully", updatedTask });
//   } catch (error) {
//     console.error("Error updating task:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

router.patch("/update_task/:task_Id", async (req, res) => {
  try {
    const { task_Id } = req.params;
    let updateData = req.body;

    // Check if the task exists
    const task_update = await task.findOne({ task_Id });
    if (!task_update) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure task_Desc is stored as an array and append if necessary
    if (updateData.task_Desc) {
      if (typeof updateData.task_Desc === "string") {
        updateData.task_Desc = [updateData.task_Desc]; // Convert string to array
      }

      if (Array.isArray(updateData.task_Desc)) {
        await task.updateOne(
          { task_Id },
          { $push: { task_Desc: { $each: updateData.task_Desc } } } // Append values to task_Desc array
        );
      }
    }

    // Define allowed fields to update
    const allowedUpdates = [
      "task_Name",
      "task_Address",
      "task_Phone",
      "task_Status",
      "branch_Id",
      "technician",
      "accessories",
    ];

    // Prepare update object dynamically
    const filteredUpdates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredUpdates[field] = updateData[field];
      }
    });

    // Update other fields if needed
    if (Object.keys(filteredUpdates).length > 0) {
      await task.updateOne({ task_Id }, { $set: filteredUpdates });
    }

    // Fetch updated task
    const updatedTask = await task.findOne({ task_Id });

    return res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE API to delete a task by task_Id
router.delete("/delete_task/:task_Id", async (req, res) => {
  try {
    const { task_Id } = req.params;

    // Delete task by task_Id
    const deletedTask = await task.findOneAndDelete({ task_Id: task_Id });

    if (!deletedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    return res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
