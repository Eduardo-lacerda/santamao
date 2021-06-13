import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OrcamentoService {
  constructor(private http: HttpClient) { }

  salvarOrcamento(body) {
    return this.http.post('/api/orcamento', body);
  }
}
