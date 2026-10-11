import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`🚀 Skill Setu API server running on port ${config.port}`);
  console.log(`📍 API Base: http://localhost:${config.port}${config.apiPrefix}`);
  console.log(`📖 API Docs: http://localhost:${config.port}/api/docs`);
  console.log(`🩺 Health:   http://localhost:${config.port}/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
