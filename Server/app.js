require("dotenv").config();

const express = require("express");
const app = express();
const port =  process.env.PORT || 8000;
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/registration");
const cookieParser = require("cookie-parser");


const authRoute = require("./Routes/auth");
const marketTra = require("./Routes/mak")
const aucte = require("./Routes/Auct")



app.use(
  cors({
    origin: ["http://localhost:3001"],
    method: ["GET", "POST"],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());


app.use("/home",(req,res)=>{

  res.send("server 0  home");
})


app.use("/",(req,res)=>{

 res.send("server home");

})


/// USER ROUTES

app.use('/api/auth',authRoute)
app.use("/api/mak",marketTra)
app.use("/api/auct",aucte)



// process.env.MONGO_URL

mongoose
  .connect("mongodb+srv://nikhilkajota9413750125:nikhilkajota@energy-trading.rcuotf2.mongodb.net/", {})
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(2000, () => {
  console.log("server is running on port" + " " + 2000);
});
