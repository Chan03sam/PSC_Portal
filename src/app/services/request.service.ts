import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { PDFDocument, rgb, PDFFont, StandardFontEmbedder} from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private firestore: AngularFirestore,
    private httpClient: HttpClient
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
    const pdfBytes = await this.httpClient.get('assets/templates/clearance_form.pdf', { responseType: 'arraybuffer' }).toPromise();
    
    if (!pdfBytes) {
      throw new Error('Failed to load PDF template.');
    }

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));

    const [page] = pdfDoc.getPages();

    const fontSize = 12;

      page.drawText(request.name, { x: 240, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.address, { x: 120, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.purpose, { x: 200, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.name, { x: 320, y: 180, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
    

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
      page.drawText(request.businessaddress, { x: 240, y:480, font: undefined, size: fontSize, color: rgb(0, 0, 0) });


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
      page.drawText(request.purpose, { x: 200, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.name, { x: 320, y: 180, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
    

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
      page.drawText(request.address, { x: 120, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.purpose, { x: 200, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.name, { x: 320, y: 180, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
    

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

      page.drawText(request.name, { x: 240, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.address, { x: 120, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.purpose, { x: 200, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.name, { x: 320, y: 180, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
    

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
      page.drawText(request.purpose, { x: 200, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.name, { x: 320, y: 180, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
    

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

      page.drawText(request.name, { x: 240, y: 506, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
      page.drawText(request.address, { x: 120, y: 491, font: undefined, size: fontSize, color: rgb(0, 0, 0) }); // Replace with the actual coordinates
      page.drawText(request.purpose, { x: 200, y: 445, font: undefined, size: fontSize, color: rgb(0, 0, 0) })
      page.drawText(request.name, { x: 320, y: 180, font: undefined, size: fontSize, color: rgb(0, 0, 0)});
    

    // Save the modified PDF as a Uint8Array
    const modifiedPdfBytes = await pdfDoc.save();
    return new Uint8Array(modifiedPdfBytes.buffer);
  }
}


