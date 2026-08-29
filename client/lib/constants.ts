export const APP_NAME = 'Inspect Practice';
export const APP_DESCRIPTION = 'AI-Powered ICC Building Inspector Exam Prep';

export const EXAMS = [
  { code: 'ICC-B1', name: 'B1 - Residential Building Inspector (IRC)', country: 'US', licenseType: 'ICC' },
  { code: 'ICC-B2', name: 'B2 - Commercial Building Inspector (IBC)', country: 'US', licenseType: 'ICC' },
  { code: 'ICC-E1', name: 'E1 - Residential Electrical Inspector (NEC)', country: 'US', licenseType: 'ICC' },
  { code: 'ICC-P1', name: 'P1 - Residential Plumbing Inspector (IPC)', country: 'US', licenseType: 'ICC' },
  { code: 'ICC-M1', name: 'M1 - Residential Mechanical Inspector (IMC)', country: 'US', licenseType: 'ICC' },
];

export const QUESTION_TYPES = [
  { value: 'MCQ', label: 'Multiple Choice' },
  { value: 'TRUEFALSE', label: 'True/False' },
  { value: 'WRITTEN', label: 'Written' },
];

export const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

export const PLANS = [
  { value: 'FREE', label: 'Free', price: 0 },
  { value: 'MONTHLY', label: 'Monthly', price: 29.99 },
  { value: 'YEARLY', label: 'Yearly', price: 99 },
  { value: 'LIFETIME', label: 'Lifetime', price: 199 },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/questions', label: 'Question Bank', icon: 'FileQuestion' },
  { href: '/admin/exams', label: 'Exams', icon: 'ClipboardList' },
  { href: '/admin/users', label: 'Users', icon: 'Users' },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: 'CreditCard' },
  { href: '/admin/settings', label: 'Settings', icon: 'Settings' },
];
