import {Component, OnInit} from '@angular/core';
import {Good, Review, User} from "../shared/interface";
import { Observable, Subscription} from "rxjs";
import {GoodService} from "../good.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {OrderService} from "../order.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../alert.service";
import {UserService} from "../user.service";



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
    private dSub: Subscription;
    mark = 0;
    error: any;
    private userSub: Subscription;
    currentUser: User;

  constructor(private goodService: GoodService, private route: ActivatedRoute, private router: Router,
              private alert: AlertService, private orderService: OrderService, private userService: UserService) {
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
      text: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(80)]),
        id: new FormControl(null),
    });
  }

  AddToCart(good: Good, count = 1) {
    this.orderService.AddToCart(good, count).subscribe(data => {
      this.response = data;
    },
      error => {
          this.error = error.error.data;
          this.alert.warning(this.error);
      },
    );
      this.orderService.UpdateCart();
      setTimeout(()=>{  this.router.navigate(['/basket']);}, 2000);
  }

  submit() {
      if (localStorage.getItem('user-token') !== null) {
     this.submitted = true;
    let review: Review = {
      mark: this.form.value.mark,
      text: this.form.value.text,
        id: this.form.value.id,
    };
    console.log(review);

     this.goodService.createReview(review, this.id).subscribe(() => {
             this.form.reset();
             setTimeout(()=>{ this.reloadComponent();}, 2000);
    },
         error => {
             this.error = error.error.data;
             this.alert.warning(this.error);
             this.form.reset();
         }

    );}
      else{
          this.alert.warning('Чтобы оставить комментарий - авторизируйтесь!');
      }
  }

    removeReview(review) {
        this.userSub = this.userService.getCurrentUser()
            .subscribe(res => {
                this.currentUser = res;   console.log(this.currentUser);

                if (review.author.id == this.currentUser.id)
                {
                    this.dSub = this.goodService.removeRe(review).subscribe(() => {
                        this.alert.danger('Отзыв был удалён');
                    });
                    this.reloadComponent();
                }
                else{
                    this.alert.danger('Вы не можете удалить чужой комментарий');
                }

            });
    }

    openReviewEdit(review){
        this.userSub = this.userService.getCurrentUser()
            .subscribe(res => {
                this.currentUser = res;   console.log(this.currentUser);

                if (review.author.id==this.currentUser.id)
                    this.form = new FormGroup({
                        mark: new FormControl( review.mark, [Validators.required]),
                        text: new FormControl( review.text, [Validators.required]),
                        id: new FormControl( review.id, [Validators.required]),
                    });
                else{
                    this.alert.danger('Вы не можете редактировать чужой комментарий');
                    console.log('Вы не можете редактировать чужой комментарий');
                }

            });

    }

    checkAuth() {
        if (localStorage.getItem('user-token') !== null) {
            return true;
        }
        return false;
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

}
