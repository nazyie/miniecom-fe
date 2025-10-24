import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  parseErrorMessage(value: string) : string {
    switch(value) {
      case 'Record not exists to update':
        return 'Rekod tidak sah'

      case 'Incorrect password or email':
        return 'Katalaluan atau emel tidak tepat'

      case 'This email has been registered in the system':
        return 'Emel ini telah digunakan di dalam sistem'

      case 'You have reach the limit on creating the new record':
        return 'Anda telah mencapai had limit. Sila tambah kuota anda'

      case 'Record not exits':
        return 'Rekod tidak sah'

      case 'Record not exits':
        return 'Rekod tidak sah'

      case 'Record not exits':
        return 'Rekod tidak sah'

      default:
        return value;
    }
  }

}
