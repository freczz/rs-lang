import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IFormData, IUserData } from 'src/app/interfaces/interfaces';
import RSLState from 'src/app/store/rsl.state';
import { Select, Store } from '@ngxs/store';
import comparePasswordsValidator from 'src/app/utilities/validators';
import { Observable } from 'rxjs';
import { SetRefreshToken, SetToken, SetUserDate, SetUserId } from 'src/app/store/rsl.action';
import { EMAIL_PATTERN, PASSWORD_MIN_LENGTH } from 'src/app/constants/constants';
import { getUserSetting, getUserStatistic } from 'src/app/utilities/server-requests';
import HttpService from './service/http.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export default class AuthPageComponent {
  newUserForm: FormGroup = this.formBuilder.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      password: [null, [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
      confirm: [null, [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
    },
    {
      validator: comparePasswordsValidator('password', 'confirm'),
    }
  );

  oldUserForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]),
  });

  error: string = '';

  isNewUser: boolean = true;

  userId: string = '';

  token: string = '';

  refreshToken: string = '';

  @Select(RSLState.userId) public userId$!: Observable<string>;

  @Select(RSLState.token) public token$!: Observable<string>;

  @Select(RSLState.refreshToken) public refreshToken$!: Observable<string>;

  constructor(
    private router: Router,
    private store: Store,
    public httpService: HttpService,
    private formBuilder: FormBuilder
  ) {}

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
          (): Promise<void> => this.signInUser(formData),
          (err: string): void => {
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
        this.userId = userData.userId as string;
        this.token = userData.token as string;
        this.refreshToken = userData.refreshToken as string;
        this.error = '';
        await this.router.navigate(['/']);
        this.store.dispatch(new SetUserId(this.userId));
        this.store.dispatch(new SetToken(this.token));
        this.store.dispatch(new SetRefreshToken(this.refreshToken));
        this.store.dispatch(new SetUserDate(+Date.now()));
        getUserSetting(this.store);
        getUserStatistic(this.store);
      },
      (err: string): void => {
        this.error = err;
      }
    );
  }
}
