import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isLoggedIn = false;
  exposableId: any;
  loggedInUser: any;
  loggedInPassword: any;
  isCooperateUser: any;
  selectedData: any;
  selectedIndex: any;
  inputData: any;
  clickEventStatus: string | undefined;
  checkoutId: any;
  transactionReferenceNumber: any;
  senderName: any;
  transferredAmount: any;
  sendingCurrency: any;
  recipientCurrency: any;
  paymentResult: any;
  agentTransactionMasterId: any;
  customerBasicDetails: any;
  agentSenderDetailsEmail: any;
  selectedTranferFeeData: any;
  selectedRateSettings: any;
  transactionDetailId: any;
  agentCustomerTransactionData: any;
  agentSenderDetailsId: any;
  reportdata: any;
  reports: any;
  bankData: any;
  isBenEditable: any;
  isBankEditable: any;
  summaryReport: any;
  cashcommision: any;
  benificiaryDetailsID: any;
  selectedBeniID: any;
  beniCountryId: any;
  beniCountryID: any;
  BenificieryID: any;
  benificieryName: any;
  countryId: any;
  agentSenderId: any;
  personalbenId: any;
  corporatebenId: any;
  switchvalue: boolean = true;
  isSuccess: boolean = false;
  isCoporate: any;
  coporate: any;
  coporateUser: any;
  agentTransferCurrenciesId: any;
  contactId: any;
  agentId: any;
  senderData: any;
  beneficiaryData: any;
  sendingAmount: any;
  receivingAmount: any;
  transferAs: any;
  agentExposableId: any;
  sendingCurrencyData: any;
  userManagementSelectedIndex = 0;

  selectBankAccount: any;
  agentCurrencyRateId: any;
  beneficiaryId: any;
  notesData: any;
  transactionDetailsForAddNote: any;
  subAgent: any;
  agent: any;
  agentEmail: any;
  agentCorporateDetails: any = {};
  userName: any;
  transferdata: any;
  isBankEditabled: any;
  newIsActive: any;
  subAgentData: any;
  subAgentApprovalData: any;
  subAgentPendingData: any;
  subAgentDeclinedData: any;
  validationData: any;
  selectedBankId: any;
  newBenStatus: any;
  validationResult: any;
  beneficiaryViewData: any;
  senderMail: any;
  exposableIdMonex: any;
  transferFlowStepId: any;
  receivingCurrencyIdForBank: any;
  selectedBank: any;
  value: any;
  transferData: any;
  durationID: any;
  existingAgentCorporateDetails: any;
  saveAddBenifisaryData: any;
  FirstPageAgntValue: any;
  FirstPagesenderSearch: any;
  nameValue: any;
  saveAllAgentDetails: any;
  rate: any;
  isSendingAmount!: boolean;
  privilagesList: any = [];
  privilageCodes: any;
  totalamount: any;
  resetPasswordToken: any;
  resetPasswordUserDetails: any;
  saveClientCountryValue: any;
  saveSearchNameValue: any;
  agentEmailSelectBenefit: any;

  //sahan data
  sidebarItem: string = 'admin';
  projectData: any;
  userId: any;
  userDetails: any;
  permisions: any = {
    'activities:create': false,
    'activities:read': false,
    'activities:update': false,
    'activities:delete': false,
    'communications:create': false,
    'communications:read': false,
    'communications:update': false,
    'communications:delete': false,
    'companies:create': false,
    'companies:read': false,
    'companies:update': false,
    'companies:delete': false,
    'contracts:create': false,
    'contracts:read': false,
    'contracts:update': false,
    'contracts:delete': false,
    'contacts:create': false,
    'contacts:read': false,
    'contacts:update': false,
    'contacts:delete': false,
    'deals:create': false,
    'deals:read': false,
    'deals:update': false,
    'deals:delete': false,
    'accounts:create': false,
    'accounts:read': false,
    'accounts:update': false,
    'accounts:delete': false,
    'budgets:create': false,
    'budgets:read': false,
    'budgets:update': false,
    'budgets:delete': false,
    'expenses:create': false,
    'expenses:read': false,
    'expenses:update': false,
    'expenses:delete': false,
    'invoices:create': false,
    'invoices:read': false,
    'invoices:update': false,
    'invoices:delete': false,
    'reports:create': false,
    'reports:read': false,
    'reports:update': false,
    'reports:delete': false,
    'transactions:create': false,
    'transactions:read': false,
    'transactions:update': false,
    'transactions:delete': false,
    'departments:create': false,
    'departments:read': false,
    'departments:update': false,
    'departments:delete': false,
    'employees:create': false,
    'employees:read': false,
    'employees:update': false,
    'employees:delete': false,
    'interviews:create': false,
    'interviews:read': false,
    'interviews:update': false,
    'interviews:delete': false,
    'jobs:create': false,
    'jobs:read': false,
    'jobs:update': false,
    'jobs:delete': false,
    'leaves:create': false,
    'leaves:read': false,
    'leaves:update': false,
    'leaves:delete': false,
    'performance:create': false,
    'performance:read': false,
    'performance:update': false,
    'performance:delete': false,
    'positions:create': false,
    'positions:read': false,
    'positions:update': false,
    'positions:delete': false,
    'trainings:create': false,
    'trainings:read': false,
    'trainings:update': false,
    'trainings:delete': false,
    'projects:create': false,
    'projects:read': false,
    'projects:update': false,
    'projects:delete': false,
    'issues:create': false,
    'issues:read': false,
    'issues:update': false,
    'issues:delete': false,
    'resources:create': false,
    'resources:read': false,
    'resources:update': false,
    'resources:delete': false,
    'team:create': false,
    'team:read': false,
    'team:update': false,
    'team:delete': false,
  };

  hasPermission(permission: string): boolean {
  return this.permisions?.[permission] === true;
}
  constructor() {}
}
