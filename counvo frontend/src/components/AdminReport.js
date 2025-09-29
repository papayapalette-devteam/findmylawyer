import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line,
} from "recharts";
import {
  Clock, Repeat, Timer, Users, Smartphone, DollarSign,
} from "lucide-react";
import "../css/adminreport.css"; 
import Adminpanelheader from "./adminpanelheader";
import Adminsidebar from "./adminsidebar";
import api from '../api';

const AdminReport = () => {


    const[casttypedata,setcasttypedata]=useState([])
    const get_case_type=async(specialization)=>
    {
      try {
        const resp=await api.get('api/admin/case-type')
        console.log(resp);
         const caseTypeData = resp.data.map(item => ({
        name: item.type_of_case,
        value: item.total_number
      }));

      setcasttypedata(caseTypeData)
        
      } catch (error) {
        console.log(error);
        
      }
    }

    useEffect(()=>
    {
    get_case_type()
    },[])
    

  const data = {
    avgTimeToSwitch: "3.5 interactions",
    repeatInteractionsPercent: 45,
    avgSessionDuration: "15 mins",
    timeToFirstConsultation: "2 days",
    acquisitionSource: [
      { name: "Ads", value: 40 },
      { name: "Referral", value: 30 },
      { name: "Organic", value: 30 },
    ],
    caseType: casttypedata,

    typeVsRepeat: [
      { type: "Civil", repeat: 70 },
      { type: "Criminal", repeat: 40 },
      { type: "Family", repeat: 55 },
    ],
    deviceBreakdown: [
      { name: "Mobile", value: 60 },
      { name: "Desktop", value: 40 },
    ],
    dropOffAfterPrice: 35,
    retentionVsFee: [
      { fee: "Low", retention: 60 },
      { fee: "Medium", retention: 45 },
      { fee: "High", retention: 20 },
    ],
    avgSwitching: 1.8,
    totalUserChats: 520
  }

  const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

  return (
    <div>
        {/* <Adminpanelheader/> */}
        <Adminsidebar/>
  
  <main style={{marginLeft:"20%",marginTop:"5%"}}>
   <div className="analytics-container">
      {/* KPI Cards */}
      <div className="analytics-cards">
        <div className="card">
          <Clock className="icon indigo" />
          <p className="label">Time to Lawyer Switch</p>
          <h3 className="value">{data.avgTimeToSwitch}</h3>
        </div>
        <div className="card">
          <Repeat className="icon green" />
          <p className="label">Repeat Interactions %</p>
          <h3 className="value">{data.repeatInteractionsPercent}%</h3>
        </div>
        <div className="card">
          <Timer className="icon yellow" />
          <p className="label">Avg. Session Duration</p>
          <h3 className="value">{data.avgSessionDuration}</h3>
        </div>
        <div className="card">
          <Users className="icon blue" />
          <p className="label">Total User Chats</p>
          <h3 className="value">{data.totalUserChats}</h3>
        </div>
      </div>

      {/* Time to First Consultation */}
      <div className="card full">
        <h3 className="title">Time Between First Login and First Consultation</h3>
        <p className="big-value">{data.timeToFirstConsultation}</p>
      </div>

      {/* Acquisition Source */}
      <div className="card full">
        <h3 className="title">Customer Acquisition Source</h3>
        <div className="chart">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.acquisitionSource}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {data.acquisitionSource.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Case Type */}
      <div className="card full">
        <h3 className="title">Type of Case Distribution</h3>
        <div className="chart">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.caseType}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {data.caseType.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Type vs Repeat */}
      <div className="card full">
        <h3 className="title">Type of Case vs Repeat Usage</h3>
        <div className="chart">
          <ResponsiveContainer>
            <BarChart data={data.typeVsRepeat}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="repeat" fill="#4F46E5" name="Repeat %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="card full">
        <h3 className="title">Device Breakdown</h3>
        <div className="chart">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.deviceBreakdown}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {data.deviceBreakdown.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drop-off */}
      <div className="card">
        <DollarSign className="icon red" />
        <h3 className="title small">Drop-off After Price Discovery</h3>
        <p className="value">{data.dropOffAfterPrice}%</p>
      </div>

      {/* Retention vs Fee */}
      <div className="card full">
        <h3 className="title">Retention vs Fee Charged</h3>
        <div className="chart">
          <ResponsiveContainer>
            <LineChart data={data.retentionVsFee}>
              <XAxis dataKey="fee" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="#22C55E"
                strokeWidth={3}
                name="Retention %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Switching */}
      <div className="card">
        <Smartphone className="icon cyan" />
        <h3 className="title small">Average Switching</h3>
        <p className="value">{data.avgSwitching}</p>
      </div>
    </div>

    </main>

      </div>
  );
};

export default AdminReport;
