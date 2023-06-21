const {request, response } = require('express');
const { message } = require('../helpers/message');
const { dbConnection } = require('../database/config');
const sql = require('mssql');

const GetPagos = async (req = request, res = response) => {

    const connection = await dbConnection();

    const result = await connection.request().query('SELECT * from pago')
        
    res.json({
        pagos : result.recordset
    })
}

const GetPago = async (req = request, res = response) => {

    const {id_reserva } = req.params;

    const connection = await dbConnection();

    const result = await connection.request().input("id_reserva", sql.Int , id_reserva)
                                             .query('SELECT top 1* from pago where id_reserva = @id_reserva')

    if(result.rowsAffected[0] == 1){
        res.json({
            pago: result.recordset
        })
    }else{
        res.json({
            msg: message.msg_022
        })
    }
        
}

const PostPago = async(req = request, res = response) => {
   
    const { id_reserva , fecha , cantidad_pagada } = req.body;
 
     const connection = await dbConnection()

    const reserva_00 =  await connection.request().input("id_reserva", sql.Int , id_reserva)
                                              .query('SELECT * from reserva where id_reserva = @id_reserva')

                                              

    const habitacion=  await connection.request().input("id_habitacion", sql.Int , reserva_00.recordset[0].id_habitacion)
                                  .query('SELECT * from habitacion where id_habitacion = @id_habitacion')


    if(cantidad_pagada < habitacion.recordset[0].precio){
        return res.json({
            msg: message.msg_024
        })
    }
 
     await connection.request().input("id_reserva", sql.Int , id_reserva)
                               .input("fecha", sql.Int , fecha)
                               .input("cantidad_pagada", sql.Int , cantidad_pagada)
                               .query('INSERT INTO pago values (@id_reserva ,@fecha , @cantidad_pagada)')
 
    const confirmada = 'confirmada'
    const reserva =  await connection.request().input("id_reserva", sql.Int , id_reserva)
                                               .input("confirmada", sql.VarChar, confirmada)
                                               .query('update reserva set estado = @confirmada where id_reserva = @id_reserva')

    const result =  await connection.request().input("id_reserva", sql.Int , id_reserva)
                                               .query('SELECT top 1 * from pago where id_reserva = @id_reserva ')
    res.json({ 
         New_Pago: result.recordset

    });
 }

module.exports ={
    GetPagos,
    GetPago,
    PostPago
}