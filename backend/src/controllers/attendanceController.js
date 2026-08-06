import { Attendance } from '../models/attendance.js';
import { LeaveRequest } from '../models/leaveRequest.js';
import { pool } from '../config/database.js'; // Database pool import kiya hai auto-attendance ke liye

export const markAttendance = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { employeeId, attendanceDate, status, checkIn, checkOut, overtimeHours, remarks } = req.body;
    if (!employeeId || !attendanceDate || !status) {
      return res.status(400).json({ message: 'employeeId, attendanceDate and status are required' });
    }

    const record = await Attendance.create(
      { employeeId, attendanceDate, status, checkIn, checkOut, overtimeHours, remarks },
      tenantId
    );

    res.status(201).json({ success: true, message: 'Attendance recorded successfully', attendance: record });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { date, employeeId, month, year } = req.query;
    const records = await Attendance.findByTenant(tenantId, {
      date,
      employeeId,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
    });

    res.json({ success: true, attendance: records });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const record = await Attendance.update(req.params.id, tenantId, req.body);
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    res.json({ success: true, message: 'Attendance updated successfully', attendance: record });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createLeaveRequestHandler = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;
    if (!employeeId || !leaveType || !fromDate || !toDate) {
      return res.status(400).json({ message: 'employeeId, leaveType, fromDate and toDate are required' });
    }
    const request = await LeaveRequest.create({ employeeId, leaveType, fromDate, toDate, reason }, tenantId);
    res.status(201).json({ success: true, message: 'Leave request submitted', leaveRequest: request });
  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLeaveRequestsHandler = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const requests = await LeaveRequest.findByTenant(tenantId);
    res.json({ success: true, leaveRequests: requests });
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateLeaveRequestHandler = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { status, fromDate, toDate } = req.body;
          
    // 1. Purani request ki details fetch karein taake pichli dates ka pata ho
    const requests = await LeaveRequest.findByTenant(tenantId);
    const existingRequest = requests.find(r => String(r.id) === String(req.params.id));

    if (!existingRequest) return res.status(404).json({ message: 'Leave request not found' });

    // 2. Agar pichli leave Approved thi, toh uski purani auto-attendance saaf kar dein
    if (existingRequest.status === 'Approved') {
      await pool.query(
        `DELETE FROM attendance 
         WHERE tenant_id = $1 AND employee_id = $2 AND attendance_date BETWEEN $3 AND $4 AND remarks = 'Auto-generated from approved leave'`,
        [tenantId, existingRequest.employeeId, existingRequest.fromDate, existingRequest.toDate]
      );
    }

    // 3. Leave request ko update karein (agar form edit hua hai ya status change hua hai)
    const request = await LeaveRequest.update(req.params.id, tenantId, req.body);

    // 4. Agar naya status 'Approved' hai, toh nayi dates par attendance 'Leave' mark kar dein
    const currentStatus = status || request.status;
    if (currentStatus === 'Approved') {
      const startDate = new Date(request.fromDate);
      const endDate = new Date(request.toDate);
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
                  
        await pool.query(
          `INSERT INTO attendance (tenant_id, employee_id, attendance_date, status, remarks) 
           VALUES ($1, $2, $3, 'Leave', 'Auto-generated from approved leave') 
           ON CONFLICT (employee_id, attendance_date) 
           DO UPDATE SET status = 'Leave', remarks = 'Auto-generated from approved leave'`,
          [tenantId, request.employeeId, dateStr]
        );
      }
    }

    res.json({ success: true, message: 'Leave request and attendance synchronized successfully', leaveRequest: request });
  } catch (error) {
    console.error('Update leave request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const editLeaveRequestHandler = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    
    // Request body mein agar status nahi hai ya change ho raha hai, toh status 'Pending' set kar dein
    const updateData = {
      ...req.body,
      status: 'Pending', 
    };

    const request = await LeaveRequest.update(req.params.id, tenantId, updateData);
    if (!request) return res.status(404).json({ message: 'Leave request not found' });
    
    res.json({ success: true, message: 'Leave request updated and pending approval', leaveRequest: request });
  } catch (error) {
    console.error('Edit leave request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteLeaveRequestHandler = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const requests = await LeaveRequest.findByTenant(tenantId);
    const existingRequest = requests.find(r => String(r.id) === String(req.params.id));

    if (!existingRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Agar leave approved thi, toh uski auto-attendance bhi delete kar dein
    if (existingRequest.status === 'Approved') {
      await pool.query(
        `DELETE FROM attendance 
         WHERE tenant_id = $1 AND employee_id = $2 AND attendance_date BETWEEN $3 AND $4 AND remarks = 'Auto-generated from approved leave'`,
        [tenantId, existingRequest.employeeId, existingRequest.fromDate, existingRequest.toDate]
      );
    }

    // Leave request delete karein (LeaveRequest model mein delete function hona chahiye)
    await pool.query('DELETE FROM leave_requests WHERE id = $1 AND tenant_id = $2', [req.params.id, tenantId]);

    res.json({ success: true, message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Delete leave request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};