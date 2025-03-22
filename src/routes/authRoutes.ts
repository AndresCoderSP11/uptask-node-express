import { Router } from "express";
import { AuthConntroller } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router=Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .isLength({min:8}).withMessage('El password tiene que tener 8 caractes min'),
    body('password_confirmation').custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('Los Password no son iguales')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
        handleInputErrors,
        AuthConntroller.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
    AuthConntroller.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthConntroller.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
        handleInputErrors,
        AuthConntroller.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
        handleInputErrors,
        AuthConntroller.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
        handleInputErrors,
    AuthConntroller.validateToken
)


router.post('/update-password/:token',
    param('token').isNumeric().withMessage('El token tiene que ser un numero'),
    body('password')
        .isLength({min:8}).withMessage('El password tiene que tener 8 caractes min'),
    body('password_confirmation').custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('Los Password no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthConntroller.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthConntroller.user
)

/* Profile */

router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputErrors,
    AuthConntroller.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    body('password')
        .isLength({min:8}).withMessage('El password tiene que tener 8 caractes min'),
    body('password_confirmation').custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('Los Password no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthConntroller.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthConntroller.checkPassword
)


export default router