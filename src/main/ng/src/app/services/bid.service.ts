import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {StompService} from 'ng2-stomp-service';

@Injectable()
export class BidService {
  constructor(private stomp: StompService) {
    this.stomp.configure({host: '/stomp-websocket'});
    this.stomp.startConnect().then(() => console.log('ws connected'));
  }

  watchProduct(productId: number): Observable<any> {
    return Observable.create(observer => {
      console.log(`Subscribing to bids for ${productId}`)
      const subscription = this.stomp.subscribe(`/topic/bids/${productId}`, (data) => observer.next(data));

      return () => {
        console.log(`Unsubscribing to bids for ${productId}`)
        subscription.unsubscribe();
      };
    });
  }
}
