const billingsModel = require("../models/billing.model");
const orderModel = require("../models/order.model");

const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

const createOrder = (req, res) => {
  let token = req.headers.authorization;
 
  jwt.verify(token, SECRET, (err, result) => {
    if (err) {
      res.send({
        status: false,
        message: "Please sign in to create order",
        err: err.message,
      });
    } else {
        let { order_details, payment_details } = req.body;
        let { amount_paid } = payment_details;
      let form = new orderModel({...order_details, amount_paid});
      form
        .save()
        .then((result) => {
          if (payment_details) {
            let billings = new billingsModel({...payment_details, order_id: result._id});
            billings.save().then((result) => {
              setTimeout(() => {
                res.status(200).send({
                  message: "Order successfully created",
                  status: true,
                });
              }, 5000);
            });
          } else {
            setTimeout(() => {
              res.status(200).send({
                message: "Order successfully created",
                status: true,
              });
            }, 5000);
          }
        })
        .catch((err) => {
          res.status(401).send({
            message: "There was an error",
            status: true,
            err: err.message,
          });
        });
    }
  });
};

const updateOrderStatus = (req, res) => {
  const token = req.headers.authorization;
  let { order_id, status } = req.body;
  jwt.verify(token, SECRET, (err, result) => {
    if (err) {
      res.status(403).send({
        status: false,
        message: "Please sign in update order status",
        err: err.message,
      });
    } else {
      orderModel
        .findOneAndUpdate({ _id: order_id }, { order_status: status })
        .then((result) => {
          res
            .status(200)
            .send({ status: true, message: "Order Status updated" });
        })
        .catch((err) => {
          res.status(400).send({
            message: "There was an err",
            err: err.message,
            status: false,
          });
        });
    }
  });
};
const getOrder = async (req, res) => {
  const token = req.headers.authorization;
  const { order_id } = req.body;

  jwt.verify(token, SECRET, (err, result) => {
    if (err) {
      res.status(403).send({
        status: false,
        message: "Please sign in to access order",
        err: err.message,
      });
    } else {
      orderModel
        .findOne({ _id: order_id })
        .then((result) => {
          if (result) {
            res
              .status(200)
              .send({ message: "Request Successful", status: true, result });
          } else {
            res.status(404).send({ message: "Order Not Found", status: false });
          }
        })
        .catch((err) => {
          res
            .status(400)
            .send({ message: "Something went wrong", status: false });
        });
    }
  });
};
module.exports = { createOrder, getOrder, updateOrderStatus };
