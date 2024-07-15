const { models } = require("mongoose");
const User = require("../models/user")


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
     //taking data from request
     let {username,email,password} = req.body;
     const newUser = new User({email,username});
    
     //registering new User in database
     const registeredUser = await User.register(newUser,password)
     console.log(registeredUser);
    
     //Automatic login after signup
     req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","User Signup Successfully");
        res.redirect("/listings");
     })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
       
    }

    module.exports.renderLoginForm = (req,res)=>{
        res.render("users/login.ejs")
    }

    module.exports.login = async (req, res) => {
        req.flash('success', 'Logged in successfully!');
        console.log("User:", req.user); // Check if user is properly populated
        console.log("Is Authenticated:", req.isAuthenticated()); // Check authentication status
        console.log(res.locals.redirectUrl);

        // Redirect to the URL saved in session or default to '/listings'
        let redirectUrl =res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
    }

    module.exports.logout =(req,res)=>{
        req.logout((err)=>{
            if(err){
              return  next(err);
            }
            req.flash("success","You are logged out!")
            res.redirect("/listings")
        })
    }