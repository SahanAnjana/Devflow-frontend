import { BASE_URL } from './environment.const';

export const commonEnvironment = {
  production: false,
  baseUrl: BASE_URL,

  // Login
  TFACode: BASE_URL + 'twoFactor/2faCode',

  agentBeneficiaryBankAccounts_checkBeneficiaryBankIsEditable:
    BASE_URL + 'agentBeneficiaryBankAccounts/checkBeneficiaryBankIsEditable/',
  forgetPasswordRequest: BASE_URL + 'resetPassword/request',
  resetPassword: BASE_URL + 'resetPassword/reset',
  user: 'api/v1/user',

  //Report
  getAgentDetailsExposableId: BASE_URL + 'agentSender/getExposableIdByUsername', //reusable Api
  agentBanks_getAgentBankDetails: BASE_URL + 'agentBanks/getAgentBankDetails',
  agentBeneficiaryDetails_getBasicDetailsByBeneficiaryId:
    BASE_URL + 'agentDetails/getExposableId', //reusable Api

  transferNotes_save: BASE_URL + '/transferNotes/save',
  nationality: BASE_URL + '/nationality/',
  countryCode: BASE_URL + '/countryCode/',
  clientCurrency_MN: BASE_URL + 'clientCurrency/',
  agentTransaction_details: BASE_URL + '/agentTransaction/details/',
  bankDetails_byExposableIdAndCountryId:
    BASE_URL + 'bankDetails/byExposableIdAndCountryId/',

  transferNotes_getAll: BASE_URL + '/transferNotes/getAll/',
  country_byExposableId: BASE_URL + '/country/byExposableId/',
  agentTransaction_volumeSummary: BASE_URL + '/agentTransaction/volumeSummary/',
  agentBeneficiaryDetails_update: BASE_URL + 'agentBeneficiaryDetails/update',
  agentBanks_update: BASE_URL + 'agentBanks/update/',
  payBillTransaction: BASE_URL + 'v1/payBillTransaction/getAll',

  bankDetailsbyExposableIdAndCountryId:
    BASE_URL + '/bankDetails/byExposableIdAndCountryId/',
  reports_summaryReportWithAgent: BASE_URL + 'reports/summaryReportWithAgent',
  agentTransaction_checkIs:
    BASE_URL + 'agentTransaction/checkIsBeneficiaryEditable/',
  currency: BASE_URL + 'currency/',
  userType: BASE_URL + 'userType/',
  country: BASE_URL + 'country/',
  transactionMode: BASE_URL + 'transactionMode/',
  report_cashCollectorCollectedCashDetailsReportView:
    BASE_URL + 'report/cashCollectorCollectedCashDetailsReportView',
  client_allForReport: BASE_URL + 'client/allForReport',
  reports_summaryReportWithAgent_cardetails:
    BASE_URL + 'reports/summaryReportWithAgent/cardDetails',
  agentTransactionDetails_getUpdatedAgentTransaction_Details:
    BASE_URL + '/agentTransactionDetails/getUpdatedAgentTransactionDetails/',

  //Dashboard
  user_privileges: BASE_URL + '/user/privileges/',
  transaction_getCountByClientCode_clientCode_range:
    BASE_URL + '/transaction/getCountByClientCode',
  transaction_count: BASE_URL + 'transaction/countNotification',
  get_User_Count: BASE_URL + 'user/getUserCount',
  OPT_client_getClientDetails_clientcode_isActive:
    BASE_URL + '/client/getClientDetails/',
  OPT_client_client_code: BASE_URL + '/client/getDetail/',
  getTransactionNotifications: BASE_URL + 'transaction/countNotification/MN',
  // Communication
  getAllCommunication: BASE_URL + '/bulkEmail/search',
  getAgentDetails: BASE_URL + '/agentDetails/getAll',
  agentSenderCustomer: BASE_URL + '/agentSender/allagentCustomer',
  agentSender: BASE_URL + 'agentSender/getAgentSenderDetailsByCriteria/',
  agentSender2: BASE_URL + 'agentSender/',
  get_agent_customer: BASE_URL + 'agentSender/search',
  enableCoporateAccount: BASE_URL + 'agentSender/enableCoporateAccount/',
  sendMail: BASE_URL + '/bulkEmail/sendEmail',

  //diagnostic
  loginDetails: BASE_URL + '/v1/auth/user/loginDetails',
  transferFlowDataAll: BASE_URL + '/transferFlowStep/getAllTransferFlowStep',
  customerTransferFlow: BASE_URL + '/agentCustomerBasicInfo/',
  getAllTransferFlowStepById:
    BASE_URL + '/transferFlowStep/getAllTransferFlowStepById/',
  getDualRegistration:
    BASE_URL + '/dualRegistration/getAllDualRegistretedSenders',
  dualRegistrationPopupData:
    BASE_URL + '/dualRegistration/getDualRegistretedSendersByParams',
  downloadImage: BASE_URL + 'customer/customerDetails/downloadImages',
  downloadAmlReport: BASE_URL + '/customer/amlReport/',
  deleteDataInTable: BASE_URL + '/dualRegistration/removeDualRegistration',

  //Pending Cash Collection

  getAllPendingCashDetails:
    BASE_URL + 'agentTransaction/getCashCollectedDetailsWithFilters',

  //RoleManagemnet

  getAllRoleManagmentData: BASE_URL + 'role/getAllCreatedRoles',
  updateRoleStatus: BASE_URL + 'role/update',
  addNewRole: BASE_URL + 'role/add',
  getAllPrivilages: BASE_URL + 'privilege/findAllOnlyAdmin',
  updateRolePrivilageStatus: BASE_URL + 'rolePrivilege/update',
  getPrivilagesByUser: BASE_URL + 'privilege/findAllPrevilageByUserType/',

  //report Notes
  getAllSubject: BASE_URL + '/emailSubjectDetails/getAll',
  addNotes: BASE_URL + '/transferNotes/save',
  getAllNotes: BASE_URL + '/transferNotes/getAll',

  //Corporate Users

  getAllCorporateUsers: BASE_URL + 'agentSender/getAllCoorparateSender',
  changeStatus: BASE_URL + 'agentSender/updateStatus/2',
  updateAml: BASE_URL + 'agentSender/updateAML',
  sendEmail: BASE_URL + 'AgentCooperateSender/sendEmail',
  getAllEmailSubjects: BASE_URL + 'emailSubjectDetails/getAll',
  getAllNewCorporateUsers: BASE_URL + 'agentSender/getAllCoorparateSender',
  getNewCorporateViewDetails:
    BASE_URL + 'AgentCooperateSender/getCooperateAccountImage/',
  downloadDocNewUserCo:
    BASE_URL + 'AgentCooperateSender/downloadImagesForCorporateSender',
  getAllDocumets: BASE_URL + '/AgentCooperateSender/documents/',
  uploadDocs: BASE_URL + '/AgentCooperateSender/uploadDocs/',
  updateStatusCorporate: BASE_URL + '/agentSender/updateStatus/',
  downloadReport: BASE_URL + '/AgentCooperateSender/agentDocument/',

  //getPrivilagesByUser: BASE_URL + 'privilege/findAllPrevilageByUserType/',
  summaryReportTransferAmenment:
    BASE_URL + 'reports/summaryReportTransferAmenment',
  reports_summaryReportWithAgent_download:
    BASE_URL + '/reports/summaryReportWithAgent/download',
  reports_commisionFeeForSubAgent:
    BASE_URL + '/reports/commisionFeeForSubAgent/download',
  reports_cashCollectorCollectedCashDetailsReportView:
    BASE_URL + 'reports/cashCollectorCollectedCashDetailsReport',

  //usermanagemnet
  //Sub Agent-start
  getAllsubAgents: BASE_URL + 'agentDetails/subagent',
  getSubAgentById: BASE_URL + 'agentDetails/getsubAgentById/',
  subAgentEmailSubject: BASE_URL + 'emailSubjectDetails/getAll',
  subAgentSendEmail: BASE_URL + 'user/sendEmail',
  //privilege setting
  updateSubAgentPrivilageStatus: BASE_URL + 'userprivilege/addOrUpdate',
  getAllSubAgentPrivilages: BASE_URL + 'user/getAllPrivilages/',
  //Agent-approved-Currencys
  getAllSubAgentSendingCurrency: BASE_URL + 'agentSendingReceivingCurrency/',
  //rate setting
  getAllCurrencyType: BASE_URL + 'currency/allForRateSettings/',
  getAllProviderType: BASE_URL + 'provider/getAllProviderDetails',
  updateRateSettings: BASE_URL + 'agentCurrencyRate/updateAgentCurrencyRates',
  //rate setting grid
  getAllAgentCurrencyRate: BASE_URL + 'agentCurrencyRate/getAll/',
  // getAllAgentCurrencyRate: BASE_URL + 'agentCurrencyRate/',
  updateAgentCurrencyRate: BASE_URL + 'agentCurrencyRate/add/',
  //Credit balance
  // updateCreditBalanceStatus: BASE_URL + 'updateCreditBalanceStatus/',
  //Transaction-config-tab1
  getAllIdentityMode: BASE_URL + 'agentIdentityMode/getAll/',
  updateSubAgentIdentityModeStatus: BASE_URL + 'agentIdentityMode/updateStaus/',
  //Transaction-config-tab2
  getAllIPaymentMode: BASE_URL + 'agentPaymentMode/getAll/',
  updateSubAgentPaymentModeStatus: BASE_URL + 'agentPaymentMode/updateStaus/',
  //Transaction-config-tab3
  getAllITransferMode: BASE_URL + 'agentTransactionMode/getAll/',
  updateSubAgentTransferModeStatus:
    BASE_URL + 'agentTransactionMode/updateStaus/',
  getAllReceivingCurrency:
    BASE_URL + 'agentReceivingCurrency/getAllByExposableId/',
  getAllTransferMode: BASE_URL + 'agentTransactionMode/getAll/',
  //transferFee
  getAllTransferFee: BASE_URL + 'agentTransactionFee/',
  getAllSendingCurrency: BASE_URL + 'agentSendingCurrency/getAllByExposableId/',
  updateTransferFee:
    BASE_URL + 'agentConfiguredTransferFee/updateAgentTransactionFee',
  //Agent-approved-countries
  getAllSubAgentReceivingCountries: BASE_URL + 'agentReceivingCountries/',
  getsubAgentById: BASE_URL + 'agentDetails/getsubAgentById/',
  //Sub Agent-end

  //usermanagemnet
  //Agent-start
  getAllAgent: BASE_URL + 'agentDetails/search',
  getAgentById: BASE_URL + 'agentDetails/getAgent',
  getAgentReceivingCurrency:
    BASE_URL + 'agentReceivingCurrency/getAllByExposableId',

  //Agent-end

  //platform user
  getAllExitPlatformUser:
    BASE_URL + 'user/getActiveUsersByForPlatform/MN/true/1',
  getAllNewPlatformUser:
    BASE_URL + 'user/getActiveNewUsersByForPlatform/MN/false/1',
  getViewUserDetails: BASE_URL + 'user/userDetailsById/',
  updateUser: BASE_URL + 'user/updateUser',
  getCountry: BASE_URL + 'country/MN',
  isActiveStatusChange: BASE_URL + 'user/approveUser/',
  getAllRole: BASE_URL + 'role/findAll',
  getRoleById: BASE_URL + 'rolePrivilege/findByRoleIdAdmin',
  updateUserRole: BASE_URL + 'user/updateUserRole',
  unlockUser: BASE_URL + 'user/unlock',
  assignRole: BASE_URL + 'user/updateUserRole/',
  checkUserName: BASE_URL + 'user/checkUserName',
  addNewUser: BASE_URL + 'user/addUser',
  getUserDetailsById: BASE_URL + '/user/userDetailsById',
  agentApproval: BASE_URL + 'user/updateAgentIsApproved',

  //affliateuser
  getAllAffliateUsers: BASE_URL + 'agentDetails/affiliate',
  getPrivilages: BASE_URL + 'user/getAllPrivilages/',
  updateStatus: BASE_URL + 'agentDetails/updateStatus/',
  updatePrivilageStatus: BASE_URL + '/userprivilege/addOrUpdate',

  //approve-pending affliate
  getApprovePendingTableData: BASE_URL + '/agentDetails/affiliate',
  sendEmailAppliate: BASE_URL + '/user/sendEmail',
  getAllSubjects: BASE_URL + '/emailSubjectDetails/getAll',
  getAllAgentDetailsApprovPending:
    BASE_URL + '/agentDetails/viewVerifyPendingSubAgnet/',
  approveStatus: BASE_URL + '/agentDetails/changeAffiliateStatus',
  declineStatus: BASE_URL + '/agentDetails/changeAffiliateStatus',

  //decline affliate
  getAllDetailsDeclinepending: BASE_URL + 'agentDetails/affiliate',

  //verify pending affliate
  getAllVerifyPendingData: BASE_URL + '/agentDetails/affiliate',
  sendMailVerify: BASE_URL + '/user/sendMailVerify',
  getAllVerifyPendingDetailsforPatch:
    BASE_URL + '/agentDetails/viewVerifyPendingSubAgnet/',

  //Make Transfer

  checkratescorrect: BASE_URL + 'agentTransaction/checkCalculation',
  getExposableId: BASE_URL + 'agentDetails/getExposableId',
  getAllAgents: BASE_URL + 'agentDetails/getAll',
  getAllAgentDetails: BASE_URL + 'agentDetails/getAllAgents',
  getAgentSendingCurrency:
    BASE_URL + 'agentSendingCurrency/getAllByExposableId',
  getReceivingCurrency:
    BASE_URL + 'agentSendingReceivingCurrency/byCurrencyCode',
  getAgentCurrencyRate: BASE_URL + 'agentCurrencyRate/convertedAmount',
  getAgentPaymentMode: BASE_URL + 'agentPaymentMode/',
  getAgentTransactionMode: BASE_URL + 'agentTransactionMode/',
  getAgentConfiguredTranferFee: BASE_URL + 'agentConfiguredTransferFee',
  getAgentSenderDetails:
    BASE_URL + 'agentSender/getAgentSenderDetailsByCriteria',
  getSendingReceivingAmountValidation:
    BASE_URL +
    '/sendingReceivingAmountValidation/getSendingRecievingAmountValidationByCriteria',
  getAgentIdentityMode: BASE_URL + 'agentIdentityMode/getAll',
  getSignupCountries: BASE_URL + 'signupCountries/all',
  getAllCountryCode: BASE_URL + 'countryCode',
  getNationality: BASE_URL + 'nationality/',
  getAgentSenderDuplicateSearch: BASE_URL + 'agentSender/duplicateSearch',
  saveAgentSender: BASE_URL + 'agentSender/save',
  getAgentTransactionVolumeSummary: BASE_URL + 'agentTransaction/volumeSummary',
  getAgentTransactionSummary: BASE_URL + 'agentTransaction/getFillter',
  getAgentSenderdetailsByEmail: BASE_URL + 'agentSender/getDetailsByEmail',
  getAgentReceivingCountriesById:
    BASE_URL + 'agentReceivingCountries/byReceivingCurrenciesId',
  getReference: BASE_URL + 'reference',
  getBankDetailsByExposableId:
    BASE_URL + 'bankDetails/byExposableIdAndCountryId',
  saveAgentBeneficiaryDetails: BASE_URL + 'agentBeneficiaryDetails/save',
  saveAgentBanks: BASE_URL + 'agentBanks/add',
  getProvider: BASE_URL + 'provider/getAllByCountry',
  getAgentBeneficiaryBankAccounts:
    BASE_URL + 'agentBeneficiaryBankAccounts/getAll',
  saveAgentbank: BASE_URL + 'agentBanks/add/',
  checkBeneficiaryEditable:
    BASE_URL + 'agentTransaction/checkIsBeneficiaryEditable',
  getAgentBeneficiaryBankAccount:
    BASE_URL + 'agentBeneficiaryBankAccounts/getById',
  saveAgentTransaction: BASE_URL + 'agentTransaction/addAgentTransaction',
  getTransferFee: BASE_URL + '/agentConfiguredTransferFee',
  getAgentSender: BASE_URL + 'agentSender/getAgentSenderDetailsByCriteria',
  getBeneficiaryDetails: BASE_URL + '/agentBeneficiaryDetails/basic/details/',
  getBeneficiaryByFilter:
    BASE_URL + 'agentBeneficiaryDetails/agentBeneficiaryFilter/',
  getBeneficiaryById: BASE_URL + '/agentBeneficiaryDetails/basic/details/',
  getAgentBankAccountBiId: BASE_URL + '/agentBeneficiaryBankAccounts/getById',
  getClientCurrency: BASE_URL + '/clientCurrency/MN',
  submitTransfer: BASE_URL + '/agentTransaction/addAgentTransaction',
  getBankCodes:
    BASE_URL + 'agentReceivingCountries/beneficiaryCountriesByCountryId/',
  saveTransferFlow: BASE_URL + 'transferFlowStep/save',
  updateTransferFlow: BASE_URL + 'transferFlowStep/update',
  updateSenderIdData: BASE_URL + 'agentSenderIdentityValues/update',
  //notes
  saveCustomerNotes: BASE_URL + 'customerNotes/save',
  getCustomerNotes: BASE_URL + 'customerNotes/getAll/',
  getAgentSenderDetailsByUsername:
    BASE_URL + 'agentSender/getAgentSenderDetailsByUsername/',
  updateAgentSenderDetails: BASE_URL + 'agentSender/updateAgentSenderDetails',
  creditsafeAMLService: BASE_URL + 'creditsafeAMLService/amlReport/',

  getAllContactTitleNames:
    BASE_URL + 'contactTitleName/getAllContactTitleNames',
  customerSignUp: BASE_URL + 'user/addAgentCustomer/forSigunup/',

  customerImageDetails: BASE_URL + 'customerImageDetails/retrieve',
  agentSenderUpdateStatus: BASE_URL + 'agentSender/updateStatus/',
  declinedAgentCustomers:
    BASE_URL + 'agentSender/declinedAgentCustomers/search',
  agentTransactionIdentitySave: BASE_URL + 'agentTransactionIdentity/save',
  customerImageDetailsPrimaryUpload:
    BASE_URL + 'customerImageDetails/primaryId/',
  customerImageDetailsSecondaryUpload: BASE_URL + 'amlCore/secondaryId/',
  customerImagePrimaryGetAll:
    BASE_URL + 'customerImageDetails/retrieveAllPrimaryids',
  customerImageSecondaryGetAll:
    BASE_URL + 'customerImageDetails/retrieveAllSecondaryIds',
  getAllWithoutApproved: BASE_URL + 'agentSender/getAllWithoutApproved',
  sendVerifyLink: BASE_URL + 'agentSender/sendVerifyLink/',
  updateStatus2: BASE_URL + 'agentSender/updateStatus',
  //Transfer-Tab

  getTransfers: BASE_URL + 'transaction/searchAll',

  getPayBill: BASE_URL + 'v1/payBillTransaction/getAll',
  sendTrfMail: BASE_URL + 'user/sendTransferEmail',
  emailSubjectDetails_getAll: BASE_URL + 'emailSubjectDetails/getAll',
  // user_sendEmail: BASE_URL + 'user/sendTransferEmail',
  getTransferNotes: BASE_URL + 'transferNotes/getAll',
  saveTrfNotes: BASE_URL + 'transferNotes/save',
  agentTransactiondetails:
    BASE_URL + '/agentTransactionDetails/getUpdatedAgentTransactionDetails/',
  getAgentTrnxDetails:
    BASE_URL + 'agentTransactionDetails/getUpdatedAgentTransactionDetails',
  getAgentTrnxVolSummary: BASE_URL + 'agentTransaction/volumeSummary',
  checkBenEditable: BASE_URL + 'agentTransaction/checkIsBeneficiaryEditable',
  checkBenBankEditable:
    BASE_URL + 'agentBeneficiaryBankAccounts/checkBeneficiaryBankIsEditable',
  updateBeneficiary: BASE_URL + 'agentBeneficiaryDetails/update',
  updateBank: BASE_URL + 'agentBanks/update',
  trnxPaymentAmountAmmend: BASE_URL + 'agentTransaction/paymentAmendment',
  trnxReceivedAmountAmmend: BASE_URL + 'agentTransaction/amountChange/MN',
  markPaymentReceived: BASE_URL + 'agentTransaction/paymentReceived',
  checkIdIssueDate: BASE_URL + 'agentTransactionIdentity/checkIssueDate',
  cargills: BASE_URL + 'lcr/createQuote/CARGILLS/MN',
  terraPay: BASE_URL + 'lcr/createQuote/TERRAPAY/MN',
  manual: BASE_URL + 'lcr/createQuote/MANUAL/MN',
  getAgentSenderById: BASE_URL + 'agentSender/getAllSenderById',
  executeTrnx: BASE_URL + 'lcr/executeQuote/MN',
  changeTrnxStatus:
    BASE_URL + 'agentTransactionDetails/changeTransactionStatus',
  cargillsTrnx: BASE_URL + 'lcr/createQuote/CARGILLS/MN',
  checkTransferLimitation: BASE_URL + 'agentSender/checkTransferLimitation',

  //agent
  agentReceivingCurrency:
    BASE_URL + 'agentReceivingCurrency/getAllByExposableId/',
  saveAgentSendingReceivingCurrency:
    BASE_URL + 'agentSendingReceivingCurrency/save/',

  agentSendingReceivingCurrency: BASE_URL + 'agentSendingReceivingCurrency/',
  agentSendingCurrency: BASE_URL + 'agentSendingCurrency/getAllByExposableId/',
  key: BASE_URL + '/user/unlock',
  // agentReceivingCurrency: BASE_URL + '/agentReceivingCurrency/getAllByExposableId/',
  agentDetails_getAgent: BASE_URL + 'agentDetails/getAgent',
  agentSendingReceivingCurrencyStatusUpdate:
    BASE_URL + 'agentSendingReceivingCurrency/updateIsActive',
  getAgentIdentityModes: BASE_URL + 'agentIdentityMode/getAll/',

  updateCreditBalanceStatus:
    BASE_URL + 'agentDetails/updateCreditBalanceStatus/',
  getagentSendingReceivingCurrencyByCurrencyCode:
    BASE_URL + 'agentSendingReceivingCurrency/byCurrencyCode/',
  agentTransactionModeByCurrencyId: BASE_URL + 'agentTransactionMode/',
  saveAgentTransactionFee:
    BASE_URL + 'agentTransactionFee/saveAgentTransactionFee',
  getAllTransactionFee: BASE_URL + 'agentTransactionFee/',
  getagentNotificationConfiguration:
    BASE_URL + 'agentNotificationConfiguration/get/',
  sendingReceivingAmountValidation:
    BASE_URL + 'sendingReceivingAmountValidation/',
  savesendingReceivingAmountValidation:
    BASE_URL + 'sendingReceivingAmountValidation/save',
  saveAgentNotification: BASE_URL + 'agentNotificationConfiguration/add',
  agentReceivingCountries: BASE_URL + 'agentReceivingCountries/',
  agentReceivingCountrie:
    BASE_URL + 'agentReceivingCountries/beneficiaryCountriesByCountryId', //+currencyID
  getCountries: BASE_URL + 'country/byExposableId/',
  getagentSendingReceivingCurrency:
    BASE_URL + 'agentSendingReceivingCurrency/byCurrencyCode/',
  saveAgentReceivingCountries: BASE_URL + 'agentReceivingCountries/save',
  updateSubAgnetStatus: BASE_URL + 'agentDetails/approveAgent/',
  agentCustomerApprovedCurrencyRate:
    BASE_URL + 'agentApprovedCurrencyRate/getAgentApprovedCurrency',
  updateRateSetting:
    BASE_URL + 'agentApprovedCurrencyRate/agentApprovedCurrencyRate',
  //benificiaries

  getAllBenificiaryData: BASE_URL + 'agentBeneficiaryDetails/search',
  updateAgentBeneficiaryStatus:
    BASE_URL + 'agentBeneficiaryDetails/updateAgentBeneficiaryStatus/update',
  getBenificieryBasicData: BASE_URL + 'agentBeneficiaryDetails/basic/details/',
  CountryCode: BASE_URL + 'countryCode/',
  getAllBankAccountDetails:
    BASE_URL + 'agentBeneficiaryBankAccounts/getAllDetails/',
  updateBankAccountStatus:
    BASE_URL + 'agentBeneficiaryBankAccounts/updateById/',
  addNewBankForBenificiery: BASE_URL + 'agentBanks/add/',
  benificiaryCountries:
    BASE_URL + 'agentReceivingCountries/beneficiaryCountriesByCountryId/',
  currencyForBenificiery: BASE_URL + 'clientCurrency/',
  getAgentRecevingCurrency:
    BASE_URL + 'agentReceivingCurrency/getAllByExposableId/',
  benificieryUpdate: BASE_URL + 'agentBeneficiaryDetails/update',
  benificiaryTransactionHistory:
    BASE_URL + 'agentTransaction/beneficiaryTransaction/',
  BenificieryVolumeSummary: BASE_URL + 'agentBeneficiaryDetails/volumeSummary/',
  downloadBenificieryReport:
    BASE_URL + 'reports/beneficiarySummaryReport/download/',
  savePersonalBenificiery: BASE_URL + 'agentBeneficiaryDetails/save',
  getAgentSenderDetailss: BASE_URL + 'agentSender/',
  getAllSignupCountries: BASE_URL + 'signupCountries/all/',
  getIdTypes: BASE_URL + 'agentIdentityMode/',
  checkIsEditable: BASE_URL + 'agentTransaction/checkBeneficiaryEditable/',
  getAgentDetailss: BASE_URL + 'agentDetails/getAll',
  agentSenderSearchforBeni:
    BASE_URL + 'agentSender/getAgentSenderDetailsByCriteria/',

  saveAgent: BASE_URL + 'agentDetails/',
  getAgentDetailsByagentDetailsId: BASE_URL + 'agentDetails/',
  getDocuments: BASE_URL + 'documentTypes/',

  uploadAgentDocuments: BASE_URL + 'agentDocumentTypes/uploadDocs/',
  saveAgentCustomerCountry:
    BASE_URL + 'signupCountries/saveAgentCustomerCountry',
  saveAgentReceivingCurrency:
    BASE_URL + 'agentReceivingCurrency/saveAgentReceivingCurrency',
  saveAgentSendingCurrency:
    BASE_URL + 'agentSendingCurrency/saveAgentSendingCurrency',
  dynamicLabels:
    BASE_URL + 'agentReceivingCountries/beneficiaryCountriesByCountryId/',
  senderDetails: BASE_URL + 'agentSender/detailsForAgentCustomer/',
  //setting

  updatesetting: BASE_URL + 'user/update',
  optGetAllUserDetails: BASE_URL + '/user/details',

  // Transfer Limit
  agentTransferLimit: BASE_URL + '/agentTransferLimit',
  agentDetailsgetId: BASE_URL + '/agentDetails/getId',
  // agentSendingCurrency: BASE_URL + 'agentSendingCurrency/getAllByExposableId',
  Durations: BASE_URL + '/limitDuration/',
  agentTransferLimitupdate: BASE_URL + 'agentTransferLimit/update',
  agentDetailsgetExposableId: BASE_URL + '/agentDetails/getExposableId',
  save: BASE_URL + '/agentTransferLimit/save',
  agentSendergetAgentSenderDetailsByCriteria:
    BASE_URL + 'agentSender/getAgentSenderDetailsByCriteria',
  getSubAgentsForAffiliateFeeConfig:
    BASE_URL + 'agentDetails/subAgentsByExposableId/',

  //sahan API ------------------------------------------
  authenticate: BASE_URL + '8000/auth/login',
  refresh: BASE_URL + '8000/auth/refresh-token',
  getUsers: BASE_URL + '8000/auth/users',
  getUserdetailsMe: BASE_URL + '8000/auth/users/me',
  //privilages
  getPrivileges: BASE_URL + '8000/auth/roles/permissions',
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

  //
};
