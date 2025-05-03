// Team member role constants
export const TEAM_MEMBER_ROLES = {
  PROJECT_MANAGER: 'Project Manager',
  DEVELOPER: 'Developer',
  DESIGNER: 'Designer',
  QA_ENGINEER: 'QA Engineer',
  BUSINESS_ANALYST: 'Business Analyst'
};

// Default form data
export const DEFAULT_TEAM_MEMBER_FORM_DATA = {
  name: '',
  email: '',
  phone: '',
  role: TEAM_MEMBER_ROLES.DEVELOPER,
  skills: [],
  projectIds: []
}; 