import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReportService } from 'src/app/_services/finance/report.service';
import { BudgetsService } from 'src/app/_services/finance/budgets.service';
import { InvoicesService } from 'src/app/_services/finance/invoices.service';
import { ExpensesService } from 'src/app/_services/finance/expenses.service';
import { AccountsService } from 'src/app/_services/finance/accounts.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Register Chart.js components
Chart.register(...registerables);

interface FinanceDashboardData {
  total_invoices_count: number;
  total_expenses_count: number;
  total_budgets_count: number;
  total_transactions_count: number;
  total_accounts_count: number;
}

interface FinancialActivity {
  title: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'neutral';
  date: string;
}

interface TrendData {
  percentage: number;
  type: 'up' | 'down' | 'neutral';
  period: string;
}

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.sass'],
})
export class FinanceDashboardComponent implements OnInit, OnDestroy {
  // Debug mode flag
  debugMode = true;

  // Loading states
  isLoading = false;
  loadingRevenue = false;
  loadingInvoices = false;
  loadingExpenses = false;
  loadingFunds = false;
  loadingActivities = false;
  error: string | null = null;

  // Component lifecycle
  private componentDestroyed = false;

  // API Data
  private apiUrl = 'http://140.245.213.62:8002/dashboard/';
  dashboardData: FinanceDashboardData | null = null;

  // Computed properties for dynamic data binding
  get totalInvoices(): number {
    return this.dashboardData?.total_invoices_count ?? 0;
  }

  get totalExpenses(): number {
    return this.dashboardData?.total_expenses_count ?? 0;
  }

  get totalBudgets(): number {
    return this.dashboardData?.total_budgets_count ?? 0;
  }

  get totalTransactions(): number {
    return this.dashboardData?.total_transactions_count ?? 0;
  }

  get totalAccounts(): number {
    return this.dashboardData?.total_accounts_count ?? 0;
  }

  // KPI Data
  totalRevenue = 498000.0;
  outstandingInvoices = 251077.37;
  recentExpenseAmount = 0.0;
  availableFunds = 89750.25;

  // Trend Data
  revenueTrend: TrendData = { percentage: 18.2, type: 'up', period: 'MoM' };
  invoicesTrend: TrendData = { percentage: 15.0, type: 'up', period: 'WoW' };
  expensesTrend: TrendData = { percentage: 3.1, type: 'down', period: 'MoM' };
  fundsTrend: TrendData = {
    percentage: 15.0,
    type: 'up',
    period: 'Last 30 Days',
  };

  // Marketing Budget
  marketingBudget = {
    spent: 7800,
    total: 10000,
    percentage: 78,
  };

  progressColor = '#1890ff';

  // Recent Financial Activities
  recentFinancialActivities: FinancialActivity[] = [
    {
      title: 'Invoice Paid',
      description: 'Payment received for Project Alpha',
      amount: 1500.0,
      type: 'income',
      date: '2024-07-28',
    },
    {
      title: 'Expense Added',
      description: 'Software Subscription Renewal',
      amount: 120.0,
      type: 'expense',
      date: '2024-07-27',
    },
    {
      title: 'Invoice Sent',
      description: 'Invoice #UF2024-005 to Acme Corp',
      amount: 800.0,
      type: 'neutral',
      date: '2024-07-26',
    },
    {
      title: 'Budget Alert',
      description: 'Marketing budget 85% utilized',
      amount: 0,
      type: 'neutral',
      date: '2024-07-25',
    },
    {
      title: 'Payment Recorded',
      description: 'Vendor payment for Office Supplies',
      amount: 50.0,
      type: 'expense',
      date: '2024-07-24',
    },
    {
      title: 'Invoice Paid',
      description: 'Payment received for Consulting Services',
      amount: 2500.0,
      type: 'income',
      date: '2024-07-23',
    },
  ];

