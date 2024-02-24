import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertGuardianshipComponent } from './cert-guardianship.component';

describe('CertGuardianshipComponent', () => {
  let component: CertGuardianshipComponent;
  let fixture: ComponentFixture<CertGuardianshipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertGuardianshipComponent]
    });
    fixture = TestBed.createComponent(CertGuardianshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
