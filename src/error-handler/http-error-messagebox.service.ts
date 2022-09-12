import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable()
export class HttpErrorMessageboxService {
  public messages: string[] = [];
  public LoadSuccess: boolean = true;
  public add(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'エラーメッセージ',
      text: message
    });
    this.messages.push(message);
  }
  public infobox(message: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Success!',
      text: message
    });
    this.messages.push(message);
  }
  public clear(): void {
    this.messages = [];
  }
  constructor() { }
}
