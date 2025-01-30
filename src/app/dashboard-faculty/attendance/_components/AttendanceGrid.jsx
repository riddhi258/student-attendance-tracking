import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import moment from "moment";
import * as XLSX from "xlsx";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalApi from "../../../_services/GlobalApi";

// Register all AG Grid modules (community modules)
ModuleRegistry.registerModules([AllCommunityModule]);

function AttendanceGrid({ attendanceList, selectedMonth }) {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    { field: "studentId", filter: true },
    { field: "name", filter: true },
  ]);

  // Memoizing days in the selected month
  const daysInMonth = useMemo(() => {
    const year = moment(selectedMonth).format("YYYY");
    const month = moment(selectedMonth).format("MM");
    return new Date(year, month, 0).getDate();
  }, [selectedMonth]);

  const daysArrays = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  // Function to handle marking attendance
  const onMarkAttendance = (day, studentId, presentStatus) => {
    const date = moment(selectedMonth).format("MM/YYYY");

    if (presentStatus) {
      const data = { day, studentId, present: presentStatus, date };

      GlobalApi.MarkAttendance(data)
        .then((resp) => {
          console.log("Attendance marked as present:", resp);
          toast.success(`Student ID: ${studentId} marked as present`);
        })
        .catch((error) => {
          console.error("Error marking attendance:", error);
          toast.error("Failed to mark student as present. Please try again.");
        });
    } else {
      GlobalApi.MarkAbsent(studentId, day, date)
        .then((resp) => {
          console.log("Attendance marked as absent:", resp);
          toast.success(`Student ID: ${studentId} marked as absent`);
        })
        .catch((error) => {
          console.error("Error marking absent:", error);
          toast.error("Failed to mark student as absent. Please try again.");
        });
    }
  };

  // Prepare data and columns for the grid
  useEffect(() => {
    if (attendanceList) {
      const userList = getUniqueRecord(attendanceList);

      const columns = [
        { field: "studentId" },
        { field: "name" },
        ...daysArrays.map((day) => ({
          field: day.toString(),
          width: 50,
          editable: true,
        })),
      ];

      setColumnDefs(columns);

      const attendanceMap = new Map();
      attendanceList.forEach((item) => {
        const key = `${item.studentId}-${item.day}`;
        attendanceMap.set(key, true);
      });

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

  // Function to get unique records
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

  // Export to Excel function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rowData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const fileName = `Attendance_${moment(selectedMonth).format("MM-YYYY")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success("Attendance exported to Excel!");
  };

  // Import from Excel function
  const importFromExcel = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Imported Data:", jsonData);
        setRowData(jsonData); // Update the grid with imported data
        toast.success("Data imported successfully!");
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("No file selected!");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={exportToExcel}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Export to Excel
        </button>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={importFromExcel}
          style={{
            display: "inline-block",
            padding: "10px",
            cursor: "pointer",
          }}
        />
      </div>

      <div style={{ height: "500px" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={10}
          onCellValueChanged={(e) =>
            onMarkAttendance(e.colDef.field, e.data.studentId, e.newValue)
          }
        />
      </div>
      <ToastContainer />
    </div>
  );
}

export default AttendanceGrid;
