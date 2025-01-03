"use client";
import React, { useState } from "react";
import MonthSelection from "@/app/_components/MonthSelection";
import GradeSelect from "@/app/_components/GradeSelect";
import { Button } from "@/components/ui/button";
import moment from "moment";
import GlobalApi from "@/app/_services/GlobalApi";
import AttendanceGrid from "./_components/AttendanceGrid";

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const [attendanceList, setAttendanceList] = useState([]);

  const onSearchHandler = () => {
    const month = moment(selectedMonth).format("MM/YYYY");

    GlobalApi.GetAttendanceList(selectedGrade, month)
      .then((resp) => {
        if (Array.isArray(resp.data)) {
          setAttendanceList(resp.data);
        } else {
          console.error("Invalid response data:", resp.data);
          setAttendanceList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching attendance list:", err);
        setAttendanceList([]);
      });
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Attendance</h2>

      <div>
        <div className="flex gap-5 my-5 p-5 border rounded-lg shadow-sm">
          <div className="flex gap-2 items-center">
            <label>Select Month:</label>
            <MonthSelection
              selectedMonth={(value) => setSelectedMonth(value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label>Select Grade:</label>
            <GradeSelect
              selectedGrade={(value) => setSelectedGrade(value)}
            />
          </div>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-700"
            onClick={onSearchHandler}
          >
            Search
          </Button>
        </div>
        <div>
          <AttendanceGrid attendanceList={attendanceList}
          selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
}

export default Attendance;
