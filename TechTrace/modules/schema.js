// modules/branchSchema.js
const mongoose = require('mongoose');

// Define the schema
const branchSchema = new mongoose.Schema({
  branch_Id: { type: String, required: true, unique: true },
  branch_Name: { type: String, required: true },
  branch_Phone:{ type:String,required:true },
  branch_Address: { type:String,required:true },
});

branchSchema.statics.generateBranchId = async function () {
  console.log("generateBranchId() function is being called..."); // Debug log
    const lastBranch = await this.findOne().sort({ branch_Id: -1 });

  let newIdNumber = 1;
  if (lastBranch && lastBranch.branch_Id) {
    const lastIdNumber = parseInt(lastBranch.branch_Id.split('_')[1], 10);
    if (!isNaN(lastIdNumber)) {
      newIdNumber = lastIdNumber + 1;
    }
    
  }
  const newBranchId = `Br_${newIdNumber.toString().padStart(4, '0')}`;
  console.log("Generated branch_Id:", newBranchId); // Debug log
  return newBranchId;

}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  branch: { type: String, required: true }
});

const taskSchema = new mongoose.Schema({
  task_Id: { type: String, required: true, unique: true },
  task_Name: { type: String, required: true },
  task_Phone:{ type:String,required:true },
  task_Address: { type:String,required:true },
  task_Desc: { type:String,required:true },
  task_Status: { type:String,required:true },
  branch_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
});

taskSchema.statics.generateTaskId = async function () {
  console.log("generateBranchId() function is being called..."); // Debug log
    const lastTask = await this.findOne().sort({ task_Id: -1 });

  let newIdNumber = 1;
  if (lastTask && lastTask.task_Id) {
    const lastIdNumber = parseInt(lastTask.task_Id.split('_')[1], 10);
    if (!isNaN(lastIdNumber)) {
      newIdNumber = lastIdNumber + 1;
    }
  }
  const newTaskId = `Task_${newIdNumber.toString().padStart(4, '0')}`;
  console.log("Generated branch_Id:", newTaskId); // Debug log
  return newTaskId;
}

const accessoriesSchema = new mongoose.Schema({
  accessories_Id: { type: String, required: true, unique: true },
  accessories_Name: { type: String, required: true },
  accessories_Desc: { type:String,required:true },
  accessories_Quantity: { type:Number,required:true },
});

accessoriesSchema.statics.generateaccessoriesId = async function () {
    const lastTask = await this.findOne().sort({ accessories_Id: -1 });

  let newIdNumber = 1;
  if (lastTask && lastTask.accessories_Id) {
    const lastIdNumber = parseInt(lastTask.accessories_Id.split('_')[1], 10);
    if (!isNaN(lastIdNumber)) {
      newIdNumber = lastIdNumber + 1;
    }
  }
  const newTaskId = `Access_${newIdNumber.toString().padStart(4, '0')}`;
  return newTaskId;
}


// Export the model
const user = mongoose.model('profiles', userSchema);
const branch = mongoose.model('branches', branchSchema);
const task = mongoose.model('tasks', taskSchema);
const accessories = mongoose.model('accessoriess', accessoriesSchema);
module.exports = { branch, user,task,accessories };