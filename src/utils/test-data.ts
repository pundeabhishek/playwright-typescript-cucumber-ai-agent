import { env } from '@config/env';

export const demoUsers = {
  admin: {
    username: env.username,
    password: env.password
  },
  invalid: {
    username: 'invalid.user',
    password: 'wrong_password'
  }
};

export type EmployeeRecord = {
  firstName: string;
  lastName: string;
  fullName: string;
  employeeId: string;
};

export function createEmployeeRecord(seed = Date.now()): EmployeeRecord {
  const suffix = String(seed).slice(-6);
  const employeeId = String(seed).slice(-8);
  const firstName = `Demo${suffix}`;
  const lastName = `Employee${suffix}`;

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    employeeId
  };
}
