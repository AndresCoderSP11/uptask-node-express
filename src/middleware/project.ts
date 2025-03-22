import type { Request,Response,NextFunction } from "express";
import Project, { IProject } from "../models/Project";

declare global{
    namespace Express{
        interface Request{
            project:IProject //En este caso la parte del IProject es del 
            // modelo brindado en el archivo models/Project.ts pero su Tipado
        }
    }
}

export async function validateProject(req:Request,res:Response,next:NextFunction){
    try {
        const {projectId}=req.params;
        const project=await Project.findById(projectId);
        if(!project){
            const error=new Error('Proyecto no encontrado');
            res.status(404).send({error:error.message});
            return;
        }
        req.project=project;
        next();
    } catch (error) {
        res.status(500).send({error:'Hubo un error'});
    }
}