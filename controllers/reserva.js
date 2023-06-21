const {request, response } = require('express');
const { message } = require('../helpers/message');
const { dbConnection } = require('../database/config');
const sql = require('mssql');

const GetReservas = async (req = request, res = response) => {

    const connection = await dbConnection();

    const result = await connection.request().query('SELECT * from reserva');
        
    res.json({
        reservas: result.recordset
    })
}

const GetReserva= async (req = request, res = response) => {

    const {id_reserva } = req.params;

    const connection = await dbConnection();

    const result = await connection.request().input("id_reserva", sql.Int , id_reserva)
                                             .query('SELECT * from reserva where id_reserva = @id_reserva');
        
    res.json({
        reserva: result.recordset
    })
}

const PostReserva = async(req = request, res = response) => {
   
    const { id_cliente , id_habitacion , fecha  , cant_persona} = req.body;
     const estado = 'pendiente'

    const connection = await dbConnection()

    const personas_habitacion =  await connection.request().input("id_habitacion" , sql.Int , id_habitacion)
                                                           .query('SELECT * from habitacion where id_habitacion = @id_habitacion')
   
    if(personas_habitacion.recordset[0].capcidad < cant_persona) {
        return res.json({
           msg: message.msg_011
        })                                                    
    }

    const dia_disponible =  await connection.request().input("fecha", sql.Int , fecha)
                                                      .input("id_habitacion" , sql.Int , id_habitacion)
                                                      .query('SELECT * from reserva where id_habitacion = @id_habitacion and (fecha = @fecha or fecha+1 = @fecha or fecha+2 = @fecha or fecha-1 = @fecha or fecha-2 = @fecha) ')                                          

    if(dia_disponible.rowsAffected[0] == 1){
        return res.json({
            msg: message.msg_012
        })
    }

    await connection.request().input("id_cliente",  sql.VarChar , id_cliente)
                              .input("id_habitacion", sql.Int , id_habitacion)
                              .input("fecha", sql.Int , fecha)
                              .input("cant_persona", sql.Int , cant_persona)
                              .input("estado",  sql.VarChar ,estado)
                              .query('INSERT INTO reserva values (@id_cliente ,@id_habitacion , @fecha,@cant_persona, @estado)');
 
    const result =  await connection.request().query('SELECT * from reserva')
 
    res.json({ 
        New_reserva: result.recordset[result.recordset.length-1]   
    });


}

 
const PutReserva = async (req = request, res = response) =>{
    const { id_reserva } = req.params;
    let { fecha } = req.body;

    const connection = await dbConnection()

    const reserva = await connection.request().input("id_reserva", sql.Int , id_reserva)
                              .query('SELECT * FROM reserva where id_reserva = @id_reserva')

     //   console.log(reserva.recordset[0].id_habitacion);

    const dia_disponible =  await connection.request().input("fecha", sql.Int , fecha)
                                                      .input("id_habitacion" , sql.Int , reserva.recordset[0].id_habitacion)
                                                      .query('SELECT * from reserva where id_habitacion = @id_habitacion and (fecha = @fecha or fecha+1 = @fecha or fecha+2 = @fecha or fecha-1 = @fecha or fecha-2 = @fecha) ')                                          

    if(dia_disponible.rowsAffected[0] == 1){
        return res.json({
            msg: message.msg_012
        })
    }

    await connection.request().input("id_reserva", sql.Int , id_reserva)
                              .input("fecha", sql.Int, fecha)
                              .query('update reserva set fecha = @fecha where id_reserva = @id_reserva')

                            
    const result =  await connection.request().input("id_reserva", sql.Int , id_reserva)
                                              .query('SELECT * from reserva where id_reserva = @id_reserva')

  
    res.json({
        Update_reserva: result.recordset
      
    })
}

const DeleteReserva = async (req = request, res = response) => {
    
    const { id_reserva } = req.params;
    const { id_empleado , id_cliente } = req.body;
    let bandera = false;

    const connection = await dbConnection()
    
    if(id_empleado  || id_cliente ){
        bandera = true;
    }

    if(bandera){
        if(id_empleado){
            let result =  await connection.request().input("id_empleado", sql.VarChar , id_empleado)
                                                      .query('SELECT * from empleado_rol where id_empleado = @id_empleado')

            let admin = 'administrador'

            let result2 =  await connection.request().input("id_rol", sql.Int , result.recordset[0].id_rol)
                                                       .input("nombre_rol" , sql.VarChar , admin)
                                                       .query('SELECT * from rol where id_rol = @id_rol and nombre_rol = @nombre_rol')

            if(result2.rowsAffected[0] == 0 )
                return res.json({
                    msg: message.msg_007
                });
        }
        else{
            let reserva = await connection.request().input("id_reserva", sql.Int , id_reserva)
                                                    .input("id_cliente" , sql.VarChar , id_cliente)
                                                    .query('SELECT * FROM reserva where id_reserva = @id_reserva and id_cliente = @id_cliente')
       
            if(reserva.rowsAffected[0] == 0 )
            return res.json({
                msg: message.msg_014
            });
        }
    }
    else{
        return res.json({
            msg: message.msg_015
        });
    }
    
    const resultado =  await connection.request().input("id_reserva", sql.Int , id_reserva)
                                                 .query('SELECT * from reserva where id_reserva = @id_reserva')

    await connection.request().input("id_reserva", sql.Int , id_reserva)
                              .query('delete from pago where id_reserva = @id_reserva')                                         

    await connection.request().input("id_reserva", sql.Int , id_reserva)
                              .query('delete from reserva where id_reserva = @id_reserva')



    res.json({
        Delete_reserva: resultado.recordset
    })
}


module.exports = {
    GetReservas,
    GetReserva,
    PostReserva,
    PutReserva,
    DeleteReserva
}