const express = require('express')
const router = express.Router()
const AreaAsignar= require('../models/area')
const Campo= require('../models/campo')
const Actividad = require('../models/actividad')
const Cultivo = require('../models/cultivo')
const area = require('../models/area')

router.get('/', async (req, res) => {
    

    const areaAsignar = await AreaAsignar.find({activo : true})
    .populate('areaName', 'name')
    .populate('cultivoName', 'name')
    .populate('cultivoActividad.actividad', 'name')
    .exec()
    
    const campo = await Campo.find()

    const params = {
        areaAsignar : areaAsignar,
        campo : campo
    }
    


    res.render('area/index', params)

})



//crea campo asginando nombre
router.get('/newArea', async (req, res) =>{
   
    res.render('area/newArea', {campo : new Campo()})
    
})
router.post('/newArea', async (req, res) => {
    const campo = new Campo({
        name: req.body.name,
    })
    
    
    try {
        const newCampo = await campo.save()
        res.render('index')
        //res.redirect(`campo/${newCampo.id}`)0
        1
            } catch {
        res.render('area/newArea', {
        campo: campo,
        errorMessage: 'error creando campo'
        })
    }
})
//asignar cultivo a un area
router.get('/new', async (req, res) =>{

    
    
    const cultivos = await Cultivo.find({activo : true})
    const campo = await Campo.find({activo : true})
    const areaAsignar = new AreaAsignar
    

    const params = {
        cultivos : cultivos,
        campo: campo,
        areaAsignar : areaAsignar,
        
    }

    res.render('area/new', params)
    
})

router.post('/new', async (req, res) =>{
    
    const areaAsignar = new AreaAsignar({
        areaName : req.body.name,
        cultivoName: req.body.cultivo,
        initDate: req.body.initDate
    })

    try {
        
        await areaAsignar.save()

        const cultivo = await Cultivo.findById(req.body.cultivo)

        //crear nombre
        const camp = await Campo.findById(req.body.name)
        let t = areaAsignar.initDate.toDateString().split(' ')[3]
        const numAsignacion = await AreaAsignar.find({initDate : {$gte: `${t}-01-01`, $lte: `${t}-12-31`}})
        

        let i = 0;
        numAsignacion.forEach( num => {
            i=i+1;
        })
        let nameT = `${i}-${camp.name}-${cultivo.name}-${t}`
        let text = ''
        for(let o = 0; o < nameT.length; o++){
            if(nameT[o] !== ' '){
            text = text + nameT[o]
            }
        }
        
        areaAsignar.asignacion = text
        
        //fin crear nombre

        await cultivo.labor.forEach(element => {
            areaAsignar.cultivoActividad.push({ actividad: element.actividad})
        });
        const newArea = await areaAsignar.save()
        res.redirect(`/area/${newArea.id}/plan`)

                
    } catch {
        res.render('area/new', {
            areaAsignar: areaAsignar,
            errorMessage: 'error creando area'
        })        
    }
})

//planificar fecha de las actividades asignada
router.get('/:id/plan', async (req, res) => {
    const asignacion = await AreaAsignar.findById(req.params.id)
    .populate('areaName', 'name')
    .populate('cultivoName', 'name')
    .populate('cultivoActividad.actividad', 'name')
    .exec()
    
    res.render('area/plan', {asignacion : asignacion})
})

router.put('/:id/plan', async (req, res) => {
    let asignacion = await AreaAsignar.findById(req.params.id)
    .populate('areaName', 'name')
    .populate('cultivoName', 'name')
    .populate('cultivoActividad.actividad', 'name')
    .exec()
    
    try{
    
    let fecha = req.body.act
    
    let o = 0
    await asignacion.cultivoActividad.forEach( actividad => {
        if(fecha[o] !== ''){
        actividad.fechaPlan = new Date(fecha[o])
        } 

        o = o + 1;
    })
    await asignacion.save()

    res.redirect(`/area/${asignacion.id}/show`)
    
    } catch {
        res.render(`/area/${asignacion.id}/plan`, {
            asignacion: asignacion,
            errorMessage: 'error al asignar fecha'
        }) 
    }
    
})

router.get('/:id/show', async (req, res) => {
    const asignacion = await AreaAsignar.findById(req.params.id)
    .populate('areaName', 'name')
    .populate('cultivoName', 'name')
    .populate('cultivoActividad.actividad', 'name')
    .exec()
    
    res.render('area/show', {asignacion : asignacion})
})



//agregar actividad

router.get('/:id/addActividad', async (req, res) => {
    
    try {
         const asignacion = await AreaAsignar.findById(req.params.id)
        .populate('areaName', 'name')
        .populate('cultivoName', 'name')
        .populate('cultivoActividad.actividad', 'name')
        .exec()
        
        const actividades = await Actividad.find({activo : true})        
            
        const params = {
            asignacion: asignacion,
            actividades: actividades
        }
        
        res.render('area/addActividad', params)
        

    } catch {
        res.render(`area/index`)
    }

})


router.put('/:id/addActividad', async (req, res) => {
    let asignacion
    try {        
        asignacion = await AreaAsignar.findById(req.params.id)
        const actividades = await Actividad.find({activo : true})
        let params = {
            asignacion: asignacion,
            actividades: actividades
        }
        
        await asignacion.cultivoActividad.push({ actividad: req.body.labor})
        await asignacion.save()
        params.asignacion = await AreaAsignar.findById(req.params.id).populate('cultivoActividad.actividad', 'name').exec()
        res.render(`area/addActividad`, params)
    } catch {
        res.render(`area/index`)
        
    }
})

router.delete('/:id/addActividad', async (req, res) => {
    let asignacion
    
    try {
        asignacion = await AreaAsignar.findOne({"cultivoActividad._id": req.params.id})
        .populate('areaName', 'name')
        .populate('cultivoName', 'name')
        .populate('cultivoActividad.actividad', 'name')
        .exec()
        
        const actividades = await Actividad.find()
        
        await asignacion.cultivoActividad.id(req.params.id).remove()
        await asignacion.save()
        let params = {
            asignacion: asignacion,
            actividades: actividades
        }
        
        
        res.render(`area/addActividad`, params)
        
    } catch {
        if (cultivo != null) {
            res.render('area/show', {
                asignacion: asignacion,
                errorMessage: 'Could not remove actividad'
            })
        } else {
            res.redirect('/')
        }
    }
})



module.exports = router