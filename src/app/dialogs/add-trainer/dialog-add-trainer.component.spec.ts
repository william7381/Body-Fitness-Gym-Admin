import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddTrainerComponent } from './dialog-add-trainer.component';

describe('DialogAddTrainerComponent', () => {
  let component: DialogAddTrainerComponent;
  let fixture: ComponentFixture<DialogAddTrainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddTrainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
