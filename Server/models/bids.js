const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    auctionid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    auctionowner: {
        type: String,
        required: true,
      },
      ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "registration",
      },
    bidderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registration",
    },
    biddername: {
      type: String,
      required: true,
    },
    bidAmount: {
      type: String,
      required: true,
    },
    maxunit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "PENDING",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bids", BidSchema);
