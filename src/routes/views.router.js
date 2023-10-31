import express from "express";
const router = express.Router()

router.get("/", async(req,res)=>{
    res.render("login.hbs",{
        title: "Vista login"
    })
})

export default router
