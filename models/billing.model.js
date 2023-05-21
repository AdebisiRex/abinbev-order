const mongoose = require("mongoose");
let billingsURI = process.env.BILLINGS_URI;
const billingsDB = mongoose.createConnection(billingsURI);

const billingsSchema = mongoose.Schema({
    order_id: {type: String, required: true},
    amount_paid: {type: Number},
    transaction_name: {type: String, required:true}, 
    transaction_type: {type: String, uppercase: true},
    transaction_date: { type: Date, default: Date.now() },
})

const billingsModel = billingsDB.model("transactions", billingsSchema);

module.exports = billingsModel;