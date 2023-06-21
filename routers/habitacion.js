const { Router } = require('express');
const {check} = require('express-validator');
const { message } = require('../helpers/message');
const {validarCampos} = require('../middlewares/validar-campos');
const { GetHabitaciones, GetHabitacion, PostHabitacion, PutHabitacion, DeleteHabitacion } = require('../controllers/habitacion');
const { existeHabitacionporId, existeHotelporId,existeempleado, esAdminRole } = require('../helpers/db_validator');

const router = Router();

router.get('/' , GetHabitaciones);

router.get('/:id_habitacion', [
    check('id_habitacion').custom(existeHabitacionporId),
    validarCampos
],GetHabitacion);

router.post('/:id_empleado',[
    check('id_hotel').custom(existeHotelporId),
    check('id_empleado').custom(existeempleado),
    validarCampos,
    check('id_empleado').custom(esAdminRole),
    validarCampos
],PostHabitacion)

router.put('/:id_habitacion',[
    check('id_habitacion').custom(existeHabitacionporId),
    validarCampos
],PutHabitacion)

router.delete('/:id_habitacion',[
    check('id_habitacion').custom(existeHabitacionporId),
    validarCampos
],DeleteHabitacion)

module.exports = router;