import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment'; // Import your environment configuration
import { initializeApp } from 'firebase/app'; // Import the initializeApp function from Firebase

if (environment.production) {
  enableProdMode();
}
// Initialize Firebase with your configuration
initializeApp(environment.firebase);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
