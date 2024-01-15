import { useEffect, useState } from "react";
import "../index.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";

const Signin = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const { userid } = useSelector((state) => state.userId);

  console.log(userid);

  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [Aadhar, setaadhar] = useState();
  const [phone, setphone] = useState();
  const [maxquantity, setquantity] = useState();
  const [pincode, setpincode] = useState();
  const [password, setpassword] = useState();
  const [users, setusers] = useState([]);
  const [id, setid] = useState();
  const [data, setdata] = useState();

  // console.log(id);

  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  const deleteProfile = async (e) => {
    e.preventDefault();

    try {
      const deleteprofile = await axios.delete(
        `https://3.6.225.138/api/auth/userDel/${userid}`
      );

      if (deleteprofile) {
        message.success("profile deleted");

        setTimeout(() => {
          deleteCookie("token");
          navigate("/login");
        }, 2000);

        
      }

      console.log(deleteprofile);
    } catch (error) {
      console.log(error);
      message.error("something went wrong");
    }
  };





  const postupdate = async (e) => {
    e.preventDefault();

    const oldusser = user;

    const data = {
      name,
      email,
      Aadhar,
      phone,
      maxquantity,
      pincode,
      userid,
      oldusser,
      password,
    };

    try {
      const upd = await axios.put(
        `https://3.6.225.138/api/auth/userupd/${userid}`,
        data,
        { withCredentials: true }
      );

      if (upd) {
        setTimeout(() => {
          deleteCookie("token");
          navigate("/login");
          window.location.reload();
        }, 2000);
      }

      console.log(upd);

      message.success("profile Updated");

      console.log(upd);
    } catch (error) {
      console.log(error);
      message.error("something went wrong");
    }
  };




  

  const getuser = async () => {
    console.log(userid);

    try {
      const getuser = await axios.get(
        `https://3.6.225.138/api/auth/getuser/${userid}`
      );

      console.log(getuser.data);
      setdata(getuser.data);
      setname(getuser.data.name);
      setemail(getuser.data.email);
      setphone(getuser.data.phone);
      setaadhar(getuser.data.Aadhar);
      setpincode(getuser.data.pincode);
      setquantity(getuser.data.maxquantity);

      console.log(getuser.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Call getuser only if userId is available
    if (userid) {
      getuser();
    }
  }, [userid]);

  //-----------------------------------------------------------------------------------------------------------------------------------------

  return (
    <>
      {/* <!-- component --> */}

      <div className="bg-purple-900 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden">
        <div class="flex justify-center min-h-screen">
          <div class="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5 ">
            <div className="bg-white p-[3rem] rounded-2xl">
              <div class="w-full ">
                <h1 class="text-2xl font-semibold tracking-wider text-black capitalize dark:text-black">
                  Profile 
                </h1>

                <form class="grid text-xl font-semibold grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                  <div>
                    <input
                      onChange={(e) => {
                        console.log("hit name");

                        setname(e.target.value);
                      }}
                      className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      type="text"
                      id="name"
                      name="name"
                      placeholder="name"
                      value={name}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Email address"
                      className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Adhar number"
                      className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      value={Aadhar}
                      onChange={(e) => setaadhar(e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Phone number"
                      className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      value={phone}
                      onChange={(e) => setphone(e.target.value)}
                    />
                  </div>


                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      className=" w-full text-sm  px-4 py-3     rounded-lg focus:outline-none"
                    />
                  </div>

                  <button
                    class="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-800 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:purple-blue-600 focus:ring-opacity-50"
                    onClick={postupdate}
                    type="submit"
                  >
                    <span>Update</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 rtl:-scale-x-100"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>

                  <button
                    class="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-800 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:purple-blue-600 focus:ring-opacity-50"
                    onClick={deleteProfile}
                    type="submit"
                  >
                    {" "}
                    Delete{" "}
                  </button>

                  <button
                    class="flex  items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-800 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:purple-blue-600 focus:ring-opacity-50"
                    type="submit"
                  >
                    <Link to={"/userMak"}>Market status</Link>
                  </button>

                  <button
                    class="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-800 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:purple-blue-600 focus:ring-opacity-50"
                    type="submit"
                  >
                    <Link to={"/userAuct"}>Auction status </Link>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
