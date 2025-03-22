"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate); //Esto va permitir que t oda las rutas esten protegias y que tengan un authenticate previo
/* Aquellos que requieran un authenticate se va solicitar el BEARER */
router.get('/', 
/* Aqui ira la parte  */
ProjectController_1.ProjectController.getAllProjects);
router.post('/', (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El nombre del proyecto es requerido'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El nombre del cliente es requerido'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('El nombre del cliente es requerido'), validation_1.handleInputErrors, ProjectController_1.ProjectController.createProject);
/* Proteger Acceso unicamente para que el usuario quien las creo las tenga */
router.get('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('El id del proyecto no es valido'), validation_1.handleInputErrors, ProjectController_1.ProjectController.getProjectById);
router.put('/:id', (0, express_validator_1.param)('id')
    .isMongoId().withMessage('El id del proyecto no es valido'), (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El nombre del proyecto es requerido'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El nombre del cliente es requerido'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('El nombre del cliente es requerido'), validation_1.handleInputErrors, ProjectController_1.ProjectController.updateProject);
router.delete('/:id', (0, express_validator_1.param)('id')
    .isMongoId().withMessage('El id del proyecto no es valido'), validation_1.handleInputErrors, ProjectController_1.ProjectController.deleteProject);
/* Como las tareas son dependientes de los projectos, no es necesario crear otra ruta para cada Tarea*/
/* Routes for tasksssss */
/* Haremos el validador de la parte de que el projectIId exista, si no no procesa la funcion o el contorlador */
router.param('projectId', project_1.validateProject);
/* Validando los huecos de agregar Tarea en este caso
por parte de las tareas */
router.post('/:projectId/tasks', task_1.hasAuthorization, (0, express_validator_1.param)('projectId')
    .isMongoId().withMessage('El id del proyecto no es valido'), (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre de la tarea es requerido'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('La descripcion de la tarea es requerida'), validation_1.handleInputErrors, TaskController_1.TaskController.createTask);
router.param('taskId', task_1.taskExists);
router.param('taskId', task_1.taskBelongsToProject);
router.get('/:projectId/tasks', TaskController_1.TaskController.getTasks);
/* TaskController */
router.get('/:projectId/tasks/:taskId', (0, express_validator_1.param)('projectId')
    .isMongoId().withMessage('ID no valido'), TaskController_1.TaskController.getTaskById);
router.put('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.param)('projectId')
    .isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre de la tarea es requerido'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('La descripcion de la tarea es requerida'), validation_1.handleInputErrors, TaskController_1.TaskController.updateTask);
router.delete('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.param)('projectId')
    .isMongoId().withMessage('ID no valido'), validation_1.handleInputErrors, TaskController_1.TaskController.deleteTask);
router.post('/:projectId/tasks/:taskId/status', (0, express_validator_1.param)('projectId')
    .isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('status')
    .notEmpty().withMessage('El status de la tarea es requerido'), validation_1.handleInputErrors, TaskController_1.TaskController.updateStatus);
/* Routes for team */
router.post('/:projectId/team/find', (0, express_validator_1.body)('email')
    .isEmail().toLowerCase().withMessage('E-mail no valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.findMemberByEmail);
router.post('/:projectId/team', (0, express_validator_1.body)('id')
    .isMongoId().withMessage('Id no valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.addMemberById);
router.delete('/:projectId/team/:userId', (0, express_validator_1.param)('userId')
    .isMongoId().withMessage('Id no valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.removeMemberId);
router.get('/:projectId/team', TeamController_1.TeamMemberController.getProjectTeam);
/*** Routes for Notes ***/
/* Esta ruuta el task ya lo tenemos lo que tenemos que alamacenar es el contenido */
router.post('/:projectId/tasks/:taskId/notes', (0, express_validator_1.body)('content')
    .notEmpty().withMessage('El Contenido de la nota es obligatorio'), validation_1.handleInputErrors, NoteController_1.NoteController.createNote);
router.get('/:projectId/tasks/:taskId/notes', NoteController_1.NoteController.getTaskNotes);
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('userId')
    .isMongoId().withMessage('Id no valido'), NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map