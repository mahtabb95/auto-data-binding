import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
interface TokenObj {
  token: string;
}
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;


  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // const token = this.cookieService.get('token');
    // console.log("token: ", token)
    // if (token) {
    //   this.router.navigate(['pages/layout/list'])
    // }
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

  }
  onSubmit() {
    console.log("dada")
    if (this.loginForm.invalid) {
      alert("Invalid form")
    }
    this.apiService.loginUser(this.loginForm.value).subscribe((data: TokenObj) => {
      console.log(data);
      this.cookieService.set('token', data.token);
      this.router.navigate(['pages/layout/list'])
    },
      error => console.log(error),
    );

  }

}
