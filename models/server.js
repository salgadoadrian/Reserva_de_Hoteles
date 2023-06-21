const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.js');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT ;
        this.path = {
            hotel: '/api/hotel',
            reserva: '/api/reserva',
            funcionabilidad: '/api/funcionabilidad',
            habitacion: '/api/habitacion',
            pago: '/api/pago'
           

        }


        //conectar a base de datos
        this.conectarDB();

        //Middleware
        this.middleware();
        //Rutas de mi aplicacion

        this.routes();
    }

    async conectarDB(){
        await dbConnection();
        
    }

    middleware(){

        //cors
        this.app.use(cors());

        // lectura y parseo de body
        this.app.use(express.json());


    }


    routes() {


        
       this.app.use( this.path.hotel, require('../routers/hotel.js'));
       this.app.use( this.path.reserva, require('../routers/reserva.js'));
       this.app.use( this.path.funcionabilidad, require('../routers/funcionabilidad.js'));
       this.app.use( this.path.habitacion , require('../routers/habitacion.js'));
       this.app.use( this.path.pago , require('../routers/pago.js'));

    }

    listen(){
        this.app.listen(this.port , () => {
            console.log('corrieendo en el puerto ', this.port);
        }); 
    }

}




module.exports = Server;