import { Role } from '@roles/enums/role.enum';

export const SEED_USERS = [
  {
    name: 'Admin',
    email: 'admin@jobportal.com',
    password: 'Password@123',
    role: Role.ADMIN,
  },
  {
    name: 'Recruiter',
    email: 'recruiter@company.com',
    password: 'Password@123',
    role: Role.RECRUITER,
  },
  {
    name: 'Candidate',
    email: 'candidate@gmail.com',
    password: 'Password@123',
    role: Role.CANDIDATE,
  },
];
