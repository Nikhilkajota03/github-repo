import Logout from "../Logout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Bidupdateform from "../components/Bidupdateform";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const Auctbids = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updlist, setUpdateList] = useState(false);

  var productid = useParams().id;
  const receiverwallet = useParams().walletAddress;
  const biditem = useParams().index;
  const bidowner = useParams().owner;
  const maxunit = useParams().maxunit;

  const { userid } = useSelector((state) => state.userId);

  const pincode = useParams().pincode;

  const [Auctid, setAuctid] = useState(productid);
  // console.log(Auctid)///

  const navigate = useNavigate();

  // const [completedTransactions, setCompletedTransactions] = useState(() => {
  //   // Initialize from localStorage on component mount
  //   const storedData = localStorage.getItem("completedAucBid");
  //   return storedData ? JSON.parse(storedData) : [];
  // });

  const [status, setStatus] = useState(false);
  const [bids, setBids] = useState([]);
  console.log(bids);

  const { user } = useSelector((state) => state.users); // Extracting user from the Redux state
  const { walletAdd } = useSelector((state) => state.wallet); // Extracting wallet address

  const getbids = async () => {
    try {
      const res = await axios.get(
        "https://3.6.225.138/api/auct/bids/" + productid
      );

      console.log(res.data);

      setBids(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //   const getAuction = async (id)=>{

  //     try {

  //      const auction = await axios.get(`https://3.6.225.138/api/auct/auctionOrd/${id}`)

  //      setAuction([])
  //      setAuction(auction.data)
  //      console.log(auction.data)

  //     } catch (error) {
  //         console.log(error)
  //     }

  // }

  

  const makePayment = async (Amount, bidID) => {
    // await  getAuction(auctionid);

    const auction = {
      owner: bidowner,
      maxunit: maxunit,
      _id: productid,
      pincode: pincode,
    };

    console.log(auction);

    try {
      const stripe = await loadStripe(
        "pk_test_51ORdAfSHVF5wmC656NN6R5R00V1Fxs4lmtw3DFDWUxwi0AJy3b5FVXzmJdhwO6U0Up9zSowWN2BwNWGVCPBL6ylR004Zciutlo"
      );

      const body = {
        products: auction,
        buyername: user,
        buyerid: userid,
        price: Amount,
        bidId: bidID,
      };

      const headers = {
        "Content-type": "application/json",
      };

      const response = await fetch(
        "https://3.6.225.138/api/auct/stripe/pay",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );

      const session = await response.json();

      const result = stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  const Acceptbid = async (id) => {

    console.log( id , "acceptbid")
    console.log("accept bid");

    try {
      const accept = await axios.put(
        `https://3.6.225.138/api/auct/bidAcc/${id}`
      );

      console.log(accept);

      message.success("bid accepted");

      getbids();

      return "accepted";
    } catch (error) {
      console.log(error);
    }
  };






  const deleteitem = async (id) => {
    try {
      const deleteitem = await axios.delete(
        `https://3.6.225.138/api/auct/bidDel/${id}`
      );

      if (deleteitem) {
        message.success("bid deleted");
        getbids();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getbids()
  }, [updlist]);

  return (
    <div className="bg-purple-900 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 flex flex-col gap-10 items-center bottom-0 leading-5 h-[100vh] w-full overflow-hidden">
      <div className="p-4  right-0 mt-[4rem]  rounded-lg shadow-md h-18px">
        {/* <p>User : {user ? user : "Please log in first"}</p>
          <p>Wallet: {walletAdd ? walletAdd : "Please log in first"}</p> */}
      </div>

      <div className="text-yellow-400 text-5xl  font-bold">BIDS</div>

      <div className="bg-gray-200 p-4 text-xl font-semibold  right-0  rounded-lg shadow-md h-18px">
        <p>Owner Name : {bidowner}</p>
        <p>Auction No : {productid}</p>
      </div>

      {updlist ? (
        <Bidupdateform
          data={selectedOrder}
          Auctionid={Auctid}
          setUpdateList={setUpdateList}
        />
      ) : null}

      <div className="md:px-32 py-7 w-full">
        <div className="shadow overflow-hidden rounded-2xl border-b border-gray-200 max-h-[45vh] overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white ">
              <tr>
                <th className="w-1/5 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Bidder name
                </th>
                <th className=" w-1/5 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Offer Price
                </th>
                <th className="w-1/5 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Bid status
                </th>
                <th className="w-1/8 sm:w-1/12 text-center py-3 px-4 uppercase font-semibold text-sm">
                  update
                </th>
                <th className="w-1/8 sm:w-1/12 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Delete
                </th>
                <th className="w-1/8 sm:w-1/12 text-center py-3 px-4 uppercase font-semibold text-sm">
                  PAY
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {bids.length === 0 ? (
                <div className="p-5 text-red">No Bid placed Till Now</div>
              ) : (
                bids.map((value, index) => (
                  <tr key={index}>
                    <td className="w-1/9 text-xl font-semibold text-center py-3 px-4">
                      {value.biddername}
                    </td>
                    <td className="w-1/9  text-xl font-semibold text-center py-3 px-4">
                      <a className="hover:text-blue-500" href="tel:622322662">
                        {value.bidAmount}
                      </a>
                    </td>





                
                    <td className="w-1/9 text-center">
                      <button

                       onClick={()=>  {

                    if(user === value.owner){
                     
                        const res =  Acceptbid(value._id)  
                        console.log(res)
                    }else{
                      message.error("you are not the owner")
                    }

                       }  }

                        type="button"
                        class={`${
                          value.status === "OPEN"
                            ? "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 "
                            : "focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 me-2  mt-1 dark:bg-green-600 dark:hover:bg-green-600 dark:focus:ring-green-900"
                        } `}
                        disabled={bidowner !== user}
                      >
                        {value.status}
                      </button>
                    </td>




                    <td className="w-1/6 py-3 px-8 text-center">
                      <a
                        onClick={() => {
                          if (user === value.biddername) {
                            setSelectedOrder(value);
                            setAuctid(productid);
                            setUpdateList(true);
                          } else {
                            message.error("you are not the bidder");
                          }
                        }}
                        className="flex items-center justify-center group relative inline-flex overflow-hidden rounded bg-green-700 px-4 py-2 text-white focus:outline-none focus:ring active:bg-indigo-500"
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                          />
                        </svg>
                      </a>
                    </td>

                    <td
                      className="w-1/6  text-center"
                      onClick={() => {
                        if (user === value.biddername) {
                          deleteitem(value._id);
                        } else {
                          message.error("you are not the bidder");
                        }
                      }}
                    >
                      <DeleteOutlined />
                    </td>

                    <td
                      onClick={() => {


                        if(user == value.biddername && value.status == "ACCEPTED"  )

                        makePayment(value.bidAmount, value._id);


                      }}
                    >
                      <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"  disabled={value.biddernamer !== user && value.status == "PAID"}  >
                        {" "}
                        Pay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Auctbids;
