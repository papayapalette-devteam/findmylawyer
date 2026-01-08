"use client"
import React from "react";
import Link from "next/link";
import { Server, Lock, Eye, FileCheck, ArrowRight } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const Security = () => {
  const securityFeatures = [
    {
      icon: Server,
      title: "Your Infrastructure, Your Control",
      description:
        "All AI systems run on your servers and cloud accounts. Your data never touches third-party systems or external AI providers unless you explicitly choose to integrate them.",
      details: [
        "Deploy on your AWS, Azure, or Google Cloud",
        "On-premise deployment options available",
        "No vendor lock-in or proprietary platforms",
        "Complete control over data residency",
      ],
    },
    {
      icon: Lock,
      title: "Full Data Ownership",
      description:
        "You own every byte of data your systems generate and process. No training on your data, no data mining, no hidden sharing with third parties.",
      details: [
        "Zero data collection by IntelliviaAI",
        "No telemetry or analytics pipelines",
        "Your intellectual property stays yours",
        "Compliance with GDPR, HIPAA, and other regulations",
      ],
    },
    {
      icon: Eye,
      title: "Transparent Workflows",
      description:
        "Every automation is fully documented and auditable. No black-box AI making decisions you can't explain or understand.",
      details: [
        "Complete process documentation",
        "Decision logic is explainable and auditable",
        "Full logging and monitoring capabilities",
        "No proprietary 'magic' you can't inspect",
      ],
    },
    {
      icon: FileCheck,
      title: "Enterprise-Grade Security",
      description:
        "Built with security best practices from day one. Regular audits, encrypted communications, and role-based access control.",
      details: [
        "End-to-end encryption for data in transit",
        "Encrypted storage at rest",
        "Role-based access control (RBAC)",
        "Regular security audits and updates",
      ],
    },
  ];

  return (
    <div>
        <Header/>
      {/* Hero */}
      <section
        className="section-spacing"
        style={{
          paddingTop: "160px",
          paddingBottom: "96px",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h1 className="hero-headline" style={{ marginBottom: "24px" }}>
            Security & Ownership
            <br />
            <span className="accent-text">Built Into Everything</span>
          </h1>
          <p
            className="body-text-large"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              color: "#666666",
            }}
          >
            Your business data is your most valuable asset. Our AI systems are
            designed to keep it under your complete control—always.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="section-spacing" style={{ backgroundColor: "#fafafa" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "96px" }}>
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isEven ? "1fr 1fr" : "1fr 1fr",
                    gap: "64px",
                    alignItems: "center",
                  }}
                  className="security-feature"
                >
                  <div style={{ order: isEven ? 1 : 2 }}>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #e5e5e5",
                        borderRadius: "4px",
                        backgroundColor: "#FFFFFF",
                        marginBottom: "24px",
                      }}
                    >
                      <Icon size={40} strokeWidth={1.5} />
                    </div>
                    <h2
                      style={{
                        fontSize: "32px",
                        fontWeight: 600,
                        marginBottom: "16px",
                      }}
                    >
                      {feature.title}
                    </h2>
                    <p className="body-text" style={{ color: "#666666" }}>
                      {feature.description}
                    </p>
                  </div>
                  <div
                    style={{
                      order: isEven ? 2 : 1,
                      backgroundColor: "#FFFFFF",
                      padding: "48px",
                      borderRadius: "4px",
                      border: "1px solid #e5e5e5",
                    }}
                  >
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {feature.details.map((detail, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              width: "6px",
                              height: "6px",
                              backgroundColor: "#0066cc",
                              borderRadius: "50%",
                              marginTop: "8px",
                              flexShrink: 0,
                            }}
                          />
                          <span className="body-text" style={{ color: "#1a1a1a" }}>
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="section-spacing">
        <div className="container">
          <h2 className="section-header" style={{ textAlign: "center" }}>
            Our Commitments
          </h2>
          <div className="grid-3">
            <div
              style={{
                padding: "48px",
                backgroundColor: "#fafafa",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                No Data Retention
              </h3>
              <p className="body-text" style={{ color: "#666666", margin: 0 }}>
                We don&apos;t store, log, or retain your business data. Once deployed,
                systems run entirely on your infrastructure.
              </p>
            </div>
            <div
              style={{
                padding: "48px",
                backgroundColor: "#fafafa",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Open Architecture
              </h3>
              <p className="body-text" style={{ color: "#666666", margin: 0 }}>
                All code and configurations are yours to inspect, modify, and
                control. No proprietary dependencies.
              </p>
            </div>
            <div
              style={{
                padding: "48px",
                backgroundColor: "#fafafa",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Complete Portability
              </h3>
              <p className="body-text" style={{ color: "#666666", margin: 0 }}>
                Systems are built to be portable. You can migrate or modify them
                without us if needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing" style={{ backgroundColor: "#fafafa" }}>
        <div
          className="container"
          style={{
            textAlign: "center",
            padding: "96px 48px",
            backgroundColor: "#000000",
            borderRadius: "4px",
            color: "#FFFFFF",
          }}
        >
          <h2
            style={{
              fontSize: "48px",
              fontWeight: 300,
              marginBottom: "24px",
            }}
          >
            Questions About Security?
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#a0a0a0",
              marginBottom: "48px",
              maxWidth: "600px",
              margin: "0 auto 48px",
            }}
          >
            We&apos;re happy to discuss our security practices and how we protect your
            data in detail.
          </p>
          <Link
            href="/contactus"
            className="btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .security-feature {
            grid-template-columns: 1fr !important;
          }
          .security-feature > div {
            order: 1 !important;
          }
        }
      `}</style>
      <Chatbot/>
      <Footer/>
    </div>
  );
};

export default Security;
