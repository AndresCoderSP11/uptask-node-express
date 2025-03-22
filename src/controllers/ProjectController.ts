import { Request,Response } from "express"
import Project from "../models/Project";

export class ProjectController{

    static createProject=async(req:Request,res:Response)=>{
        /* Recuerda que en la parte del try catch  */
        /* const project=new Project(req.body); */
       /* En ese caso inicialmente crea pero hay otro metodo */
        /* Cuando se trata de almacenamiento hace el tryCatch */
        const project=new Project(req.body);
        try {
            /* await project.save(); */
            project.manager=req.user.id
            
            await project.save();
            res.status(201).send('Proyecto Creado Correctamente');
            return;
        } catch (error) {
            console.log(error);
        }
    }

    static getAllProjects=async(req:Request,res:Response)=>{
        try {
            
            const projects = await Project.find({
                $or:[
                    /* Vas a mostrar al mannager y a los que pertenecen en el team */
                    {manager:{$in:req.user.id}},
                    {team:{$in:req.user.id}}
                ]
            });
            
            res.json(projects);
            return;
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById=async(req:Request,res:Response)=>{
        try {
            const project=await Project.findById(req.params.id).populate('tasks');
            if(!project){
                const error=new Error('Proyecto no encontrado');
                res.status(404).send({error:error.message});
                return;
            }
            if(project.manager.toString()!==req.user.id.toString() && !project.team.includes(req.user.id)){
                const error=new Error('Accion No Valida');
                res.status(404).json({error:error.message})
                return
            }


            res.json(project);
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject=async(req:Request,res:Response)=>{
        const {id}=req.params;
        const {projectName,clientName,description}=req.body;
        try {
        
            const project=await Project.findByIdAndUpdate(id,req.body);
            if(!project){
                const error=new Error('No ha sido posible actualizar el proyecto');
                res.status(404).send({error:error.message});
                return;
            }

            if(project.manager.toString()!==req.user.id.toString()){
                const error=new Error('Solo el Manager puede actualizar un Proyecto');
                res.status(404).json({error:error.message})
                return
            }

            await project.save();
            res.status(200).send('Proyecto Actualizado Correctamente');
            return

        } catch (error) {
            console.log(error);
        }
       console.log('Desde put');
       
    }

    static deleteProject=async(req:Request,res:Response)=>{
        const {id}=req.params;
        try {
            const project=await Project.findById(id);
            if(!project){
                const error=new Error('No ha sido posible eliminar el proyecto');
                res.status(404).send({error:error.message});
                return;
            }
            if(project.manager.toString()!==req.user.id.toString()){
                const error=new Error('Solo el Manager puede Eliminar un Proyecto');
                res.status(404).json({error:error.message})
                return
            }
            await project.deleteOne();
            res.status(200).send('Proyecto Eliminado Correctamente');
            return;
        } catch (error) {
            console.log(error);
        }
    }
}