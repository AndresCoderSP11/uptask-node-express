"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const Note_1 = __importDefault(require("../models/Note"));
class NoteController {
    static createNote = async (req, res) => {
        const { content } = req.body;
        const note = new Note_1.default();
        note.content = content;
        note.createdBy = req.user.id;
        note.task = req.task.id;
        req.task.notes.push(note.id);
        try {
            await Promise.allSettled([req.task.save(), note.save()]);
            res.send('Nota agregada Correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un Error' });
        }
    };
    static getTaskNotes = async (req, res) => {
        try {
            const notes = await Note_1.default.find({ task: req.task.id });
            res.send(notes);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un Error' });
        }
    };
    static deleteNote = async (req, res) => {
        const { noteId } = req.params;
        const note = await Note_1.default.findById(noteId);
        if (!note) {
            const error = new Error('El note no existe');
            res.status(404).json({ error: error.message });
            return;
        }
        /* Verifica que el usuario no sea el mismo de ello */
        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Accion No Valida');
            res.status(404).json({ error: error.message });
            return;
        }
        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());
        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.send('Nota Eliminada');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map