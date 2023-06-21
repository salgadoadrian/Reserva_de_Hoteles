const { Router } = require('express');
const {check} = require('express-validator');
const { message } = require('../helpers/message');
const {validarCampos} = require('../middlewares/validar-campos');
const { funcionabilidad, Ejecutar_Funcion1, Ejecutar_Funcion2 } = require('../controllers/funcionabilidad');

const router = Router();


router.get('/funcion1',[
    check('fecha', message.msg_017).notEmpty(),
    validarCampos
], Ejecutar_Funcion1)

router.get('/funcion2',[
    check('tipo', message.msg_020).notEmpty(),
    check('gasto', message.msg_021).notEmpty(),
    validarCampos
], Ejecutar_Funcion2)


router.get('/:funcionabilidad',funcionabilidad);



module.exports = router;