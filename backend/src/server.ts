import app from './app';
import { connectDB, closeDB } from './config/database';
// import logger from './config/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();
    
    const server = app.listen(PORT, () => {
      // logger.info(`Server is running on port ${PORT}`);
      console.log(`Server is running on port ${PORT}`);
    });

    // Graceful Shutdown
    process.on('SIGINT', async () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('HTTP server closed');
      });
      await closeDB();
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('HTTP server closed');
      });
      await closeDB();
    });

  } catch (error) {
    // logger.error('Failed to start server:', error);
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
