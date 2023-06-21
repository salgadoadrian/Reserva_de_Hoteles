const {request, response } = require('express');
const { message } = require('../helpers/message');
const { dbConnection } = require('../database/config');
const sql = require('mssql');


const GetHabitaciones = async (req = request, res = response) => {

    const connection = await dbConnection();

    const result = await connection.request().query('SELECT * from habitacion')
        
    res.json({
        habitaciones: result.recordset
    })
}


const GetHabitacion = async (req = request, res = response) => {

    const {id_habitacion } = req.params;

    const connection = await dbConnection();

    const result = await connection.request().input("id_habitacion", sql.Int , id_habitacion)
                                             .query('SELECT * from habitacion where id_habitacion = @id_habitacion')
        
    res.json({
        habitacion: result.recordset
    })
}

const PostHabitacion = async(req = request, res = response) => {
   
    const { id_hotel , tipo , capacidad , precio } = req.body;
 
     const connection = await dbConnection()
 
     await connection.request().input("id_hotel", sql.Int , id_hotel)
                               .input("tipo", sql.Int , tipo)
                               .input("capacidad", sql.Int , capacidad)
                               .input("precio", sql.Int , precio)
                               .query('INSERT INTO habitacion values (@id_hotel ,@tipo , @capacidad , @precio)')
 
     const result =  await connection.request().query('SELECT * from habitacion')
 
     res.json({ 
         New_hotel: result.recordset[result.recordset.length - 1]
     });
}


const PutHabitacion = async (req = request, res = response) =>{
    const { id_habitacion } = req.params;
    let { precio , tipo , capacidad } = req.body;

    const connection = await dbConnection()

    const habitacion = await connection.request().input("id_habitacion", sql.Int, id_habitacion)
                                                     .query('SELECT * FROM habitacion where id_habitacion = @id_habitacion')

    if(!precio) precio = habitacion.recordset[0].precio
    if(!tipo) tipo = habitacion.recordset[0].tipo
    if(!capacidad) capacidad =habitacion.recordset[0].capacidad

    await connection.request().input("id_habitacion" , sql.Int, id_habitacion)
                              .input("precio", sql.Int , precio)
                              .input("tipo", sql.Int, tipo)
                              .input("capacidad", sql.Int, capacidad)
                              .query('update habitacion set tipo = @tipo , capacidad =  @capacidad, precio = @precio where id_habitacion = @id_habitacion')

    const result = await connection.request().input("id_habitacion", sql.Int, id_habitacion)
                              .query('SELECT * FROM habitacion where id_habitacion = @id_habitacion')
    res.json({
        Update_habitacion: result.recordset
   
    })
}

const DeleteHabitacion = async (req = request, res = response) => {
    
    const { id_habitacion } = req.params;

    const connection = await dbConnection()

    const result =  await connection.request().input("id_habitacion", sql.Int , id_habitacion)
                                              .query('SELECT * from habitacion where id_habitacion = @id_habitacion')

    await connection.request().input("id_habitacion", sql.Int , id_habitacion)
                              .query('delete from habitacion where id_habitacion = @id_habitacion')



    res.json({
        Delete_habitacion: result.recordset
    })
}


module.exports ={
    GetHabitacion,
    GetHabitaciones,
    PostHabitacion,
    PutHabitacion,
    DeleteHabitacion

}