const express = require("express");
const mysql = require('mysql');
// set up the connection string
const con = mysql.createConnection({
    database: "bookstore",
    user: "root",
    password: '',
});
// database connection
con.connect((err)=>{
    if(err) throw err
    else{
        console.log("Database connected successfully !!!!");
    }
})
module.exports = con;
console.log("Database connection string is already ready to use");