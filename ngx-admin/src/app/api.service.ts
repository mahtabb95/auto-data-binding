import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CsrfTokenServiceService } from './csrf-token-service.service';
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

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(
    private httpClient: HttpClient,
    private csrfTokenService: CsrfTokenServiceService
  ) { }

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
    return this.httpClient.get(this.baseUrlPerson, { headers: this.headers });
  }
  getPipes() {
    return this.httpClient.get(this.baseUrlPipe, { headers: this.headers });
  }
  getTablesName() {
    return this.httpClient.get(this.baseUrlTable, { headers: this.headers });
  }

  getTableContent(tableName: string) {
    return this.httpClient.get<any[]>(`${this.baseUrlPostTable}${tableName}/`, { headers: this.headers });
  }
  createData(data, tableName) {
    return this.httpClient.post(`${this.baseUrlPostTable}${tableName}/`, data, { headers: this.headers });
  }
  updateData(data, tableName) {
    return this.httpClient.put(`${this.baseUrlPostTable}${tableName}/${data.id}/`, data, { headers: this.headers });
  }
  deleteData(id: any, tableName) {
    return this.httpClient.delete(`${this.baseUrlPostTable}${tableName}/${id}/`, { headers: this.headers });
  }
  createPerson(person) {
    const body = person;
    return this.httpClient.post(`${this.baseUrlPerson}`, body, { headers: this.headers });
  }
  updatePerson(person) {
    const body = person;
    return this.httpClient.put(`${this.baseUrlPerson}${person.userid}/`, body, { headers: this.headers });
  }
  deleteUser(userid: any) {
    return this.httpClient.delete(`${this.baseUrlPerson}${userid}/`, { headers: this.headers });
  }
  hiddenColumns() {
    return this.httpClient.get<any[]>(`${this.baseUrlHidden}`, { headers: this.headers })
  }

}
