import { Injectable } from '@angular/core';




@Injectable()
export class JwtService {

  storage: any = window.localStorage;

  readonly KEY: string = 'user-token';
  readonly KEYLifetime: string = 'user-token-exp';

  constructor(
  ){}


  get token(): string {
    const expDate = new Date(this.storage.getItem(this.KEYLifetime));
    if (new Date() > expDate) {
      this.destroyToken();
      return null;
    }
    return this.storage.getItem(this.KEY);
  }
   setToken(response: any | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + 10800000);
      this.storage.setItem(this.KEY, response);
      this.storage.setItem(this.KEYLifetime, expDate.toString());
    } else {
      this.storage.clear();
    }
  }

  destroyToken() {
    this.setToken(null);
  }



}
