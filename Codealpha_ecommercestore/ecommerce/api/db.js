import mysql from "mysql2";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "ecommerce",
})

db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database");
}); 

export default db; 