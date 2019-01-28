import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddQuestionComponent } from './dialog-add-question.component';

describe('DialogAddQuestionComponent', () => {
  let component: DialogAddQuestionComponent;
  let fixture: ComponentFixture<DialogAddQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
