import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "student",
  password : "riddhi@2909",
  port : "3306"
});

const db = drizzle({ client: connection });
export default db;
