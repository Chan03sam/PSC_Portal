import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { RequestService } from 'src/app/services/request.service';
import { PostService } from 'src/app/services/post.service';
import { EventService } from 'src/app/services/event.service';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { interval, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  totalUsers: number = 0;
  totalRequests: number = 0;
  totalPosts: number = 0;
  totalEvents: number = 0;
  totalAnnouncements: number = 0;
  totalPendingRequests: number = 0;
  totalRejectedRequests: number = 0;
  totalApprovedRequests: number = 0;
  brgy_clearance: number = 0;
  brgy_id: number = 0;
  business_clearance: number = 0;
  cert_indigency: number = 0;
  cert_cohab: number = 0;
  cert_residency: number = 0;
  cert_goodmoral: number = 0;
  cert_guardian: number = 0;
  totalEmployees: number = 0;


  // Reference to the canvas element
  @ViewChild('totalUsersChartCanvas') totalUsersChartCanvas?: ElementRef;
  @ViewChild('digitalClock') digitalClockElement?: ElementRef;
  @ViewChild('rejectedRequestsChartCanvas') rejectedRequestsChartCanvas?: ElementRef;
  @ViewChild('pendingRequestsChartCanvas') pendingRequestsChartCanvas?: ElementRef;
  @ViewChild('approvedRequestsChartCanvas') approvedRequestsChartCanvas?: ElementRef;
  @ViewChild('employeesChartCanvas') employeesChartCanvas?: ElementRef;
  @ViewChild('radarChartCanvas') radarChartCanvas?: ElementRef;
  
  constructor(
    private requestService: RequestService,
    private postService: PostService,
    private eventService: EventService,
    private announcementService: AnnouncementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.updateClock();
  }

  ngAfterViewInit(): void {
    this.fetchData();
  }

  updateClock(): void {
    interval(1000).subscribe(() => {
      if (this.digitalClockElement) {
        const now = new Date();
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        const clockText = `${hours}:${minutes}:${seconds} ${ampm}`;
        this.digitalClockElement.nativeElement.innerText = clockText;
      }
    });
  }

  fetchData(): void {
    const totalUsers$ = this.requestTotalUsers();
    const totalRequests$ = this.requestTotalRequests();
    const totalPosts$ = this.requestTotalPosts();
    const totalEvents$ = this.requestTotalEvents();
    const totalAnnouncements$ = this.requestTotalAnnouncements();
    const totalPendingRequests$ = this.requestTotalPendingRequests();
    const totalRejectedRequests$ = this.requestTotalRejectedRequests();
    const totalApprovedRequests$ = this.requestTotalApprovedRequests();
    const brgy_clearance$ = this.brgyclearance();
    const brgy_id$ = this.brgyid();
    const business_clearance$ = this.businessclearance();
    const cert_indigency$ = this.certindigency();
    const cert_cohab$ = this.certcohab();
    const cert_residency$ = this.certresidency();
    const cert_goodmoral$ = this.certgoodmoral();
    const cert_guardian$ = this.certguardian();
    const totalEmployees$ = this.totalEmp();
    

    combineLatest([
      totalUsers$,
      totalRequests$,
      totalPosts$,
      totalEvents$,
      totalAnnouncements$,
      totalPendingRequests$,
      totalRejectedRequests$,
      totalApprovedRequests$,
      brgy_id$,
      brgy_clearance$,
      business_clearance$,
      cert_indigency$,
      cert_cohab$,
      cert_residency$,
      cert_goodmoral$,
      cert_guardian$,
      totalEmployees$
    ]).subscribe(() => {
      this.createCharts();
    });
  }

  requestTotalUsers() {
    return this.authService.getAllUsersCount().pipe(map(count => this.totalUsers = count));
  }

  totalEmp() {
    return this.authService.getAllEmployeeCount().pipe(map(count => this.totalEmployees = count));
  }

  requestTotalRequests() {
    return this.requestService.getAllRequestsCount().pipe(map(count => this.totalRequests = count));
  }

  requestTotalPosts() {
    return this.postService.getPostCount().pipe(map(count => this.totalPosts = count));
  }

  requestTotalEvents() {
    return this.eventService.getEventCount().pipe(map(count => this.totalEvents = count));
  }

  requestTotalAnnouncements() {
    return this.announcementService.getAnnouncementCount().pipe(map(count => this.totalAnnouncements = count));
  }

  requestTotalPendingRequests() {
    return this.requestService.getPendingRequestsCount().pipe(map(count => this.totalPendingRequests = count));
  }

  requestTotalRejectedRequests() {
    return this.requestService.getRejectedRequestsCount().pipe(map(count => this.totalRejectedRequests = count));
  }

  requestTotalApprovedRequests() {
    return this.requestService.getApprovedRequestsCount().pipe(map(count => this.totalApprovedRequests = count));
  }

  brgyid() {
    return this.requestService.getBrgyIDRequestsCount().pipe(map(count => this.brgy_id = count));
  }
  brgyclearance() {
    return this.requestService.getBrgyClearanceRequestsCount().pipe(map(count => this.brgy_clearance = count));
  }
  businessclearance() {
    return this.requestService.getBusinessClearanceRequestsCount().pipe(map(count => this.business_clearance = count));
  }
  certindigency() {
    return this.requestService.getCertIndigencyRequestsCount().pipe(map(count => this.cert_indigency = count));
  }
  certcohab() {
    return this.requestService.getCertCohabRequestsCount().pipe(map(count => this.cert_cohab = count));
  }
  certresidency() {
    return this.requestService.getCertResidencyRequestsCount().pipe(map(count => this.cert_residency = count));
  }
  certgoodmoral() {
    return this.requestService.getCertGoodmoralRequestsCount().pipe(map(count => this.cert_goodmoral = count));
  }
  certguardian() {
    return this.requestService.getCertGuardianRequestsCount().pipe(map(count => this.cert_guardian = count));
  }

  createCharts(): void {
    // Reference to the canvas element
    const chartCtx = this.totalUsersChartCanvas?.nativeElement.getContext('2d');
    const rejectedRequestsChartCtx = this.rejectedRequestsChartCanvas?.nativeElement.getContext('2d');
    const pendingRequestsChartCtx = this.pendingRequestsChartCanvas?.nativeElement.getContext('2d');
    const approvedRequestsChartCtx = this.approvedRequestsChartCanvas?.nativeElement.getContext('2d');
    const EmployeesChartCtx = this.employeesChartCanvas?.nativeElement.getContext('2d');
    const radarChartCtx = this.radarChartCanvas?.nativeElement.getContext('2d');
    
    if (chartCtx && rejectedRequestsChartCtx && pendingRequestsChartCtx && approvedRequestsChartCtx && EmployeesChartCtx) {
      // Create the chart
      new Chart(chartCtx, {
        type: 'bar',
        data: {
          labels: ['Total Users', 'Total Requests', 'Total Posts', 'Total Events', 'Total Announcements'],
          datasets: [
            {
              label: 'Data Overview',
              data: [this.totalUsers, this.totalRequests, this.totalPosts, this.totalEvents, this.totalAnnouncements],
              backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 159, 64, 0.7)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
              borderRadius: 15,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(this.totalUsers, this.totalRequests, this.totalPosts, this.totalEvents, this.totalAnnouncements) + 1,
            },
          },
        },
      });

      new Chart(pendingRequestsChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Pending Requests', 'Total Requests - Pending'],
            datasets: [{
                label: 'Pending Requests',
                data: [this.totalPendingRequests, this.totalRequests - this.totalPendingRequests],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)', // Blue for pending requests
                    'rgba(128, 128, 128, 0.7)', // Gray for total requests - pending
                ],
                borderColor: [
                    'rgba(54, 162, 235, 0.7)', // Blue for pending requests
                    'rgba(128, 128, 128, 0.7)', // Gray for total requests - pending
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
    
    new Chart(approvedRequestsChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Approved Requests', 'Total Requests - Approved'],
            datasets: [{
                label: 'Approved Requests',
                data: [this.totalApprovedRequests, this.totalRequests - this.totalApprovedRequests],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)', // Green for approved requests
                    'rgba(128, 128, 128, 0.7)', // Gray for total requests - approved
                ],
                borderColor: [
                    'rgba(75, 192, 192, 0.7)', // Green for approved requests
                    'rgba(128, 128, 128, 0.7)', // Gray for total requests - approved
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
    
    new Chart(rejectedRequestsChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Rejected Requests', 'Total Requests - Rejected'],
            datasets: [{
                label: 'Rejected Requests',
                data: [this.totalRejectedRequests, this.totalRequests - this.totalRejectedRequests],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', // Red for rejected requests
                    'rgba(128, 128, 128, 0.7)', // Gray for total requests - rejected
                ],
                borderColor: [
                    'rgba(255, 99, 132, 0.7)', // Red for rejected requests
                    'rgba(128, 128, 128, 0.7)', // Gray for total requests - rejected
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
    
    new Chart(EmployeesChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Total Users', 'Total Users - Employees'],
            datasets: [{
                label: 'Rejected Requests',
                data: [this.totalEmployees, this.totalUsers - this.totalEmployees],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.7)', // Yellow for employees
                    'rgba(128, 128, 128, 0.7)', // Gray for total users - employees
                ],
                borderColor: [
                    'rgba(255, 159, 64, 0.7)', // Yellow for employees
                    'rgba(128, 128, 128, 0.7)', // Gray for total users - employees
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
    
    
    
      

 new Chart(radarChartCtx, {
      type: 'line',
      data: {
        labels: ['ID', 'Brgy Clearance', 'Business Clearance', 'Indigency', 'Cohabitation', 'Residency', 'Good-Moral', 'Guardianship'],
        datasets: [
          {
            label: 'Type of Documents Requested',
            data: [
              this.brgy_id,
              this.brgy_clearance,
              this.business_clearance,
              this.cert_indigency,
              this.cert_cohab,
              this.cert_residency,
              this.cert_goodmoral,
              this.cert_guardian,
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.7)',   // Blue
              'rgba(255, 99, 132, 0.7)',   // Red
              'rgba(255, 206, 86, 0.7)',   // Yellow
              'rgba(54, 162, 235, 0.7)',   // Sky blue
              'rgba(255, 159, 64, 0.7)',   // Orange
              'rgba(192, 192, 75, 0.7)',   // Olive
              'rgba(235, 162, 54, 0.7)',   // Brown
              'rgba(64, 159, 255, 0.7)',   // Aqua
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',     // Blue
              'rgba(255, 99, 132, 1)',     // Red
              'rgba(255, 206, 86, 1)',     // Yellow
              'rgba(54, 162, 235, 1)',     // Sky blue
              'rgba(255, 159, 64, 1)',     // Orange
              'rgba(192, 192, 75, 1)',     // Olive
              'rgba(235, 162, 54, 1)',     // Brown
              'rgba(64, 159, 255, 1)',     // Aqua
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(this.brgy_id + this.brgy_clearance + this.business_clearance + this.cert_indigency + this.cert_cohab + this.cert_residency + this.cert_goodmoral + this.cert_guardian) + 1,
          },
        },
      },
    });

    }
  }
}

