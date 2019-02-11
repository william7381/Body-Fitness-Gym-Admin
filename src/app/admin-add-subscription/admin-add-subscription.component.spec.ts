import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddSubscriptionComponent } from './admin-add-subscription.component';

describe('AdminAddSubscriptionComponent', () => {
  let component: AdminAddSubscriptionComponent;
  let fixture: ComponentFixture<AdminAddSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
