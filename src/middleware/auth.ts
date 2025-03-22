import { Request,Response,NextFunction } from "express"
import jwt from 'jsonwebtoken';
import User, { IUser } from "../models/User";


declare global{
    namespace Express{
        interface Request{
            user?:IUser
        }
    }
}


export const authenticate=async(req:Request,res:Response,next:NextFunction)=>{
    const bearer=req.headers.authorization; //Esto en caso si no encunetra ninnguna authorization
    if(!bearer){
        const error=new Error('No autorizado');
        res.status(401).json({error:error.message})
        return
    }

    const token=bearer.split(' ')[1];

    try {
        //En la parte de util el momento de generar le jwt , te bota la cantidad de tipo de datos con el jwt 
        //Con ello se tiene que trabajar para que todo este okey :D
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
            
        if(typeof decoded==='object' && decoded.id){
            const user=await User.findById(decoded.id).select('id name email');
            if(user){
                req.user=user;
                next();
            }else{
                res.status(500).json({error:'Token No Valido'})
            }   
        }
    } catch (error) {
        res.status(500).json({error:'Token No Valido'})
    }
   
}