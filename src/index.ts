import "reflect-metadata";
import "dotenv/config"

import "@presentation/Dependency-Injection/Container"
import express from "express";
import userRoutes from 'Presentation/Routes/user.routes'
import cors from 'cors'
import { connectToPostgressDB } from "@infrastructure/Database/postgress";

const app = express()
app.use(
  cors({
    origin: process.env.CLIENT_SIDE_URL || "http://localhost:5173"
  })
)
app.use(express.json())

app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const PORT = process.env.PORT || 3000
async function serverStart() {
  await connectToPostgressDB()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port http://localhost:${PORT}`);
  });
}


serverStart()

