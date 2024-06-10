"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.getAllUsers = exports.getUserById = exports.updateUserProfile = exports.getUserProfile = exports.registerUser = exports.authUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const authUser = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel_1.default.findOne({ email });
    if (!user) {
        return next((0, http_errors_1.default)(404, `User not found`));
    }
    if (await user.matchPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        next((0, http_errors_1.default)(401, `Invalid email or password`));
    }
};
exports.authUser = authUser;
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await userModel_1.default.findOne({ email });
    if (user) {
        next((0, http_errors_1.default)(400, `User already exists`));
    }
    const createdUser = await userModel_1.default.create({
        name,
        email,
        password,
    });
    if (createdUser) {
        res.status(201).json({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: (0, generateToken_1.default)(createdUser._id),
        });
    }
    else {
        next((0, http_errors_1.default)(400, `Invalid user data`));
    }
};
exports.registerUser = registerUser;
const getUserProfile = async (req, res, next) => {
    const user = await userModel_1.default.findById(req.user._id);
    if (!user) {
        return next((0, http_errors_1.default)(404, `User not found`));
    }
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await userModel_1.default.findById(req.user._id);
    if (!user) {
        return next((0, http_errors_1.default)(404, `User not found`));
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    const updatedUser = await user.save();
    // res.json(updatedUser);
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: (0, generateToken_1.default)(updatedUser._id),
    });
};
exports.updateUserProfile = updateUserProfile;
const getUserById = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return next((0, http_errors_1.default)(400, "Id is not valid"));
    }
    const user = await userModel_1.default.findById(id);
    if (!user) {
        return next((0, http_errors_1.default)(404, `User not found`));
    }
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
};
exports.getUserById = getUserById;
const getAllUsers = async (req, res, next) => {
    const users = await userModel_1.default.find({}).select("name email isAdmin");
    if (!users) {
        next((0, http_errors_1.default)(404, `Users not found`));
    }
    res.json(users);
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.isValidObjectId(id)) {
            next((0, http_errors_1.default)(400, "Id is not valid"));
        }
        await userModel_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "User removed" });
    }
    catch (error) {
        next((0, http_errors_1.default)(404, `User not found | internal server error`));
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, isAdmin } = req.body;
    try {
        if (!mongoose_1.default.isValidObjectId(id)) {
            return next((0, http_errors_1.default)(400, "Id is not valid"));
        }
        const user = await userModel_1.default.findById(req.params.id);
        if (!user) {
            return next((0, http_errors_1.default)(404, `User not found`));
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.isAdmin = isAdmin;
        const updatedUser = await user.save();
        res.json(updatedUser);
    }
    catch (error) {
        next((0, http_errors_1.default)(error.status, error.message));
    }
};
exports.updateUser = updateUser;
