import dotenv from "dotenv"
dotenv.config();
import { ConnectDB } from "./db/db.js";
import { app } from "./app.js";
ConnectDB();
app.listen(process.env.PORT,"0.0.0.0",()=>{
    console.log("listening to the port 5000")
})
