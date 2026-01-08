"use client"
import React from "react";
import { useRef,useState,useEffect } from "react";
import '../components/css/OnlineLawyerConsultation.css'; // Uncomment after you add the CSS
import Swal from 'sweetalert2';
import api from '../components/api';
import { HiOutlinePaperClip } from 'react-icons/hi';
import { IoSend } from 'react-icons/io5';
import { FaRegCommentDots } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { NAVIGATION_CONSTANTS } from "../components/_constants/navigationConstants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const navigate = useRouter();

  const coverCards = [
    {
      title: "Legal Notices",
      img: "https://assets.vakilsearch.com/consult_legal_notices.svg",
    },
    {
      title: "Company Law Matters",
      img: "https://assets.vakilsearch.com/consult_company.svg",
    },
    {
      title: "Legal Documentation",
      img: "https://assets.vakilsearch.com/consult_legal_documentation.svg",
    },
    {
      title: "Others",
      img: "https://assets.vakilsearch.com/consult_others.svg",
    },
    {
      title: "Property Lawyer",
      img: "https://assets.vakilsearch.com/consult_property.svg",
    },
    {
      title: "Family Lawyer",
      img: "https://assets.vakilsearch.com/consult_family.svg",
    },
    {
      title: "Consumer Lawyer",
      img: "https://assets.vakilsearch.com/consult_consumer.svg",
    },
    {
      title: "Civil Lawyer",
      img: "https://assets.vakilsearch.com/consult_civil.svg",
    },
    {
      title: "Criminal Lawyer",
      img: "https://assets.vakilsearch.com/consult_criminal.svg",
    },
    {
      title: "IP Lawyer",
      img: "https://assets.vakilsearch.com/consult_ip.svg",
    },
    {
      title: "Labour Lawyer",
      img: "https://assets.vakilsearch.com/consult_labour.svg",
    },
    {
      title: "Constitutional Lawyer",
      img: "https://assets.vakilsearch.com/consult_constitutional.svg",
    },
  ];

  const CARDS_PER_PAGE = 4;

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(coverCards.length / CARDS_PER_PAGE);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  const start = page * CARDS_PER_PAGE;
  const visibleCards = coverCards.slice(start, start + CARDS_PER_PAGE);

  const consultants = [
    {
      name: "SJ Anakha",
      img: "https://assets.vakilsearch.com/live-images/ttl/authors-anakha.svg",
      desc: "Solves cheque bounce, money recovery & DRT cases.",
      experience: "5 years of Experience",
    },
    {
      name: "Kanisha",
      img: "https://assets.vakilsearch.com/live-images/ttl/authors-kanisha.svg",
      desc: "Handles succession, registration, verification of property efficiently.",
      experience: "3 years of Experience",
    },
    {
      name: "Srijita",
      img: "https://assets.vakilsearch.com/live-images/ttl/authors-srijitha.svg",
      desc: "Handles accident claims, employment issues, consumer complaints.",
      experience: "8 years of Experience",
    },
    {
      name: "Kavitha Natesan",
      img: "https://assets.vakilsearch.com/live-images/ttl/kavitha-natesan.svg",
      desc: "Cheque Bounce, GST Consultant",
      experience: "12 years of Experience",
    },
  ];

  const CARDS_PER_PAGE1 = 3;
  const [page1, setPage1] = useState(0);
  const totalPages1 = Math.ceil(consultants.length / CARDS_PER_PAGE1);

  const handlePrev1 = () => setPage1((p) => Math.max(p - 1, 0));
  const handleNext1 = () => setPage1((p) => Math.min(p + 1, totalPages - 1));

  const start1 = page1 * CARDS_PER_PAGE1;
  const visibleConsultants = consultants.slice(
    start1,
    start1 + CARDS_PER_PAGE1
  );

  const legalPoints = [
    {
      title: "Expert Guidance:",
      desc: " A lawyer understands the law and can guide you through complex legal processes.",
    },
    {
      title: "Right Representation:",
      desc: "Whether you're facing a dispute, sending/receiving a legal notice, or filing a complaint — a lawyer ensures your rights are protected. ",
    },
    {
      title: "Risk Reduction:",
      desc: "Avoid costly mistakes or penalties by having a professional represent you. ",
    },
    {
      title: "Peace of Mind:",
      desc: " Knowing you have someone experienced handling your legal matter helps reduce stress. ",
    },
    {
      title: "Better Negotiation:",
      desc: " Lawyers can communicate formally and effectively, often leading to better outcomes.",
    },
  ];

  const legalExpertise = [
    {
      title: "Criminal Case ",
      img: "https://assets.vakilsearch.com/consult_civil.svg",
      alt: "Family Lawyer",
      link: "https://www.zolvit.com/lawyers/family",
      description: `Criminal cases involve actions that are considered offenses against society or the 
state. These include crimes like theft, assault, fraud, murder, cybercrime, and more. 
A criminal lawyer defends individuals accused of such crimes or helps victims file 
complaints and pursue justice under the Indian Penal Code (IPC). `,
    },
    {
      title: "Civil Case",
      img: "https://assets.vakilsearch.com/consult_property.svg",
      alt: "Property Lawyer",
      link: "https://www.zolvit.com/lawyers/property",
      description: `Civil cases deal with personal disputes between individuals or organizations. 
Common civil matters include property disputes, breach of contract, loan recovery, 
defamation, and more. Civil lawyers help in filing suits, sending legal notices, and 
court representation.`,
    },
    {
      title: "Family Case",
      img: "https://assets.vakilsearch.com/consult_family.svg",
      alt: "Civil Lawyer",
      link: "https://www.zolvit.com/lawyers/civil",
      description: `Family cases include legal issues related to personal relationships such as marriage, 
divorce, child custody, maintenance, domestic violence, and inheritance. A family 
lawyer helps resolve these matters through court or mutual agreement. `,
    },
    {
      title: "Corporate Case",
      img: "https://assets.vakilsearch.com/consult_company.svg",
      alt: "Business Lawyer",
      link: "https://www.zolvit.com/lawyers/business",
      description: `Corporate legal cases involve legal matters related to companies and business 
operations. This includes company registration, mergers, shareholder disputes, 
regulatory compliance, and corporate fraud. Corporate lawyers work with businesses 
of all sizes.`,
    },
    {
      title: "Consumer Case",
      img: "https://assets.vakilsearch.com/consult_criminal.svg",
      alt: "Criminal Lawyer",
      link: "https://www.zolvit.com/lawyers/criminal",
      description: `Consumer cases are filed when a consumer faces fraud, poor service, or defective 
products. A consumer lawyer helps you file a complaint in the consumer court and 
ensures your consumer rights are protected.`,
    },
    {
      title: "Labour Case",
      img: "https://assets.vakilsearch.com/consult_labour.svg",
      alt: "Consumer Lawyer",
      link: "https://www.zolvit.com/lawyers/consumer",
      description: ` Labour or employment cases deal with disputes between employers and employees. 
This includes wrongful termination, unpaid wages, harassment at work, and labor law 
violations. Labour lawyers ensure your rights at the workplace are legally protected.`,
    },
    {
      title: "Cyber Case",
      img: "https://assets.vakilsearch.com/consult_consumer.svg",
      alt: "Labour Lawyer",
      link: "https://www.zolvit.com/lawyers/labour",
      description: `Cyber legal cases involve crimes committed using the internet or digital platforms. 
Common examples include online fraud, cyberbullying, hacking, financial scams, 
identity theft, and data breaches. A cyber lawyer helps file complaints and take legal 
action under the IT Act.`,
    },
    {
      title: "Property Case",
      img: "https://assets.vakilsearch.com/consult_constitutional.svg",
      alt: "Constitutional Lawyer",
      link: "https://www.zolvit.com/lawyers/constitutional",
      description: ` Property cases include land disputes, illegal possession, boundary issues, ancestral 
property conflicts, and builder fraud. A property lawyer helps in title verification, 
property transfer, and litigation.`,
    },
    {
      title: "Tax Case",
      img: "https://assets.vakilsearch.com/consult_ip.svg",
      alt: "Intellectual Property (IP) Lawyer",
      link: "https://www.zolvit.com/lawyers/intellectual-property",
      description: `Tax cases involve issues with income tax, GST, business tax disputes, or notices 
from tax authorities. A tax lawyer or consultant helps with tax filing, appeals, audits, 
and notices from the Income Tax Department.`,
    },
  ];

  const onlineBenefits = [
    {
      title: "Save Time & Effort",
      desc: " No need to visit chambers or courts just for a consultation.",
    },
    {
      title: "Convenient Access",
      desc: " Talk to a verified lawyer from anywhere using your phone or laptop.",
    },
    {
      title: "Discreet & Confidential",
      desc: " Private legal matters stay private — you choose when and how to talk.",
    },
    {
      title: "Faster Solutions",
      desc: " Quick answers to urgent questions like legal notices, challans, disputes, etc.",
    },
    {
      title: "Affordable Options",
      desc: "Flexible consultation options compared to traditional visits.",
    },
    {
      title: "Wide Choice",
      desc: "Access lawyers from various practice areas — all in one place.",
    },
  ];

  const whyZolvitCards = [
    {
      img: "https://assets.vakilsearch.com/live-images/whyZolvit1.svg",
      desc: "No waiting, no booking — connect with available lawyers immediately via chat or call.",
    },
    {
      img: "https://assets.vakilsearch.com/live-images/whyZolvit2.svg",
      desc: "From civil and criminal to family, consumer, cyber, and more — we connect you with the right expert. ",
    },
    {
      img: "https://assets.vakilsearch.com/live-images/whyZolvit3.svg",
      desc: "Every lawyer on our platform is verified for qualification and authenticity. ",
    },
    {
      img: "https://assets.vakilsearch.com/live-images/whyZolvit4.svg",
      desc: " Just open the app or website, choose your issue, and talk to a lawyer — it's that simple.",
    },
    {
      img: "https://assets.vakilsearch.com/live-images/whyZolvit5.svg",
      desc: " Access legal support even from remote areas or small towns.",
    },
    {
      img: "https://assets.vakilsearch.com/live-images/whyZolvit6.svg",
      desc: "Your data and conversations stay safe, and pricing (if any) is always shown upfront.",
    },
  ];

  const categories = [
    {
      title: "Property & Real Estate",
      services: [
        "Land Acquisition Matters",
        "Property Registration",
        "Property Verification",
        "Estate Planning",
        "Property Succession",
        "Will Drafting and Registration",
        "Landlord/Tenant Disputes",
        "RERA Consultation",
        "Relinquishment Deed",
        "Power of Attorney",
        "Gift Deed",
        "Rental Tenant Notice",
        "Mutation of Property",
        "Partition Suit",
      ],
    },
    {
      title: "Family & Personal Law",
      services: [
        "Family Lawyer",
        "Divorce & Matrimonial Consultation",
        "Maintenance and Alimony",
        "Child Custody and Guardianship",
        "Muslim Personal Law Matters",
        "Domestic Violence Cases",
        "Legal Heir Certificate",
        "Dowry Harassment Cases",
        "Judicial Separation",
        "Adoption & Guardianship Matters",
      ],
    },
    {
      title: "Civil Law",
      services: [
        "Civil Lawyer",
        "Defamation Cases",
        "Legal Notices",
        "Cheque Bounce Cases",
        "Money Recovery Issues",
        "Mediation / Arbitration",
        "Writ Petition / PIL",
        "Loan Recovery / Bank Account Freeze-Unfreeze",
        "E-Court Filing Procedures",
        "National Green Tribunal Cases",
        "Debt Recovery Tribunal (DRT)",
        "Motor Accident Claims / Traffic Challans",
        "MSME Samadhan / MSME Recovery",
        "Insolvency & Bankruptcy Code (IBC)",
        "Rent Control Matters",
        "Legal Retainer Services",
        "Partition Suits",
        "Civil Injunctions",
      ],
    },
    {
      title: "Cyber Law",
      services: [
        "Cyber Lawyer",
        "Cyber Crime Complaints",
        "Online Fraud / Scam Complaints",
        "IT Act Violations",
        "Social Media Defamation",
        "Hacking / Data Theft Cases",
        "Phishing and Online Financial Frauds",
        "Cyberbullying and Online Harassment",
        "Unauthorized Access / Privacy Breach",
        "Filing Cyber Complaints via Cyber Cells",
      ],
    },
    {
      title: "Criminal Law",
      services: [
        "Criminal Lawyer",
        "Criminal Bail Application",
        "NDPS (Drugs & Psychotropic Substances Act)",
        "Criminal Trial Court Matters",
        "File a Criminal Complaint",
        "Quashing of FIR",
        "Criminal Appeals and Revisions",
        "Anticipatory Bail",
        "White Collar Crimes",
      ],
    },
    {
      title: "Consumer Law",
      services: [
        "Consumer Lawyer",
        "File a Consumer Case",
        "Consumer Law Consultation",
        "Misleading Advertisements Cases",
        "Defective Product / Service Complaints",
        "Legal Notices under Consumer Law",
        "Delay in Service or Possession (e.g., real estate)",
      ],
    },
    {
      title: "Corporate & Business Law",
      services: [
        "Company Law & Corporate Compliance",
        "Legal Retainer for Companies",
        "Political Party Registration",
        "Company / LLP / Startup Incorporation",
        "ESOP & Fundraising Consultation",
        "Business Debt Restructuring",
        "Drug & Cosmetic License",
        "Legal Metrology License",
        "POSH Internal Committee Setup",
        "Business Contracts & Documentation",
        "Business Due Diligence",
        "Barcode & BIS License",
        "ROC Filings & MCA Compliance",
      ],
    },
    {
      title: "Labour & Employment Law",
      services: [
        "Labour Lawyer",
        "Employment Disputes (Employee/Employer)",
        "POSH Sexual Harassment at Workplace",
        "CLRA (Contract Labour Regulation)",
        "Gratuity / Provident Fund Disputes",
        "Termination & Severance Advisory",
        "Drafting Employment Contracts",
      ],
    },
    {
      title: "Legal Notices & Drafting",
      services: [
        "Legal Notice Drafting",
        "Drafting & Sending Legal Notices",
        "Legal Notice for Recovery of Dues",
        "Cheque Bounce Legal Notice",
        "Legal Notice under Consumer Protection",
        "Contract Breach Notice",
      ],
    },
  ];

  const [openIndex, setOpenIndex] = React.useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(idx === openIndex ? null : idx);
  };

  const [specialization, setSpecialization] = useState("");
  const [court, setcourt] = useState("");
  const [language, setlanguage] = useState("");

  const SPECIALIZATIONS = [
    { value: "", label: "Select Specialization" },
    { value: "property lawyer", label: "Property Lawyer" },
    { value: "family lawyer", label: "Family Lawyer" },
    { value: "civil lawyer", label: "Civil Lawyer" },
    { value: "cyber lawyer", label: "Cyber Lawyer" },
    { value: "criminal lawyer", label: "Criminal Lawyer" },
    { value: "consumer lawyer", label: "Consumer Lawyer" },
    { value: "labour lawyer", label: "Labour Lawyer" },
    { value: "legal notice drafting", label: "Legal Notice Drafting" },
    {
      value: "company law & corporate compliance",
      label: "Company Law & Corporate Compliance",
    },
  ];

  const Courts = [
    { value: "", label: "Select Courts" },
    { value: "other", label: "Other" },
    { value: "tis_hazari_court", label: "Tis Hazari Court" },
    { value: "saket_court", label: "Saket Court" },
    { value: "karkardooma_court", label: "Karkardooma Court" },
    { value: "patiala_house_court", label: "Patiala House Court" },
    { value: "rohini_court", label: "Rohini Court" },
    { value: "dwarka_court", label: "Dwarka Court" },
    { value: "rouse_avenue_court", label: "Rouse Avenue Court" },
    { value: "high_court", label: "High Court" },
  ];

  const languages = [
    { value: "", label: "Select language" },
    { value: "hindi", label: "Hindi" },
    { value: "english", label: "English" },
  ];




  //=============================== Filter lawyers based on search===================================

  const case_type = async (specialization) => {
    try {
      const payload = { type_of_case: specialization };

      const resp = await api.post("api/admin/case-type", payload);
    } catch (error) {
      console.log(error);
    }
  };

  const filterLawyersAndChat = () => {
    if (!userData?.user._id) {
      return navigate.push(NAVIGATION_CONSTANTS.LOGIN_PATH);
    }

    setIsLoading(true);
    setTimeout(async () => {
      setIsLoading(false);

      let filtered = lawyers.filter((lawyer) =>
        onlineLawyers.includes(lawyer._id)
      );

      // ✅ Must match specialization
      if (specialization) {
        case_type(specialization);
        filtered = filtered.filter((lawyer) =>
          Array.isArray(lawyer.specializations)
            ? lawyer.specializations.some(
                (spec) =>
                  (spec.label &&
                    spec.label
                      .toLowerCase()
                      .includes(specialization.toLowerCase())) ||
                  (spec.value &&
                    spec.value
                      .toLowerCase()
                      .includes(specialization.toLowerCase()))
              )
            : (
                lawyer.specializations?.label ||
                lawyer.specializations?.value ||
                lawyer.specializations ||
                ""
              )
                .toLowerCase()
                .includes(specialization.toLowerCase())
        );
      }

      // ✅ Must match language
      if (language) {
        filtered = filtered.filter((lawyer) =>
          Array.isArray(lawyer.languages)
            ? lawyer.languages.some(
                (lang) =>
                  (lang.label &&
                    lang.label
                      .toLowerCase()
                      .includes(language.toLowerCase())) ||
                  (lang.value &&
                    lang.value.toLowerCase().includes(language.toLowerCase()))
              )
            : (
                lawyer.languages?.label ||
                lawyer.languages?.value ||
                lawyer.languages ||
                ""
              )
                .toLowerCase()
                .includes(language.toLowerCase())
        );
      }

      // ✅ Court is optional
      let courtMatched = [];
      if (court && court.trim() !== "") {
        courtMatched = filtered.filter(
          (lawyer) =>
            Array.isArray(lawyer.practicingcourts) &&
            lawyer.practicingcourts.some((c) =>
              [c.label, c.value].some(
                (v) => v && v.toLowerCase() === court.toLowerCase()
              )
            )
        );
      }

      // ✅ If courtMatched not empty, prefer it. Otherwise keep specialization+language result
      if (courtMatched.length > 0) {
        filtered = courtMatched;
      }

      // ✅ No lawyers found after filtering
      if (filtered.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Search result...",
          text: "No lawyers available.",
          showConfirmButton: "true",
        });
        return;
      }

      // ✅ Try to find an online lawyer
      let candidates = [...filtered];
      while (candidates.length > 0) {
        const idx = Math.floor(Math.random() * candidates.length);
        const candidate = candidates[idx];
        if (onlineLawyers.includes(candidate._id)) {
          await handleOpenChat(candidate);

          handleSendMessage("hello", candidate);
          return;
        }
        candidates.splice(idx, 1);
      }

      // ✅ No online lawyer in filtered
      Swal.fire({
        icon: "info",
        title: "Search result...",
        text: "No lawyers available online.",
        showConfirmButton: "true",
      });
    }, 2000);
  };

  return (
    <div>
      <Header/>
      <div className="olc-root">
        <section className="olc-banner-bg">
          <div className="olc-banner" id="main-banner">
            <div className="olc-banner-content">
              {/* Left: Headline and Benefits */}
              <div className="olc-banner-left">
                <div className="olc-process-desktop">
                  <p className="olc-process-title">Process</p>
                  <div className="olc-process-steps">
                    <div className="olc-process-step">
                      <span style={{ fontSize: "32px" }} className="icons">
                        📝
                      </span>
                      <span>Select details</span>
                    </div>
                    <span
                      className="arrow"
                      style={{
                        fontSize: "32px",
                        background: "#2d3a5c",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "bold",
                      }}
                    >
                      &gt;&gt;
                    </span>
                    <div className="olc-process-step">
                      <span style={{ fontSize: "32px" }} className="icons">
                        ⏳
                      </span>
                      <span>Wait for a few minutes</span>
                    </div>
                    <span
                      className="arrow"
                      style={{
                        fontSize: "32px",
                        background: "#2d3a5c",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "bold",
                      }}
                    >
                      &gt;&gt;
                    </span>
                    <div className="olc-process-step">
                      <span style={{ fontSize: "32px" }} className="icons">
                        💬
                      </span>
                      <span>Chat with lawyer</span>
                    </div>
                  </div>
                </div>
                {/* Process Steps (Mobile) */}
                {/* <div className="olc-process-mobile">
          <p className="olc-process-title">Process</p>
          <div className="olc-process-steps">
           <div className="olc-process-step">
     <span style={{ fontSize: '32px' }}>📝</span>
    <span>Select details</span>
  </div>
  <div className="olc-process-step">
    <span style={{ fontSize: '32px' }}>⏳</span>
    <span>Wait for a few minutes</span>
  </div>
  <div className="olc-process-step">
    <span style={{ fontSize: '32px' }}>💬</span>
    <span>Chat with lawyer</span>
  </div>
          </div>
        </div> */}

                <div className="findlawyer">
                  <div className="findlawyer-glass" />
                  <h2 className="findlawyer-title">🔎 Find a Lawyer</h2>
                  <div className="findlawyer-controls">
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="findlawyer-select"
                    >
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec.value} value={spec.value}>
                          {spec.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={court}
                      onChange={(e) => setcourt(e.target.value)}
                      className="findlawyer-select"
                    >
                      {Courts.map((st) => (
                        <option key={st.value} value={st.value}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={language}
                      onChange={(e) => setlanguage(e.target.value)}
                      className="findlawyer-select"
                    >
                      {languages.map((st) => (
                        <option key={st.value} value={st.value}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="action-btn findlawyer-btn"
                      title="Chat Now"
                      onClick={filterLawyersAndChat}
                    >
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <section className="legal-queries-section">
              <h2 className="section-title">Most Asked Legal Queries</h2>
              <div className="queries-grid">
                <div
                  className="query-card"
                  onClick={() => setSpecialization("civil lawyer")}
                >
                  {/* <span className="query-icon">🚗</span> */}
                  <h3>Car Challan</h3>
                  {/* <p>Information and help regarding traffic fines and challans.</p> */}
                </div>
                {/* <div className="query-card">
      <span className="query-icon">📄</span>
      <h3>Legal Notice</h3>
      {/* <p>Drafting and responding to legal notices efficiently.</p> 
    </div> */}
                <div
                  className="query-card"
                  onClick={() => setSpecialization("legal notice drafting")}
                >
                  {/* <span className="query-icon ">💸</span> */}
                  <h3>Cheque Bounce</h3>
                  {/* <p>Guidance on cheque bounce cases and legal remedies.</p> */}
                </div>
                <div
                  className="query-card"
                  onClick={() => setSpecialization("consumer lawyer")}
                >
                  {/* <span className="query-icon">📦</span> */}
                  <h3>Product/Service Default</h3>
                  {/* <p>Assistance for faulty products or unsatisfactory services.</p> */}
                </div>
                <div
                  className="query-card"
                  onClick={() => setSpecialization("cyber lawyer")}
                >
                  {/* <span className="query-icon">🕵️</span> */}
                  <h3>Online Fraud</h3>
                  {/* <p>Support for victims of cyber fraud and scams.</p> */}
                </div>
              </div>
            </section>
          </div>

          <section className="lawyer-help-section">
            <h2 className="help-title">Not sure which type of lawyer you need?</h2>
            <p className="help-desc">
              No problem!{" "}
              <a
                href="https://www.google.com/"
                target="_blank"
                className="google-link"
              >
                Click here
              </a>{" "}
              and type the following:<br></br>
              <span className="help-template">
                "My legal issue is [your case]. What category of lawyer do I
                need — criminal, civil, family, corporate, consumer, labour, or
                cyber?"
              </span>
            </p>
            <div className="help-example">
              <strong>Example:</strong>
              <br></br>
              My legal issue is my employer is not paying my salary. What
              category of lawyer do I need — criminal, civil, family, corporate,
              consumer, labour, or cyber?
            </div>
          </section>

          <section className="olc-expertise-section">
            <h2 className="olc-expertise-title">Legal Matter Categories</h2>
            <div className="olc-expertise-list">
              {legalExpertise.map((area, idx) => (
                <div className="olc-expertise-card" key={area.title}>
                  <img
                    src={area.img}
                    alt={area.alt}
                    className="olc-expertise-img"
                    loading="lazy"
                  />
                  <div className="olc-expertise-content">
                    <p className="olc-expertise-area">
                      <a
                        href={area.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {area.title}
                      </a>
                    </p>
                    <p className="olc-expertise-desc">{area.description}</p>
                    {/* <a href={area.link} target="_blank" rel="noopener noreferrer">
              <button className="olc-expertise-btn">{area.cta}</button>
            </a> */}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="legal-services-container">
            <h2 className="legal-services-heading">
              Services Provided by Lawyers
            </h2>
            <div className="service-card-grid">
              {categories.map((cat) => (
                <div key={cat.title} className="service-card">
                  <div className="category-title">{cat.title}</div>
                  <ul className="service-list">
                    {cat.services.map((srv) => (
                      <li key={srv}>{srv}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <section className="olc-legalrep-section">
            <div className="olc-legalrep-container">
              <h2 className="olc-legalrep-title">
                Importance of Legal Representation
              </h2>
              <p className="olc-legalrep-lead">
                Having skilled legal representation ensures your rights are
                protected and offers expert guidance through complex legal
                matters. A qualified lawyer provides strategic advice, minimises
                risks, and strengthens your position in disputes or
                negotiations. Below are some reasons for hiring a lawyer:
              </p>
              <ul className="olc-legalrep-list">
                {legalPoints.map((point, idx) => (
                  <li className="olc-legalrep-listitem" key={idx}>
                    <span className="olc-legalrep-dot"></span>
                    <span>
                      <b>{point.title}</b> {point.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="olc-benefits-section">
            <h2 className="olc-benefits-title">
              Benefits of Online Lawyer Consultation
            </h2>
            <div className="olc-benefits-wrapper">
              <p className="olc-benefits-lead">
                Online lawyer consultations offer numerous advantages that
                enhance your legal experience. Here’s how you can benefit:
              </p>
              <div className="olc-benefits-list-bg">
                <div className="olc-benefits-list">
                  {onlineBenefits.map((item, idx) => (
                    <div className="olc-benefit-card" key={idx}>
                      <p className="olc-benefit-title">{item.title}:</p>
                      <p className="olc-benefit-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="olc-whyzolvit-section">
            <div className="olc-whyzolvit-container">
              <h2 className="olc-whyzolvit-title">
                Why Choose Counvo For Online Legal Consultation?
              </h2>
              <p className="olc-whyzolvit-lead">
                Counvo offers tailored legal support, ensuring that you are
                connected with experienced lawyers. Whether it be corporate,
                personal, business, or IP law, we provide access to a network of
                skilled Lawyers across various niches. Our platform simplifies
                the process, offering transparent communication, efficient legal
                counsel, and ongoing support throughout the legal process.
                Choose Zolvit for comprehensive legal solutions, personalised
                attention, and a hassle-free experience in securing the best
                legal consultation for your case.
              </p>
              <div className="olc-whyzolvit-grid">
                {whyZolvitCards.map((card, idx) => (
                  <div className="olc-whyzolvit-card" key={idx}>
                    <div className="olc-whyzolvit-img-bg">
                      <img
                        src={card.img}
                        alt=""
                        className="olc-whyzolvit-img"
                        loading="lazy"
                      />
                      <img
                        src="https://assets.vakilsearch.com/live-images/bg.svg"
                        alt=""
                        className="olc-whyzolvit-bg"
                        aria-hidden="true"
                        loading="lazy"
                      />
                    </div>
                    <p className="olc-whyzolvit-desc">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/*========================================= chat section start============================================================= */}
          <style>{`

  .lawyers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .lawyer-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .lawyer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
          background: white;
        }

        .lawyer-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #3b82f6;
          margin: 0 auto 1rem;
        }

        .lawyer-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .lawyer-status {
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .lawyer-details {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .lawyer-actions {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
        }

        .action-btn {
          background: white;
          color:blue;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
        }
      .chat-popup {
          position: fixed;
          bottom: 10px;
          left:40%;
          width: 480px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .message {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 18px;
          font-size: 0.875rem;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message.sent {
          align-self: flex-end;
          background: #3b82f6;
          color: white;
        }

        .message.received {
          align-self: flex-start;
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }

        .message.system {
          align-self: center;
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
          text-align: center;
          font-style: italic;
        }

     .chat-input {
       width:85%;
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: white;
  gap: 0.5rem;
}


      .chat-input input {
  flex: 1 1 auto;

  padding: 0.75rem 1rem;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
  background: #fff;
}
  .actionbutton{
        margin-top:10px !important;
  }


        .chat-input input:focus {
          border-color: #3b82f6;
        }

  
    @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .time-info {
            flex-direction: column;
            gap: 0.5rem;
          }

          .lawyers-grid {
            grid-template-columns: 1fr;
          }

          .chat-popup {
            width: calc(100vw - 20px);
            height: calc(100vh - 100px);
            bottom: 10px;
            right: 10px;
            left: 10px;
          }
              @media (max-width: 1024px) {
    .lawyers-grid {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .chat-popup {
      width: 320px;
      height: 450px;
    }
  }

@media (max-width: 480px) {
  .main1 {
    margin-left: 0px;
  }
  .lawyers-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .chat-popup {
    width: 100vw;
    height: 100% !important;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
  }
  .chat-header {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    height: 56px;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }
  .header-actions {
    margin-left: 0;
    margin-top: 0;
    display: flex;
    gap: 0.5rem;
  }
 .chat-input {
    padding-bottom: 2.5rem;
    gap: 0.25rem;
  }
  .chat-input input {
    font-size: 1rem;
    padding: 0.65rem 1rem;
    width:70%
  }
    .actionbutton
    {
    margin-top:5px !important;
    }

  select {
    min-width: 100% !important;
  }
  .main1 > div {
    padding: 20px 8px !important;
  }
    .typing-indicator
    {
        position:absolute;
        padding-left:40%;
        margin-top:-10px;
    }
    
}
    @media (max-width: 380px) {
     .actionbutton
    {
    margin-top:-10px !important;
    }

      }

      
        
      `}</style>

        
        </section>
        <Footer/>
      </div>

   

     
    </div>
  );
};

export default Home;
