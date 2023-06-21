
const { message } = require('./message');
const { dbConnection } = require('../database/config');
const sql = require('mssql');


const existeHotel =  async (id_hotel = '') => {

    const connection = await dbConnection()

    const result =  await connection.request().input("id_hotel", sql.Int , id_hotel)
                                              .query('SELECT * from hotel where id_hotel = @id_hotel')

    if(result.rowsAffected[0] != 0 )
        throw new Error(message.msg_005);
}

const existeHotelporId =  async (id_hotel = '') => {

    const connection = await dbConnection()

    const result =  await connection.request().input("id_hotel", sql.Int , id_hotel)
                                              .query('SELECT * from hotel where id_hotel = @id_hotel')

    if(result.rowsAffected[0] == 0 )
        throw new Error(message.msg_006);
}

const existeempleado =  async (id_empleado = '') => {

    const connection = await dbConnection()

    const result =  await connection.request().input("id_empleado", sql.VarChar , id_empleado)
                                              .query('SELECT * from empleado where id_empleado = @id_empleado')

    if(result.rowsAffected[0] == 0 )
        throw new Error(message.msg_006);
}


const esAdminRole =  async (id_empleado = '') => {

    const connection = await dbConnection()

    const result =  await connection.request().input("id_empleado", sql.VarChar , id_empleado)
                                              .query('SELECT * from empleado_rol where id_empleado = @id_empleado')

    let admin = 'administrador'
    
    const result2 =  await connection.request().input("id_rol", sql.Int , result.recordset[0].id_rol)
                                               .input("nombre_rol" , sql.VarChar , admin)
                                               .query('SELECT * from rol where id_rol = @id_rol and nombre_rol = @nombre_rol')

    if(result2.rowsAffected[0] == 0 )
        throw new Error(message.msg_007);
}

const existeReservaporId =  async (id_reserva = '') => {

    const connection = await dbConnection()

    const result =  await connection.request().input("id_reserva", sql.Int , id_reserva)
                                              .query('SELECT * from reserva where id_reserva = @id_reserva')

                                              

    if(result.rowsAffected[0] == 0 )
        throw new Error(message.msg_006);
}


const existeClienteporId =  async (id_cliente = '') => {

    const connection = await dbConnection()

    const result =  await connection.request().input("id_cliente", sql.VarChar , id_cliente)
                                              .query('SELECT * from cliente where id_cliente = @id_cliente')

    if(result.rowsAffected[0] == 0 )
        throw new Error(message.msg_006 );
}

const existeHabitacionporId =  async (id_habitacion = '') => {

    const connection = await dbConnection()

    const result =  await connection.request().input("id_habitacion", sql.Int , id_habitacion)
                                              .query('SELECT * from habitacion where id_habitacion = @id_habitacion')

    if(result.rowsAffected[0] == 0 )
        throw new Error(message.msg_006 );
}

const existeEstado = async(estado = '') => {
    const estado_habitacion = ['pendiente', 'confirmada', 'cancelada'];

    if(estado_habitacion.indexOf(estado) == -1){
        throw new Error(message.msg_008+ ': '+ estado_habitacion );
    }
}

const reservaPagada = async(id_reserva = '') => {
   

    const connection = await dbConnection()
    const confirmada = 'confirmada'

    const result =  await connection.request().input("id_reserva", sql.Int , id_reserva)
                                              .input("confirmada", sql.VarChar, confirmada)
                                              .query('SELECT * from reserva where id_reserva = @id_reserva and estado = @confirmada')

    if(result.rowsAffected[0] == 1 )
        throw new Error(message.msg_023);
}





module.exports ={
    existeHotel,
    existeHotelporId,
    existeempleado,
    esAdminRole,
    existeReservaporId,
    existeClienteporId,
    existeHabitacionporId,
    existeEstado,
    reservaPagada,
 
} 