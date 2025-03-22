import type { Request,Response } from "express";
import Note,{INote} from '../models/Note';
import { Types } from "mongoose";

type NoteParams={   
    noteId:Types.ObjectId
}
export class NoteController{
    static createNote=async(req:Request<{},{},INote>,res:Response)=>{
        const {content}=req.body
        const note=new Note();
        note.content=content;
        note.createdBy=req.user.id;
        note.task=req.task.id;

        req.task.notes.push(note.id)

        try {
            await Promise.allSettled([req.task.save(),note.save()])
            res.send('Nota agregada Correctamente');
        } catch (error) {
            res.status(500).json({error:'Hubo un Error'})
        }
    }

    static getTaskNotes=async(req:Request<{},{},INote>,res:Response)=>{
        try {
            const notes=await Note.find({task:req.task.id})
            res.send(notes)
        } catch (error) {
            res.status(500).json({error:'Hubo un Error'})
        }
    }

    static deleteNote=async(req:Request<NoteParams>,res:Response)=>{
        const {noteId}=req.params
        const note=await Note.findById(noteId)

        if(!note){
            const error=new Error('El note no existe');
            res.status(404).json({error:error.message})
            return
        }
        /* Verifica que el usuario no sea el mismo de ello */
        if(note.createdBy.toString()!==req.user.id.toString()){
            const error=new Error('Accion No Valida');
            res.status(404).json({error:error.message})
            return
        }

        req.task.notes=req.task.notes.filter(note=>note.toString()!==noteId.toString())

        try {
            await Promise.allSettled([req.task.save(),note.deleteOne()])
            res.send('Nota Eliminada')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }

    }
}