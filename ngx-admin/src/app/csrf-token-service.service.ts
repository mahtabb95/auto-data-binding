import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CsrfTokenServiceService {

  baseUrlCsrf = 'http://127.0.0.1:8000/csrf-token';
  constructor(private httpClient: HttpClient) { }

  getCsrfToken() {
    return this.httpClient.get(this.baseUrlCsrf);
  }
}
