import { BASE_URL } from './environment.const';

export const commonEnvironment = {
  production: false,
  baseUrl: BASE_URL,

  // Login
  TFACode: BASE_URL + 'twoFactor/2faCode',

  agentBeneficiaryBankAccounts_checkBeneficiaryBankIsEditable:
    BASE_URL + 'agentBeneficiaryBankAccounts/checkBeneficiaryBankIsEditable/',
  forgetPasswordRequest: BASE_URL + '8000/auth/forgot-password',
  resetPassword: BASE_URL + 'resetPassword/reset',
  user: 'api/v1/user',

  //sahan API ------------------------------------------
  authenticate: BASE_URL + '8000/auth/login',
  refresh: BASE_URL + '8000/auth/refresh-token',
  getUsers: BASE_URL + '8000/auth/users',
  getUserdetailsMe: BASE_URL + '8000/auth/users/me',
  //privilages
  getRoles: BASE_URL + '8000/auth/roles/',
  getPrivileges: BASE_URL + '8000/auth/roles/permissions/',
  getUserDetails: BASE_URL + '8000/auth/users/me',

  //projects
  getProjects: BASE_URL + '8003/projects/',
  createproject: BASE_URL + '8003/projects',
  getProjectDetailsById: BASE_URL + '8003/projects/', //project Id
  updateProjectDetails: BASE_URL + '8003/projects/', //project Id
  deleteProjectDetails: BASE_URL + '8003/projects/', //project Id
  getProjectMembers: BASE_URL + '8003/projects/',

  //members
  getMembers: BASE_URL + '8003/projects/',
  createMember: BASE_URL + '8003/projects/',
  getMemberDetailsById: BASE_URL + '8003/members/', //member Id
  updateMemberDetails: BASE_URL + '8003/projects/', //member Id
  deleteMemberDetails: BASE_URL + '8003/members/', //member Id

  //setting
  getAllsettings: BASE_URL + '8003/projects/',

  //tasks
  getAllTaskList: BASE_URL + '8003/tasks/statuses',
  createNewTask: BASE_URL + '8003/tasks/',
  getProjectTasks: BASE_URL + '8003/tasks/',
  getTaskDetailsById: BASE_URL + '8003/tasks/',
  updateTaskDetails: BASE_URL + '8003/tasks/',
  deleteTaskDetails: BASE_URL + '8003/tasks/',
  updateTaskEndpoint: BASE_URL + '8003/tasks/',
  changeAssigneeEndpoint: BASE_URL + '8003/tasks/',

  //resources
  getAllresourcesList: BASE_URL + '8003/resources/',
  addNewResources: BASE_URL + '8003/resources/',
  getREsourcesData: BASE_URL + '8003/resources/',
  updateResources: BASE_URL + '8003/resources/',
  deleteResources: BASE_URL + '8003/resources/',

  //issues
  getAllissuesList: BASE_URL + '8003/qa/issues/',
  addNewIssues: BASE_URL + '8003/qa/issues/',
  getIssuesData: BASE_URL + '8003/qa/issues/',
  updateIssues: BASE_URL + '8003/qa/issues/',
  deleteIssues: BASE_URL + '8003/qa/issues/',

  //testcaes
  getAllTestCases: BASE_URL + '8003/qa/test-cases/',
  CreateTestCases: BASE_URL + '8003/qa/test-cases/',
  updateTestCases: BASE_URL + '8003/qa/test-cases/',
  deleteTestCases: BASE_URL + '8003/qa/test-cases/',

  //HR Management---------------------------------

  //employee
  getEmployees: BASE_URL + '8001/employees/',
  createEmployee: BASE_URL + '8001/employees/',
  getEmployeeDetailsById: BASE_URL + '8001/employees/',
  updateEmployeeDetails: BASE_URL + '8001/employees/',
  deleteEmployeeDetails: BASE_URL + '8001/employees/',

  //department
  getDepartments: BASE_URL + '8001/departments/',
  createDepartment: BASE_URL + '8001/departments/',
  updateDepartment: BASE_URL + '8001/departments/',
  deleteDepartment: BASE_URL + '8001/departments/',

  //positions
  getPositions: BASE_URL + '8001/positions/',
  createPosition: BASE_URL + '8001/positions/',
  getpositionDetailsById: BASE_URL + '8001/positions/',
  updatePosition: BASE_URL + '8001/positions/',
  deletePosition: BASE_URL + '8001/positions/',

  //leaves
  getLeavesAll: BASE_URL + '8001/leaves/',
  createLEaveRequest: BASE_URL + '8001/leaves/',
  getleaveDetailsById: BASE_URL + '8001/leaves/',
  updateLeaverequest: BASE_URL + '8001/leaves/',
  deletePLeave: BASE_URL + '8001/leaves/',

  //performance
  getPeroformanceAll: BASE_URL + '8001/performances/',
  getPeroformanceAllMe: BASE_URL + '8001/performances/me',
  createPerformance: BASE_URL + '8001/performances/',
  getPerformanceDetailsById: BASE_URL + '8001/performances/',
  updatePerformance: BASE_URL + '8001/performances/',
  deletePerformance: BASE_URL + '8001/performances/',
  getPerformancebyEmployee: BASE_URL + '8001/performances/employee/',
  readPeroformanceByMe: BASE_URL + '8001/performances/as-reviewer',

  //job posting
  getAllJobPosting: BASE_URL + '8001/job-postings/',
  createJobPosting: BASE_URL + '8001/job-postings/',
  getJobPostingDetailsById: BASE_URL + '8001/job-postings/',
  updateJobPosting: BASE_URL + '8001/job-postings/',
  deleteJobPosting: BASE_URL + '8001/job-postings/',

  //interview
  getAllInterviews: BASE_URL + '8001/interviews/',
  createnewInterview: BASE_URL + '8001/interviews/',
  getintrviewDetailsById: BASE_URL + '8001/interviews/',
  updateInterview: BASE_URL + '8001/interviews/',
  deleteInterview: BASE_URL + '8001/interviews/',

  //reports
  getFinancialSummary: BASE_URL + '8002/reports/summary',
  getProfitLossReport: BASE_URL + '8002/reports/profit-loss',
  getRevenueReport: BASE_URL + '8002/reports/revenue',
  getExpensesReport: BASE_URL + '8002/reports/expenses',
  getProjectFinanceReport: BASE_URL + '8002/reports/project/',

  //download API
  downloadReports: BASE_URL + '8006/api/files/download/{file_path}',

  //CRM------------------------------------
  //Activities
  getAllActivities: BASE_URL + '8004/activities/',
  createnewActivity: BASE_URL + '8004/activities/',
  getActivityDetailsById: BASE_URL + '8004/activities/',
  updateActivity: BASE_URL + '8004/activities/',
  deleteActivity: BASE_URL + '8004/activities/',

  //Communication
  getAllCommunications: BASE_URL + '8004/communications/',
  createnewCommunications: BASE_URL + '8004/communications/',
  getCommunicationsDetailsById: BASE_URL + '8004/communications/',
  updateCommunications: BASE_URL + '8004/communications/',
  deleteCommunications: BASE_URL + '8004/communications/',

  //Companies
  getAllCompanies: BASE_URL + '8004/companies/',
  createnewCompanies: BASE_URL + '8004/companies/',
  getCompaniesDetailsById: BASE_URL + '8004/companies/',
  updateCompanies: BASE_URL + '8004/companies/',
  deleteCompanies: BASE_URL + '8004/companies/',

  //Contacts
  getAllContacts: BASE_URL + '8004/contacts/',
  createnewContacts: BASE_URL + '8004/contacts/',
  getContactsDetailsById: BASE_URL + '8004/contacts/',
  updateContacts: BASE_URL + '8004/contacts/',
  deleteContacts: BASE_URL + '8004/contacts/',

  //Contracts
  getAllContracts: BASE_URL + '8004/contracts/',
  createnewContracts: BASE_URL + '8004/contacts/',
  getContractsDetailsById: BASE_URL + '8004/contacts/',
  updateContracts: BASE_URL + '8004/contacts/',
  deleteContracts: BASE_URL + '8004/contacts/',

  //deals
  getAllDeals: BASE_URL + '8004/deals/',
  createnewDeals: BASE_URL + '8004/deals/',
  getDealsDetailsById: BASE_URL + '8004/deals/',
  updateDeals: BASE_URL + '8004/deals/',
  deleteDeals: BASE_URL + '8004/deals/',

  //perposals
  getAllPerposals: BASE_URL + '8004/contracts/proposals',
  createnewPerposals: BASE_URL + '8004/contracts/proposals/',
  getPerposalsDetailsById: BASE_URL + '8004/contracts/proposals/',
  updatePerposals: BASE_URL + '8004/contracts/proposals/',
  deletePerposals: BASE_URL + '8004/contracts/proposals/',

  //finance API------------------------

  //budgets
  getAllBudgets: BASE_URL + '8002/budgets/',
  createnewBudgets: BASE_URL + '8002/budgets/',
  getBudgetsDetailsById: BASE_URL + '8002/budgets/',
  updateBudgets: BASE_URL + '8002/budgets/',
  deleteBudgets: BASE_URL + '8002/budgets/',

  //accounts
  getAllAccounts: BASE_URL + '8002/accounts/',
  createnewAccounts: BASE_URL + '8002/accounts/',
  getAccountsDetailsById: BASE_URL + '8002/accounts/',
  updateAccounts: BASE_URL + '8002/accounts/',
  deleteAccounts: BASE_URL + '8002/accounts/',

  //invoices
  getAllInvoices: BASE_URL + '8002/invoices/',
  createnewInvoices: BASE_URL + '8002/invoices/',
  getInvoicesDetailsById: BASE_URL + '8002/invoices/',
  updateInvoices: BASE_URL + '8002/invoices/',
  deleteInvoices: BASE_URL + '8002/invoices/',

  //expenses
  getAllExpenses: BASE_URL + '8002/expenses/',
  createnewExpenses: BASE_URL + '8002/expenses/',
  getExpensesDetailsById: BASE_URL + '8002/expenses/',
  updateExpenses: BASE_URL + '8002/expenses/',
  deleteExpenses: BASE_URL + '8002/expenses/',
};
