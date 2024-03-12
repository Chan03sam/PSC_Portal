import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { RequestService } from 'src/app/services/request.service';
import { PostService } from 'src/app/services/post.service';
import { EventService } from 'src/app/services/event.service';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { interval } from 'rxjs';

// Register Chart.js components
Chart.register(...registerables);
// ... (import statements)
// ... (import statements)

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

  // Reference to the canvas element
  @ViewChild('totalUsersChartCanvas') totalUsersChartCanvas?: ElementRef;
  @ViewChild('digitalClock') digitalClockElement?: ElementRef;
  @ViewChild('rejectedRequestsChartCanvas') rejectedRequestsChartCanvas?: ElementRef;
  @ViewChild('pendingRequestsChartCanvas') pendingRequestsChartCanvas?: ElementRef;
  @ViewChild('approvedRequestsChartCanvas') approvedRequestsChartCanvas?: ElementRef;
  

  constructor(
    private requestService: RequestService,
    private postService: PostService,
    private eventService: EventService,
    private announcementService: AnnouncementService
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
    this.fetchTotalUsers();
    this.fetchTotalRequests();
    this.fetchPostCount();
    this.fetchEventCount();
    this.fetchAnnouncementCount();
    this.fetchRequestCounts();
    
  }

  async fetchTotalUsers() {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      this.totalUsers = querySnapshot.size;
      this.createCharts(); // Call createCharts after updating totalUsers
    } catch (err) {
      console.error('Error fetching total users:', err);
    }
  }

  fetchRequestCounts(): void {
    this.requestService.getPendingRequestsCount().subscribe((count) => {
      this.totalPendingRequests = count;
      this.createCharts();
    });

    this.requestService.getRejectedRequestsCount().subscribe((count) => {
      this.totalRejectedRequests = count;
      this.createCharts();
    });

    this.requestService.getApprovedRequestsCount().subscribe((count) => {
      this.totalApprovedRequests = count;
      this.createCharts();
    });
  }

  fetchTotalRequests() {
    this.requestService.getAllRequestsCount().subscribe((count) => {
      this.totalRequests = count;
    });
  }

  fetchPostCount() {
    this.postService.getPostCount().subscribe((count) => {
      this.totalPosts = count;
    });
  }

  fetchEventCount() {
    this.eventService.getEventCount().subscribe((count) => {
      this.totalEvents = count;
    });
  }

  fetchAnnouncementCount() {
    this.announcementService.getAnnouncementCount().subscribe((count) => {
      this.totalAnnouncements = count;
    });
  }

  createCharts(): void {
    // Reference to the canvas element
    const chartCtx = this.totalUsersChartCanvas!.nativeElement.getContext('2d');
    const rejectedRequestsChartCtx = this.rejectedRequestsChartCanvas!.nativeElement.getContext('2d');
    const pendingRequestsChartCtx = this.pendingRequestsChartCanvas!.nativeElement.getContext('2d');
    const approvedRequestsChartCtx = this.approvedRequestsChartCanvas!.nativeElement.getContext('2d');
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
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 159, 64, 0.2)',
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
            'rgba(255, 159, 64, 0.5)',
            'rgba(54, 162, 235, 0.5)',
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        }],
      },
    });

    new Chart(approvedRequestsChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Approved Requests', 'Total Requests - Approved'],
        datasets: [{
          label: 'Approved Requests',
          data: [this.totalApprovedRequests, this.totalRequests - this.totalApprovedRequests],
          backgroundColor: [
            'rgba(255, 159, 64, 0.5)',
            'rgba(54, 162, 235, 0.5)',
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        }],
      },
    });

    new Chart(rejectedRequestsChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Rejected Requests', 'Total Requests - Rejected'],
        datasets: [{
          label: 'Rejected Requests',
          data: [this.totalRejectedRequests, this.totalRequests - this.totalRejectedRequests],
          backgroundColor: [
            'rgba(255, 159, 64, 0.5)',
            'rgba(54, 162, 235, 0.5)',
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        }],
      },
    });
  }
  
}
