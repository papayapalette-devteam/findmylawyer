
"use client"
import React, { useState,useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import Swal from 'sweetalert2';
import api from '../components/api';
import socket from './socket';
import { NAVIGATION_CONSTANTS } from "../components/_constants/navigationConstants";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useRouter();
  const location = usePathname();


  // Helper to check active path (for subpaths)
  const isActive = (path) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };


  const [missingmessage, setmissingmessage] = useState(0);
  const [missingtext, setmissingtext] = useState("");
  useEffect(() => {
    socket.on("missedMessagesNotification", async (notifications) => {
      // Get unique client IDs to fetch
      const clientIds = [...new Set(notifications.map((n) => n._id))];

      // Fetch clients data from API
      const clientIdNameMap = {};
      await Promise.all(
        clientIds.map(async (id) => {
          try {
            const res = await api.get(`/api/lawyer/getlawyer/${id}`);
            clientIdNameMap[id] = res.data.firstName || "Lawyer";
          } catch {
            clientIdNameMap[id] = "Client"; // fallback
          }
        })
      );

      // Show notifications with correct names
      notifications.forEach(({ _id: clientId, count }) => {
        const name = clientIdNameMap[clientId] || clientId;
        setmissingmessage(count);
        setmissingtext(
          `You have ${count} unread message${
            count > 1 ? "s" : ""
          } from ${name}.`
        );

        // const name = clientIdNameMap[clientId] || clientId;
        // Swal.fire({
        //   icon: 'info',
        //   title: 'Unread Messages',
        //   text: `You have ${count} unread message${count > 1 ? 's' : ''} from ${name}.`,
        //   timer: 4000,
        //   showConfirmButton: true,
        // });
      });
    });

    return () => socket.off("missedMessagesNotification");
  }, []);

  const showmissingmessage = () => {
    //  socket.on('missedMessagesNotification', async (notifications) => {
    //   // Get unique client IDs to fetch
    //   const clientIds = [...new Set(notifications.map(n => n._id))];

    //   // Fetch clients data from API
    //   const clientIdNameMap = {};
    //   await Promise.all(clientIds.map(async (id) => {
    //     try {
    //       const res = await api.get(`/api/user/${id}`);
    //       clientIdNameMap[id] = res.data.fullName || 'Client';
    //     } catch {
    //       clientIdNameMap[id] = 'Client'; // fallback
    //     }
    //   }));

    //   // Show notifications with correct names
    //   notifications.forEach(({ _id: clientId, count }) => {
    //     const name = clientIdNameMap[clientId] || clientId;
    Swal.fire({
      icon: "info",
      title: "Unread Messages",
      text: missingtext,
      timer: 4000,
      showConfirmButton: true,
    }).then(() => {
      navigate.push("/clientchathistory");
    });

    // return () => socket.off('missedMessagesNotification');
  };

  return (
    <>
      <style>{`
        .header {
          display: flex;
          align-items: flex-start;
          height: 80px; 
          justify-content: space-between;
          background: #fff;
          padding: 10px 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          margin-top:-70px;
          height: 200px;
          cursor: pointer;
          object-fit: contain;
        }
          .logo1 {
          height: 50px;
          cursor: pointer;
          margin-left:-100
        }

        .nav-links {
          margin-top:10px !important;
          color: black;
          display: flex;
          gap: 30px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links li {
        
          cursor: pointer;
          font-weight: 500;
          position: relative;
          transition: color 0.2s;
        }

        .nav-links li.active {
          color: #1956d2;
        }

        .nav-links li.active::after {
          content: '';
          display: block;
          margin: 0 auto;
          width: 60%;
          border-bottom: 3px solid #1956d2;
          border-radius: 2px;
          animation: underlineGrow 0.3s cubic-bezier(.4,0,.2,1);
        }

        @keyframes underlineGrow {
          from { width: 0; }
          to { width: 60%; }
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: #333;
        }

        @media (max-width: 768px) {
          .nav-links {
            position: fixed;
            top:70px;
            left: 0;
            right: 0;
            background: #fff;
            flex-direction: column;
            gap: 20px;
            padding: 30px;
            transform: translateY(-120%);
            transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          }

           .logo {
           margin-top:-40px;
          height: 150px;
          cursor: pointer;
          object-fit: contain;
        }

          .nav-links.open {
            transform: translateY(0);
          }

          .hamburger {
          margin-top:30px !important;
            display: flex;
          }
        }
      `}</style>

      <header className="header">
        <img
          src="/Counvo Logo-01.png"
          alt="Logo"
          className="logo"
          onClick={() => {
            navigate.push("/");
            setMenuOpen(false);
          }}
        />

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li
            className={isActive("/") ? "active" : ""}
            onClick={() => {
              navigate.push("/");
              setMenuOpen(false);
            }}
          >
            Home
          </li>
          <li
            className={isActive("/about") ? "active" : ""}
            onClick={() => {
              navigate.push("/about");
              setMenuOpen(false);
            }}
          >
            About
          </li>
          <li
            className={isActive("/contact") ? "active" : ""}
            onClick={() => {
              navigate.push("/contactus");
              setMenuOpen(false);
            }}
          >
            Contact
          </li>
       

          <li
            onClick={() => {
              navigate.push("/signin");
              setMenuOpen(false);
            }}
            className={isActive("/login") ? "active" : ""}
          >
            Login
          </li>
        </ul>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>
    </>
  );
}
