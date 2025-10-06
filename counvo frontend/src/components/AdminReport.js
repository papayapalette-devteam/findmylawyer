import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line,
} from "recharts";
import {
  Clock, Repeat, Timer, Users, Smartphone, DollarSign,
} from "lucide-react";
import "../css/adminreport.css"; 
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

      const[session_time,setsession_time]=useState([])
      const[switch_time,setswitch_time]=useState([])
    const get_session_time=async()=>
    {
      try {
        const resp=await api.get('api/admin/session-time')
        console.log(resp);
       

      setsession_time(resp.data.data.avgSessionTime)
      setswitch_time(resp.data.data.avgSwitchTime)
        
      } catch (error) {
        console.log(error);
        
      }
    }

    useEffect(()=>
    {
    get_session_time()
    },[])


   const [chatSummary, setChatSummary] = useState([]);
  const [expandedLawyers, setExpandedLawyers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const lawyersPerPage = 5; // adjust as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await api.get("/api/admin/chat-summary");
        setChatSummary(resp.data.chatSummary);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const toggleCollapse = (lawyerId) => {
    setExpandedLawyers((prev) => ({
      ...prev,
      [lawyerId]: !prev[lawyerId],
    }));
  };

  // Pagination logic
  const indexOfLastLawyer = currentPage * lawyersPerPage;
  const indexOfFirstLawyer = indexOfLastLawyer - lawyersPerPage;
  const currentLawyers = chatSummary.slice(indexOfFirstLawyer, indexOfLastLawyer);
  const totalPages = Math.ceil(chatSummary.length / lawyersPerPage);


  
  const [userSummary, setUserSummary] = useState([]);
const [expandedUsers, setExpandedUsers] = useState({});
const [currentPageUser, setCurrentPageUser] = useState(1);
const usersPerPage = 5; // adjust as needed

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const resp = await api.get("/api/admin/user-chat-summary");
      console.log(resp);
      
      setUserSummary(resp.data.userChatSummary); // array of users
    } catch (error) {
      console.error(error);
    }
  };
  fetchUserData();
}, []);

// Toggle collapsible user details
const toggleCollapseUser = (userId) => {
  setExpandedUsers((prev) => ({
    ...prev,
    [userId]: !prev[userId],
  }));
};

// Pagination logic
const indexOfLastUser = currentPageUser * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = userSummary.slice(indexOfFirstUser, indexOfLastUser);
const totalPagesUser = Math.ceil(userSummary.length / usersPerPage);


 const[get_first_chat_time_data,setget_first_chat_time_data]=useState([])

 const get_first_chat_time=async()=>
    {
      try {
        const resp=await api.get('api/admin/first_chat_time')
        setget_first_chat_time_data(resp.data.averageTimeMinutes)
        
      } catch (error) {
        console.log(error);
        
      }
    }

   
    

    useEffect(()=>
    {
      get_first_chat_time()

    },[])

    

  const data = {
    avgTimeToSwitch: switch_time,
    repeatInteractionsPercent: 45,
    avgSessionDuration: session_time,
    timeToFirstConsultation: get_first_chat_time_data,
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
          <h3 className="value">{data.avgTimeToSwitch} Minutes</h3>
        </div>
        <div className="card">
          <Repeat className="icon green" />
          <p className="label">Repeat Interactions %</p>
          <h3 className="value">{data.repeatInteractionsPercent}%</h3>
        </div>
        <div className="card">
          <Timer className="icon yellow" />
          <p className="label">Avg. Session Duration</p>
          <h3 className="value">{data.avgSessionDuration} Minutes</h3>
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
        <p className="big-value">{data.timeToFirstConsultation} Minutes</p>
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

      {/* lawyer chat summary   */}
     <div className="chat-summary-container">
      <h1 className="chat-summary-title">Lawyer Chat Summary</h1>

      <div className="chat-cards">
        {currentLawyers.map((lawyer) => {
          const totalChats = lawyer.users.reduce((acc, u) => acc + u.totalMessages, 0);

          return (
            <div key={lawyer.lawyerId} className="chat-card">
              {/* Header */}
              <div
                className="chat-card-header"
                onClick={() => toggleCollapse(lawyer.lawyerId)}
              >
                <div className="lawyer-info">
                  <div className="avatar">{lawyer.lawyerName.charAt(0)}</div>
                  <div>
                    <h2 className="lawyer-name">{lawyer.lawyerName}</h2>
                    <p className="lawyer-stats">
                      Total Users: {lawyer.totalUsers} | Total Chats: {totalChats}
                    </p>
                  </div>
                </div>
                <div className="collapse-icon">
                  {expandedLawyers[lawyer.lawyerId] ? "▲" : "▼"}
                </div>
              </div>

              {/* Users */}
              {expandedLawyers[lawyer.lawyerId] && (
                <div className="user-list">
                  {lawyer.users.map((user) => (
                    <div key={user.userId} className="user-card">
                      <div className="user-info">
                        <div className="user-avatar">{user.userName.charAt(0)}</div>
                        <div>
                          <p className="user-name">{user.userName}</p>
                          <p className="user-stats">
                            Messages: {user.totalMessages}
                             {/* | Duration: {user.durationMinutes} min */}
                          </p>
                        </div>
                      </div>
                      <span className="chat-icon">💬</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>

       {/*user chat summary   */}
     <div className="chat-summary-container">
      <h1 className="chat-summary-title">User Chat Summary</h1>

      <div className="chat-cards">
  {currentUsers.map((user) => {
    const totalChats = user?.lawyers?.reduce((acc, l) => acc + l.totalMessages, 0);

    return (
      <div key={user.userId} className="chat-card">
        {/* Header */}
        <div
          className="chat-card-header"
          onClick={() => toggleCollapseUser(user.userId)}
        >
          <div className="user-info">
            <div className="avatar">{user?.userName?.charAt(0)}</div>
            <div>
              <h2 className="user-name">{user?.userName}</h2>
              <p className="user-stats">
                Total Lawyers: {user?.totalLawyers} | Total Chats: {totalChats}
              </p>
            </div>
          </div>
          <div className="collapse-icon">
            {expandedUsers[user.userId] ? "▲" : "▼"}
          </div>
        </div>

        {/* Lawyers (Collapsible) */}
        {expandedUsers[user.userId] && (
          <div className="lawyer-list">
            {user.lawyers.map((lawyer) => (
              <div key={lawyer.lawyerId} className="lawyer-card">
                <div className="lawyer-info">
                  <div className="lawyer-avatar">{lawyer.lawyerName.charAt(0)}</div>
                  <div>
                    <p className="lawyer-name">{lawyer.lawyerName}</p>
                    <p className="lawyer-stats">
                      Messages: {lawyer.totalMessages}
                       {/* | Duration: {Math.round(lawyer.durationMinutes)} min */}
                        | Sessions: {lawyer.sessionCount}
                    </p>
                  </div>
                </div>
                <span className="chat-icon">💬</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })}
</div>


      {/* Pagination */}
      {totalPagesUser > 1 && (
        <div className="pagination">
          <button
            disabled={currentPageUser === 1}
            onClick={() => setCurrentPageUser(currentPageUser - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPageUser} of {totalPagesUser}
          </span>
          <button
            disabled={currentPageUser === totalPagesUser}
            onClick={() => setCurrentPageUser(currentPageUser + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>

  


    
    </div>

    </main>

      </div>
  );
};

export default AdminReport;
