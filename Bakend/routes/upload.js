var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

// modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: true,
            mensaje: 'Tipo invalido',
            error: { message: 'Debe seleccionar un tipo valido' }
        });
    }

    if (!req.files) {
        res.status(400).json({
            ok: true,
            mensaje: 'No selecciono nada',
            error: { message: 'Debe seleccionar una imagen' }
        });
    }

    // get name
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // validate extension 
    var extesionValidas = ['jpg', 'png', 'gif', 'jpeg'];
    if (extesionValidas.indexOf(extensionArchivo) < 0) {
        res.status(400).json({
            ok: true,
            mensaje: 'Extension no valida',
            error: { message: 'Las extension valdias son Jpg, png, gif , jpge' }
        });
    }

    // nombre de archivo personalziado
    var nombreArchivo = `${id} -${new Date().getMilliseconds()}.${extensionArchivo}`;

    // move file temp to path
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: true,
                mensaje: 'Error al mover el archivo',
                error: { message: 'Error al mover el archivo' }
            });
        };

    });

    subirPorTipo(tipo, id, nombreArchivo, res);



});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if(!usuario) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errores: {message: 'Usuario no Existe'}
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            // if exists,, delete image.-
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuario.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if(!medico) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'medico no existe',
                    errores: {message: 'medico no Existe'}
                });
            }
            var pathViejo = './uploads/medicos' + medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                medicoActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if(!hospital) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'hospital no existe',
                    errores: {message: 'hospital no Existe'}
                });
            }
            var pathViejo = './uploads/hospitales' + hospital.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                hospitalActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;