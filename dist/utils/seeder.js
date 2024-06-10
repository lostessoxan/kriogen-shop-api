"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../config/db"));
const userModel_1 = __importDefault(require("../models/userModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const users_1 = __importDefault(require("../data/users"));
const products_1 = __importDefault(require("../data/products"));
dotenv_1.default.config();
(0, db_1.default)();
const importData = async () => {
    try {
        await productModel_1.default.deleteMany();
        await userModel_1.default.deleteMany();
        await orderModel_1.default.deleteMany();
        const createdUsers = await userModel_1.default.insertMany(users_1.default);
        const adminUserId = createdUsers[0]._id;
        const sampleProducts = products_1.default.map((product) => ({
            ...product,
            user: adminUserId,
        }));
        await productModel_1.default.insertMany(sampleProducts);
        console.log("Data Imported");
    }
    catch (error) {
        console.error(`${error.message}`);
    }
};
const destroyData = async () => {
    try {
        await productModel_1.default.deleteMany();
        await userModel_1.default.deleteMany();
        await orderModel_1.default.deleteMany();
        console.log("Data Destroyed");
    }
    catch (error) {
        console.error(`${error.message}`);
    }
};
if (process.argv[2] === "-d") {
    destroyData();
}
else {
    importData();
}
