"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

import { toast, ToastContainer } from "react-toastify";  // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import GlobalApi from "../../../_services/GlobalApi";
import { Input } from "../../../../components/ui/input";

function AddNewStudent() {
  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState([]);

  const [data, setData] = useState({
    fullName: "",
    grade: "",
    contactNumber: "",
    address: "",
  });

  // Handle changes in the form input fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle the save action
  const handleSave = () => {
    console.log("Saved Data:", data);

    // Ensure data has a name field value
    if (!data.fullName) {
      toast.error("Please enter a full name");
      return;
    }
 
    setOpen(false);

    GlobalApi.CreateNewStudent({
      name: data.fullName,
      grade: data.grade,
      contact: data.contactNumber,
      address: data.address,
    }).then((resp) => {
      console.log("--", resp);
      toast.success("New student added!");
    }).catch((error) => {
      toast.error("Failed to add student");
      console.error(error);
    });
  };

  // Fetch all grades when the component mounts
  useEffect(() => {
    GetAllGradesList();
  }, []);

  // Function to fetch all grades
  const GetAllGradesList = () => {
    GlobalApi.GetAllGrades().then((resp) => {
      if (resp.data) {
        setGrades(resp.data);
      } else {
        console.error("Failed to load grades");
      }
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
      >
        + Add New Student
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent style={{ backgroundColor: "white" }}>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              <form>
                <div className="py-3">
                  {/* Full Name Input */}
                  <label
                    htmlFor="fullName"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    value={data.fullName}
                    onChange={handleChange}
                    placeholder="Riddhi Upadhyay"
                    style={{ width: "100%", marginBottom: "16px" }}
                  />

                  {/* Grade Selection */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      htmlFor="grade"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Select Grade
                    </label>
                    <select
                      id="grade"
                      value={data.grade}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      {grades.map((item, index) => (
                        <option key={index} value={item.grade}>
                          {item.grade}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contact Number Input */}
                  <label
                    htmlFor="contactNumber"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Contact Number
                  </label>
                  <Input
                    id="contactNumber"
                    value={data.contactNumber}
                    onChange={handleChange}
                    placeholder="9327754285"
                    style={{ width: "100%", marginBottom: "16px" }}
                  />

                  {/* Address Input */}
                  <label
                    htmlFor="address"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Address
                  </label>
                  <Input
                    id="address"
                    value={data.address}
                    onChange={handleChange}
                    placeholder="h-21 capital flora sargasan"
                    style={{ width: "100%", marginBottom: "16px" }}
                  />
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "16px",
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* ToastContainer for displaying the toast messages */}
      <ToastContainer />
    </div>
  );
}

export default AddNewStudent;
