import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountingComponent } from './admin-accounting.component';

describe('AdminAccountingComponent', () => {
  let component: AdminAccountingComponent;
  let fixture: ComponentFixture<AdminAccountingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
