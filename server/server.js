import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. CORS configuration
app.use(cors());

// 3. Rate Limiting (limit to 100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 4. Request Body Limit (prevent payload size overflow)
app.use(express.json({ limit: '10kb' }));

// 5. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Routes
app.use('/api', apiRoutes);

// Root testing route
app.get('/', (req, res) => {
  res.send('⚡ Prediq API is running securely...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ Server running in developer mode on port ${PORT}`);
});

