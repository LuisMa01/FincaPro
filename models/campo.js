const mongoose = require('mongoose')


const campoSchema = new mongoose.Schema({
    name:{
        type:String

    },
    activo: {
        type: Boolean,
        default: true
    }
})

campoSchema.pre('remove', function(next) {
    areaAsignar.find({ areaName: this.id}, (err, areaAsignar) => {
        if (err) {
            next(err)
        } else if (areaAsignar.length > 0) {
            next(new Error('error para eliminar Cultivo'))
        } else {
            next()
        }

    })
})

module.exports = mongoose.model('campo', campoSchema)
