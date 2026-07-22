import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { departmentAttendanceData } from '@/mocks/data/dashboardTrends.mock';

/**
 * DepartmentAttendanceChart — "Employee Attendance / Present vs
 * absent by department" stacked bar chart, matching the screenshot.
 */
export function DepartmentAttendanceChart() {
  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-lg font-bold text-text-primary">Employee Attendance</h3>
      <p className="text-sm text-text-secondary mb-4">Present vs absent by department</p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={departmentAttendanceData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="department" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
          <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Bar dataKey="present" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
          <Bar dataKey="absent" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}