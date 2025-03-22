import mongoose,{Schema,Document, PopulatedDoc, ObjectId, Types} from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

export interface IProject extends Document {
    projectName:string;
    clientName:string;
    description:string;
    tasks:PopulatedDoc<ITask  & Document>[];
    manager:PopulatedDoc<IUser & Document>;
    team:PopulatedDoc<IUser & Document>[];
}

const ProjectSchema=new Schema({
    projectName:{
        type:String,
        required:true,
        trim:true //Elimina los espacios en blanco alredereos de la entrada
    },
    clientName:{
        type:String,
        required:true,
        trim:true //Elimina los espacios en blanco alredereos de la entrada
    },
    description:{
        type:String,
        required:true,
        trim:true //Elimina los espacios en blanco alredereos de la entrada
    }, //La parte de tasks en este caso sera un array de objetos que se relacionaran con la tarea
    tasks:[{
        type:Types.ObjectId,
        ref:'Task'
    }],
    manager:{
        type:Types.ObjectId,
        ref:'User'
    },
    team:[{
        type:Types.ObjectId,
        ref:'User'
    }],
},{timestamps:true});
  //En este caso la parte de esta sera para que se cree automaticamente la fecha de creacion y actualizacion , donde nos mostraran si o si esta data

  ProjectSchema.pre('deleteOne',{document:true,query:false},async function(){
    const projectId=this._id;
    if(!projectId) return

    const tasks=await Task.find({project:projectId});
    for(const task of tasks){
        await Note.deleteMany({task:task.id});
    }

    await Task.deleteMany({project:projectId});


});

  const Project = mongoose.model<IProject>('Project',ProjectSchema)



export default Project;