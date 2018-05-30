import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';

@Injectable()
export class HospitalService {

  constructor(public _http: HttpClient,
              public _usuarioService: UsuarioService) {

   }

   cargarHospitales() {
     let url = URL_SERVICIOS + '/hospital';
     return this._http.get(url);
   }

   obtenerHospital(id: string) {
      let url = URL_SERVICIOS + '/hospital/' + id;
      return this._http.get(url);
   }

   borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;
    return this._http.delete(url).map(resp => {
      swal('Hospital borrado', 'El hospital a sido eliminado correctamente', 'success');
      return true;
    });
   }

   crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital?token=' + this._usuarioService.token;

    return this._http.post(url, { nombre }).map((resp: any) => {
      swal('hospital creado', nombre , 'success');
      return resp.hospital;
    });
   }

   buscarHospital(termino: string) {
     let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
     return this._http.get(url).map((resp: any) => resp.hospitales);
   }

   actualizarHospital(hospital: Hospital) {
     let url = URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this._usuarioService.token;
     return this._http.put(url, hospital)
     .map((resp: any) => {
        let hospitalDB: Hospital = resp.hospital;
      swal('Hospital actualizado', hospital.nombre, 'success');
      return true;
    });

   }





}
