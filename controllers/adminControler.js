const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nocach = require("nocache")

const adminCredential = {
    email: 'admin@gmail.com',
    password: '1234'
  };

  //---------------** Admin GET METHOD **-------------------

const loadAdmin = async (req, res) => {
    try {
     if(req.session.user){
      res.redirect("/adminPannel" );
     }else {
      res.render("adminLogin", { title: 'Admin LoginPage' })
     }
    } catch (error) {
      console.log(error.message);
    }
  };

  //---------------** Admin-login POST METHOD **-------------------


  const verifyAdmin= async (req,res) =>{

    try {
        const email = req.body.email;
        const password = req.body.password;
        if (req.body.email === adminCredential.email && req.body.password === adminCredential.password ){

           // req.session.user = req.body.email
            req.session.user = true
            res.redirect("/adminPannel");
        }
        else{
            res.render('adminLogin', { title: 'Admin LoginPage', message: 'wrong credential' })
        }

    }
     catch (error) {
        console.log(error.message);
        
    }
  }


   //---------------** Admin-Pannel GET  METHOD**----------------------------------


  const   loadAminPannel = async (req, res) => {
    try {
      if(req.session.user){
        let search=  req.query.search ||'' 
        // if(req.query.search){
        //   search=req.query.search
        // }
       let userList = await User.find({
        $or:[
         {name:{$regex:'^'+search,$options:'i'}},
          {email:{$regex:'^'+search,$options:'i'}} ]
        
       })
       console.log(userList,"hello");
      
        res.render("adminPannel" , { title: 'Admin Pannel',userList:userList });
      }else{
        redirect('/admin')
      }
   } catch (error) {
      console.log(error.message);
    }
  };

  //---------------** Admin-Pannel LOGOUT**----------------------------------

  const adminLogout  = (req, res)=>{
    // req.session.destroy(()=>{
    //     res.render('login')
    // }) }
    req.session.user = false
    res.render('login')
  }
  
 
  //****************************************************************************************** */
  //--------------------------------------ADD nEW USER -----------------------------------------
  /********************************************************************************************* */


  //-------------------GET METHOD-------------------

  const loadAddNewUserPage = async(req, res)=>{

    try {
      res.render('addNewUser')
      
    } catch (error) {
      console.log(error.message);
      
    }
  }


  //---------------POST METHOD----------------------

  const insertNewUser = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
      const fieldMissing = "Name, email, and password are required fields";
      return res.redirect("/addNewUser", { message: fieldMissing });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
  
  try {
    const useri = await User.findOne({ email: req.body.email });

  if (useri) {
    return res.render("addNewUser", { message: 'Existing Email Address' });
  }
  else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      
      password: hashedPassword,

    });
    const newUserData = await newUser
      .save()
      .then(() =>
        res.render("addNewUser", { message: "New User is Added" })
      );
  } }catch (error) {
    console.log(error.message);
  }}

    //****************************************************************************************** */
  //--------------------------------------Edit USER -----------------------------------------
  /********************************************************************************************* */


  //-------------------GET METHOD-------------------

  const loadEditpage = async(req, res)=>{

    try {

      const id = req.params.id
      //console.log(id);
      const existingUser=await User.findById(id)
      //console.log(existingUser,"user found");
      if(existingUser){
      res.render('editUser',{user:existingUser})
      }
      else{
        res.redirect('/adminPannel')
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

   //------------------- (UPDATE) POST METHOD-------------------
/*
   const updateUser = async (req, res) =>{
    const {name, email} = req.body
    if(name==="" || email === ""){
      res.render("editUser",{user:{}, message:"empty field"})
    }
    if(name.trim()=="" || email.trim() ==""){
      res.render("editUser",{user:{}, message:"empty field"})
    }
    

    try {
      console.log(req.body.ID);
     const updated =await User.findByIdAndUpdate({_id:req.body.ID},{$set:{name:req.body.name, email:req.body.email}})
     res.redirect("/adminPannel", )
      
    } catch (error) {
      console.log(error.message);
      
    }
   }
*/

const updateUser = async (req, res) => {
  const { name, email, ID } = req.body;

  // Check if name or email is empty or contains only whitespace
  if (name.trim() === "" || email.trim() === "") {
    return res.render("editUser", { user: {}, message: "Empty field" });
  }

  try {
    console.log(ID);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: ID },
      { $set: { name, email } }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // Redirect to the admin panel after a successful update
    res.redirect("/adminPannel");
  } catch (error) {
    console.error(error.message);
    // Handle database errors here
    return res.status(500).send("Internal Server Error");
  }
};


   //-------------------- DELETE USER----------------

   const delUser= async (req, res)=> {  
     try {
      const id = req.params.id
      console.log(id);
      await User.deleteOne({_id:id})
      res.redirect('/adminPannel')
      
     } catch (error) {
      console.log(error.message);
      
     }
   }

  

  module.exports={
    loadAdmin,
    verifyAdmin,
    loadAminPannel,
    loadAddNewUserPage,
    insertNewUser,
    adminLogout,
    loadEditpage,
    updateUser,
    delUser,
   //userSearch,
   //userGet
   // getAllUsers
    
  }