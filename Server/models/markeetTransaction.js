const mongoose = require("mongoose");
const MarketTransaction = new mongoose.Schema(


  {
    buyerName: {
      type: String,
      required: true,
    },
    sellerName: {  // Change the property name to "sellerWallet"
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
     productid: {
      type: String,
      unique: true,
      required: true,
    },
    },
    { timestamps: true }

    
  );
  

  module.exports = mongoose.model("MarketTransaction", MarketTransaction);