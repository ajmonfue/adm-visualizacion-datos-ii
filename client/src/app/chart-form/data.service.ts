import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(
        private http: HttpClient
    ) {}

    getFromUrl(url: string) {
        return this.http.get(url, {responseType: 'text'});
    }
}