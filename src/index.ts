import 'reflect-metadata'; //enable decorator metadata
import 'dotenv/config';

import '@presentation/Dependency-Injection/Container'; //execute the DI container setup
import express from 'express';
import userRoutes from '@presentation/Routes/Auth/user.routes';
import cors from 'cors';
import { connectToPostgressDB } from '@infrastructure/Database/postgress';
import { connectToRedis } from '@infrastructure/Cache/redis.client';

const app = express();

// app.use(cors({
//   origin: true,
//   credentials: true
// }));



// app.use(
//   cors({
//     origin: process.env.CLIENT_SIDE_URL || "http://localhost:5173",
//     credentials:true
//   })
// )

app.use(
  cors({
    origin: [
      process.env.CLIENT_SIDE_URL || 'http://localhost:5173' ,
    ],
    credentials:true
  }),
);

app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
async function serverStart() {
  await connectToRedis()
  await connectToPostgressDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port http://localhost:${PORT}`);
  });
}

serverStart();
