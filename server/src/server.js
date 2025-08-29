import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import cookieParser from "cookie-parser";

import connectDB from './configs/mongodb.config.js';
import redis from './configs/redis.config.js';
import contactRouter from './routes/contactUs.routes.js';
import authRouter from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT;
if (!PORT) {
  console.error("PORT is not defined in the environment variables.");
  process.exit(1);
}

// Middleware setup
app.use(helmet()); // Security middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   credentials: true
// }));

const allowedOrigins = [process.env.CLIENT_URL, 'https://wemakeover.netlify.app', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true // if using cookies or auth headers
}));

app.use(express.json());  
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use("/", contactRouter);
app.use('/auth', authRouter);


// Disable X-Powered-By header
app.disable('x-powered-by')

connectDB()
redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
