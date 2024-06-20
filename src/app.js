import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, lmit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




//routes import
 
// we can use any name for import when we are doing default export like using import name as userRouter bcoz export of router as default in ./routes/user.routes.js

import userRouter from "./routes/user.routes.js"

//routes declaration
// app.use("/users", userRouter)
app.use("/api/v1/users", userRouter)


// https://localhost:8000/api/v1/users will call userRouter and redirect to user.routes.js file and call register https://localhost:8000/api/v1/users/register
export { app }
