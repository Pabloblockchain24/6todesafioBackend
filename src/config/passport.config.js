import passport from "passport";
import local from "passport-local"
import userService from "../models/User.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2"
const localStrategy = local.Strategy

const initalizePassport = () => {
    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                let user = await userService.findOne({ email: username })
                if (user) {
                    console.log("El usuario ya existe")
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userService.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al obtener usuario")
            }
        }
    ))

    passport.use("github", new GitHubStrategy({
        clientID:"Iv1.b193efba53e74a10",
        clientSecret:"0a86415cfd29274c35e0861424221cb0f48e55d2",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    },async(accessToken, refreshToken, profile, done)=>{
        try{
            // console.log(profile)
            let user = await userService.findOne({email:profile._json.email})
            if(!user){
                let newUser={
                    first_name: profile._json.name,
                    last_name: "",
                    age:18,
                    email:profile._json.email,
                    password:""
                }
                let result = await userService(newUser)
                done(null,result)
            }else{
                done(null,user)
            }
        }catch(error){
            return done(error)
        }
    }
    ))
}


passport.serializeUser((user, done) => {
    done(null, user._id)
})


passport.deserializeUser(async (id, done) => {
    let user = await userService.findById(id)
    done(null, user)
})


passport.use("login", new localStrategy({ usernameField: "email" }, async (username, password, done) => {
    try {
        const user = await userService.findOne({ email: username })
        if (!user) {
            console.log("Usuario no existe")
            return done(null, false)
        }
        if (!isValidPassword(user, password)){
            return done(null, false)
        } 
        return done(null, user)
    } catch (error) {
        return done(error)
    }
}))


export default initalizePassport
