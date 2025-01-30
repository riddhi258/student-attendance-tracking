"use client";
import React, { useEffect } from "react";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { FaSignInAlt, FaUserPlus, FaCheckCircle, FaChartBar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutIcon, GraduationCap, Hand, Contact } from "lucide-react";

export default function Home() {
  const menuList = [
    { id: 1, name: "Mentor", icon: LayoutIcon, path: "/dashboard" },
    { id: 2, name: "Students", icon: GraduationCap, path: "/dashboard/students" },
    { id: 3, name: "Attendance", icon: Hand, path: "/dashboard/attendance" },
    { id: 4, name: "Faculty", icon: Contact, path: "/dashboard-faculty" },
   
  ];

  const path = usePathname() || ""; // Ensure fallback value

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div>
      {/* Sidebar */}
      <div className="w-64 fixed md:block">
        <div className="border shadow-md h-screen p-5">
          <Image src="/logo.svg" width={180} height={50} alt="logo" priority />

          <hr className="my-5" />

          {menuList.map((menu) => (
            <Link href={menu.path} key={menu.id}>
              <h2
                className={`flex items-center gap-3 text-md p-4 cursor-pointer rounded-lg my-2 ${
                  path === menu.path
                    ? "bg-primary text-blue"
                    : "text-slate-500 hover:bg-primary hover:text-blue"
                }`}
              >
                <menu.icon />
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <div className="p-4 shadow-sm border flex justify-end gap-4">
          {/* Mentor Sign In & Sign Up */}
          <div>
            <h3 className="text-sm font-bold text-gray-600">Mentor</h3>
            <div className="flex gap-2">
              <LoginLink to="/mentor/dashboard">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
                  <FaSignInAlt />
                  <span>Sign In</span>
                </button>
              </LoginLink>
              <RegisterLink to="/mentor/register">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600">
                  <FaUserPlus />
                  <span>Sign Up</span>
                </button>
              </RegisterLink>
            </div>
          </div>

          {/* Faculty Sign In & Sign Up */}
          <div>
            <h3 className="text-sm font-bold text-gray-600">Faculty</h3>
            <div className="flex gap-2">
              {/* Use Link from Next.js for routing */}
              <Link href="/dashboard-faculty">
                <button  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
                  <FaSignInAlt />
                  <span>Sign In</span>
                </button>
              </Link>

              <RegisterLink to="/faculty/register">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600">
                  <FaUserPlus />
                  <span>Sign Up</span>
                </button>
              </RegisterLink>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="bg-gray-50 min-h-screen">
          {/* Hero Section */}
          <div className="bg-blue-500 text-white p-10 text-center h-60">
            <h1 className="p-4 text-4xl font-bold">Welcome to Trackify</h1>
            <p className="text-xl mt-4">
              Simplify attendance tracking for students with real-time insights and reporting.
            </p>
          </div>

          {/* Features Section */}
          <div className="py-10 px-4 md:px-20 grid md:grid-cols-2 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
              <FaCheckCircle className="text-blue-500 text-4xl mx-auto" />
              <h3 className="text-xl font-bold mt-4">Easy Attendance</h3>
              <p className="mt-2 text-gray-600">
                Mark and track attendance in just a few clicks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
              <FaChartBar className="text-green-500 text-4xl mx-auto" />
              <h3 className="text-xl font-bold mt-4">Real-Time Analytics</h3>
              <p className="mt-2 text-gray-600">
                Get detailed insights into student attendance trends.
              </p>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-blue-100 py-8 text-center h-60">
            <h2 className="p-4 text-3xl font-bold">Start Tracking Today!</h2>
            <p className="mt-2 text-gray-600">
              Join thousands of institutions using Trackify to enhance attendance management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
