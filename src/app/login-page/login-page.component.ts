import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { UserAuth} from '../shared/interface';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../user.service";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  message: string;
  constructor(public userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }
  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const user: UserAuth = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    console.log(user);
    this.userService.login(user);
    this.form.reset();
    this.submitted = false;
    this.submitted = false;
  }
}
