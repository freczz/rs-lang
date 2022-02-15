import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IFormData, IUserData } from 'src/app/interfaces/interfaces';
import { RSLState } from 'src/app/store/rsl.state';
import { Select, Store } from '@ngxs/store';
import comparePasswordsValidator from 'src/app/utilities/validators';
import { Observable } from 'rxjs';
import { SetToken } from 'src/app/store/rsl.action';
import HttpService from './service/http.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export default class AuthPageComponent implements OnInit {
  newUserForm: FormGroup = this.formBuilder.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirm: [null, [Validators.required, Validators.minLength(8)]],
    },
    {
      validator: comparePasswordsValidator('password', 'confirm'),
    }
  );

  oldUserForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
  });

  error: string = '';

  isNewUser = true;

  token: string = '';

  @Select(RSLState.token) public token$!: Observable<string>;

  constructor(
    private router: Router,
    private store: Store,
    public httpService: HttpService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new SetToken(this.token));
  }

  togglePage(): void {
    this.newUserForm.reset();
    this.oldUserForm.reset();
    this.error = '';
    this.isNewUser = !this.isNewUser;
  }

  checkValidators(): void {
    this.newUserForm.get('name')?.markAsTouched();
    this.newUserForm.get('email')?.markAsTouched();
    this.newUserForm.get('password')?.markAsTouched();
    this.newUserForm.get('confirm')?.markAsTouched();
    this.oldUserForm.get('email')?.markAsTouched();
    this.oldUserForm.get('password')?.markAsTouched();
  }

  getProfile(formData: IFormData): void {
    if (this.newUserForm.valid || this.oldUserForm.valid) {
      if (this.isNewUser) {
        this.httpService.registerUser(formData).subscribe(
          () => this.signInUser(formData),
          (err) => {
            this.error = err;
          }
        );
      } else {
        this.signInUser(formData);
      }
    }
  }

  async signInUser(formData: IFormData): Promise<void> {
    this.httpService.signInUser(formData).subscribe(
      async (userData: IUserData): Promise<void> => {
        this.token = userData.token as string;
        const user = {
          userId: userData.userId as string,
          token: this.token,
          refreshToken: userData.refreshToken as string,
        };
        localStorage.setItem('userInfo', JSON.stringify(user));
        this.error = '';
        await this.router.navigate(['/']);

        this.store.dispatch(new SetToken(this.token));
      },
      (err) => {
        this.error = err;
      }
    );
  }
}
