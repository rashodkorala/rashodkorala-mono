"use client";

import React, { useState } from "react";
import { jakartaSans } from "@/lib/font";
import { supabase } from "@/lib/supabase";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
}

const contactDetails = [
  { label: "Email",    value: "hello@rashodkorala.com", href: "mailto:hello@rashodkorala.com" },
  { label: "Based in", value: "Canada",                   href: null },
  { label: "GitHub",   value: "rashodkorala",             href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", value: "rashodk",                  href: "https://linkedin.com/in/rashodk" },
  { label: "Response", value: "Within 48 hours",          href: null },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{
        fontSize: "clamp(10px, 0.8vw, 12px)",
        color: "var(--color-body-secondary)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontFamily: jakartaSans,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactContent() {
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", email: "",
    company: "", projectType: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { error: sbError } = await supabase.from("contact_submissions").insert({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        company: form.company || null,
        project_type: form.projectType || null,
        message: form.message,
      });
      if (sbError) throw sbError;
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try emailing me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .ct-input, .ct-textarea {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border-strong);
          padding: clamp(8px, 1vw, 14px) 0;
          font-size: clamp(14px, 1.2vw, 18px);
          font-family: ${jakartaSans};
          color: var(--color-heading);
          outline: none;
          width: 100%;
          transition: border-color 0.2s;
          -webkit-appearance: none;
          border-radius: 0;
        }
        .ct-input:focus, .ct-textarea:focus { border-bottom-color: var(--color-heading); }
        .ct-input::placeholder, .ct-textarea::placeholder { color: var(--color-faint); }
        .ct-textarea { resize: none; min-height: clamp(80px, 10vw, 130px); }

        .ct-btn {
          background: var(--color-heading);
          color: var(--color-inverse);
          border: none;
          padding: clamp(12px, 1.4vw, 20px) clamp(28px, 3vw, 48px);
          font-size: clamp(12px, 1vw, 15px);
          font-family: ${jakartaSans};
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .ct-btn:hover:not(:disabled) { opacity: 0.82; }
        .ct-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        @media (max-width: 720px) {
          .ct-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .ct-name-row { grid-template-columns: 1fr !important; }
          .ct-heading-indent { padding-left: clamp(20px, 8vw, 40px) !important; }
        }
      `}</style>

      <div style={{ paddingBottom: "89px" }}>

        {/* Main two-column grid */}
        <main
          className="ct-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "start",
            gap: "clamp(32px, 6vw, 100px)",
          }}
        >
          {/* Left — heading + contact info */}
          <div>
            <h1 style={{
              fontFamily: jakartaSans,
              fontWeight: 700,
              fontSize: "clamp(44px, 7vw, 96px)",
              color: "var(--color-heading)",
              letterSpacing: "-0.02em",
              lineHeight: 0.88,
              marginBottom: "clamp(28px, 4vw, 56px)",
            }}>
              Get
              <span
                className="ct-heading-indent"
                style={{ paddingLeft: "clamp(28px, 4vw, 64px)", display: "block", color: "var(--color-body-secondary)" }}
              >
                in touch
              </span>
            </h1>

            {contactDetails.map(({ label, value, href }) => (
              <div key={label} style={{ marginBottom: "clamp(20px, 2.5vw, 36px)" }}>
                <p style={{
                  fontSize: "clamp(10px, 0.8vw, 12px)",
                  color: "var(--color-body-secondary)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: jakartaSans,
                  marginBottom: "6px",
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: jakartaSans,
                  fontSize: "clamp(16px, 1.6vw, 24px)",
                  color: "var(--color-heading)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                      style={{ color: "var(--color-link)", textDecoration: "underline", textUnderlineOffset: "4px" }}
                    >
                      {value}
                    </a>
                  ) : value}
                </p>
              </div>
            ))}

            {/* Availability */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "clamp(24px, 3vw, 44px)" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-success)", flexShrink: 0 }} />
              <span style={{ fontSize: "clamp(12px, 0.95vw, 15px)", color: "var(--color-success)", fontFamily: jakartaSans, fontWeight: 500 }}>
                Available for new projects
              </span>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div style={{ paddingTop: "clamp(32px, 5vw, 72px)" }}>
                <p style={{
                  fontFamily: jakartaSans,
                  fontSize: "clamp(22px, 2.5vw, 36px)",
                  color: "var(--color-heading)",
                  fontWeight: 600,
                  marginBottom: "16px",
                  letterSpacing: "-0.01em",
                }}>
                  Thank you, {form.firstName || "there"}.
                </p>
                <p style={{ fontSize: "clamp(13px, 1vw, 16px)", color: "var(--color-body-secondary)", fontFamily: jakartaSans, lineHeight: 1.6 }}>
                  Your message has been sent. I&rsquo;ll be in touch within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.5vw, 32px)" }}>
                {/* Name row */}
                <div className="ct-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2vw, 32px)" }}>
                  <Field label="First name">
                    <input className="ct-input" name="firstName" type="text" placeholder="Jane" value={form.firstName} onChange={handleChange} />
                  </Field>
                  <Field label="Last name">
                    <input className="ct-input" name="lastName" type="text" placeholder="Smith" value={form.lastName} onChange={handleChange} />
                  </Field>
                </div>

                <Field label="Email">
                  <input className="ct-input" name="email" type="email" placeholder="jane@company.com" value={form.email} onChange={handleChange} required />
                </Field>

                <Field label="Company / Brand">
                  <input className="ct-input" name="company" type="text" placeholder="Optional" value={form.company} onChange={handleChange} />
                </Field>

                <Field label="Project type">
                  <input className="ct-input" name="projectType" type="text" placeholder="e.g. Web app, Mobile, Consulting" value={form.projectType} onChange={handleChange} />
                </Field>

                <Field label="Message">
                  <textarea className="ct-textarea ct-input" name="message" placeholder="Tell me about your project, timeline, and goals..." value={form.message} onChange={handleChange} required />
                </Field>

                {error && (
                  <p style={{ fontSize: "13px", color: "var(--color-error)", fontFamily: jakartaSans }}>
                    {error}
                  </p>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "clamp(8px, 1vw, 16px)" }}>
                  <button className="ct-btn" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Send message"}
                  </button>
                  <span style={{ fontSize: "clamp(10px, 0.8vw, 12px)", color: "var(--color-body-secondary)", fontFamily: jakartaSans }}>
                    No spam, ever.
                  </span>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
