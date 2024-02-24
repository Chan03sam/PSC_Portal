import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ModalService } from 'src/app/shared/modal.service';
import { AuthService } from "src/app/shared/auth.service";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from 'src/app/shared/profile.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    panelVisible1 = false;
    panelVisible2 = false;
    role = '';
    profileImageURL: string = '';
    private profileImageURLSource = new BehaviorSubject<string>('');
    profileImageURL$ = this.profileImageURLSource.asObservable();
    emailVerified: boolean | null = null;

    constructor(
        private router: Router,
        private modalService: ModalService,
        public authService: AuthService,
        private auth: AuthService,
        public afAuth: AngularFireAuth,
        private profileService: ProfileService
        ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setActiveLink(event.url);
            }
        });
        
    }
    setProfileImageURL(url: string) {
        this.profileImageURLSource.next(url);
    }
    
    togglePanel1() {
    this.panelVisible1 = !this.panelVisible1;
    if (this.panelVisible2) {
        this.panelVisible2 = false;
    }
    }
    togglePanel2() {
    this.panelVisible2 = !this.panelVisible2;
    if (this.panelVisible1) {
        this.panelVisible1 = false;
    }
    }

    

    logout(){
        this.auth.logout(); 
        this.closePanel1();
    }

    openLoginModal(): void {
        this.modalService.closeLoginModal();
        this.modalService.openLoginModal();
    }
    closePanel1() {
        this.panelVisible1 = false; 
    }

    ngOnInit() {
        this.checkLoginStatus();

        this.profileService.profileImageURL$.subscribe((url) => {
            this.profileImageURL = url;
        });

    }
    
    checkLoginStatus() {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/']);
        }
    }
    
    setActiveLink(url: string) {
        const homeLink = document.getElementById('home-link');
        const aboutLink = document.getElementById('about-link');
        const formsLink = document.getElementById('forms-link'); 
        const historyLink = document.getElementById('history-link');
        const dashboardLink = document.getElementById('dashboard');
        const employeeLink = document.getElementById('employee-link');
        const userLink = document.getElementById('user-link');
        const auditLink = document.getElementById('audit-link');
        const requestsLink = document.getElementById('request-link');


        // Remove the "active" class from all links
        homeLink?.classList.remove('active');
        aboutLink?.classList.remove('active');
        formsLink?.classList.remove('active'); 
        dashboardLink?.classList.remove('active');
        employeeLink?.classList.remove('active'); 
        userLink?.classList.remove('active');
        auditLink?.classList.remove('active'); 
        requestsLink?.classList.remove('active'); 


        // Add the "active" class to the appropriate link based on the current URL
        if (url === '/') {
            homeLink?.classList.add('active');
        } else if (url === '/about') {
            aboutLink?.classList.add('active');
        } else if (url === '/forms') { // Add Forms route
            formsLink?.classList.add('active');
        } else if (url === '/history') { // Add History route
            historyLink?.classList.add('active');
        } else if (url === '/dashboard') { // Add History route
            dashboardLink?.classList.add('active');
        } else if (url === '/requests') { // Add History route
            employeeLink?.classList.add('active');
        } else if (url === '/employee-accounts') { // Add History route
            userLink?.classList.add('active');
        } else if (url === '/user-accounts') { // Add History route
            auditLink?.classList.add('active');
        } else if (url === '/audit-trail') { // Add History route
            auditLink?.classList.add('active');
        }
    }

    resetActiveLink() {
        const navLinks = document.querySelectorAll('.nav-link'); // Add a common class to all navigation links
        navLinks.forEach((link) => {
            link.classList.remove('active');
        });
    }    

    isActive(route: string) {
        return this.router.url === route;
    }

    setActive(route: string) {
        if (!this.isActive(route)) {
            this.router.navigateByUrl(route);
        }
    }
}