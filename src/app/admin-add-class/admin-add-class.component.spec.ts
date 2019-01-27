import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddClassComponent } from './admin-add-class.component';

describe('AdminAddClassComponent', () => {
  let component: AdminAddClassComponent;
  let fixture: ComponentFixture<AdminAddClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
