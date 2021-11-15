
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from "../shared/interface";
import {Router} from '@angular/router';
import {AlertService} from "../alert.service";
import {UserService} from "../user.service";



@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  message: string;
  form: FormGroup;
  submitted = false;

  constructor(
      private router: Router,
      private Alert: AlertService,
      private userService: UserService,

  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      first_name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      last_name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(50)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
      country: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      city: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    });

  }


  submit() {
    if (this.form.invalid) {
      return this.Alert.success('Вы не правильно заполнили форму');
    }

    this.submitted = true;
    this.Alert.success('Вы успешно зарегистрировались');
    const user: User = {
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      email: this.form.value.email,
      password: this.form.value.password,
      phone: this.form.value.phone,
      country: this.form.value.country,
      city: this.form.value.city,
    };


    this.userService.register(user);
    this.form.reset();
    this.router.navigate(['login']);
    this.submitted = false;
  }
}
