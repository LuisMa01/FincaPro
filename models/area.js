const mongoose = require('mongoose')



const asignarSchema = new mongoose.Schema({
    asignacion :{
        type: String,
    },
    initDate:{
        type: Date,
        require: true,
        default: Date.now

    },
    createDate:{
        type: Date,
        require: true,
        default: Date.now

    },
    activo: {
        type: Boolean,
        default: true
    },

    areaName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'campo'},



    cultivoName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cultivo'
    },

    fechaAplicacion: {
        type: Date,            
    },
    
    cultivoActividad: [{
        actividad: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Actividad'
        },
        fechaPlan: {
            type: Date,
            
        },
        fechaRealizacion: {
            type: Date,
            
        },
        inventario: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventario'
        }]
    }],
    comentario: [{
        nota:{
            type: String
        },
        fechaNota:{
            type: Date,
            default: Date.now
        }
    }]
    
})

module.exports = mongoose.model('AreaAsignar', asignarSchema)
