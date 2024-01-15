// Modify the success URL route to include the necessary information
router.post('/stripe/pay', async (req, res) => {
    try {
      const { products, buyername, buyerid, auctionID, price, bidId } = req.body;
  
      const productss = [products];
      const usser = encodeURIComponent(productss[0].owner);
      let amount = Math.floor((price * productss[0].maxunit) / 80);
  
      const item = productss.map((product) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product._id,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: item,
        mode: 'payment',
        success_url: `http://localhost:3000/UserAuctSuccess/${productss[0]._id}/${amount}/${productss[0].owner}`,
        cancel_url: `http://localhost:3000/UserAuctFail/${productss[0]._id}/${amount}/${usser}`,
      });
  
      // Pass the necessary information to the /save-transaction route
      const saveTransactionInfo = {
        buyername,
        sellerName: productss[0].owner,
        amount,
        auctionID,
        paymentID: session.id,
        bidId,
      };
  
      // Return the session ID and saveTransactionInfo to the client
      res.json({ id: session.id, saveTransactionInfo });
    } catch (error) {
      console.error('Error during payment process:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Add a new route to handle saving the transaction details
  router.post('/save-transaction', async (req, res) => {
    try {
      const { buyername, sellerName, amount, auctionID, paymentID, bidId } = req.body;
  
      // Save transaction details to your database
      const transaction = await new stripeTra({
        buyerName: buyername,
        sellerName: sellerName,
        price: amount,
        pincode: '', // Add the necessary pincode information
        productid: auctionID,
        paymentid: paymentID,
      });
  
      await transaction.save();
  
      // Update auction details
      const updateauct = await Auction.findById(auctionID);
      if (updateauct) {
        updateauct.auctionWinner = buyername;
        updateauct.winnerid = buyerid;
        updateauct.status = 'CLOSED';
  
        await updateauct.save();
      }
  
      // Update bid status to "PAID"
      const getbid = await Bid.findById(bidId);
      if (getbid) {
        getbid.status = 'PAID';
        await getbid.save();
      }
  
      res.json({ message: 'Transaction details saved successfully' });
    } catch (error) {
      console.error('Error saving transaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  