const mongoose = require('mongoose')
const areaAsignar = require('./area')



const cultScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    labor:[{
        actividad: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Actividad'
        },
    }],
    creationDate: {
        type: Date,
        require: true,
        default: Date.now

    },
    activo: {
        type: Boolean,
        default: true
    }

}) 

cultScheme.pre('remove', function(next) {
    areaAsignar.find({ cultivoName: this.id}, (err, areaAsignar) => {
        if (err) {
            next(err)
        } else if (areaAsignar.length > 0) {
            next(new Error('error para eliminar Cultivo'))
        } else {
            next()
        }

    })
})

module.exports = mongoose.model('Cultivo', cultScheme)