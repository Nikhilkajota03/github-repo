import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { message } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

function UserAuct() {
  const { user } = useSelector((state) => state.users);
  const { userid } = useSelector((state) => state.userId);

  const [orderdata, setOrderdata] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [bids, setbids] = useState([]);
  const[auction , setAuction] = useState([])
  console.log(auction)

  const getorders = async () => {
    try {
      const userOrder = await axios.get(
        `https://3.6.225.138/api/auct/userOrder/${userid}`
      );

      console.log(userOrder.data);
      setOrderdata(userOrder.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getbids = async () => {
    try {
      const userOrder = await axios.get(
        `https://3.6.225.138/api/auct/userbids/${userid}`
      );

      console.log(userOrder.data);
      setbids(userOrder.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const getAuction = async (id)=>{
      
  //      try {

  //       const auction = await axios.get(`https://3.6.225.138/api/auct/auctionOrd/${id}`)

  //       setAuction([])
  //       setAuction(auction.data)
  //       console.log(auction.data)

  //      } catch (error) {
  //          console.log(error)
  //      }

  // }





  // const makePayment = async (auctionid, Amount,bidID) => {

  //  await  getAuction(auctionid);
   

  //   try {
  //     const stripe = await loadStripe(
  //       "pk_test_51ORdAfSHVF5wmC656NN6R5R00V1Fxs4lmtw3DFDWUxwi0AJy3b5FVXzmJdhwO6U0Up9zSowWN2BwNWGVCPBL6ylR004Zciutlo"
  //     );

  //     const body = {
  //       products: auction,
  //       buyername: user,
  //       buyerid: userid,
  //       auctionID : auctionid,
  //       price : Amount,
  //       bidId:bidID
  //     };

  //     const headers = {
  //       "Content-type": "application/json",
  //     };

  //     const response = await fetch("https://3.6.225.138/api/auct/stripe/pay", {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify(body),
  //     });

  //     const session = await response.json();

  //     const result = stripe.redirectToCheckout({
  //       sessionId: session.id,
  //     });

  //     if (result.error) {
  //       console.log(result.error);
  //     }
  //   } catch (error) {
  //     console.error("Error during payment process:", error);
  //   }
  // };







  useEffect(() => {
    getorders();
    getbids();
  });

  return (
    <div className="bg-purple-900 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 flex flex-col gap-10 items-center bottom-0 leading-5 h-[100vh] w-full overflow-hidden">
      <div className="text-white text-4xl mt-[5rem] font-bold text-red-500 ">
        Auction History
      </div>

      <div className="text-white text-2xl  font-bold text-red-500">
        Auctions
      </div>

      <div className="md:px-32 py-7 w-full">
        <div className="shadow overflow-hidden rounded-2xl border-b border-gray-200 max-h-[45vh] overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Product ID
                </th>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Amount
                </th>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Winner
                </th>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">



              {   orderdata.length===0 ? <div className="p-5 text-red">No item Posted</div> :    orderdata.map((item, index) => (
                <tr key={index}>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item._id}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.minprice * item.maxunit}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.auctionWinner}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-white text-2xl  font-bold text-red-500">Bids</div>

      <div className="md:px-32 py-7 w-full">
        <div className="shadow overflow-hidden rounded-2xl border-b border-gray-200 max-h-[45vh] overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Product ID
                </th>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Bid price
                </th>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  max unit
                </th>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                 Total Amount
                </th>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Status
                </th>
              </tr>
            </thead>



            <tbody className="text-gray-700">


              {  bids.length===0 ? <div className="p-5 text-red">No bid placed</div> :    bids.map((item, index) => (
                <tr key={index}>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.auctionid}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.bidAmount}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.maxunit}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.bidAmount * item.maxunit}
                  </td>



                  <td className="w-1/9 text-center">
                    <button


                      // onClick={() => {


                      //   if (item.status === "ACCEPTED") {
                             
                      //     // getAuction(item.auctionid)

                      //     makePayment(item.auctionid, item.bidAmount ,item._id)


                      //   } else {
                      //     message.error("bid not accepted");
                      //   }

                        
                      // }}



                      type="button"
                      class={`${
                        item.status === "PENDING"
                          ? "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 "
                          : "focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 me-2  mt-1 dark:bg-green-600 dark:hover:bg-green-600 dark:focus:ring-green-900"
                      } `}
                      disabled={item.status === "PENDING"}
                    >
                      {item.status}
                    </button>
                  </td>





                </tr>
              ))}



            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserAuct;
