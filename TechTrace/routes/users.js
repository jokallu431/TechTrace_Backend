var express = require('express');
var router = express.Router();
const {user} = require('../modules/schema');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;

/* Token Generation */
function generateAccessToken(username){
  // return jwt.sign({
  //   exp: Math.floor(Date.now() / 1000) + (60 * 60),
  //   data: username
  // }, 'TECH_TRACE');
  return jwt.sign(username,'TECH_TRACE');
}
/* Token Verification */
function verifyToken(token)
{
  return jwt.verify(token,'TECH_TRACE');
}
/* Password Encryption and Decryption */
async function encrypt(password){
let hash = await bcrypt.hash(password,saltRounds);
      console.log("hash",hash);
      return hash;
  };

async function decrypt(password,hash){
let result= await bcrypt.compare(password,hash);
return result;
}

// Import the user model
router.post('/profile', async function(req, res, next) {
try {
  
  const {name,email,password,phone,role,branch } = req.body;
  
  let securePassword= await encrypt(password);
  
  // Create a new user document
  const newuser = new user({
    name,
    email,
    password:securePassword,
    phone,
    role,
    branch,
  });
  
  // Save the user to the database
  await newuser.save();

  res.status(201).json({ message: 'User added successfully', User: newuser });
} catch (error) {
  res.status(500).json({ error: error.message });
}
});

// Example: Fetch all branches
router.get('/technician_list', async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* User Login */
router.post('/login', async function(req, res, next) {
  console.log("Login called");

  const {email} = req.body;
    const users = await user.findOne({email:email});
    console.log(users.password);
    
    if (users){
      let password=(req.body.password); 
      console.log(users);
      let result= await decrypt(password,users.password);
      console.log(users);
          if (result==true){
          let token = generateAccessToken(JSON.stringify(users));
          res.send({
              message :"User List",
              status:"Success decrypt",
              data:users,token
        })
    }}
    else{
      res.send({
        message :"User List",
        status:"Login failed. Try again",
        data:[]
  })
    } 
});

/* Token Verification */
router.get('/verify', function (req, res, next){

  let token= verifyToken(req.headers.authorization.split(" ")[1]);
    console.log("token",token);
    
  user.findById(token._id).then((user)=>{
    console.log(user);
    
    res.send(user);
  });
});

module.exports = router;
