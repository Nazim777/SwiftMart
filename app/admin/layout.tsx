import React from 'react'
import Sidebar from "../../components/Sidebar"

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="flex h-screen mt-12">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar Placeholder */}
          <div className="h-16 border-b flex items-center px-6">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
  
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    );
  };
  
  export default AdminDashboardLayout;