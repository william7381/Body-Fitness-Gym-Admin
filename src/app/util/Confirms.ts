import swal from 'sweetalert';
import Swal, {SweetAlertOptions, SweetAlertType} from 'sweetalert2';

export class Confirms {

  static showSuccessType(title, message) {
    Swal.fire(title, '', 'success');
  }

  static showChooserOption(title, type) {
    return Swal.fire({
      title: title,
      type: type,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#d33',
      reverseButtons: true
    });
  }

  static showErrorType(title, message) {
    Swal.fire(title, '<span class="swal2-message" >' + message + '<span>', 'error');
  }

  static showTopRight(title, type) {
    Swal.fire({
      position: 'top-end',
      type: type,
      title: title,
      showConfirmButton: false,
      timer: 2000
    });
  }
}
