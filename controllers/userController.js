const User = require("../models/userModel");
const bcrypt = require("bcrypt");

//---------------**Register GET METHOD **-------------------

const loadRegister = async (req, res) => {
  try {
    res.render("register" , { title: 'Register Page' });
  } catch (error) {
    console.log(error.message);
  }
};

//-------------POST METHOD -------------

const insertUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if any required field is missing or empty
  if (!name || !email || !password) {
    return res.render("register", { message: "Name, email, and password are required fields" });
  }

  // Trim name and email to remove leading/trailing whitespace
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  // Check if name or email is empty after trimming
  if (trimmedName === "" || trimmedEmail === "") {
    return res.render("register", { message: "Name and email must not be empty" });
  }

  // Continue with password hashing and database insertion
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const existingUser = await User.findOne({ email: trimmedEmail });

    if (existingUser) {
      return res.render('register', { message: 'Email address already exists' });
    }

    const user = new User({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
    });

    const userData = await user.save();

    return res.render("register", { message: "Your registration is completed" });
  } catch (error) {
    console.error(error.message);
    // Handle database errors here
    return res.status(500).send("Internal Server Error");
  }
};



/*
const insertUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    const fieldMissing = "Name, email, and password are required fields";
    return res.render("register", { message: fieldMissing });
  }
 
 
  
  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  try {
    const useri = await User.findOne({ email: req.body.email });
    

  if (useri) {
    return res.render('register', { message: 'Existing Email Address' });
  }
  
  else {
    const {name, email} = req.body
   if(name==="" || email === ""){
      res.render("register", { message: "fieldMissing" })
    }
   else{
     if(name.trim()=="" || email.trim() ==""){
      res.render("register", { message: "fieldMissing" })
    }}}
  
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      
      password: hashedPassword,

    });

    const userData = await user
      .save()
      .then(() =>
        res.render("register", { message: "Your Registration is Completed" })
      );
   }catch (error) {
    console.log(error.message);
  }
};
*/
//--------------LOgin User-----------------

const loadLogin = async (req, res) => {
  try {
    if (req.session.user) {
      return res.redirect("/home");
    } else {
      res.render("login" ,{ title: 'Login Page' });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({
      email: email,
    });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        req.session.user_id = userData.id;
        req.session.user = true;
        res.redirect("/home");
        //res.send("home")
      }
    } else {
      res.render("login", { message: "Invalid User" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//-----------------------home Page------------------

const loadHome = async (req, res) => {
  try {
    if (req.session.user) {
      // return res.redirect('/home')}
      res.render("home",{ title: 'Home Page' });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const logout  = (req, res)=>{
    req.session.destroy(()=>{
        res.render('login')
    })

    }




    


module.exports = {
  loadRegister,
  insertUser,
  loadLogin,
  verifyLogin,
  loadHome,
  logout,
  
};
