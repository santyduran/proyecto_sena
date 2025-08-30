import mysql from 'mysql2/promise';


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',   
  database: 'turism',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});
export default pool;