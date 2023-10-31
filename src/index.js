import express from "express"
import __dirname from "./utils.js"
import mongoose, { mongo } from "mongoose";
import passport from "passport"
import initalizePassport from "./config/passport.config.js"
import session from "express-session"
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js"
import { router as userRouter } from "./routes/user.router.js";

import {engine} from "express-handlebars"
import path from "path";

const app = express()
const port = 8080;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret:"CoderSecret",
    resave: true,
    saveUninitialized:true
}))

const connection = mongoose.connect("mongodb+srv://parcepaivaTest:clusterMongo@clustercoderhouse.unxc6mu.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos", error);
    })

initalizePassport(passport)
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

app.use("/", viewsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/users", userRouter)


app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
})