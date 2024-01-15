const mongoose = require("mongoose");

// Schema 2: Auction Schema
const AuctionSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    ownerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registration"
    },
    auctionWinner: {
      type: String,
      default: "No",
      required: true,
    },
    winnerid: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Auction"
    },
    pincode: {
      type: String,
      required: true,
    },
    maxunit: {
      type: String,
      required: true,
    },
    minprice: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "OPEN",
      required: true,
    },
  },
  { timestamps: true }
);


module.exports =   mongoose.model("Auction", AuctionSchema);
