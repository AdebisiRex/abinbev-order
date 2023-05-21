const express =require('express');
const app =express();
const cors = require('cors')
require("dotenv").config();
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const mongoose = require('mongoose')
const PORT = process.env.PORT

app.get('/', (req, res)=>{
    console.log ("We are connected")
    res.send({message: "aiit, let's do this"})
})

app.listen(PORT, (req, res)=>{
    console.log(PORT,"Order Server Started")
})


const {createOrder, updateOrderStatus, getOrder}= require("./controllers/order.controller")
app.post("/order/create-order", createOrder )
app.post("/order/update-status", updateOrderStatus )
app.post("/order/get-order", getOrder )

