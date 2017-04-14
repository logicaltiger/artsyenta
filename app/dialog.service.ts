import { Injectable } from '@angular/core';

/*
  Async modal dialog service
  DialogService makes this app easier to test by faking this service.
  TODO: create a better modal implementation that doesn't use window.confirm
 */
@Injectable()
export class DialogService {
  
  public confirm(message?: string) {
    return new Promise<boolean>(resolve => {
      return resolve(window.confirm(message || 'Is it OK?'));
    });
  };

}
