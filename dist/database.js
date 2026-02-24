"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.connectWithRetry = connectWithRetry;
require("dotenv/config");
const sequelize_1 = require("sequelize");
console.log('DB_NAME =', JSON.stringify(process.env.DB_NAME));
console.log('DB_USER =', JSON.stringify(process.env.DB_USER));
console.log('DB_PASSWORD =', JSON.stringify(process.env.DB_PASSWORD));
console.log('DB_HOST =', JSON.stringify(process.env.DB_HOST));
console.log('DB_PORT =', JSON.stringify(process.env.DB_PORT));
exports.sequelize = new sequelize_1.Sequelize({
    database: 'postgres',
    username: 'postgres',
    password: 'mypassword',
    host: 'postgres',
    port: 5432,
    dialect: 'postgres',
    logging: false,
});
async function connectWithRetry() {
    try {
        await exports.sequelize.authenticate();
        console.log('Database connected!');
    }
    catch (err) {
        console.log('Retrying in 3s...');
        setTimeout(connectWithRetry, 3000);
    }
}
connectWithRetry();
//# sourceMappingURL=database.js.map