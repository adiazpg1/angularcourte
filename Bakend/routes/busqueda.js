var express = require('express');

var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var promesa;
    var regex = new RegExp(busqueda, 'i')

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda oslo son: usuarios. medicos y hospitales',
                error: { message: 'Tipo de tabla no valido'}
            });
    }

    promesa.then(data => {
        return res.status(200).json({
            ok: false,
            [tabla]: data
        });
    })
});

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
            .then(respuestas => {
                res.status(200).json({
                    ok: true,
                    hospitales: respuestas[0],
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                });
            })]
    )
});



function buscarHospitales(nombre, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error al cargar hospitales", err)
                } else {
                    resolve(hospitales)
                }
            });
    });
}


function buscarUsuarios(nombre, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role ')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuario')
                } else {
                    resolve(usuarios)
                }
            });
    });
}


function buscarMedicos(nombre, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ 'nombre': regex }, (err, medicos) => {
            if (err) {
                reject("Error al cargar hospitales", err)
            } else {
                resolve(medicos)
            }
        });
    });
}


module.exports = app;