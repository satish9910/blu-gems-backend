const express = require("express");
const db = require("./config/db");
const bodyParser = require("body-parser");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const cors = require("cors");
const fs = require('fs');
const path = require('path');

require("dotenv").config();





const app = express();
app.use(
  cors()
//   cors({
//     origin: "http://localhost:5173", // ✅ Allow specific origin
//     origin: "http://localhost:5174", // ✅ Allow specific origin
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, // ✅ Allow credentials (cookies, tokens, etc.)
//   })
);

db();



const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const PORT = process.env.PORT || 3000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
