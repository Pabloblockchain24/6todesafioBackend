import express from "express";
const router = express.Router()
import passport from "passport";



router.post("/register", passport.authenticate("register", {failureRedirect:"/api/users/failregister"}), async(req,res)=>{
    res.send({status:"success", message:"usuario registrado"})
}
)

router.get("/failregister", async(req,res)=>{
    console.log("Falla de registro")
    res.send({error: "Fallo"})
})

router.post("/login", passport.authenticate("login", {failureRedirect:"/api/users/faillogin"}), async(req,res) =>{
    if (!req.user) return res.status(400).send({status:"error", error:"credenciales invalidas"})

    req.session.user={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    let nombre = req.user.first_name
    let apellido = req.user.last_name
    console.log(nombre)
    res.render("home.hbs",{
        nombre,
        apellido
    })
    }
)

router.get("/faillogin", (req,res)=>{
    res.send({error: "login fallado"})
})


export {router}
