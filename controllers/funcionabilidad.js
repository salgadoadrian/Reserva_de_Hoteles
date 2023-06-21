const {request, response } = require('express');
const { message } = require('../helpers/message');
const { dbConnection } = require('../database/config');
const sql = require('mssql');



const funcionabilidad = async( req = request, res = response ) => {

    const { funcionabilidad } = req.params;
    
    const connection = await dbConnection();

    let result ;

    if(funcionabilidad == 'hotel con mayor cantidad de habitaciones'){ //vista
        result = await connection.request().query('select * from vista');
    }
    else if(funcionabilidad == 'clientes con mas de dos reservas'){
        result = await connection.request().query('select cliente.id_cliente as Carnet_de_Identidad , count(reserva.id_reserva) as Cantidad_Reserva from cliente join reserva on cliente.id_cliente = reserva.id_cliente group by cliente.id_cliente having count (reserva.id_reserva) > 1 order by count (reserva.id_reserva) desc ');
    }
    else if(funcionabilidad == 'reservas con pagos'){
        result = await connection.request().query('select r.id_reserva , r.id_cliente , p.cantidad_pagada from reserva r right join pago p on r.id_reserva = p.id_reserva');
    }
    else if(funcionabilidad == 'descripcion de rol'){
        result = await connection.request().query('select rol.id_rol , documento.descripcion from rol join documento on rol.id_rol = documento.id_rol');
    }


    else if(funcionabilidad == 'cantidad de reservas confirmadas por cliente'){
        const confirmada = 'confirmada';
        result = await connection.request().input("confirmada" , sql.VarChar , confirmada)
                                           .query(' select cliente.id_cliente as carnet, count (habitacion.id_habitacion) as cantidad_habitaciones from cliente join reserva on(reserva.id_cliente = cliente.id_cliente and reserva.estado = @confirmada) join habitacion on reserva.id_habitacion = habitacion.id_habitacion group by cliente.id_cliente order by count (habitacion.id_habitacion) desc');
    }
    else {
        return res.json({
            msg: message.msg_016
        })
    }

    res.json({
        msg: result.recordset
     })
}

const Ejecutar_Funcion1 = async(req = request, res = response) => {
    const { fecha } = req.body;

    const connection = await dbConnection();

    const  result = await connection.request().input("fecha", sql.Int , fecha).query('select dbo.cant_res_dia(@fecha) as cantidad_apariciones ');

    res.json({
        respuesta: result.recordset
    })

}

const Ejecutar_Funcion2 = async(req = request, res = response) => {
    const { tipo , gasto } = req.body;

    const connection = await dbConnection();

    const  result = await connection.request().input("tipo", sql.Int , tipo)
                                              .input("gasto", sql.Int , gasto)
                                              .query(' select dbo.evaluacion01( @tipo , @gasto ) as cumple');


    if( result.recordset[0].cumple == 1 ){
        res.json({
           msg: message.msg_019
        })
    }
    else{
        res.json({
            msg: message.msg_018
         })
    }

}



module.exports = {
    funcionabilidad,
    Ejecutar_Funcion1,
    Ejecutar_Funcion2
}