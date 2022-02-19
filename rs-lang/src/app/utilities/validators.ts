import { AbstractControl, FormGroup } from '@angular/forms';

export default function comparePasswordsValidator(
  passwordName: string,
  confirmPasswordName: string
): (formGroup: FormGroup) => void {
  return (formGroup: FormGroup): void => {
    const control: AbstractControl = formGroup.controls[passwordName];
    const confirmControl: AbstractControl = formGroup.controls[confirmPasswordName];

    if (control.value !== confirmControl.value) {
      confirmControl.setErrors({ concurrence: true });
    }
  };
}
