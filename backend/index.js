const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

require("./config/database").connect();
require("./config/cloudinary").cloudinaryConnect();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

const fileUpload = require("express-fileupload");

const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const courseRoute = require("./routes/course");
const paymentRoute = require('./routes/payment')
const contactRoute = require('./routes/contact')
const errormiddleware = require("./middleware/Error");

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "https://studynotion-ten.vercel.app",
  credentials: true,
}));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
}));

app.use(cookieParser());
app.use("/api/v1/auth", authRoute);

app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/reach", contactRoute)

app.use(errormiddleware);
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
