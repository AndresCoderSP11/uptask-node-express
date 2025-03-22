"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    const passwordHash = await bcrypt_1.default.hash(password, salt);
    return passwordHash;
};
exports.hashPassword = hashPassword;
const comparePassword = async (passwordBody, passwordUser) => {
    const isPasswordValid = await bcrypt_1.default.compare(passwordBody, passwordUser);
    return isPasswordValid;
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=auth.js.map