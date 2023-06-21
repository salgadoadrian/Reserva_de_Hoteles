const { Router } = require('express');
const {check} = require('express-validator');
const { message } = require('../helpers/message');
const {validarCampos} = require('../middlewares/validar-campos');
const { existeHotel, existeHotelporId, existeempleado, esAdminRole } = require('../helpers/db_validator');

const router = Router();

const {
    GetHoteles,
    PostHotel,
    PutHotel,
    DeleteHotel,
    GetHotel
} = require('../controllers/hotel');


router.get('/', GetHoteles);

router.get('/:id_hotel', [
    check('id_hotel').custom(existeHotelporId),
    validarCampos
],GetHotel);

router.post('/',[
    check('id_hotel', message.msg_001).not().isEmpty(),
    check('id_hotel').custom(existeHotel),
    check('nombre', message.msg_002).not().isEmpty(),
    check('direccion', message.msg_002).not().isEmpty(),
    validarCampos
], PostHotel);

router.put('/:id_hotel',[
    check('id_hotel').custom(existeHotelporId),
    check('nombre', message.msg_002).not().isEmpty(),
    validarCampos
],PutHotel)

router.delete('/:id_hotel/:id_empleado',[
    check('id_hotel').custom(existeHotelporId),
    check('id_empleado').custom(existeempleado),
    check('id_empleado').custom(esAdminRole),
    validarCampos
],DeleteHotel)


module.exports = router;

//2307