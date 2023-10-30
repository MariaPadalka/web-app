const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const taskController = require('../controllers/task-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware')

router.post('/registration', body('email').isEmail(), body('password').isLength({min:6, max:32}), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, adminMiddleware, userController.getUsers);
router.post('/sendEmail', authMiddleware, userController.sendEmail);

router.post('/task', body('index').isInt({ gt: 0 }), 
        body('title').isLength({max:32}), authMiddleware, taskController.create);
router.get('/tasks', authMiddleware, taskController.getTasks);
router.delete('/task/:id', authMiddleware, taskController.delete);


module.exports = router;