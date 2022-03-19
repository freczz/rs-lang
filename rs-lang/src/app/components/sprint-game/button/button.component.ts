import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
class ButtonComponent {
  @Input() text: string = '';

  @Input() color: string = '';

  @Input() bgColor: string = '';

  @Input() isActive: boolean = false;
}

export default ButtonComponent;
