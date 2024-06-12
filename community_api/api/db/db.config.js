const mysql = require("mysql2/promise");

const dbPool = mysql.createPool({
    host: "192.168.0.13",
    port: "9906",
    user: "developer",
    password: "developer",
    database: "community",
    connectionLimit: 10
});

module.exports = dbPool;


/*
=> simple query
connection.query(
    'select * from `table` where `name` = "page" and `age` > 45, (err, result, fields) => {
        console.log(results)
        console.log(fields)
    }
);

=> query with placeholder
connection.query(
    'select * from `table` where `name` = ? and `age` > ?, ['page', 45], (err, results) => {
        console.log(results)
    }
);
 */