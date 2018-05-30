import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


declare var swal: any;
@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styles: []
})
export class HospitalComponent implements OnInit {


  cargando: boolean = true;
  totalRegistros: number = 0;
  hospitales: Hospital[] = [];

  constructor(public _hospitalService: HospitalService ,
    public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
     this.cargarHospitales();

     this._modalUploadService.notificacion.subscribe(resp => {
      this.cargarHospitales();
    });
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales().subscribe((resp: any) => {
      console.log(resp);
      this.hospitales = resp.hospitales;
      this.totalRegistros = resp.hospitales.length;
      this.cargando = false;
    });
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
     this._hospitalService.buscarHospital(termino).subscribe((hospital: Hospital[]) => {
        this.hospitales = hospital;
        this.cargando = false;
     });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: 'Esta Seguro?',
      text: 'Esta a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((borrar) => {
        console.log(borrar);
        if (borrar) {
          this._hospitalService.borrarHospital(hospital._id).subscribe( borrado => {
               this.cargarHospitales();
          });
        }
      });
}

mostrarModal(id: string) {
  this._modalUploadService.mostrarModal('hospitales', id);
}

crearHospital() {
  swal({
      title: 'Crear hospital',
      text: 'Ingrese nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons:true,
      dangerMode: true
  }).then((valor: string) => {
    console.log(valor);
    if( !valor || valor.length === 0) {
      return;
    }
    this._hospitalService.crearHospital(valor).subscribe(resp => {
      this.cargarHospitales();
      console.log("Cargaron los hospis")
    });
  });

}

}
