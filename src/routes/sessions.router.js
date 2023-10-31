import express from "express";
import passport from "passport";
const router = express.Router()


router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})
router.get("/githubcallback", passport.authenticate("github",{failure:"/login"}), async(req,res)=>{
    req.session.user=req.user
    let nombre = req.session.user.first_name
    res.render("home.hbs",{
        nombre
    })
})

export default router