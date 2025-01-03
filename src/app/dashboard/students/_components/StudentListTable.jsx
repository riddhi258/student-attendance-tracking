import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'; 
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule, PaginationModule } from 'ag-grid-community'; 
import { Trash, Search } from 'lucide-react'; 
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_services/GlobalApi";
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
} from "@/components/ui/alert-dialog";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles

function StudentListTable({ studentList }) {
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (studentList) {
      setRowData(studentList);
      setFilteredData(studentList);  // Initialize with the full list of students
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
        setFilteredData((prevData) => prevData.filter((item) => item.id !== id));  // Remove from filtered data as well
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
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            height: '20px',
            width: '30px',
          }}
        >
          <Trash style={{ width: '16px', height: '16px' }} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent style={{ backgroundColor: "white" }}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your record
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => DeleteRecord(props.data.id)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const [colDefs] = useState([
    { 
      field: 'id', 
      headerName: 'ID', 
      filter: 'agNumberColumnFilter', 
      floatingFilter: true,  
      sortable: true,  
      resizable: true,  
      flex: 0.5, 
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      filter: 'agTextColumnFilter', 
      floatingFilter: true,  
      sortable: true, 
      resizable: true,
      flex: 0.5,  
    },
    { 
      field: 'contact', 
      headerName: 'Contact', 
      filter: 'agTextColumnFilter', 
      floatingFilter: true,  
      sortable: true, 
      resizable: true, 
      flex: 0.5, 
    },
    { 
      field: 'address', 
      headerName: 'Address', 
      filter: 'agTextColumnFilter', 
      floatingFilter: true, 
      sortable: true, 
      resizable: true, 
      flex: 1, 
    },
    { 
      field: 'action', 
      headerName: 'Action', 
      cellRenderer: CustomButtons, 
      maxWidth: 100  
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
        row.id.toString().includes(value)  // You can also search by ID
      );
    });

    setFilteredData(filtered);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Toast Notification */}
      <ToastContainer />

      {/* Search Input with Icon */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '300px',
            gap: '10px',
          }}
        >
          <Search style={{ width: '20px', height: '20px', color: '#888' }} />
          <input 
            type="text" 
            value={searchInput}
            onChange={onSearchChange} 
            placeholder="Search Anything..." 
            style={{ border: 'none', outline: 'none', flex: 1 }} 
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          rowData={filteredData}  // Use filteredData instead of rowData
          columnDefs={colDefs} 
          modules={[ClientSideRowModelModule, PaginationModule]} 
          pagination={true}  
          paginationPageSize={10}  
          domLayout="autoHeight"  
          enableFilter={false}  
          rowSelection="multiple"  
        />
      </div>
    </div>
  );
}

export default StudentListTable;
