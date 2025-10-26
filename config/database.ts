export default ({ env }) => ({
  connection: {
    // 1. กำหนดให้ใช้ PostgreSQL Client
    client: env('DATABASE_CLIENT', 'postgres'), 
    
    connection: {
      // 2. ดึงข้อมูล Host, Port, Database, User, Password จากไฟล์ .env
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi_final_db'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', '123456'), // ใช้รหัสผ่านที่ถูกต้อง
      
      // การตั้งค่า SSL สำหรับ Local/Cloud
      ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
    },
    
    // การตั้งค่าอื่นๆ
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
  },
});