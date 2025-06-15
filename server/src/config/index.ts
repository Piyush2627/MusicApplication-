import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  // Add other configurations here
};

export default config;
