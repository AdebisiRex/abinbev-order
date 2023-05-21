const mongoose = require("mongoose");
let orderURI = process.env.ORDER_URI;
const orderDB = mongoose.createConnection(orderURI);

const orderSchema = mongoose.Schema({
  customer_id: { type: String, required: true },
  seller_email: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  delivery_details: {
    address: { type: String, required: true },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
  },
  total_price: { type: Number, required: true },
  amount_paid: { type: Number },
  order_cart: [
    { product_id: String, description: String, total_units: Number },
  ],
  order_status: { type: String, uppercase: true },
  payment_status: {type: String}
});

orderSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const payedAmount = update.amount_paid;
  const {total_price} = await this.model.findOne(this.getQuery())
  // const totalPrice = this.getUpdate().total_price;
  if(payedAmount< total_price && update.order_status == "SHIPPED"){
    throw new Error("You cannot ship partially paid order")
    
  }
  if (payedAmount >= total_price) {
    update.payment_status = "PAYMENT COMPLETED";
  } 
  else {
    update.payment_status = "PARTIAL PAYMENT";
  }
  next();
});

orderSchema.pre("save", function (next) {
  if (this.amount_paid >= this.total_price) {
    this.payment_status = "COMPLETED";
  } else {
    this.payment_status = "PARTIAL PAYMENT";
  }
  next();
});

const orderModel = orderDB.model("orders", orderSchema);
module.exports = orderModel;
