import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

// Register all Chart.js components
Chart.register(...registerables);

interface Task {
  task: string;
  start: Date;
  end: Date;
  progress: number;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.sass'],
})
export class TimelineComponent implements OnInit, AfterViewInit {
  @ViewChild('ganttChart') ganttChart!: ElementRef;
  chart: any;

  // Sample project data
  projectData = {
    tasks: [
      {
        task: 'Project Planning',
        start: new Date('2025-07-01'),
        end: new Date('2025-07-10'),
        progress: 100,
      },
      {
        task: 'Design Phase',
        start: new Date('2025-07-11'),
        end: new Date('2025-07-20'),
        progress: 75,
      },
      {
        task: 'Development',
        start: new Date('2025-07-15'),
        end: new Date('2025-07-30'),
        progress: 50,
      },
      {
        task: 'Testing',
        start: new Date('2025-07-25'),
        end: new Date('2025-08-05'),
        progress: 25,
      },
      {
        task: 'Deployment',
        start: new Date('2025-08-05'),
        end: new Date('2025-08-10'),
        progress: 0,
      },
    ] as Task[],
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createGanttChart();
  }

  createGanttChart(): void {
    const ctx = this.ganttChart.nativeElement.getContext('2d');

    // Calculate date range for the chart
    const startDate = new Date(
      Math.min(...this.projectData.tasks.map((t) => t.start.getTime()))
    );
    const endDate = new Date(
      Math.max(...this.projectData.tasks.map((t) => t.end.getTime()))
    );

    // Prepare data for the chart
    const data = {
      labels: this.projectData.tasks.map((t) => t.task),
      datasets: [
        {
          label: 'Project Timeline',
          data: this.projectData.tasks.map((t) => ({
            x: [t.start, t.end],
            y: t.task,
            progress: t.progress,
          })),
          backgroundColor: this.projectData.tasks.map(
            (t) => `rgba(54, 162, 235, ${t.progress / 100})`
          ),
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
          barPercentage: 0.5,
        },
      ],
    };

    // Chart configuration
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM d',
              },
            },
            min: startDate.toISOString(),
            max: endDate.toISOString(),
            title: {
              display: true,
              text: 'Timeline',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Tasks',
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const task = this.projectData.tasks[context.dataIndex];
                return [
                  `Start: ${format(task.start, 'MMM d, yyyy')}`,
                  `End: ${format(task.end, 'MMM d, yyyy')}`,
                  `Progress: ${task.progress}%`,
                ];
              },
            },
          },
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Project Timeline',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
      },
    });
  }
}
