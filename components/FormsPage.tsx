'use client';

import { CheckCircle2, AlertCircle, Clock, Upload, ArrowRight } from 'lucide-react';
import { mockApplications, statusConfig } from '@/lib/supabase';

const trackSteps = [
  { label: 'Application Submitted', date: 'Dec 10, 2024', done: true },
  { label: 'Documents Verified',    date: 'Dec 11, 2024', done: true },
  { label: 'Under Review at Block Office', date: 'In Progress', active: true },
  { label: 'Certificate Ready',     date: 'Expected Dec 15', done: false },
];

export default function FormsPage() {
  return (
    <div style={{ overflowY: 'auto', height: 'calc(100vh - 60px)', paddingBottom: 88 }}>
      <div style={{ padding: '16px 18px 0', fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#1a2744', marginBottom: 4 }}>
        My Applications
      </div>
      <div style={{ padding: '0 18px 4px', fontSize: 12, color: '#9CA3AF' }}>
        {mockApplications.length} active applications
      </div>

      {/* Application 1 - Under Review */}
      <div style={{ margin: '10px 18px 0', background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,48,135,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>Caste Certificate</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>RF-2024-001234</div>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 50,
              background: statusConfig.under_review.bg,
              color: statusConfig.under_review.color,
            }}
          >
            Under Review
          </div>
        </div>

        {/* Steps */}
        <div>
          {trackSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: step.done ? 'none' : step.active ? 'none' : '2px solid #E5E7EB',
                    background: step.done ? '#003087' : step.active ? '#FF9933' : '#fff',
                    flexShrink: 0,
                    marginTop: 2,
                    transition: 'all 0.2s',
                  }}
                />
                {i < trackSteps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 22,
                      background: step.done ? '#003087' : '#E5E7EB',
                      margin: '2px 0',
                    }}
                  />
                )}
              </div>
              <div style={{ paddingBottom: i < trackSteps.length - 1 ? 14 : 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: step.active ? 600 : 500, color: step.done || step.active ? '#1a2744' : '#9CA3AF' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 10, color: step.active ? '#FF9933' : '#9CA3AF', marginTop: 2 }}>
                  {step.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application 2 - Docs Pending */}
      <div style={{ margin: '10px 18px 0', background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,48,135,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>Income Certificate</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>RF-2024-001198</div>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 50,
              background: statusConfig.docs_pending.bg,
              color: statusConfig.docs_pending.color,
            }}
          >
            Docs Pending
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            background: '#FEF3C7',
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <AlertCircle size={14} color="#92400E" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#92400E' }}>Aadhaar copy pending — please upload</span>
        </div>

        <button
          style={{
            width: '100%',
            padding: '11px 0',
            background: '#003087',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Upload size={14} />
          Upload Documents
        </button>
      </div>

      {/* CTA if no more */}
      <div
        style={{
          margin: '16px 18px 0',
          background: 'linear-gradient(135deg, #003087, #1a4fa0)',
          borderRadius: 14,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>Apply for more services</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>111+ government services available</div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            background: '#FF9933',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ArrowRight size={18} color="#fff" />
        </div>
      </div>
    </div>
  );
}
