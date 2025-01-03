"use client";

import { getUniqueRecord } from "@/app/_services/service";
import React, { useEffect, useState } from "react";
import { BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, Bar, ResponsiveContainer } from "recharts";

function BarChartComponent({ attendanceList = [], totalPresentData = [] }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (attendanceList.length && totalPresentData.length) {
      formatAttendanceListCount();
    }
  }, [attendanceList, totalPresentData]);

  const formatAttendanceListCount = () => {
    const totalStudent = getUniqueRecord(attendanceList);
    const result = totalPresentData.map((item) => ({
      day: item.day,
      presentCount: item.presentCount,
      absentCount: Number(totalStudent?.length) - Number(item.presentCount),
    }));
    console.log(result);
    setData(result);
  };

  return (
    <div>
    <div className="p-5 border rounded-lg shadow-sm " >
        <h2 className="my-4 font-bold text-xl">Attendance</h2>
      <ResponsiveContainer width={'80%'}  height={300}>
      <BarChart  data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="presentCount" name='Total Present' fill="#4c8cf8" />
        <Bar dataKey="absentCount" name='Total Absent' fill="#1fe6d1" />
      </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}

export default BarChartComponent;
