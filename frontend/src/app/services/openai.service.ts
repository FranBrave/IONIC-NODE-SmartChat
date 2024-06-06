import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  constructor(private http: HttpClient) { }

  sendQuestion(prompt: string) {
    return this.http.post(environment.baseUrl, { prompt });
  }

}
