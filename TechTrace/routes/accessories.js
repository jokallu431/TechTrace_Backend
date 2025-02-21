var express = require("express");
var router = express.Router();
const { accessories } = require("../modules/schema");
/* create Branch listing. */
router.post("/create_accessories", async function (req, res, next) {
  try {
    const { accessories_Name, accessories_Desc, accessories_Quantity } =
      req.body;
    const accessories_Id = await accessories.generateaccessoriesId();
    // Create a new branch document
    const newaccessories = new accessories({
      accessories_Id,
      accessories_Name,
      accessories_Desc,
      accessories_Quantity,
    });
    console.log("newaccessories", newaccessories);

    // Save the branch to the database
    await newaccessories.save();

    res
      .status(201)
      .json({
        message: "accessories added successfully",
        newaccessories: newaccessories,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example: Fetch all branches
router.get("/accessories_list", async (req, res) => {
  try {
    const accessories_list = await accessories.find();
    res.status(200).json(accessories_list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH - Update Accessories (e.g., Update Quantity)
router.patch("/update_accessories/:accessories_Id", async (req, res) => {
  try {
    const { accessories_Id } = req.params;
    const updateData = req.body;

    const updatedAccessory = await accessories.findOneAndUpdate(
      { accessories_Id }, 
      updateData,
      { new: true }
    );

    if (!updatedAccessory) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.status(200).json(updatedAccessory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Remove Accessories
router.delete("/delete_accessories/:accessories_Id", async (req, res) => {
  try {
    const { accessories_Id } = req.params;

    const deletedAccessory = await accessories.findOneAndDelete(
      { accessories_Id }
    );

    if (!deletedAccessory) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.status(200).json({ message: "Accessory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
