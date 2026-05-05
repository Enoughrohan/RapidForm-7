'use client';

import { useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { X, CheckCircle2, Clock, IndianRupee, Zap, FileText } from 'lucide-react';
import { colorMap } from '@/lib/services';
import { useAppStore } from '@/store/app';

export default function ServiceModal() {
  const { selectedService, closeModal, openApply } = useAppStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = !!selectedService;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!selectedService) return null;

  const s = selectedService;
  const colors = colorMap[s.color];

  const iconName = s.icon
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') as keyof typeof Icons;
  const IconComponent = (Icons[iconName] || Icons.FileText) as React.ElementType;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeModal}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 500,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.2s',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Bottom sheet */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          background: '#fff',
          borderRadius: '22px 22px 0 0',
          zIndex: 600,
          maxHeight: '88vh',
          overflowY: 'auto',
          animation: 'slideUp 0.28s cubic-bezier(0.34,1.2,0.64,1) forwards',
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100%); }
            to   { transform: translateX(-50%) translateY(0); }
          }
          .no-scrollbar2::-webkit-scrollbar { display: none; }
          .no-scrollbar2 { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
        </div>

        {/* Close */}
        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#F3F4F6',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={16} color="#6B7280" />
        </button>

        <div style={{ padding: '10px 20px 40px' }}>
          {/* Icon + Title */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <IconComponent size={26} color={colors.icon} strokeWidth={1.8} />
          </div>

          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22,
              color: '#1a2744',
              marginBottom: 6,
              lineHeight: 1.2,
            }}
          >
            {s.name}
          </div>
          <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.65, marginBottom: 18 }}>
            {s.desc}
          </div>

          {/* Info pills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
            <div
              style={{
                background: '#F8F4ED',
                borderRadius: 10,
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <Clock size={11} color="#9CA3AF" />
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>Processing Time</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2744' }}>{s.time}</div>
            </div>
            <div
              style={{
                background: '#F8F4ED',
                borderRadius: 10,
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <IndianRupee size={11} color="#9CA3AF" />
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>Service Fee</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2744' }}>{s.fee}</div>
            </div>
          </div>

          {/* Documents */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#4B5563',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 10,
              }}
            >
              Documents Required
            </div>
            {s.docs.map((doc, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  background: '#F8F4ED',
                  borderRadius: 8,
                  marginBottom: 6,
                }}
              >
                <CheckCircle2 size={14} color="#059669" strokeWidth={2} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#1a2744' }}>{doc}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              closeModal();
              setTimeout(() => openApply(false), 100);
            }}
            style={{
              width: '100%',
              padding: '15px 0',
              background: '#003087',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <FileText size={16} />
            Apply Now
          </button>

          {s.tatkal && (
            <button
              onClick={() => {
                closeModal();
                setTimeout(() => openApply(true), 100);
              }}
              style={{
                width: '100%',
                padding: '13px 0',
                background: '#FFF3E6',
                color: '#FF9933',
                border: '2px solid #FF9933',
                borderRadius: 14,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
              }}
            >
              <Zap size={15} />
              Apply Tatkal — Urgent (24h)
            </button>
          )}
        </div>
      </div>
    </>
  );
}
