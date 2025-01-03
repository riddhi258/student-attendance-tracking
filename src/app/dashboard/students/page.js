"use client";
import React, { useEffect,useState } from 'react';
import AddNewStudent from './_components/AddNewStudent';
import StudentListTable from './_components/StudentListTable';
import GlobalApi from "@/app/_services/GlobalApi";

function Student() {
 

  const[studentList,setStudentList]=useState([]);
  const GetAllStudents = () => {
    GlobalApi.GetAllStudents()
      .then(resp => {
        setStudentList(resp.data);
      })
  };

  // Fetch students on component mount
  useEffect(() => {
    GetAllStudents();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl flex justify-between items-center">
        Students
        <AddNewStudent 
        />
      </h2>
        <StudentListTable studentList={studentList}
        />
    </div>
  );
}

export default Student;
