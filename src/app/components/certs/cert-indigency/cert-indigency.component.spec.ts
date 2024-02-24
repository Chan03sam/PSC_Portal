import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertIndigencyComponent } from './cert-indigency.component';

describe('CertIndigencyComponent', () => {
  let component: CertIndigencyComponent;
  let fixture: ComponentFixture<CertIndigencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertIndigencyComponent]
    });
    fixture = TestBed.createComponent(CertIndigencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
