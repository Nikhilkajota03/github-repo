import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function UserMak() {
  const { userid } = useSelector((state) => state.userId);
  const { user } = useSelector((state) => state.users);
  console.log(user);

  const [orderdata, setOrderdata] = useState([]);
  const [transaction, setTransaction] = useState([]);



  

  

  const getorders = async () => {
    try {
      const userOrder = await axios.get(
        `https://3.6.225.138/api/mak/userOrder/${userid}`
      );

      setOrderdata(userOrder.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getbuyorders = async () => {
    try {
      const userbuyOrder = await axios.get(
        `https://3.6.225.138/api/mak/userbuyOrder/${user}`
      );

      setTransaction(userbuyOrder.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getorders();
    getbuyorders();
  });

  return (
    <div className="bg-purple-900 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 flex flex-col gap-10 items-center bottom-0 leading-5 h-[100vh] w-full overflow-hidden">
      <div className="text-white text-4xl mt-[5rem] font-bold text-red-500 ">
        Market History
      </div>

      <div className="text-white text-2xl  font-bold text-red-500">
        Market Order
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
                  Status
                </th>
              </tr>
            </thead>


            {  orderdata.length===0 ? <div className="p-5 text-red">No item Posted</div> : orderdata.map((item, index) => (
              <tbody className="text-gray-700">
                <tr>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item._id}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.price * item.maxunit}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {item.status}
                  </td>
                </tr>
              </tbody>
            ))}




          </table>
        </div>
      </div>

      <div className="text-white text-2xl  font-bold text-red-500">
        Market Order Buyed
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
                  Seller Name
                </th>
                <th className="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">
                  Amount
                </th>
              </tr>
            </thead>

          {  transaction.length ===0 ? <div className="p-5 text-red">No item buyed</div>  :     transaction.map((product, index) => (
              <tbody className="text-gray-700">
                <tr>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {product._id}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {product.sellerName}
                  </td>
                  <td className="w-1/6  py-3 px-4 text-center bg-green font-bold text-red-500">
                    {product.price}
                  </td>
                </tr>
              </tbody>
            ))}




          </table>
        </div>
      </div>
    </div>
  );
}

export default UserMak;
