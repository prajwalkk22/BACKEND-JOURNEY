import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/index.js";
dotenv.config({
    path:"./.env"
})




const PORT = process.env.PORT || 8000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Mong db is connected http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
