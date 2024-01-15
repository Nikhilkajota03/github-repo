const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/registration");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");
const MarketTra = require("../models/marketTra");
const stripeTra = require("../models/markeetTransaction");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51ORdAfSHVF5wmC65bjGgIAaJ79E6707dJ10Fkx4kjhYayQmuaLvifkbjMB9X7U2ihQ1KIcic0P6EOCVTIKiEn0lG00OqMEJorS"
);
const { v4: uuidv4 } = require("uuid");


router.post("/market", async (req, res) => {
  

  try {
    const { pincode, maxunit, Price, users, userid } = req.body;

    const order = await new Order({
      pincode: pincode,
      maxunit: maxunit,
      price: Price,
      user: users.trim(),
      userid: userid,
    });

    const User = await order.save();

    res.status(201).json({ message: "order is placed" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/marketord", async (req, res) => {
  try {
    const allOrders = await Order.find();

    if (allOrders.length === 0) {
      return res.status(404).json({ message: "no order placed" });
    }

    return res.status(201).json(allOrders);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/userOrder/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const allorder = await Order.find({ userid: id });

    if (allorder) {
      res.status(200).json(allorder);
    } else {
      res.status(400).json({ message: "No order found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/userbuyOrder/:user", async (req, res) => {
  const username = req.params.user;
 

  try {
    const allorder = await stripeTra.find({
      buyerName: username.trim(),
    });

   

    if (allorder) {
      res.status(200).json(allorder);
    } else {
      res.status(400).json({ message: "No order found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//  market transactions
router.post("/marktra", async (req, res) => {
  try {
    const { buyerWallet, sellerWallet, price, pincode } = req.body;

    const Tra = await new MarketTra({
      buyerWallet: buyerWallet,
      sellerWallet: sellerWallet, // Corrected the case here
      price: price,
      pincode: pincode,
    });

    const done = await Tra.save();

    if (done) {
      res.status(201).json({ message: "transaction  saved" });
    }
  } catch (error) {
    res.status(404).json({ message: "transaction not saved" });
  }
});

router.get("/stripeTra", async (req, res) => {
  try {
    const allTransactions = await stripeTra.find();

    if (allTransactions.length === 0) {
      return res.status(404).json({ message: "no transactions found" });
    }

    return res.status(200).json(allTransactions);
  } catch (error) {
    res.status(500).json(error);
  }
});

///status code

router.put("/status/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    order.status = "SOLD";

    const update = await order.save();

    return res.status(200).json(update);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete item

router.delete("/delete/:id", async (req, res) => {
  

  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json("Post has been deleted!");
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/upd/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const update = await Order.findByIdAndUpdate(id, req.body, { new: true });

    if (!update) {
      
      return res.status(404).json({ message: "not found" });
    }

   
    return res.status(200).json({ message: "successfully updated" });
  } catch (error) {
    
    return res.status(500).json({ message: "server error" });
  }
});



router.post("/stripe/pay", async (req, res) => {
  try {
    const { products, buyername, address } = req.body;
    

    const usser = encodeURIComponent(products[0].user);

    const encodedBuyerName = encodeURIComponent(buyername);

    let amount = Math.floor((products[0].price * products[0].maxunit)/80) ;

    const item = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product._id,
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: item,
      mode: "payment",
      success_url: `http://localhost:3000/successs/${products[0]._id}/${amount}/${usser}/${encodedBuyerName}/${products[0].pincode}`,
      cancel_url: `http://localhost:3000/cancel/${products[0]._id}/${amount}/${usser}`,
    });

   

    const datas = {
      buyerName: buyername,
      sellerName: products[0].user,
      price: amount,
      pincode: products[0].pincode,
      productid: products[0]._id,
      paymentid: session.id,
    };



    res.json({ id: session.id, datas });
  } catch (error) {
    console.error("Error during payment process:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/stripe/Tra", async (req, res) => {
  

  try {
    const transaction = await new stripeTra({
      buyerName: req.body.buyername,
      sellerName: req.body.seller,
      price: req.body.amount,
      pincode: req.body.pincode,
      productid: req.body.id
    });

    await transaction.save();

    return res.status(200).json("transaction saved");
  } catch (error) {
    return res.status(500).json("transaction saved failed");
  }
});

module.exports = router;
