import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {StompService} from 'ng2-stomp-service';


import {AppComponent} from './app.component';
import {CarouselComponent} from './components/carousel/carousel.component';
import {FooterComponent} from './components/footer/footer.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ProductItemComponent} from './components/product-item/product-item.component';
import {SearchComponent} from './components/search/search.component';
import {StarsComponent} from './components/stars/stars.component';
import {ProductService} from './services/product.service';
import {CarouselModule} from 'ng2-bootstrap';
import {ProductDetailComponent} from './components/product-detail/product-detail.component';
import {HomeComponent} from './components/home/home.component';
import {RouterModule} from '@angular/router';
import {FilterPipe} from './pipes/filter.pipe';
import {BidService} from './services/bid.service';

@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
    FooterComponent,
    NavbarComponent,
    ProductItemComponent,
    SearchComponent,
    StarsComponent,
    ProductDetailComponent,
    HomeComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CarouselModule.forRoot(),
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'products/:productId', component: ProductDetailComponent}
    ])
  ],
  providers: [ProductService, StompService, BidService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
