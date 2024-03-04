import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { PDFDocument, rgb, PDFFont, StandardFontEmbedder} from 'pdf-lib';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private firestore: AngularFirestore,
    private httpClient: HttpClient,
    private storage: AngularFireStorage
    ) {}

  addRequest(request: any) {
    return this.firestore.collection('requests').add(request);
  }

  getRequests(): Observable<any[]> {
    return this.firestore.collection('requests', ref => ref.orderBy('timestamp', 'desc')).valueChanges({ idField: 'id' });
  }

  updateRequestStatus(requestId: string, status: string): Promise<void> {
    return this.firestore.collection('requests').doc(requestId).update({ status });
  }


  async generateBrgyClearancePdf(request: any): Promise<Uint8Array> {
    const pdfBytes = await this.httpClient.get('assets/templates/brgy_clearance_form.pdf', { responseType: 'arraybuffer' }).toPromise();
    
    if (!pdfBytes) {
      throw new Error('Failed to load PDF template.');
    }

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));

    const [page] = pdfDoc.getPages();

    const fontSize = 12;

      page.drawText(request.name, { x: 240, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.address, { x: 120, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.purpose, { x: 200, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.name, { x: 350, y: 180, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      page.drawText(`${formattedDate}`, { x: 150, y: 420, font: undefined, size: fontSize, color: rgb(0, 0, 0) });

    // Save the modified PDF as a Uint8Array
    const modifiedPdfBytes = await pdfDoc.save();
    return new Uint8Array(modifiedPdfBytes.buffer);
  }
  async generateBusinessClearancePdf(request: any): Promise<Uint8Array> {
    const pdfBytes = await this.httpClient.get('assets/templates/business-clearance_form.pdf', { responseType: 'arraybuffer' }).toPromise();
    
    if (!pdfBytes) {
      throw new Error('Failed to load PDF template.');
    }

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));

    const [page] = pdfDoc.getPages();

    const fontSize = 12;

      page.drawText(request.name, { x: 170, y: 378,font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.business, { x: 240, y: 506, font: undefined})
      page.drawText(request.businessaddress, { x: 120, y:480, font: undefined, size: fontSize, color: rgb(0, 0, 0) });
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      page.drawText(`${formattedDate}`, { x: 425, y: 378, font: undefined, size: fontSize, color: rgb(0, 0, 0) });

    // Save the modified PDF as a Uint8Array
    const modifiedPdfBytes = await pdfDoc.save();
    return new Uint8Array(modifiedPdfBytes.buffer);
  }
  async generateIndigencyPdf(request: any): Promise<Uint8Array> {
    const pdfBytes = await this.httpClient.get('assets/templates/indigency_form.pdf', { responseType: 'arraybuffer' }).toPromise();
    
    if (!pdfBytes) {
      throw new Error('Failed to load PDF template.');
    }

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));

    const [page] = pdfDoc.getPages();

    const fontSize = 12;

      page.drawText(request.name, { x: 240, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.address, { x: 120, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.purpose, { x: 120, y: 439, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      page.drawText(`${formattedDate}`, { x: 170, y: 414, font: undefined, size: fontSize, color: rgb(0, 0, 0) });

    // Save the modified PDF as a Uint8Array
    const modifiedPdfBytes = await pdfDoc.save();
    return new Uint8Array(modifiedPdfBytes.buffer);
  }
  async generateCohabitationPdf(request: any): Promise<Uint8Array> {
    const pdfBytes = await this.httpClient.get('assets/templates/cohabitation_form.pdf', { responseType: 'arraybuffer' }).toPromise();
    
    if (!pdfBytes) {
      throw new Error('Failed to load PDF template.');
    }

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));

    const [page] = pdfDoc.getPages();

    const fontSize = 12;

      page.drawText(request.name, { x: 240, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.birthdate, { x: 470, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.partnersName, { x: 80, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.partnersBirthdate, { x: 310, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.spousesince, { x: 350, y: 430, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.address, { x: 70, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      page.drawText(`${formattedDate}`, { x: 150, y: 365, font: undefined, size: fontSize, color: rgb(0, 0, 0) });

    // Save the modified PDF as a Uint8Array
    const modifiedPdfBytes = await pdfDoc.save();
    return new Uint8Array(modifiedPdfBytes.buffer);
  }
  async generateResidencyPdf(request: any): Promise<Uint8Array> {
    const pdfBytes = await this.httpClient.get('assets/templates/residency_form.pdf', { responseType: 'arraybuffer' }).toPromise();
    
    if (!pdfBytes) {
      throw new Error('Failed to load PDF template.');
    }

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));

    const [page] = pdfDoc.getPages();

    const fontSize = 12;

      page.drawText(request.name, { x: 220, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.address, { x: 180, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) });
      page.drawText(request.yearsofresidency, { x: 100, y: 476, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.purpose, { x: 140, y: 438, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      page.drawText(`${formattedDate}`, { x: 140, y: 415, font: undefined, size: fontSize, color: rgb(0, 0, 0) });
    

    // Save the modified PDF as a Uint8Array
    const modifiedPdfBytes = await pdfDoc.save();
    return new Uint8Array(modifiedPdfBytes.buffer);
  }
  async generateGoodmoralPdf(request: any): Promise<Uint8Array> {
    const pdfBytes = await this.httpClient.get('assets/templates/goodmoral_form.pdf', { responseType: 'arraybuffer' }).toPromise();
    
    if (!pdfBytes) {
      throw new Error('Failed to load PDF template.');
    }

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));

    const [page] = pdfDoc.getPages();

    const fontSize = 12;

      page.drawText(request.name, { x: 240, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.address, { x: 120, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.purpose, { x: 115, y: 439, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      page.drawText(`${formattedDate}`, { x: 150, y: 415, font: undefined, size: fontSize, color: rgb(0, 0, 0) });

    // Save the modified PDF as a Uint8Array
    const modifiedPdfBytes = await pdfDoc.save();
    return new Uint8Array(modifiedPdfBytes.buffer);
  }
  async generateGuardianshipPdf(request: any): Promise<Uint8Array> {
    const pdfBytes = await this.httpClient.get('assets/templates/guardianship_form.pdf', { responseType: 'arraybuffer' }).toPromise();
    
    if (!pdfBytes) {
      throw new Error('Failed to load PDF template.');
    }

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));

    const [page] = pdfDoc.getPages();

    const fontSize = 12;

      page.drawText(request.name, { x: 180, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.address, { x: 120, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.childsname, { x: 200, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.childsbirthdate, { x: 200, y: 429, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.childsage, { x: 200, y: 415, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      page.drawText(`${formattedDate}`, { x: 150, y: 386, font: undefined, size: fontSize, color: rgb(0, 0, 0) });

    // Save the modified PDF as a Uint8Array
    const modifiedPdfBytes = await pdfDoc.save();
    return new Uint8Array(modifiedPdfBytes.buffer);
  }
}


