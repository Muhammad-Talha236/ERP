/**
 * employees.mock.js — fake employee data, shaped exactly like the
 * real API response documented in docs/API/05_API_Documentation_Part3.md
 * and docs/04_Database_Design_Part2.md.
 *
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string} employeeCode
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} departmentId
 * @property {string} department        - denormalized name for display
 * @property {string} designationId
 * @property {string} designation       - denormalized title for display
 * @property {string} email
 * @property {string} phone
 * @property {'Male'|'Female'|'Other'} gender
 * @property {string} hireDate          - ISO date string
 * @property {'Daily'|'Monthly'|'Piece Rate'} salaryType
 * @property {number} baseSalary
 * @property {'Active'|'Inactive'|'On Leave'} status
 * @property {string|null} profileImage
 */

export const employeesMockData = [
  {
    id: 'emp-001',
    employeeCode: 'EMP-001',
    firstName: 'Priya',
    lastName: 'Menon',
    departmentId: 'dept-assembly',
    department: 'Assembly',
    designationId: 'desig-line-supervisor',
    designation: 'Line Supervisor',
    email: 'priya@northforge.io',
    phone: '03001234567',
    gender: 'Female',
    hireDate: '2021-03-14',
    salaryType: 'Monthly',
    baseSalary: 62000,
    status: 'Active',
    profileImage: null,
  },
  {
    id: 'emp-002',
    employeeCode: 'EMP-002',
    firstName: 'Marcus',
    lastName: 'Chen',
    departmentId: 'dept-quality',
    department: 'Quality',
    designationId: 'desig-qa-engineer',
    designation: 'QA Engineer',
    email: 'marcus@northforge.io',
    phone: '03007654321',
    gender: 'Male',
    hireDate: '2020-08-02',
    salaryType: 'Monthly',
    baseSalary: 71000,
    status: 'Active',
    profileImage: null,
  },
  {
    id: 'emp-003',
    employeeCode: 'EMP-003',
    firstName: 'Aisha',
    lastName: 'Rahman',
    departmentId: 'dept-packaging',
    department: 'Packaging',
    designationId: 'desig-team-lead',
    designation: 'Team Lead',
    email: 'aisha@northforge.io',
    phone: '03009988776',
    gender: 'Female',
    hireDate: '2019-11-19',
    salaryType: 'Monthly',
    baseSalary: 58000,
    status: 'On Leave',
    profileImage: null,
  },
  {
    id: 'emp-004',
    employeeCode: 'EMP-004',
    firstName: 'Diego',
    lastName: 'Alvarez',
    departmentId: 'dept-logistics',
    department: 'Logistics',
    designationId: 'desig-dispatch',
    designation: 'Dispatch',
    email: 'diego@northforge.io',
    phone: '03001112233',
    gender: 'Male',
    hireDate: '2022-01-25',
    salaryType: 'Monthly',
    baseSalary: 46000,
    status: 'Active',
    profileImage: null,
  },
  {
    id: 'emp-005',
    employeeCode: 'EMP-005',
    firstName: 'Sofia',
    lastName: 'Ivanova',
    departmentId: 'dept-maintenance',
    department: 'Maintenance',
    designationId: 'desig-technician',
    designation: 'Technician',
    email: 'sofia@northforge.io',
    phone: '03004445566',
    gender: 'Female',
    hireDate: '2018-06-10',
    salaryType: 'Monthly',
    baseSalary: 54000,
    status: 'Active',
    profileImage: null,
  },
  {
    id: 'emp-006',
    employeeCode: 'EMP-006',
    firstName: 'Kenji',
    lastName: 'Watanabe',
    departmentId: 'dept-assembly',
    department: 'Assembly',
    designationId: 'desig-operator',
    designation: 'Assembly Operator',
    email: 'kenji@northforge.io',
    phone: '03002223344',
    gender: 'Male',
    hireDate: '2023-02-18',
    salaryType: 'Daily',
    baseSalary: 3500,
    status: 'Active',
    profileImage: null,
  },
  {
    id: 'emp-007',
    employeeCode: 'EMP-007',
    firstName: 'Fatima',
    lastName: 'Sheikh',
    departmentId: 'dept-hr',
    department: 'HR',
    designationId: 'desig-hr-officer',
    designation: 'HR Officer',
    email: 'fatima@northforge.io',
    phone: '03005556677',
    gender: 'Female',
    hireDate: '2021-09-05',
    salaryType: 'Monthly',
    baseSalary: 49000,
    status: 'Inactive',
    profileImage: null,
  },
  {
    id: 'emp-008',
    employeeCode: 'EMP-008',
    firstName: 'Omar',
    lastName: 'Farooq',
    departmentId: 'dept-cutting',
    department: 'Cutting',
    designationId: 'desig-cutting-operator',
    designation: 'Cutting Operator',
    email: 'omar@northforge.io',
    phone: '03008889900',
    gender: 'Male',
    hireDate: '2022-07-30',
    salaryType: 'Piece Rate',
    baseSalary: 0,
    status: 'Active',
    profileImage: null,
  },
];