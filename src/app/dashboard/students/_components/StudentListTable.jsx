import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ExcelRenderer } from "react-excel-renderer"; // Import ExcelRenderer
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
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
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import GlobalApi from "../../../_services/GlobalApi";
import { Button } from "../../../../components/ui/button";

function StudentListTable({ studentList }) {
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (studentList) {
      setRowData(studentList);
      setFilteredData(studentList); // Initialize with the full list of students
    }
  }, [studentList]);

  const DeleteRecord = (id) => {
    if (!id) {
      toast.error("No ID provided to delete the record.");
      return;
    }

    GlobalApi.DeleteStudentRecord(id)
      .then((resp) => {
        toast.success("Record deleted successfully!");
        setRowData((prevData) => prevData.filter((item) => item.id !== id));
        setFilteredData((prevData) =>
          prevData.filter((item) => item.id !== id)
        ); // Remove from filtered data as well
      })
      .catch((err) => {
        toast.error("Failed to delete the record.");
      });
  };

  const CustomButtons = (props) => (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "4px",
            height: "20px",
            width: "30px",
          }}
        >
          <Trash style={{ width: "16px", height: "16px" }} />
        </Button>
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

  const [colDefs] = useState([
    {
      field: "id",
      headerName: "ID",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      sortable: true,
      resizable: true,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,
      resizable: true,
      flex: 0.5,
    },
    {
      field: "contact",
      headerName: "Contact",
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,
      resizable: true,
      flex: 0.5,
    },
    {
      field: "address",
      headerName: "Address",
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,
      resizable: true,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      cellRenderer: CustomButtons,
      maxWidth: 100,
    },
  ]);

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Filter the rows based on the search input
    const filtered = rowData.filter((row) => {
      return (
        row.name.toLowerCase().includes(value.toLowerCase()) ||
        row.contact.toLowerCase().includes(value.toLowerCase()) ||
        row.address.toLowerCase().includes(value.toLowerCase()) ||
        row.id.toString().includes(value) // You can also search by ID
      );
    });

    setFilteredData(filtered);
  };

  // Excel File Upload Handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      ExcelRenderer(file, (err, resp) => {
        if (err) {
          toast.error("Error while reading the Excel file");
        } else {
          // You can map the rows from the Excel file to your desired format
          const importedData = resp.rows.map((row, index) => ({
            id: row[0], // Assuming the first column is ID
            name: row[1], // Assuming the second column is Name
            contact: row[2], // Assuming the third column is Contact
            address: row[3], // Assuming the fourth column is Address
          }));

          setRowData(importedData);
          setFilteredData(importedData); // Update filtered data as well
          toast.success("Excel file imported successfully!");
        }
      });
    } else {
      toast.error("Please upload a valid Excel file.");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Toast Notification */}
      <ToastContainer />

      {/* Search Input with Icon */}
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "300px",
            gap: "10px",
          }}
        >
          <Search style={{ width: "20px", height: "20px", color: "#888" }} />
          <input
            type="text"
            value={searchInput}
            onChange={onSearchChange}
            placeholder="Search Anything..."
            style={{ border: "none", outline: "none", flex: 1 }}
          />
        </div>
      </div>

      {/* Excel File Upload */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          style={{ padding: "8px", cursor: "pointer" }}
        />
      </div>

      {/* Table Container */}
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={filteredData} // Use filteredData instead of rowData
          columnDefs={colDefs}
          modules={[ClientSideRowModelModule, PaginationModule]}
          pagination={true} // Enable pagination
          paginationPageSize={8} // Show 10 rows per page
          domLayout="autoHeight"
          enableFilter={true} // Enable the filter API
          floatingFilter={true} // Display floating filters for each column
          rowSelection="multiple"
        />
      </div>
    </div>
  );
}

export default StudentListTable;
