const express=require('express');
const Users = require('../models/Users');
const router=express.Router();
const { query, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const JWT_SECRET='chiranjit@25';
var fetchuser = require('../middleware/fetchuser');


//Create a UserUsing:POST "/api/auth/" Does not required auth
// router.post('/', [
//     query('email').notEmpty(),
//     query('email').isEmail(),
//     query('name').isLength({min:3}),

// ] , (req,res) => {
//     // const errors = validationResult(req);
//     //    if (!errors.isEmpty()) {
//     //       return res.status(400).json({ errors: errors.array() });
//     //  }
//      const result = validationResult(req);
//   if (result.isEmpty()) {
//     return res.send(`Hello, ${req.query.name}!`);
//   }

//   const user=Users(req.body);
//   user.save();
//   res.send(req.body);
// })

router.post("/createuser", [
    // Validate email
    body('email')
      .isEmail().withMessage('Invalid email format')
      .custom((value) => {
        return Users.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject('Email already exists');
          }
        });
      }),
  
    // Validate name
    body('name')
      .isLength({ min: 5 }).withMessage('Name must be at least 5 characters'),
  
    // Validate password
    body('password')
      .isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
  ],async(req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
        // Check whether the user with this email exists already
         let user = await Users.findOne({ email: req.body.email });
        // if (user) {
        //   return res.status(400).json({ error: "Sorry a user with this email already exists" })
        // }
         const salt = await bcrypt.genSalt(10);
         const secPass = await bcrypt.hash(req.body.password, salt);
    
        // Create a new user
        user = await Users.create({
          name: req.body.name,
          password: secPass,
          email: req.body.email,
        });
        const data = {
          user: {
            id: user.id
          }
        }
       const authtoken = jwt.sign(data, JWT_SECRET);
    
    
        // res.json(user)
        res.json({ authtoken })
    
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
  });

// router.post('/', [
//     // username must be an email
//     body('email','Enter a valid email').isEmail(),
//     // password must be at least 5 chars long
//     body('password').isLength({ min: 5 }),
//     body('name','Enter a valid Name').isLength({ min: 5 })
//   ], (req, res) => {
//     // Finds the validation errors in this request and wraps them in an object with handy functions
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
  
//     Users.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//     }).then(user => res.json(user));
//   });


//Create a User login Using:POST "/api/auth/login" Does not required auth

router.post("/login", [
    // Validate email
    body('email')
      .isEmail().withMessage('Invalid email format'),
    // Validate password
   // body('password')
     // .isEmpty().withMessage('Enter password')
  ],async(req, res) => {
     // Check for validation errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
  const {email,password}=req.body; ///it call desturcture 

    try {
        let user = await Users.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please try to right credentioal"})
        }

        let comparepassword =  await bcrypt.compare(password,user.password);
        if(!comparepassword){
            return res.status(400).json({error:"Please try to right credentioal"})
        }
        const data = {
            user: {
              id: user.id
            }
          }
         const authtoken = jwt.sign(data, JWT_SECRET);
          // res.json(user)
          res.json({ authtoken })
      

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }

  });

  // ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

    try {
      userId = req.user.id;
      const user = await Users.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })


module.exports=router;