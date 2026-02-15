import 'reflect-metadata'; //enable decorator metadata
import 'dotenv/config';

import '@presentation/Dependency-Injection/Container'; //execute the DI container setup
import express from 'express';

import cors from 'cors';
import { connectToPostgressDB } from '@infrastructure/Database/postgress';
import { connectToRedis } from '@infrastructure/Cache/redis.client';
import router from '@presentation/Routes/router';

const app = express();



app.use(
  cors({
    origin: [
      process.env.CLIENT_SIDE_URL || 'http://localhost:5173' ,
    ],
    credentials:true
  }),
);

// app.use((req, res, next) => {
//   console.log("🌍 Incoming:", req.method, req.url);
//   next();
// });


app.use(express.json());

app.use('/api', router);

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
