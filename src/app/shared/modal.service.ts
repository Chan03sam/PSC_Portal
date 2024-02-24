// modal.service.ts
import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginModalComponent } from '../components/login-modal/login-modal.component';
import { BrgyIdComponent } from '../components/certs/brgy-id/brgy-id.component';
import { BrgyClearanceComponent } from '../components/certs/brgy-clearance/brgy-clearance.component';
import { BusinessClearanceComponent } from '../components/certs/business-clearance/business-clearance.component';
import { CertIndigencyComponent } from '../components/certs/cert-indigency/cert-indigency.component';
import { CertCohabitationComponent } from '../components/certs/cert-cohabitation/cert-cohabitation.component';
import { CertResidencyComponent } from '../components/certs/cert-residency/cert-residency.component';
import { CertGoodmoralComponent } from '../components/certs/cert-goodmoral/cert-goodmoral.component';
import { CertGuardianshipComponent } from '../components/certs/cert-guardianship/cert-guardianship.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalComponentMap: Record<string, any> = {
    '/brgy-id': BrgyIdComponent,
    '/brgy-clearance': BrgyClearanceComponent,
    '/business-clearance': BusinessClearanceComponent,
    '/cert-indigency': CertIndigencyComponent,
    '/cert-cohabitation': CertCohabitationComponent,
    '/cert-residency': CertResidencyComponent,
    '/cert-goodmoral': CertGoodmoralComponent,
    '/cert-guardianship': CertGuardianshipComponent,
  };

  constructor(public dialog: MatDialog) {}

  openLoginModal(): void {
    this.dialog.open(LoginModalComponent,{
      width: 'auto',
      height: 'auto'
    });
  }

  closeLoginModal(): void {
    this.dialog.closeAll();
  }

  openFormModal(formLink: string, formTitle: string): void {
    this.closeFormModal();
    const modalComponent = this.modalComponentMap[formLink];


    if (modalComponent) {
      const config: MatDialogConfig = {
        width: 'auto',
        height: 'auto',
        data: { formTitle }
      };

      this.dialog.open(modalComponent, config);
    } else {
      // Handle default case or show an error
      console.error('Invalid form link:', formLink);
    }
  }

  closeFormModal(): void {
    this.dialog.closeAll();
  }

}
