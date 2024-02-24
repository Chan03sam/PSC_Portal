import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrgyClearanceComponent } from './brgy-clearance.component';

describe('BrgyClearanceComponent', () => {
  let component: BrgyClearanceComponent;
  let fixture: ComponentFixture<BrgyClearanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrgyClearanceComponent]
    });
    fixture = TestBed.createComponent(BrgyClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
