const {request, response } = require('express');
const { message } = require('../helpers/message');
const { dbConnection } = require('../database/config');
const sql = require('mssql');

const GetHoteles = async (req = request, res = response) => {

    const connection = await dbConnection();

    const result = await connection.request().query('SELECT * from hotel')
        
    res.json({
        hoteles: result.recordset
    })
}


const GetHotel = async (req = request, res = response) => {

    const {id_hotel } = req.params;

    const connection = await dbConnection();

    const result = await connection.request().input("id_hotel", sql.Int , id_hotel)
                                             .query('SELECT * from hotel where id_hotel = @id_hotel')
        
    res.json({
        hotel: result.recordset
    })
}

const PostHotel = async(req = request, res = response) => {
   
   const { id_hotel , nombre , direccion } = req.body;

    const connection = await dbConnection()

    await connection.request().input("id_hotel", sql.Int , id_hotel)
                              .input("nombre", sql.VarChar , nombre)
                              .input("direccion", sql.VarChar , direccion)
                              .query('INSERT INTO hotel values (@id_hotel ,@nombre , @direccion)')

    const result =  await connection.request().input("id_hotel", sql.Int , id_hotel)
                                              .query('SELECT * from hotel where id_hotel = @id_hotel')

    res.json({ 
        New_hotel: result.recordset
    });
}

const PutHotel = async (req = request, res = response) =>{
    const { id_hotel } = req.params;
    let { nombre } = req.body;

    const connection = await dbConnection()

    await connection.request().input("id_hotel", sql.Int , id_hotel)
                              .input("nombre", sql.VarChar, nombre)
                              .query('update hotel set nombre = @nombre where id_hotel = @id_hotel')

    const result =  await connection.request().input("id_hotel", sql.Int , id_hotel)
                                              .query('SELECT * from hotel where id_hotel = @id_hotel')

    res.json({
        Update_hotel: result.recordset
    })
}

const DeleteHotel = async (req = request, res = response) => {
    
    const { id_hotel } = req.params;

    const connection = await dbConnection()

    const result =  await connection.request().input("id_hotel", sql.Int , id_hotel)
                                              .query('SELECT * from hotel where id_hotel = @id_hotel')

    await connection.request().input("id_hotel", sql.Int , id_hotel)
                              .query('delete from hotel where id_hotel = @id_hotel')



    res.json({
        Delete_hotel: result.recordset
    })
}

module.exports = {
    GetHoteles,
    GetHotel,
    PostHotel,
    PutHotel,
    DeleteHotel
}