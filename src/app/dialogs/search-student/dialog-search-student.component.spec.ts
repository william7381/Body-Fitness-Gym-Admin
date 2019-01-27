import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSearchStudentComponent } from './dialog-search-student.component';

describe('DialogSearchStudentComponent', () => {
  let component: DialogSearchStudentComponent;
  let fixture: ComponentFixture<DialogSearchStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSearchStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSearchStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
