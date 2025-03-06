import { mysqlTable,int,varchar, boolean,serial } from 'drizzle-orm/mysql-core';


export const GRADES = mysqlTable('grades', {
  id:int('id').primaryKey(),  
  grade:varchar('grade',{length: 10}).notNull()
});
    
export const STUDENTS = mysqlTable("students", {
  id: serial("id").primaryKey(), // Auto-incrementing ID (Correct for MySQL)
  name: varchar("name", { length: 20 }).notNull(),
  grade: varchar("grade", { length: 10 }).notNull(),
  address: varchar("address", { length: 50 }),
  contact: varchar("contact", { length: 11 }),
});

export const ATTENDANCE = mysqlTable('attendence',{
  id:int('id',{length : 11}).autoincrement().primaryKey(),
  studentId : int ('studentId',{length : 11}).notNull(),
  present : boolean('present').default(false),
  day: int ('day',{length : 11}).notNull(),
  date : varchar ('date',{length : 11}).notNull()
});