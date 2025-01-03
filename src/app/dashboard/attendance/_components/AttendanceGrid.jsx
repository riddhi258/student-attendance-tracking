import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import moment from 'moment';
import GlobalApi from '@/app/_services/GlobalApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Register all AG Grid modules (community modules)
ModuleRegistry.registerModules([AllCommunityModule]);

function AttendanceGrid({ attendanceList, selectedMonth }) {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    { field: 'studentId' , filter:true },
    { field: 'name', filter:true },
  ]);

  // Memoizing column definitions to avoid recalculations on every render
  const daysInMonth = useMemo(() => {
    const year = moment(selectedMonth).format('YYYY');
    const month = moment(selectedMonth).format('MM');
    return new Date(year, month, 0).getDate();
  }, [selectedMonth]);

  const daysArrays = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const onMarkAttendance = (day, studentId, presentStatus) => {
    const date = moment(selectedMonth).format("MM/YYYY"); // Format the date properly
  
    if (presentStatus) {
      const data = {
        day: day,
        studentId: studentId,
        present: presentStatus,
        date: date,
      };
  
      GlobalApi.MarkAttendance(data)
        .then(resp => {
          console.log(resp);
          toast.success('Student ID:' +studentId+'marked as present');
        })
        .catch(error => {
          console.error("Error marking attendance:", error);
          toast.error("Failed to mark student as present. Please try again.");
        });
    } else {
      GlobalApi.MarkAbsent(studentId, day, date)
        .then(resp => {
          console.log(resp);
          toast.success('Student ID:'+ studentId +'marked as absent');
        })
        .catch(error => {
          console.error("Error deleting student record:", error);
          toast.error("Failed to mark student as absent. Please try again.");
        });
    }
  };
  useEffect(() => {
    if (attendanceList) {
      const userList = getUniqueRecord(attendanceList);

      // Prepare the columns based on days in the selected month
      const columns = [
        { field: 'studentId' },
        { field: 'name' },
        ...daysArrays.map((day) => ({
          field: day.toString(),
          width: 50,
          editable: true,
        })),
      ];

      setColumnDefs(columns);

      // Create a fast lookup map for attendance data
      const attendanceMap = new Map();
      attendanceList.forEach((item) => {
        const key = `${item.studentId}-${item.day}`;
        attendanceMap.set(key, true);
      });

      // Map attendance data to each student with a presence status for each day
      const updatedUserList = userList.map((user) => {
        const updatedUser = { ...user };
        daysArrays.forEach((day) => {
          const key = `${user.studentId}-${day}`;
          updatedUser[day] = attendanceMap.has(key);
        });
        return updatedUser;
      });

      setRowData(updatedUserList);
    }
  }, [attendanceList, daysArrays]);

  // Optimized unique record function using a Set for faster lookup
  const getUniqueRecord = (attendanceList) => {
    const uniqueRecord = [];
    const existingUser = new Set();

    attendanceList.forEach((record) => {
      if (!existingUser.has(record.studentId)) {
        existingUser.add(record.studentId);
        uniqueRecord.push(record);
      }
    });

    return uniqueRecord;
  };

  return (
    <div style={{ height: '500px' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout="autoHeight" 
        pagination={true}  
        paginationPageSize={10} 
        onCellValueChanged={(e)=>onMarkAttendance(e.colDef.field,e.data.studentId,e.newValue)}// Ensures auto resizing of the grid
      />
    </div>
  );
}

export default AttendanceGrid;
