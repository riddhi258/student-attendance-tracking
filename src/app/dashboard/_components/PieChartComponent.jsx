import React, { useState, useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import moment from "moment"; // Ensure moment.js is installed and imported

function getUniqueRecord(attendanceList) {
  // Assuming you want to get unique students from attendanceList.
  // Adjust this function according to your data structure.
  const uniqueStudents = [...new Set(attendanceList.map(item => item.studentId))];
  return uniqueStudents;
}

function PieChartComponent({ attendanceList }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (attendanceList && attendanceList.length > 0) {
      const totalSt = getUniqueRecord(attendanceList);
      const today = moment().date(); // Get the current day as a number
      const PresentPrec = (attendanceList.length / (totalSt.length * today)) * 100;

      setData([
        {
          name: "Total Present",
          value:Number(PresentPrec.toFixed(1)),
          fill : '#4c8cf8'
        },
        {
          name: "Total Absent",
          value: (100 - Number(PresentPrec.toFixed(1))),
          fill : '#1fe6d1'
        },
      ]);
    }
  }, [attendanceList]);

  return (
    <div className="p-5 border rounded-lg shadow-sm">
      <h2 className="my-4 font-bold text-xl">Monthly Attendance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            label
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
