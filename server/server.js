require ("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const excelRoutes = require('./routes/excelRoutes');

const corsOptions = require("./config/corsOptions")
const connectDB=require("./config/dbConn")

connectDB()
const app=express()
const PORT=process.env.PORT||5000

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// שימוש בראוטים
app.use('/api', excelRoutes);
// app.use('api/loto',lotoRoute)

//חיבור למונגו
mongoose.connection.once('open',()=>{
    console.log("connect to server success")
    app.listen(PORT,()=>{
        console.log(`server runing on port ${PORT}`)
    })
})
mongoose.connection.on('error',()=>{
    console.log("****error****")
})