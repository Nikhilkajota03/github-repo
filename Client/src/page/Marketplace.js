import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { parseUnits } from "ethers";
import { message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import Navbar from "../components/Navbar";
import Form from "../components/Form";
import "../index.css";
import Logout from "../Logout";
import ReduxUser from "../redux/reduxUser";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UpdateForm from "../components/UpdateForm";
import { Navigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const Marketplace = () => {
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState(false);
  const [updlist, setUpdateList] = useState(false);
  const [order, setOrder] = useState([]);

 

  const [data, setData] = useState();

  // console.log(updlist)

  const [transactionStatus, setTransactionStatus] = useState(null);

  const { user } = useSelector((state) => state.users);
  const { walletAdd } = useSelector((state) => state.wallet);
  const { userid } = useSelector((state) => state.userId);

  const orders = async () => {
    try {
      const allorders = await axios.get(
        "https://3.6.225.138/api/mak/marketord"
      );

      setOrder(allorders.data);
      //  console.log(allorders.data)
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyClick = async (data, amount, index, pincode, id) => {
    if (data === walletAdd) {
      message.error("You are the owner");
    } else {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          console.log("MetaMask is installed");

          // Request access to the user's Ethereum accounts

          const accounts = await window.ethereum
            .request({ method: "eth_requestAccounts" })
            .catch((err) => {
              if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                console.log("Please connect to MetaMask.");
              } else {
                console.error(err);
              }
            });

          if (accounts.length === 0) {
            console.error("User denied permission to access Ethereum accounts");
            message.error("Transaction canceled: User denied account access.");
            return;
          }

          // Set sender and receiver addresses
          const senderAddress = walletAdd;
          const receiverAddress = data;

          const transactionHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [
              {
                from: senderAddress,
                to: receiverAddress,
                value: amount.toString(), // Use the string representation
              },
            ],
          });

          setTimeout(() => {
            const messa = Tranaction(
              walletAdd,
              data,
              amount / 10000000000000,
              pincode
            );

            // message.success("Transaction successful!");
          }, 1000);

          setTimeout(() => {
            message.success("Transaction successful!");
          }, 8000);

          setTimeout(() => {
            message.success("Order buyed");
            axios.put(`https://3.6.225.138/api/mak/status/${id}`);
          }, 5000);

          // transaction save
        } else {
          console.error("MetaMask is not installed");
        }
      } catch (error) {
        console.error('Error handling "Buy" click:', error);
        setTransactionStatus("failure");
        message.error("please check if your account is connected to site");
      }
    }
  };

  const Tranaction = async (buyerWallet, sellerWallet, price, pincode) => {
    try {
      const res = axios.post("https://3.6.225.138/api/mak/marktra", {
        buyerWallet,
        sellerWallet,
        price,
        pincode,
      });

      if (res) {
        setTimeout(() => {
          message.success("Transaction saved");
        }, 5000);
      }

      console.log("Transaction saved");

      return "transaction saved";
    } catch (error) {
      console.log("Trsansaction not saved");
    }
  };

  const deleteitem = async (id) => {
    try {
      const dlt = await axios.delete(
        `https://3.6.225.138/api/mak/delete/${id}`,
        { withCredentials: true }
      );

      message.success("deleted successfully");
    } catch (error) {
      message.error("something went wrong");
    }
  };

  useEffect(() => {
    orders()
  }, [orders])




  const makePayment = async (data) => {
    console.log(data);
    console.log(typeof data);

    try {
      const stripe = await loadStripe(
        "pk_test_51ORdAfSHVF5wmC656NN6R5R00V1Fxs4lmtw3DFDWUxwi0AJy3b5FVXzmJdhwO6U0Up9zSowWN2BwNWGVCPBL6ylR004Zciutlo"
      );

      const body = {
        products: data,
        buyername: user,
      };

      const headers = {
        "Content-type": "application/json",
      };

      const response = await fetch("https://3.6.225.138/api/mak/stripe/pay", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const {id,datas} = await response.json();

      

      const result = stripe.redirectToCheckout({
        sessionId: id,
      });


      if (result.error) {
        console.log(result.error);
      }else{

        //  try {

        //   const transactiondata = await axios.post("https://3.6.225.138/api/mak/stripe/Tra", datas)

        //   console.log(transactiondata)
          
        //  } catch (error) {
          
        //      console.log(error)

        //  }



      }



    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };





  // console.log(data);

  return (
    <>
      <div className="bg-green-900 bg-gradient-to-b from-gray-900 via-gray-900 to-green-800 flex flex-col gap-10 items-center bottom-0 leading-5 h-[100vh] w-full overflow-hidden">
        <div className=" p-4 mt-[4rem] right-0  rounded-lg shadow-md h-18px">


          {/* <p>User : {user ? user : "Please log in first"}</p>
          <p>Wallet: {walletAdd ? walletAdd : "Please log in first"}</p> */}
        </div>

        <div className="text-yellow-300 text-6xl mt-[5px] font-bold">
          Market Place
        </div>

        <div className="flex gap-5">
          <a
            class="group relative inline-flex items-center overflow-hidden rounded bg-green-700 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
            onClick={() => {
              if (user) {
                setStatus(true);
              } else {
                message.error("log in first");
                //  navigate("/login")
              }
            }}
          >
            Add Orders
          </a>

          <a class="group relative inline-flex items-center overflow-hidden rounded bg-green-700 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500">
            <Link to={"/markTra"}>Sold History</Link>
          </a>
        </div>

        {status ? <Form setStatus={setStatus} /> : null}
        {updlist ? (
          <UpdateForm data={selectedOrder} setUpdateList={setUpdateList} />
        ) : null}

        <div className="md:px-32 py-7 w-full">
          <div className="shadow overflow-hidden rounded-2xl border-b border-gray-200 max-h-[45vh] overflow-y-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                    Name
                  </th>
                  <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                    Item id
                  </th>
                  <th className="w-1/6 text-center py-3 px-8 uppercase font-semibold text-sm">
                    Pincode
                  </th>
                  <th className="w-1/6 text-center py-3 px-8 uppercase font-semibold text-sm">
                    Max Unit (kwh){" "}
                  </th>
                  <th className="w-1/6 text-center py-3 px-8 uppercase font-semibold text-sm">
                    Price(₹)
                  </th>
                  <th className="w-1/6 text-center py-3 px-8 uppercase font-semibold text-sm">
                    Buy
                  </th>
                  <th className="w-1/6 text-center py-3 px-8 uppercase font-semibold text-sm">
                    update
                  </th>
                  <th className="w-1/6 text-center py-3 px-8 uppercase font-semibold text-sm">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">


              { Array.isArray(order) && order.map((data, index) => (
                  <tr key={index}>
                    <td className="w-1/6 text-xl font-semibold  py-3 px-4 text-center">
                      {data.user}
                    </td>
                    <td className="w-1/6 text-xl font-semibold  py-3 px-4 text-center">
                      {data._id}
                    </td>
                    <td className="w-1/6 text-xl font-semibold  py-3 px-4 text-center">
                      {data.pincode}
                    </td>
                    <td className="w-1/6 text-xl font-semibold  py-3 px-4 text-center">
                      {data.maxunit}
                    </td>
                    <td className="w-1/6 text-xl font-semibold  py-3 px-4 text-center">
                      <a className="hover:text-blue-500" href="tel:622322662">
                        {data.price}
                      </a>
                    </td>





                    
                    <td className="w-1/6 text-center">
                      <a
                        onClick={() => {

                          if(data.user !=user){
                        
                          if(data.status==="BUY" && data.user != user ){
                            makePayment([data])
                          }else{
                            message.error("already sold")
                          }

                        }else{
                          message.error("owner can not buy")
                        }
                          
                        }
                         
                        }
                        className={
                            data.status === "BUY"
                            ? "bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
                            : "bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
                        }
                      >
                        {data.status}
                      </a>
                    </td>






                    <td className="w-1/6  py-3 px-4 text-center">
                      <a
                        class="group relative inline-flex items-center overflow-hidden rounded bg-green-700 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                        onClick={() => {
                          if (data.status === "SOLD") {
                            message.error("Already sold");
                            return;
                          }

                          if (data.user === user) {
                            setSelectedOrder(data);
                            setUpdateList(true);
                          } else {
                            message.error("you are not the owner");
                          }
                        }}
                      >
                        <svg
                          class="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                          />
                        </svg>
                      </a>
                    </td>


                    

                    <td
                      className="w-1/6  text-center"
                      onClick={() => {
                        if (data.user === user) {
                          deleteitem(data._id);
                        } else {
                          message.error("you are not the owner");
                        }
                      }}
                    >
                      <DeleteOutlined />
                    </td>
                  </tr>
                ))}





              </tbody>
            </table>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default Marketplace;
