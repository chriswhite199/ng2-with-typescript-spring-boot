import {Component} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  formModel: FormGroup;
  categories: Observable<string[]>;

  constructor(private productService: ProductService) {
    this.categories = productService.getAllCategories();

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'title': [null, Validators.minLength(3)],
      'price': [null, this.positiveNumberValidator],
      'category': [-1]
    });
  }

  positiveNumberValidator(control: FormControl): any {
    if (!control.value) {
      return null;
    } else {
      const price = parseInt(control.value);
      return price === null || typeof price === 'number' && price > 0
        ? null : {'positivenumber': true};
    }
  }

  onSearch() {
    if (this.formModel.valid) {
      this.productService.searchEvent.emit(this.formModel.value);
    }
  }

}
