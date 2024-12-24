import { useState } from "react";
import "./style.css";
import * as React from "react";

const TabBar = () => {
  const [activeTab, setActiveTab] = useState("code");

  return (
    <div className="tab-bar">
        <button
          className={`tab-item ${activeTab === "code" ? "active" : ""}`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
      </div>
  );
};

export default TabBar;
