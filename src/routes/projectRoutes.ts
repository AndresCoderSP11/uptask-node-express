import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProject } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";



const router = Router();

router.use(authenticate); //Esto va permitir que t oda las rutas esten protegias y que tengan un authenticate previo


/* Aquellos que requieran un authenticate se va solicitar el BEARER */
router.get('/',
    /* Aqui ira la parte  */
    ProjectController.getAllProjects);

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es requerido'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es requerido'),
    body('description')
        .notEmpty().withMessage('El nombre del cliente es requerido'),
    handleInputErrors,
    ProjectController.createProject);

/* Proteger Acceso unicamente para que el usuario quien las creo las tenga */
router.get('/:id',
    param('id').isMongoId().withMessage('El id del proyecto no es valido'),
    handleInputErrors,
    ProjectController.getProjectById);

router.put('/:id',
    param('id')
        .isMongoId().withMessage('El id del proyecto no es valido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es requerido'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es requerido'),
    body('description') 
        .notEmpty().withMessage('El nombre del cliente es requerido'),
    handleInputErrors,
    ProjectController.updateProject);

router.delete('/:id',
    param('id')
        .isMongoId().withMessage('El id del proyecto no es valido'),
    handleInputErrors,
    ProjectController.deleteProject);

/* Como las tareas son dependientes de los projectos, no es necesario crear otra ruta para cada Tarea*/

/* Routes for tasksssss */

/* Haremos el validador de la parte de que el projectIId exista, si no no procesa la funcion o el contorlador */

router.param('projectId', validateProject);

/* Validando los huecos de agregar Tarea en este caso
por parte de las tareas */
router.post('/:projectId/tasks',
    hasAuthorization,
    param('projectId')
        .isMongoId().withMessage('El id del proyecto no es valido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es requerido'),
    body('description')
        .notEmpty().withMessage('La descripcion de la tarea es requerida'),
    handleInputErrors,
    TaskController.createTask
);

router.param('taskId',taskExists);
router.param('taskId',taskBelongsToProject)



router.get('/:projectId/tasks',
    TaskController.getTasks
);

/* TaskController */

router.get('/:projectId/tasks/:taskId',
    param('projectId')
        .isMongoId().withMessage('ID no valido'),
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('projectId')
        .isMongoId().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es requerido'),
    body('description')
        .notEmpty().withMessage('La descripcion de la tarea es requerida'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('projectId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
);

router.post('/:projectId/tasks/:taskId/status',
    param('projectId')
        .isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El status de la tarea es requerido'),
    
    handleInputErrors,
    TaskController.updateStatus
)

/* Routes for team */

router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no valido'),
        handleInputErrors,
        TeamMemberController.findMemberByEmail
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Id no valido'),
        handleInputErrors,
        TeamMemberController.addMemberById
)
router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('Id no valido'),
        handleInputErrors,
        TeamMemberController.removeMemberId
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

/*** Routes for Notes ***/

/* Esta ruuta el task ya lo tenemos lo que tenemos que alamacenar es el contenido */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
        handleInputErrors,
        NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
        NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('userId')
        .isMongoId().withMessage('Id no valido'),
        NoteController.deleteNote
)




export default router;