const mongoose = require("mongoose");
const AuctTra = new mongoose.Schema(

  {
    buyerName: {
      type: String,
      required: true,
    },
    sellerName: {  
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
      unique:true,
      required: true,
    },
    },
    { timestamps: true }


  );
  

  module.exports = mongoose.model("AuctTra", AuctTra);