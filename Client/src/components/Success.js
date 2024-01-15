import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { IoCheckmarkDone } from "react-icons/io5";
import { useSelector } from "react-redux";

function Success() {

    const { user } = useSelector((state) => state.users);

    console.log(user)


  // const id = useParams().id

  const id = useParams().id
  const seller = useParams().seller
  const amount =  useParams().amount
  const buyername = useParams().buyername
  const pincode=  useParams().pincode
  const paymentid =  useParams().paymentid

  let data=  {seller , amount , buyername , pincode , id}

  const [flag , setflag] = useState(true)

  // let flag = true;


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Update status using a PUT request
        const statusResponse = await axios.put(`https://3.6.225.138/api/mak/status/${id}`);
  
        // Create a transaction using a POST request

        if(flag){
        const traResponse = await axios.post("https://3.6.225.138/api/mak/stripe/Tra", data);
           setflag(false);
      }
  
        // Handle the responses or do any other necessary logic
        
      } catch (error) {
        console.error('Error during data fetching:', error);
      }
    };
  
    // Call the fetchData function
    fetchData();
  }, [flag]); // Empty dependency array means this effect runs once after the initial render


  

  return (
    <>
      <div className="bg-purple-900 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 flex flex-col gap-10 items-center bottom-0 leading-5 h-[100vh] w-full overflow-hidden">
        <div className="text-white text-4xl mt-[15rem] font-bold text-green-500 ">
          PAYMENT SUCCESS
        </div>


<div className="md:px-32 py-7 w-full">
          <div className="shadow overflow-hidden rounded-2xl border-b border-gray-200 max-h-[45vh] overflow-y-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white" >
            <tr>
              <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm" >Product ID</th>
              <th  className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm" >Buyer</th>
              <th  className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm" >Seller</th>
              <th  className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm" >Amount</th>
              <th  className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm" >Status</th>
            </tr>
          </thead>
          <tbody  className="text-gray-700">
            <tr>
              <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-green-500">{id}</td>
              <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-green-500" >{user}</td>
              <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-green-500" >{seller}</td>
              <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-green-500" >{amount}</td>
              <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-green-500">SUCCESS</td>
            </tr>
          </tbody>
        </table>

       </div>
       </div>

      </div>
    </>
  );

}

export default Success;
