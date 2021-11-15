import {Component, OnInit} from '@angular/core';
import {Good, Review} from "../shared/interface";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {GoodService} from "../good.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {OrderService} from "../order.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../alert.service";



@Component({
  selector: 'good',
  templateUrl: './good.component.html',
  styleUrls: ['./good.component.css']
})

export class GoodComponent implements OnInit {
  good: Observable<Good>;
  id: number;
  private response: any;
  count: number;
  form: FormGroup;
  submitted = false;
  reviews: Review[] = [];
  private subjR: BehaviorSubject<any> = new BehaviorSubject([]);
    private dSub: Subscription;
    mark = 0;


  constructor(private goodService: GoodService, private route: ActivatedRoute, private router: Router,
              private alert: AlertService, private orderService: OrderService) {
  }

  ngOnInit() {

    this.good = this.route.params
        .pipe(switchMap((params: Params) => {
          this.id = params.id;
          console.log(this.id);
          console.log(this.route.params);
          return this.goodService.getById(this.id);
        }));

    this.form = new FormGroup({
      mark: new FormControl(null, [Validators.required]),
      text: new FormControl(null, [Validators.required]),
        id: new FormControl(null),
    });
  }

  AddToCart(good: Good, count = 1) {
    this.orderService.AddToCart(good, count).subscribe(data => {
      this.response = data;
    });
      this.orderService.UpdateCart();
    this.router.navigate(['/basket']);
  }

  submit() {
     this.submitted = true;
    let review: Review = {
      mark: this.form.value.mark,
      text: this.form.value.text,
        id: this.form.value.id,
    };
    console.log(review);

     this.goodService.createReview(review, this.id).subscribe(() => {
    });
      this.form.reset();
      this.reloadComponent();
  }

    removeReview(review){
        this.dSub =this.goodService.removeRe(review).subscribe(() => {
            this.alert.danger('Отзыв был удалён');
        });
        this.reloadComponent();
    }

    openReviewEdit(review){
     if (review.author.id==localStorage.getItem('userId'))
        this.form = new FormGroup({
            mark: new FormControl( review.mark, [Validators.required]),
            text: new FormControl( review.text, [Validators.required]),
            id: new FormControl( review.id, [Validators.required]),
        });
        else{
         this.alert.danger('Вы не можете редактировать чужой комментарий');
         console.log('Вы не можете редактировать чужой комментарий');
        }
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

}
