import { createApp } from './app.js';
import { config } from './shared/config/env.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Student Record Management System API is running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🩺 Health: http://localhost:${config.port}/api/health`);
  console.log(`💡 Mode: ${config.nodeEnv}`);
  console.log(`======================================================\n`);
});
