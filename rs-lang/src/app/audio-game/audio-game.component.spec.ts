import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioGameComponent } from './audio-game.component';

describe('AudioGameComponent', () => {
  let component: AudioGameComponent;
  let fixture: ComponentFixture<AudioGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
