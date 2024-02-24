import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessClearanceComponent } from './business-clearance.component';

describe('BusinessClearanceComponent', () => {
  let component: BusinessClearanceComponent;
  let fixture: ComponentFixture<BusinessClearanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessClearanceComponent]
    });
    fixture = TestBed.createComponent(BusinessClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
