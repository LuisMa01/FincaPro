const express = require('express')
//const req = require('express/lib/request')
//const res = require('express/lib/response')
const router = express.Router()
const Actividad = require('../models/actividad')
const Cultivo = require('../models/cultivo')

//todas las actividades

router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name !== null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const actividades = await Actividad.find(searchOptions)
        res.render('actividad/index', {
            actividades: actividades,
            
            searchOptions: req.query
        })
    } catch {
        res.redirect('/', {
            errorMessage: 'ha ocurrido un error'
        })
    }
    //res.render('actividad/index')
}) 

//nueva actividad
router.get('/new', (req, res) =>{
    res.render('actividad/new', { actividad: new Actividad()})
})

//crear actividad
router.post('/', async (req, res) => {
    const actividad = new Actividad({
        name: req.body.name,
        description: req.body.description
    })
    //console.log(req.body.name)
    try {
        const newActividad = await actividad.save()
        res.redirect(`actividad/${newActividad.id}`)
    } catch {
        res.render('actividad/new', {
        actividad: actividad,
        errorMessage: 'error creando actividad'
        })
    }
})

//mostrar actividad

router.get('/:id', async (req, res) => {
    
    try {
        const actividad = await Actividad.findById(req.params.id)
        res.render('actividad/show', {
            actividad: actividad
        })
    } catch {
        
        res.redirect('/actividad')

    }
})

//editar actividad
router.get('/:id/edit', async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id)
        res.render('actividad/edit', { actividad: actividad })
        console.log(actividad.id)
    } catch {
        res.redirect('/actividad')
    }
})

router.put('/:id', async (req, res) => {
    let actividad
    console.log('error 2')
    try {
        actividad = await Actividad.findById(req.params.id)
        actividad.name = req.body.name
        actividad.description = req.body.description
        await actividad.save()
        
        res.redirect(`/actividad/${actividad.id}`)
    } catch {
        if (actividad == null) {
            res.redirect('/')
        } else {
            res.render('actividad/edit', {
                actividad: actividad,
                errorMessage: 'Error actualizando actividad'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let actividad
    try {
        actividad = await Actividad.findById(req.params.id)
        await actividad.remove()
        res.redirect('/actividad')
    } catch {
        if (actividad != null) {
            res.render('actividad/show', {
                actividad: actividad,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
        
    }
})

module.exports = router