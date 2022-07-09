const express = require('express')
const router = express.Router()
const Actividad = require('../models/actividad')
const Cultivo = require('../models/cultivo')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { redirect, render } = require('express/lib/response')
const { route } = require('./actividad')


//todas las actividades

router.get('/', async (req, res) => {
    
    let query = Cultivo.find({activo : true})
    if(req.query.name != null && req.query.name != ''){
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }

    try {
        const cultivos = await query.exec()
        res.render('cultivo/index', {
            cultivos: cultivos,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/', {
            errorMessage: 'ha ocurrido un error'
        })
        
    }
})




//nuevo cultivo

router.get('/new', async (req, res) =>{
    //renderNewPage(res, new Cultivo())
    res.render('cultivo/new', {cultivo: new Cultivo})

    
})



//crear cultivo
router.post('/', async (req, res) => {
    const cultivo = new Cultivo({
        name: req.body.name,
        description: req.body.description
    })
    
    try {
        
        const newCultivo = await cultivo.save()
        console.log('tengo un error1')
        res.redirect(`/cultivo/${newCultivo.id}`)
    } catch {
        res.render('cultivo/new', {
        cultivo: cultivo,
        errorMessage: 'error creando actividad'
        })
    }
})

router.get('/:id/addActividad', async (req, res) => {
    
    try {
        const cultivo = await Cultivo.findById(req.params.id).populate('labor.actividad', 'name').exec()        
        
        const actividades = await Actividad.find({activo : true})        
            
        const params = {
            cultivo: cultivo,
            actividades: actividades
        }
        
        res.render('cultivo/addActividad', params)
        

    } catch {
        res.render(`cultivo/`)
    }

})


router.put('/:id/addActividad', async (req, res) => {
    let cultivo
    try {
        cultivo = await Cultivo.findById(req.params.id)
        const actividades = await Actividad.find({activo : true})
        let params = {
            cultivo: cultivo,
            actividades: actividades
        }
        
        await cultivo.labor.push({ actividad: req.body.labor})
        await cultivo.save()
        params.cultivo = await Cultivo.findById(req.params.id).populate('labor.actividad', 'name').exec()
        res.render(`cultivo/addActividad`, params)
    } catch {
        
    }
})

router.delete('/:id/addActividad', async (req, res) => {
    let cultivo
    console.log()
    try {
        cultivo = await Cultivo.findOne({"labor._id": req.params.id}).populate('labor.actividad', 'name').exec()
        
        const actividades = await Actividad.find()
        
        await cultivo.labor.id(req.params.id).remove()
        await cultivo.save()
        let params = {
            cultivo: cultivo,
            actividades: actividades
        }
        
        
        res.render(`cultivo/addActividad`, params)
        
    } catch {
        if (cultivo != null) {
            res.render('cultivo/show', {
                cultivo: cultivo,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
    }
})



router.get('/:id', async (req, res) => {
    
    try {
        const cultivo = await Cultivo.findById(req.params.id).populate('labor.actividad', 'name').exec()        
        console.log(cultivo)
        res.render('cultivo/show', {
            cultivo: cultivo
        })
        

    } catch {
        res.render(`cultivo/`)
    }

})

router.get('/:id/edit', async (req, res) => {
    
    try {
        const cultivo = await Cultivo.findById(req.params.id)        
        
        const actividades = await Actividad.find({activo : true})        
            
        const params = {
            cultivo: cultivo,
            actividades: actividades
        }
        
        res.render('cultivo/edit', params)
        

    } catch {
        res.render(`cultivo/`)
    }

})

router.put('/:id', async (req, res) => {    
    try {
        
        let cultivo = await Cultivo.findById(req.params.id)    
        cultivo.name = req.body.name
        cultivo.description= req.body.description
        
        await cultivo.save()
       
        res.redirect(`/cultivo/${cultivo.id}`)
    } catch {
        res.render('cultivo', {
        cultivo: cultivo,
        errorMessage: 'error creando actividad'
        })
    }
})

router.delete('/:id', async (req, res) => {
    let cultivo
    try {
        cultivo = await Cultivo.findById(req.params.id)
        await cultivo.remove()
        res.redirect('/cultivo')
    } catch {
        if (cultivo != null) {
            res.render('cultivo/show', {
                cultivo: cultivo,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
        
    }


})





module.exports = router