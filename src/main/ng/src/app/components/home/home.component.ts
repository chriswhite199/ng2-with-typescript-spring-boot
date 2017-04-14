import {Component, OnInit} from '@angular/core';
import {Product, ProductService} from '../../services/product.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Observable<Array<Product>> = null;
  titleFilter: FormControl = new FormControl();
  filterCriteria: string;

  constructor(private prodSvc: ProductService) {
  }

  ngOnInit() {
    this.products = this.prodSvc.getProducts();

    this.titleFilter.valueChanges.debounceTime(100).subscribe(
      value => this.filterCriteria = value,
      error => console.error(error)
    );

    this.prodSvc.searchEvent.subscribe(
      params => this.products = this.prodSvc.search(params),
      console.error.bind(console), () => console.log('DONE'));
  }
}
