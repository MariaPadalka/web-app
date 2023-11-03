const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const taskController = require('../controllers/task-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware')
const requestMiddleware = require('../middlewares/request-middleware');


router.post('/registration', requestMiddleware, body('email').isEmail(), body('password').isLength({min:6, max:32}),  userController.registration);
router.post('/login', requestMiddleware, userController.login);
router.post('/logout', requestMiddleware, userController.logout);
router.get('/activate/:link', requestMiddleware, userController.activate);
router.get('/refresh', requestMiddleware, userController.refresh);
router.get('/users', requestMiddleware, authMiddleware, adminMiddleware, userController.getUsers);
router.delete('/user/:id', requestMiddleware, authMiddleware, userController.deleteUserById);


router.post('/task', body('index').isInt({ gt: 0 }), 
        body('title').isLength({max:32}), authMiddleware, taskController.create);
router.get('/tasks', requestMiddleware, authMiddleware, taskController.getTasks);
router.delete('/task/:id', requestMiddleware, authMiddleware, taskController.delete);
router.post('/task/start/:id', requestMiddleware, authMiddleware, taskController.start);
router.post('/task/stop/:id', requestMiddleware, authMiddleware, taskController.stopTask);
router.post('/task/resume/:id', requestMiddleware, authMiddleware, taskController.resumeTask);
router.get('/task/:id', requestMiddleware, authMiddleware, taskController.getTask);
router.get('/taskInfo/:id', requestMiddleware, authMiddleware, taskController.getTaskInfo);


module.exports = router;