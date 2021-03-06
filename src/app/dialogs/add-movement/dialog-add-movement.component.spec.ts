import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddMovementComponent } from './dialog-add-movement.component';

describe('DialogAddMovementComponent', () => {
  let component: DialogAddMovementComponent;
  let fixture: ComponentFixture<DialogAddMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
