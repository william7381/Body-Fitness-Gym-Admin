export class Messages {
  static readonly titleErrorAdd = 'No se pudo Agregar el elemento.';
  static readonly titleErrorEdit = 'No se pudo Editar el elemento.';
  static readonly titleErrorRegisterDialog = 'Diligencie los campos';
  static readonly messageErrorRegisterDialog = 'Por favor asegúrese de diligenciar los campos nombre, numero de documento, telefono, y seleccionar al menos un programa.';
  static readonly messageErrorInternetConexion = 'Por favor Compruba tu conexion a internet.';
  static readonly titleSuccessRemove = 'Elemento Eliminado.';
  static readonly titleErrorRemove = 'No se pudo eliminar el elemento.';
  static readonly titleChooseRemove = '¿Seguro que quieres eliminar este Elemento?';
  static readonly success = 'success';
  static readonly warning = 'warning';
  static readonly error = 'error';
  static readonly info = 'info';
  static readonly question = 'question';

  static readonly titleErrorGetDataSource = 'No pudimos obtener los datos de la tabla, por favor comprueba tu conexión a internet.';
  static readonly titleErrorGetPrograms = 'No pudimos obtener los programas, por favor comprueba tu conexión a internet.';
  static readonly titleErrorGetTrainers = 'No pudimos obtener los entrenadores, por favor comprueba tu conexión a internet.';
  static readonly titleErrorClassNeedTrainer = 'No ha seleccionado entrenador.';
  static readonly titleErrorClassNeedProgram = 'No ha seleccionado programa.';
  static readonly messageErrorClassNeed = 'Primero debe registar uno.';
  static readonly titleErrorConnection = 'Error de Conexión.';
  static readonly titleSuccessAdd = 'Elemento Agregado.';
  static readonly titleSuccessEdit = 'Elemento Editado.';

  static readonly urlSubscripcion = '/suscripcion';
  static readonly urlMovement = '/movimiento';
  static readonly urlAllMovements = '/movimientos';
  static readonly urlService = '/servicio';
  static readonly urlAllServices = '/servicios';
  static readonly urlClass = '/clase';
  static readonly urlAllClasses = '/clases';
  static readonly urlSchedule = '/schedules';
  static readonly urlStudent = '/alumno';
  static readonly urlAllStudents = '/alumnos';
  static readonly urlTrainer = '/entrenador';

  static readonly urlAllTrainers = '/entrenadores';
  static readonly titleErrorStudentAlreadyExist = 'El estudiante ya fue agregado.';
  static readonly messageErrorSelectedOther = 'Por favor seleccione otro.';
  static readonly titleWarningWithoutStudents = 'No hay Alumnos';
  static readonly bodyWarningRegisterStudents = 'Primero debes registrar Alumnos';
  static readonly titleSuccessAddStudent = 'Estudiante Agregado';
  static readonly titleErrorNeedQuotas = 'No ha diligenciado la cantidad de cupos.';
  static readonly messageErrorNeedQuotas = 'Por favor, ingrese un valor.';
  static readonly titleErrorDate = 'Error de fecha';
  static readonly messageErrorDateMinor = 'La fecha debe ser mayor a hoy.';
}
