import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertGoodmoralComponent } from './cert-goodmoral.component';

describe('CertGoodmoralComponent', () => {
  let component: CertGoodmoralComponent;
  let fixture: ComponentFixture<CertGoodmoralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertGoodmoralComponent]
    });
    fixture = TestBed.createComponent(CertGoodmoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
