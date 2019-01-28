import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuestionComponent } from './admin-question.component';

describe('AdminQuestionComponent', () => {
  let component: AdminQuestionComponent;
  let fixture: ComponentFixture<AdminQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
