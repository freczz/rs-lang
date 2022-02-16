import { ComponentFixture, TestBed } from '@angular/core/testing';

import ResultSprintComponent from './result-sprint.component';

describe('ResultSprintComponent', () => {
  let component: ResultSprintComponent;
  let fixture: ComponentFixture<ResultSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultSprintComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
