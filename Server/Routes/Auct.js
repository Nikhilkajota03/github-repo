
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require("../models/registration");
const jwt = require('jsonwebtoken');
const Order = require("../models/order");
const MarketTra = require("../models/marketTra")
const cors = require("cors");
const AuctionTran = require("../models/auctionTra") ;
const Auction = require("../models/auction");
const Bid = require("../models/bids");
const stripeTra = require("../models/auctionTra");
const stripe = require("stripe")(
  "sk_test_51ORdAfSHVF5wmC65bjGgIAaJ79E6707dJ10Fkx4kjhYayQmuaLvifkbjMB9X7U2ihQ1KIcic0P6EOCVTIKiEn0lG00OqMEJorS"
);
const { v4: uuidv4 } = require("uuid");



router.post("/auctionord", async (req, res) => {

  

  try {
    const { pincode , minPrice , maxunit , users , userid } = req.body;

    const trimmedOwner = users.trim();

    // Create a new Auction document
    const auctionOrder = await new Auction({
      owner: trimmedOwner,
      ownerid: userid ,
      pincode: pincode,
      maxunit: maxunit,
      minprice: minPrice 
    });

    // Save the created auction order
    await auctionOrder.save();

    res.status(201).json({ message: "Auction order is placed", auctionOrder });
  } catch (error) {
    console.error("Error creating auction order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/userOrder/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const allorder = await Auction.find({ ownerid
      : id });

    if (allorder) {
      res.status(200).json(allorder);
    } else {
      res.status(400).json({ message: "No order found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/userbids/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const allorder = await Bid.find({ bidderid
      : id });

    if (allorder) {
      res.status(200).json(allorder);
    } else {
      res.status(400).json({ message: "No Bid found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//accept bid
 
 router.put("/bidAcc/:id", async(req,res)=>{

 
    
     const bidid = req.params.id;

     console.log(bidid , "hit")
    

     try {
      
       const getbid = await Bid.findById(bidid);

       if(getbid){
           getbid.status = "ACCEPTED"
           await getbid.save();
           return res.status(200).json({message: "bid status has been changed"})
       }

           return res.status(404).json({message: "bid not found"})

     } catch (error) {
      return res.status(500).json({message: "server error"})
     }
 })
  

//post the bid

router.post('/bid', async (req, res) => {
  try {
    const { bidAmount, orderId, biddername, ownername , ownerid , userid , maxunit } = req.body;

    // Validate if the auction exists
    const auction = await Auction.findById(orderId);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Validate if the bidder exists
    const bidder = await User.findById(userid);
    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }

    // Create a new Bid document
    const bid = new Bid({
      auctionid : orderId ,
      auctionowner : ownername ,
      ownerid : ownerid ,
      bidderid: userid ,
      biddername : biddername,
      bidAmount : bidAmount ,
      maxunit: maxunit
    });

    // Save the created bid
    await bid.save();

    res.status(201).json({ message: 'Bid created successfully', bid });
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//fetch the order
router.get("/auction", async (req, res) => {
  try {
    const allOrders = await Auction.find();

    if (allOrders.length === 0) {
      return res.status(404).json({ message: "no order placed" });
    }

    return res.status(201).json(allOrders);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/auctionOrd/:id", async(req,res)=>{
    
   const id = req.params.id;

   try {
    
     const auction = await Auction.findById(id)

     if(auction){
      return res.status(200).json(auction)
     }

     return res.status(404).json({message:"not found"})

   } catch (error) {

    return res.status(500).json({message:"server error"})
    
   }
}
)


//auction transaction

router.post("/auctra",async(req,res)=>{
     
  try {

   const {  buyerWallet, sellerWallet, price , pincode } = req.body;

     const Tra = await new AuctionTran({
       buyerWallet: buyerWallet,
       sellerWallet: sellerWallet, // Corrected the case here
       price: price,
       pincode:pincode
     });

     const done  = await Tra.save();

     if(done){
        res.status(201).json({message:"transaction  saved"})
     }
   
  } catch (error) {
   res.status(404).json({message:"transaction not saved"})
  }
})


//get all  the market transaction
router.get("/aucttra", async (req, res) => {
 try {
    const allTransactions = await AuctionTran.find();

    if (allTransactions.length === 0) {
      return res.status(404).json({ message: "no transactions found" });
    }

    return res.status(201).json(allTransactions);
 } catch (error) {
    res.status(404).json(error);
 }
});


//fetch the particular order

router.get("/bids/:id",async(req,res)=>{

   try {
 
    const bid = await Bid.find({auctionid: req.params.id});

     if (!bid) {
      return res.status(404).json({ error: "Order not found" });
    }

    

     return res.status(200).json(bid)
          
    
   } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
   }
})




router.put("/status/:id",async(req,res)=>{

  try {
 
   const order = await  Auction.findById(req.params.id)

   if (!order) {
     return res.status(404).json({ message: "order not found" });
 }

 order.status = "CLOSED"

 const update = await order.save();

 return res.status(200).json(update);
    
   
  } catch (error) {
     res.status(500).json(error);
  }
})

//delete item 

router.delete("/delete/:id",async(req,res)=>{
 
  
       
 try {

   await  Auction.findByIdAndDelete(req.params.id)
  
   res.status(200).json("Post has been deleted!")

   
   
 } catch (error) {

   return res.status(500).json({message: "something went wrong"})
   
 }

})


router.put("/upd/:id",async(req,res)=>{

  

  const id = req.params.id;
 
  
 try {

    const update = await Auction.findByIdAndUpdate(id, req.body , {new:true} )

     if(!update){
     return res.status(404).json({message:"not found"})
     }

    
     return res.status(200).json({ message: "successfully updated" });
     
 } catch (error) {
  return res.status(500).json({message:"server error"})
 }
})




router.put("/updbid/:id",async(req,res)=>{

  const Bidid = req.params.id;
  const {bidAmount} = req.body;
 
  
 
 try {

      const Bids = await  Bid.findById(Bidid)

    
      
      if(!Bids){
      return   res.status(404).json({message:"Bid mot found"})
      }
 
      Bids.bidAmount = bidAmount;

      await Bids.save();

      return res.status(200).json({message:"Updated"})

     
 } catch (error) {
  return res.status(500).json({message:"server error"})
 }
})



router.delete("/bidDel/:id",async(req,res)=>{
    
  
  const id = req.params.id;   //bid id

  

   try {

    const bid = await Bid.findByIdAndDelete(id);
    
    if(!bid){
      return res.status(404).json({message: "No Record Found!"});
    }

    return res.status(200).json({message: "bid deleted"});
    
    

     
 } catch (error) {
  return res.status(500).json({message:"server error"})
 }


})




router.post("/stripe/pay", async (req, res) => {

 //auction   owner  , maxunit , productid , pincode 

//

  try {
    const { products , buyername , buyerid ,  auctionID ,  price , bidId  } = req.body;

    console.log(products, buyername , buyerid ,  auctionID ,  price , bidId )

   
    const productss = [products]
   

 
 

    const usser = encodeURIComponent(productss[0].owner);

    let amount = Math.floor((price *  productss[0].maxunit) / 80) ;



   

    

    const encodedBuyerName = encodeURIComponent(buyername);


    const item = productss.map((product) => ({
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

      success_url: `http://localhost:3000/UserAuctSuccess/${productss[0]._id}/${amount}/${usser}/${encodedBuyerName}/${productss[0].pincode}/${bidId}/${buyerid}`,

      cancel_url: `http://localhost:3000/UserAuctFail/${productss[0]._id}/${amount}/${usser}`,

    });


    res.json({ id: session.id });


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


router.put("/status",async(req,res)=>{


       

  try {


   

    const updateauct = await Auction.findById(req.body.id)
    
    if(!updateauct){
      return res.status(404).json("Auction not found");
    }

   

    updateauct.auctionWinner=req.body.buyername;
    updateauct.winnerid=req.body.buyerid;
    updateauct.status="CLOSED";

    updateauct.save();

    const getbid = await Bid.findById(req.body.bidId);

      if(getbid){
          getbid.status = "PAID"
          await getbid.save();  
      }else{
        return res.status(404).json("bid not found");
      }

    return res.status(200).json("status saved");
  } catch (error) {
    return res.status(500).json("status saving failed");
  }
})







module.exports = router