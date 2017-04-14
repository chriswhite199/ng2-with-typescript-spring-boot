import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, URLSearchParams} from '@angular/http';

export class Product {
  constructor(public id: number,
              public title: string,
              public price: number,
              public rating: number,
              public description: string,
              public categories: Array<string>) {
  }
}

export class Review {
  constructor(public id: number,
              public productId: number,
              public timestamp: Date,
              public user: string,
              public rating: number,
              public comment: string) {
  }
}

export class ProductSearchParams {
  constructor(public title: string,
              public price: number,
              public category: string) {
  }
}

@Injectable()
export class ProductService {
  searchEvent: EventEmitter<ProductSearchParams> = new EventEmitter();

  constructor(private http: Http) {
  }

  getProducts(): Observable<Array<Product>> {
    return this.http.get('/api/products').map(response => response.json());
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get(`/api/products/${productId}`).map(response => response.json());
  }

  getReviewsForProduct(productId: number): Observable<Array<Review>> {
    return this.http.get(`/api/products/${productId}/reviews`)
      .map(response => response.json())
      .map(reviews => reviews.map(r => new Review(r.id, r.productId, new Date(r.timestamp), r.user, r.rating, r.comment)
      ));
  }

  search(params: ProductSearchParams): Observable<Array<Product>> {
    const searchParams = this.encodeParams(params);
    return this.http.get('/api/products', {search: searchParams})
      .map(response => response.json());
  }

  encodeParams(params: ProductSearchParams): URLSearchParams {
    return Object.keys(params)
      .filter(key => params[key] && params[key] !== '-1')
      .reduce((accum: URLSearchParams, key: string) => {
        accum.set(key, params[key]);
        return accum;
      }, new URLSearchParams());
  }

  getAllCategories(): Observable<Array<string>> {
    return this.http.get('/api/categories').map(response => response.json());
  }
}
