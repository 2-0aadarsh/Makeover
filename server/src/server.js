import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';
import path from 'path';
import os from 'os';

import connectDB from './configs/mongodb.config.js';
import redis from './configs/redis.config.js';
import { initializeSlotGenerationJobs } from './jobs/slotGeneration.job.js';
import contactRouter from './routes/contactUs.routes.js';
import authRouter from './routes/auth.routes.js';
import serviceRouter from './routes/service.routes.js';
import categoryRouter from './routes/category.routes.js';
import cartRouter from './routes/cart.routes.js';
import addressRouter from './routes/address.routes.js';
import bookingRouter from './routes/booking.routes.js';
import workingDaysRouter from './routes/workingDays.routes.js';
import dailySlotsRouter from './routes/dailySlots.routes.js';
import slotAutomationRouter from './routes/slotAutomation.routes.js';
import paymentRouter from './routes/payment.routes.js';
import newsletterRouter from './routes/newsletter.routes.js';
import enquiryRouter from './routes/enquiry.routes.js';
import serviceableCityAdminRouter from './routes/admin/serviceableCity.admin.routes.js';
import bookingConfigRouter from './routes/bookingConfig.routes.js';
import dashboardAdminRouter from './routes/admin/dashboard.admin.routes.js';
import bookingAdminRouter from './routes/admin/booking.admin.routes.js';
import customerAdminRouter from './routes/admin/customer.admin.routes.js';
import enquiryAdminRouter from './routes/admin/enquiry.admin.routes.js';
import uploadAdminRouter from './routes/admin/upload.admin.routes.js';
import categoryAdminRouter from './routes/admin/category.admin.routes.js';
import serviceAdminRouter from './routes/admin/service.admin.routes.js';
import reviewAdminRouter from './routes/admin/review.admin.routes.js';
import adminAdminRouter from './routes/admin/admin.admin.routes.js';
import onboardingRouter from './routes/admin/onboarding.routes.js';
import siteSettingsAdminRouter from './routes/admin/siteSettings.admin.routes.js';
import siteSettingsRouter from './routes/siteSettings.routes.js';
import reviewRouter from './routes/review.routes.js';
import notificationRouter from './routes/notification.routes.js';
import cityRequestRouter from './routes/cityRequest.routes.js';
import cityRequestAdminRouter from './routes/admin/cityRequest.admin.routes.js';
import connectCloudinary from './configs/cloudinary.config.js';

const app = express();

// Middleware
app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://wemakeover.netlify.app',
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Set CORS headers on every response so error responses (5xx) also have them
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());  
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// File upload middleware (express-fileupload)
// Use os.tmpdir() so temp dir works on Windows (e.g. C:\Users\...\AppData\Local\Temp) and Linux (/tmp)
const uploadTempDir = path.join(os.tmpdir(), 'wemakeover-uploads');
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: uploadTempDir,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max file size (must match client ImageUploadZone maxSize)
  abortOnLimit: false, // send proper 413 response instead of aborting connection (avoids ERR_CONNECTION_ABORTED)
  responseOnLimit: 'File size limit exceeded (max 25MB)',
  createParentPath: true,
  parseNested: true
}));

app.use("/", contactRouter);
app.use('/auth', authRouter);
app.use('/api/services', serviceRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/working-days', workingDaysRouter);
app.use('/api/daily-slots', dailySlotsRouter);
app.use('/api/slot-automation', slotAutomationRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/enquiry', enquiryRouter);
app.use('/api/admin/serviceable-cities', serviceableCityAdminRouter);
app.use('/api/admin/booking-config', bookingConfigRouter);
app.use('/api/admin/dashboard', dashboardAdminRouter);
app.use('/api/admin/bookings', bookingAdminRouter);
app.use('/api/admin/customers', customerAdminRouter);
app.use('/api/admin/enquiries', enquiryAdminRouter);
app.use('/api/admin/upload', uploadAdminRouter);
app.use('/api/admin/categories', categoryAdminRouter);
app.use('/api/admin/services', serviceAdminRouter);
app.use('/api/admin/reviews', reviewAdminRouter);
app.use('/api/admin/admins', adminAdminRouter);
app.use('/api/admin/onboard', onboardingRouter);
app.use('/api/admin/site-settings', siteSettingsAdminRouter);
app.use('/api/site-settings', siteSettingsRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/city-requests', cityRequestRouter);
app.use('/api/admin/city-requests', cityRequestAdminRouter);

app.disable('x-powered-by');

connectDB();
redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis connection error:', err));
connectCloudinary();

// Initialize slot generation jobs
initializeSlotGenerationJobs();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Export for Vercel instead of listen
export default app;

// for developemental
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });