import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CsrfTokenServiceService } from './csrf-token-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // baseUrl = 'http://127.0.0.1:8000/book/';
  // baseUrlLevel = 'http://127.0.0.1:8000/level/';
  // baseUrlMarried = 'http://127.0.0.1:8000/Married/';
  baseUrlPerson = 'http://127.0.0.1:8000/person/';
  baseUrlPipe = 'http://127.0.0.1:8000/pipe/';
  baseUrlTable = 'http://127.0.0.1:8000/table/';
  baseUrlPostTable = 'http://127.0.0.1:8000/table-content/';
  baseUrlHidden = 'http://127.0.0.1:8000/hidden/';
  baseUrlAuth = 'http://127.0.0.1:8000/auth/';
  baseUrlRegister = 'http://127.0.0.1:8000/users/'

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) { }
  token = this.cookieService.get('token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: `Token ${this.token}`
  });
  getAuthHeaders() {
    const token = this.cookieService.get('token')
    console.log(token)
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    })
  }

  // getBooks() {
  //   return this.httpClient.get(this.baseUrl, { headers: this.headers });
  // }
  // getEducation() {
  //   return this.httpClient.get(this.baseUrlLevel, { headers: this.headers });
  // }
  // getMarried() {
  //   return this.httpClient.get(this.baseUrlMarried, { headers: this.headers });
  // }
  getPerson() {
    return this.httpClient.get(this.baseUrlPerson, { headers: this.getAuthHeaders() });
  }
  getPipes() {
    return this.httpClient.get(this.baseUrlPipe, { headers: this.headers });
  }
  getTablesName() {
    return this.httpClient.get(this.baseUrlTable, { headers: this.getAuthHeaders() });
  }

  getTableContent(tableName: string): Observable<any> {
    return this.httpClient.get<any[]>(`${this.baseUrlPostTable}${tableName}/`, { headers: this.getAuthHeaders() });
  }
  createData(data, tableName) {
    return this.httpClient.post(`${this.baseUrlPostTable}${tableName}/`, data, { headers: this.getAuthHeaders() });
  }
  updateData(data, id: any, tableName) {
    return this.httpClient.put(`${this.baseUrlPostTable}${tableName}/${id}/`, data, { headers: this.getAuthHeaders() });
  }
  deleteData(id: any, tableName) {
    return this.httpClient.delete(`${this.baseUrlPostTable}${tableName}/${id}/`, { headers: this.getAuthHeaders() });
  }
  createPerson(person) {
    const body = person;
    return this.httpClient.post(`${this.baseUrlPerson}`, body, { headers: this.getAuthHeaders() });
  }
  updatePerson(person) {
    const body = person;
    return this.httpClient.put(`${this.baseUrlPerson}${person.userid}/`, body, { headers: this.getAuthHeaders() });
  }
  deleteUser(userid: any) {
    return this.httpClient.delete(`${this.baseUrlPerson}${userid}/`, { headers: this.getAuthHeaders() });
  }
  hiddenColumns() {
    return this.httpClient.get<any[]>(`${this.baseUrlHidden}`, { headers: this.headers })
  }
  loginUser(authData) {
    const body = JSON.stringify(authData);
    return this.httpClient.post(`${this.baseUrlAuth}`, body, { headers: this.headers })
  }
  registerUser(authData) {
    const body = JSON.stringify(authData);
    return this.httpClient.post(`${this.baseUrlRegister}`, body, { headers: this.headers })
  }


}
