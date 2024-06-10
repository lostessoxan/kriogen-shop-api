"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const conn = await mongoose_1.default.connect(process.env.MONGODB_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            resolve("Success");
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
            reject(error.message);
        }
    });
};
exports.default = connectDB;
