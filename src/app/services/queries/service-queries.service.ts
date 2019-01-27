import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {Accounting} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServiceQueries {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getMovements1() {
    return this.httpClient.get('/movimientos');
  }

  async getProducts() {
    let products = [];
    this.getMovements1().subscribe((data: any[]) => {
      console.log(data);
      return products = data;
    });
  }

  create(url, data: {}) {
    return this.httpClient.post(url, data);
  }

  read(url) {
    return this.httpClient.get(url);
  }

  read2(url) {
    return this.httpClient.get<Accounting[]>(url);
  }

  update(url, data: {}) {
    return this.httpClient.put(url, data);
  }

  delete(url, id: any) {
    return this.httpClient.delete(url + '/' + id, {responseType: 'text'});
  }
}
