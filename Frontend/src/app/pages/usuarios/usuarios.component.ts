import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import {NgForm} from '@angular/forms';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _usuarioService: UsuarioService,
   public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion.subscribe(resp => {
      this.cargarUsuarios();
    });
  }
  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;

      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    if (desde >= this.totalRegistros || desde < 0) {
      return;
    }

    this.desde = desde;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this._usuarioService.buscarUsuarios(termino).subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioService.usuario._id) {
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal({
      title: 'Esta Seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((borrar) => {
        console.log(borrar);
        if (borrar) {
          this._usuarioService.borrarUsuario(usuario._id).subscribe( borrado => {
               this.cargarUsuarios();
          });
        }
      });

  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe();
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }





}
