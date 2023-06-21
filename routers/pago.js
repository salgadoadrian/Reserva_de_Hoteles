const { Router } = require('express');
const {check} = require('express-validator');
const { message } = require('../helpers/message');
const {validarCampos} = require('../middlewares/validar-campos');
const { GetPagos, GetPago, PostPago } = require('../controllers/pago');
const { existeempleado, existeReservaporId, reservaPagada } = require('../helpers/db_validator');
const { esAdminRole } = require('../helpers/db_validator');

const router = Router();

router.get('/:id_empleado', [
    check('id_empleado').custom(existeempleado),
    check('id_empleado').custom(esAdminRole),
    validarCampos
],GetPagos)

router.get('/consulta/:id_reserva',[
    check('id_reserva').custom(existeReservaporId),
    validarCampos
],GetPago)

router.post('/',[
    check('id_reserva').custom(existeReservaporId),
    check('id_reserva').custom(reservaPagada),
    validarCampos
],PostPago)

module.exports = router;