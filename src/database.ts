import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'mypassword',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dialect: 'postgres',
  logging: false,
});

export async function connectWithRetry() {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (err) {
    console.log('Retrying in 3s...');
    setTimeout(connectWithRetry, 3000);
  }
}

connectWithRetry();