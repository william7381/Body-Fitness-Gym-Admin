import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddSubscriptionComponent } from './dialog-add-subscription.component';

describe('DialogAddSubscriptionComponent', () => {
  let component: DialogAddSubscriptionComponent;
  let fixture: ComponentFixture<DialogAddSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
