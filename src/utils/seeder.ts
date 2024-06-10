import colors from "colors";
import dotenv from "dotenv";
import connectDB from "../config/db";
import User from "../models/userModel";
import Product from "../models/productModel";
import Order from "../models/orderModel";
import users from "../data/users";
import products from "../data/products";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUserId = createdUsers[0]._id;

    const sampleProducts = products.map((product: any) => ({
      ...product,
      user: adminUserId,
    }));

    await Product.insertMany(sampleProducts);

    console.log("Data Imported");
  } catch (error: any) {
    console.error(`${error.message}`);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();

    console.log("Data Destroyed");
  } catch (error: any) {
    console.error(`${error.message}`);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
