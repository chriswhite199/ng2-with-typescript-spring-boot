import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Product, ProductService, Review} from '../../services/product.service';
import {Subscription} from 'rxjs/Subscription';
import {BidService} from '../../services/bid.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  productId: number;
  product: Product = null;
  reviews: Review[] = null;

  currentBid: number;
  newComment = '';
  newRating = 0;

  isReviewHidden = true;
  isWatching = false;

  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private productService: ProductService, private bidService: BidService) {
    this.productId = parseInt(route.snapshot.params['productId']);
  }

  ngOnInit() {
    this.productService.getProductById(this.productId).subscribe(prod => {
        this.product = prod;
        this.currentBid = this.product.price;
      },
      error => console.error(error)
    );

    this.productService.getReviewsForProduct(this.productId).subscribe(
      reviews => this.reviews = reviews,
      error => console.error(error)
    );
  }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addReview() {
    const review = new Review(0, this.product.id, new Date(), 'Anonymous', this.newRating,
      this.newComment);
    this.reviews = [...this.reviews, review];
    this.product.rating = this.averageRating(this.reviews);

    this.resetForm();
  }

  averageRating(reviews: Array<Review>) {
    const sum = reviews.reduce((average, review) => average + review.rating, 0);
    return sum / reviews.length;
  }

  resetForm() {
    this.newRating = 0;
    this.newComment = '';
    this.isReviewHidden = true;
  }

  toggleWatchProduct() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.isWatching = false;
    } else {
      this.isWatching = true;
      this.subscription = this.bidService.watchProduct(this.product.id)
        .subscribe(
          bid => {
            this.currentBid = bid.newBid;
          },
          error => console.log(error)
        );
    }
  }
}
