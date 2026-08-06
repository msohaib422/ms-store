require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const connectDB = require('../config/db');
const seed = require('../utils/seed');
const errorHandler = require('../middleware/error.middleware');

const authRoutes = require('../routes/auth.routes');
const productRoutes = require('../routes/product.routes');
const categoryRoutes = require('../routes/category.routes');
const reviewRoutes = require('../routes/review.routes');
const messageRoutes = require('../routes/message.routes');
const settingsRoutes = require('../routes/settings.routes');
const uploadRoutes = require('../routes/upload.routes');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('.vercel.app'))) {
      return cb(null, true);
    }
    cb(null, true); // open for now — restrict after domain is set
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(mongoSanitize());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(errorHandler);

// Initialize DB + seed once per cold start
let ready = false;
const ensureReady = async () => {
  if (!ready) {
    await connectDB();
    await seed();
    ready = true;
  }
};

// Vercel serverless export
module.exports = async (req, res) => {
  try {
    await ensureReady();
    app(req, res);
  } catch (err) {
    console.error('Handler error:', err.message);
    res.status(500).json({ success: false, message: 'Server initialization failed: ' + err.message });
  }
};

// Local dev
if (require.main === module) {
  ensureReady().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