  upcomingReviews: any;
  recentActivities: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private reportService: ReportService,
    private budgetsService: BudgetsService,
    private invoicesService: InvoicesService,
    private expensesService: ExpensesService,
    private accountsService: AccountsService
  ) {
    if (this.debugMode) console.log('🔧 Finance Dashboard constructor called');
  }

  ngOnInit(): void {
    if (this.debugMode) console.log('🔧 Finance Dashboard ngOnInit called');

    try {
      this.initializeDefaults();

      if (!this.debugMode) {
        this.fetchDashboardData();
        this.loadFinanceDataOptimized();
      } else {
        console.log('🔧 Debug mode: Loading mock finance data');
        this.loadMockFinanceData();
      }
    } catch (error) {
      console.error('❌ Error in Finance ngOnInit:', error);
      this.error = 'Error initializing Finance Dashboard';
    }
  }

  ngOnDestroy(): void {
    if (this.debugMode) console.log('🔧 Finance Dashboard ngOnDestroy called');
    this.componentDestroyed = true;
  }

  private initializeDefaults(): void {
    if (this.debugMode) console.log('🔧 Initializing finance defaults');

    // Set safe default values
    this.dashboardData = {
      total_invoices_count: 0,
      total_expenses_count: 0,
      total_budgets_count: 0,
      total_transactions_count: 0,
      total_accounts_count: 0,
    };
  }

  private loadMockFinanceData(): void {
    if (this.debugMode) console.log('🔧 Loading mock finance data');

    this.dashboardData = {
      total_invoices_count: 17,
      total_expenses_count: 24,
      total_budgets_count: 5,
      total_transactions_count: 51,
      total_accounts_count: 4,
    };

    // Set additional mock data
    this.totalRevenue = 498000.0;
    this.outstandingInvoices = 251077.37;
    this.recentExpenseAmount = 50000.0;
    this.availableFunds = 89750.25;

    console.log('✅ Mock finance data loaded');
  }

  fetchDashboardData(): void {
    if (this.debugMode) console.log('🔧 Fetching Finance dashboard data...');

    this.isLoading = true;
    this.error = null;

    this.http.get<FinanceDashboardData>(this.apiUrl).subscribe({
      next: (data) => {
        if (this.debugMode) console.log('✅ Finance Data received:', data);
        this.dashboardData = data;
        this.isLoading = false;

        // Load additional data after dashboard data is received
        if (!this.componentDestroyed) {
          this.loadFinanceDataOptimized();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Finance API Error:', error);
        this.isLoading = false;
        this.error = `Finance API Error: ${error.status} - ${error.message}`;

        // Load mock data as fallback
        this.loadMockFinanceData();
      },
    });
  }

  // OPTIMIZED: Removed all setTimeout calls and use parallel loading with forkJoin
  private loadFinanceDataOptimized(): void {
    if (this.debugMode) console.log('🔧 Loading finance data (optimized)...');

    this.isLoading = true;

    // Load all data in parallel instead of sequential setTimeout calls
    const budgets$ = this.budgetsService
      .getAllBudgets({ skip: 0, limit: 5 })
      .pipe(
        catchError((error) => {
          console.error('❌ Error loading budgets:', error);
          return of({ data: [] });
        })
      );

    const invoices$ = this.invoicesService
      .getAllInvoices({ skip: 0, limit: 10 })
      .pipe(
        catchError((error) => {
          console.error('❌ Error loading invoices:', error);
          return of({ data: [] });
        })
      );

    const expenses$ = this.expensesService
      .getAllExpenses({ skip: 0, limit: 10 })
      .pipe(
        catchError((error) => {
          console.error('❌ Error loading expenses:', error);
          return of({ data: [] });
        })
      );

    // Use forkJoin to load all data simultaneously (MUCH FASTER than sequential setTimeout)
    forkJoin({
      budgets: budgets$,
      invoices: invoices$,
      expenses: expenses$,
    }).subscribe({
      next: (results) => {
        if (this.componentDestroyed) return;

        try {
          this.processFinanceData(results);
          console.log('✅ All finance data loaded successfully');
        } catch (error) {
          console.error('❌ Error processing finance data:', error);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading finance data:', error);
        this.isLoading = false;
      },
    });
  }

  private processFinanceData(results: any): void {
    // Process budgets (revenue)
    if (results.budgets?.data?.length > 0) {
      this.totalRevenue = results.budgets.data.reduce(
        (sum: number, budget: any) => sum + (budget.amount || 0),
        0
      );
      if (this.debugMode)
        console.log('✅ Revenue calculated:', this.totalRevenue);
    }

    // Process invoices (outstanding)
    if (results.invoices?.data?.length > 0) {
      this.outstandingInvoices = results.invoices.data
        .filter((invoice: any) => invoice.status !== 'paid')
        .reduce((sum: number, invoice: any) => sum + (invoice.amount || 0), 0);
      if (this.debugMode)
        console.log(
          '✅ Outstanding invoices calculated:',
          this.outstandingInvoices
        );
    }

    // Process expenses (recent)
    if (results.expenses?.data?.length > 0) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      this.recentExpenseAmount = results.expenses.data
        .filter((expense: any) => new Date(expense.date) >= thirtyDaysAgo)
        .reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);
      if (this.debugMode)
        console.log('✅ Recent expenses calculated:', this.recentExpenseAmount);
    }

    // Calculate available funds
    this.availableFunds = this.totalRevenue - this.recentExpenseAmount;
    if (this.debugMode)
      console.log('✅ Available funds calculated:', this.availableFunds);
  }

  // REMOVED: All the old loadXXXData methods with setTimeout

  // Navigation methods
  navigateToReports(): void {
    this.router.navigate(['/finance/reports']);
  }

  navigateToInvoices(): void {
    this.router.navigate(['/finance/invoices']);
  }

  navigateToExpenses(): void {
    this.router.navigate(['/finance/expenses']);
  }

  navigateToAccounts(): void {
    this.router.navigate(['/finance/accounts']);
  }

  navigateToBudgets(): void {
    this.router.navigate(['/finance/budgets']);
  }

  navigateToTransactions(): void {
    this.router.navigate(['/finance/transactions']);
  }

  // Activity methods
  viewAllActivities(): void {
    this.router.navigate(['/finance/activities']);
  }

  // Quick Action methods
  addNewExpense(): void {
    this.router.navigate(['/finance/expenses/new']);
  }

  createNewInvoice(): void {
    this.router.navigate(['/finance/invoices/new']);
  }

  recordPayment(): void {
    this.router.navigate(['/finance/payments/new']);
  }

  generateReport(): void {
    this.router.navigate(['/finance/reports/generate']);
  }
}
