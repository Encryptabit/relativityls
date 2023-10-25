import { Injectable } from '@angular/core';
import { License } from '../models/license.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LicenseService {
  constructor(private httpClient: HttpClient) {}

  getLicenseInformation(filename: string) {
    return this.httpClient.get<License[]>(`${environment.baseURL + filename}`);
  }
}
