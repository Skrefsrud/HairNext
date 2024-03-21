"use client";
import React, { useState } from "react";
import Bookings from "./Bookings"; // Import your components
import Employees from "./Employees";
import Availabilities from "./availabilites";
import Services from "./Services";

function AdminNavigation() {
  const [activeView, setActiveView] = useState("bookings"); // Initial view

  const renderView = () => {
    switch (activeView) {
      case "bookings":
        return <Bookings />;
      case "employees":
        return <Employees />;
      case "availabilities":
        return <Availabilities />;
      case "services":
        return <Services />;
      default:
        return null;
    }
  };

  return (
    <div className='tabs tabs-lifted ml-10 mr-10'>
      {/* Tab 1 */}
      <input
        type='radio'
        name='my_tabs_2'
        role='tab'
        className='tab'
        aria-label='Bookings'
        checked={activeView === "bookings"} // Sync with state
        onClick={() => setActiveView("bookings")}
      />
      <div
        role='tabpanel'
        className={`tab-content bg-base-100 border-base-300 h-dvh rounded-box p-6 ${
          activeView === "bookings" ? "" : "hidden"
        }`} // Conditional visibility
      >
        {renderView()}
      </div>

      {/* Tab 2 - Employees */}
      <input
        type='radio'
        name='my_tabs_2'
        role='tab'
        className='tab'
        aria-label='Employees'
        checked={activeView === "employees"}
        onClick={() => setActiveView("employees")}
      />
      <div
        role='tabpanel'
        className={`tab-content bg-base-100 border-base-300 h-dvh rounded-box p-6 ${
          activeView === "employees" ? "" : "hidden"
        }`} // Conditional visibility
      >
        {renderView()}
      </div>

      {/* Tab 3 - Availabilities */}
      <input
        type='radio'
        name='my_tabs_2'
        role='tab'
        className='tab'
        aria-label='Availabilities'
        checked={activeView === "availabilities"}
        onClick={() => setActiveView("availabilities")}
      />
      <div
        role='tabpanel'
        className={`tab-content bg-base-100 border-base-300 h-dvh rounded-box p-6 ${
          activeView === "availabilities" ? "" : "hidden"
        }`}
      >
        {renderView()}
      </div>

      {/* Tab 4 - Services */}
      <input
        type='radio'
        name='my_tabs_2'
        role='tab'
        className='tab'
        aria-label='Services'
        checked={activeView === "services"}
        onClick={() => setActiveView("services")}
      />
      <div
        role='tabpanel'
        className={`tab-content bg-base-100 border-base-300 h-dvh rounded-box mr-8 p-6 ${
          activeView === "services" ? "" : "hidden"
        }`}
      >
        {renderView()}
      </div>
    </div>
  );
}

export default AdminNavigation;
