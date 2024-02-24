import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertResidencyComponent } from './cert-residency.component';

describe('CertResidencyComponent', () => {
  let component: CertResidencyComponent;
  let fixture: ComponentFixture<CertResidencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertResidencyComponent]
    });
    fixture = TestBed.createComponent(CertResidencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
