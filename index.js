// server create kiya 
const express = require('express');
const app = express();

// Server ke liye PORT findout kiya
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// middleware to parse request body
app.use(express.json())

// import all routes
const blog = require('./routes/blog')

// mount
app.use('/api/v1', blog)

// connection with database
const connectWithDb = require('./config/database');
connectWithDb();

// activate app
app.listen(PORT, ()=>{
    console.log(`App is listening on Port ${PORT}`);
})

// default route
app.get("/", (req, res)=>{
    res.send(`<h1>Home Page</h1>`)
})
