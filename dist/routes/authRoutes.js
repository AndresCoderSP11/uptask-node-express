"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/create-account', (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre no puede ir vacio'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password tiene que tener 8 caractes min'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los Password no son iguales');
    }
    return true;
}), (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no valido'), validation_1.handleInputErrors, AuthController_1.AuthConntroller.createAccount);
router.post('/confirm-account', (0, express_validator_1.body)('token')
    .notEmpty().withMessage('El Token no puede ir vacio'), AuthController_1.AuthConntroller.confirmAccount);
router.post('/login', (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no valido'), (0, express_validator_1.body)('password')
    .notEmpty().withMessage('El password no puede ir vacio'), validation_1.handleInputErrors, AuthController_1.AuthConntroller.login);
router.post('/request-code', (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no valido'), validation_1.handleInputErrors, AuthController_1.AuthConntroller.requestConfirmationCode);
router.post('/forgot-password', (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no valido'), validation_1.handleInputErrors, AuthController_1.AuthConntroller.forgotPassword);
router.post('/validate-token', (0, express_validator_1.body)('token')
    .notEmpty().withMessage('El Token no puede ir vacio'), validation_1.handleInputErrors, AuthController_1.AuthConntroller.validateToken);
router.post('/update-password/:token', (0, express_validator_1.param)('token').isNumeric().withMessage('El token tiene que ser un numero'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password tiene que tener 8 caractes min'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los Password no son iguales');
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthConntroller.updatePasswordWithToken);
router.get('/user', auth_1.authenticate, AuthController_1.AuthConntroller.user);
/* Profile */
router.put('/profile', auth_1.authenticate, (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre no puede ir vacio'), (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no valido'), validation_1.handleInputErrors, AuthController_1.AuthConntroller.updateProfile);
router.post('/update-password', auth_1.authenticate, (0, express_validator_1.body)('current_password')
    .notEmpty().withMessage('El password no puede ir vacio'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password tiene que tener 8 caractes min'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los Password no son iguales');
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthConntroller.updateCurrentUserPassword);
router.post('/check-password', auth_1.authenticate, (0, express_validator_1.body)('password')
    .notEmpty().withMessage('El password no puede ir vacio'), validation_1.handleInputErrors, AuthController_1.AuthConntroller.checkPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map