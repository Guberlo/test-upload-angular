import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  postFile(file: File) {
    const formData = new FormData();
    formData.append("thumbnail", file);
    
    return this.http.post("/api/file-upload", formData);
  }
}
