import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit {

  constructor(private readonly authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    this.authService.login({ email: '', password: '' });
  }

}
