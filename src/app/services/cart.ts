import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addToCart(product: any): Observable<any> {
    const body = { productId: product._id, name: product.name, price: product.price };
    return this.http.post<any>(this.apiUrl, body);
  }
}