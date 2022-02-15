import { FormGroup } from '@angular/forms';

export default function comparePasswordsValidator(
  passwordName: string,
  confirmPasswordName: string
): (formGroup: FormGroup) => void {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[passwordName];
    const confirmControl = formGroup.controls[confirmPasswordName];

    if (control.value !== confirmControl.value) {
      confirmControl.setErrors({ concurrence: true });
    }
  };
}
