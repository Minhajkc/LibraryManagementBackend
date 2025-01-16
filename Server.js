const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bookRoutes = require("./Routes/BookRoutes");
const userRoutes = require("./Routes/UserRoutes");
const borrowRoutes = require("./Routes/BorrowRoutes");
const AdminRoutes = require("./Routes/AdminRoutes")
const cors = require("cors");




dotenv.config();


const app = express();



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true, 
  }));



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};
connectDB();


app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/Admin",AdminRoutes)


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
