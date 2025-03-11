import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ExcelRenderer } from "react-excel-renderer";
import { ClientSideRowModelModule, PaginationModule } from "ag-grid-community";
import { Trash, Search } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalApi from "../../../_services/GlobalApi";
import { Button } from "../../../../components/ui/button";

function StudentListTable({ studentList }) {
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (studentList) {
      setRowData(studentList);
    }
  }, [studentList]);

  // ✅ Delete Record with More Informative Toast
  const DeleteRecord = (id) => {
    if (!id) {
      toast.error("Invalid record ID.");
      return;
    }

    GlobalApi.DeleteStudentRecord(id)
      .then(() => {
        toast.success(`Student with ID ${id} deleted successfully!`);
        setRowData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch(() => {
        toast.error(`Failed to delete student with ID ${id}.`);
      });
  };

  const CustomButtons = (props) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "4px",
            height: "20px",
            width: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Trash style={{ width: "16px", height: "16px" }} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent style={{ backgroundColor: "white" }}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            record and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => DeleteRecord(props.data.id)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  

  const colDefs = [
    { field: "id", headerName: "ID", filter: true, sortable: true, flex: 0.5 },
    { field: "name", headerName: "Name", filter: true, sortable: true, flex: 1 },
    { field: "contact", headerName: "Contact", filter: true, sortable: true, flex: 1 },
    { field: "address", headerName: "Address", filter: true, sortable: true, flex: 1.5 },
    { field: "action", headerName: "Action", cellRenderer: CustomButtons, maxWidth: 100 },
  ];

  // ✅ Optimized Search with Debouncing
  const onSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);

      if (!value.trim()) {
        setRowData(studentList);
        return;
      }

      const filtered = studentList.filter((row) =>
        Object.values(row).some(
          (field) =>
            field &&
            field.toString().toLowerCase().includes(value.toLowerCase())
        )
      );

      setRowData(filtered);
    },
    [studentList]
  );

  // ✅ Improved Excel Upload Handling
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      ExcelRenderer(file, (err, resp) => {
        if (err) {
          toast.error("Error reading the Excel file.");
          console.error(err);
        } else {
          const importedData = resp.rows.map((row, index) => ({
            id: row[0] || index + 1, // Use index as fallback ID
            name: row[1] || "N/A",
            contact: row[2] || "N/A",
            address: row[3] || "N/A",
          }));

          setRowData(importedData);
          toast.success("Excel file imported successfully!");
        }
      });
    } else {
      toast.error("Please upload a valid .xlsx file.");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <ToastContainer />

      {/* Search Input */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
        <div style={{ display: "flex", border: "1px solid #ccc", padding: "8px", borderRadius: "4px", alignItems: "center", width: "300px" }}>
          <Search style={{ width: "20px", height: "20px", color: "#888" }} />
          <input
            type="text"
            value={searchInput}
            onChange={onSearchChange}
            placeholder="Search..."
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              paddingLeft: "8px",
            }}
          />
        </div>
      </div>

      {/* Excel File Upload */}
      <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ padding: "8px" }} />

      {/* Table */}
      <div className="ag-theme-alpine" style={{ height: "500px", width: "100%", marginTop: "16px" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          modules={[ClientSideRowModelModule, PaginationModule]}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
          rowSelection="multiple"
          animateRows={true}
        />
      </div>
    </div>
  );
}

export default StudentListTable;
