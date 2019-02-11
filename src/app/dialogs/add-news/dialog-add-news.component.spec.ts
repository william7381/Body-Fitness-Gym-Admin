import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddNewsComponent } from './dialog-add-news.component';

describe('DialogAddNewsComponent', () => {
  let component: DialogAddNewsComponent;
  let fixture: ComponentFixture<DialogAddNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
