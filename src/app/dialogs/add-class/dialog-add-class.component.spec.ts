import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddClassComponent } from './dialog-add-class.component';

describe('DialogAddClassComponent', () => {
  let component: DialogAddClassComponent;
  let fixture: ComponentFixture<DialogAddClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
