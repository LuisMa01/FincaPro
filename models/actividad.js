const mongoose = require('mongoose')
const Cultivo = require('./cultivo')

const actScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    activo: {
        type: Boolean,
        default: true
    }
})

actScheme.pre('remove', function(next) {
    Cultivo.find({ actividad: this.id}, (err, cultivo) => {
        if (err) {
            next(err)
        } else if (cultivo.length > 0) {
            next(new Error('error para eliminar actividad'))
        } else {
            next()
        }

    })
})

module.exports = mongoose.model('Actividad', actScheme)