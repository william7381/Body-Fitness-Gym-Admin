import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddScheduleComponent } from './dialog-add-schedule.component';

describe('DialogAddScheduleComponent', () => {
  let component: DialogAddScheduleComponent;
  let fixture: ComponentFixture<DialogAddScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
