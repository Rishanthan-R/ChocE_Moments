import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// ============== MIDDLEWARE ==============
// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan('dev'));

// ============== ROUTES ==============
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ============== ERROR HANDLING ==============
app.use((err, req, res, next) => {
  console.error('Error:', err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ============== DATABASE & SERVER ==============
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   ChocE Moments Backend Server         ║
╠════════════════════════════════════════╣
║   Port: ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}           ║
║   Status: ✅ Running                     ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
