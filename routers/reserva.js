const { Router } = require('express');
const {check} = require('express-validator');
const { message } = require('../helpers/message');
const {validarCampos} = require('../middlewares/validar-campos');
const { existeReservaporId, existeClienteporId, existeHabitacionporId, existeEstado } = require('../helpers/db_validator');

const router = Router();


const {
    GetReservas,
    GetReserva,
    PostReserva,
    PutReserva,
    DeleteReserva,
   
} = require('../controllers/reserva');



router.get('/', GetReservas);

router.get('/:id_reserva', [
    check('id_reserva').custom(existeReservaporId),
    validarCampos
],GetReserva);

router.post('/', [
    check('cant_persona',message.msg_010).notEmpty(),
    check('id_cliente').custom(existeClienteporId),
    check('id_habitacion').custom(existeHabitacionporId),
    check('estado').custom(existeEstado),
    check('fecha', message.msg_013).notEmpty(),

    validarCampos
],PostReserva)

router.put('/:id_reserva',[
    check('id_reserva').custom(existeReservaporId),
    check('fecha', message.msg_013).notEmpty(),
    validarCampos
],PutReserva)

router.delete('/:id_reserva',[
    check('id_reserva').custom(existeReservaporId),
    validarCampos
],DeleteReserva);



module.exports = router;