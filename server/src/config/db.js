const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let pool = null;
let isConnectedToMySQL = false;

const initDb = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'support_insights',
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
      queueLimit: 0,
      multipleStatements: true
    });

    const connection = await pool.getConnection();
    console.log(' Successfully connected to MySQL database: ' + (process.env.DB_NAME || 'support_insights'));
    connection.release();
    isConnectedToMySQL = true;
  } catch (error) {
    console.warn('⚠️  MySQL connection failed:', error.message);
    console.warn('ℹ️  Falling back to high-performance in-memory repository layer for seamless zero-config execution.');
    isConnectedToMySQL = false;
  }
};

// Auto initialize connection
initDb();

const query = async (sql, params = []) => {
  if (isConnectedToMySQL && pool) {
    const [rows] = await pool.execute(sql, params);
    return rows;
  }
  throw new Error('MySQL connection inactive');
};

module.exports = {
  pool,
  query,
  getIsConnected: () => isConnectedToMySQL,
  initDb
};
