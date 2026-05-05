'use client';

import * as Icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { colorMap, type Service } from '@/lib/services';
import { useAppStore } from '@/store/app';

interface Props {
  service: Service;
  variant?: 'grid' | 'list';
}

export default function ServiceCard({ service, variant = 'grid' }: Props) {
  const { openModal } = useAppStore();
  const colors = colorMap[service.color];

  // Dynamic icon lookup
  const iconName = service.icon
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') as keyof typeof Icons;
  const IconComponent = (Icons[iconName] || Icons.FileText) as React.ElementType;

  if (variant === 'list') {
    return (
      <div
        onClick={() => openModal(service)}
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '13px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8,
          cursor: 'pointer',
          boxShadow: '0 1px 6px rgba(0,48,135,0.06)',
          transition: 'transform 0.12s',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(0.98)')}
        onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
        onTouchStart={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(0.98)')}
        onTouchEnd={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
      >
        <div
          style={{
            width: 42,
            height: 42,
            minWidth: 42,
            borderRadius: 10,
            background: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent size={20} color={colors.icon} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#1a2744',
              marginBottom: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {service.name}
          </div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>
            {service.sub} &bull; {service.fee}
          </div>
        </div>
        <ChevronRight size={16} color="#D1D5DB" />
      </div>
    );
  }

  return (
    <div
      onClick={() => openModal(service)}
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '16px 14px',
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,48,135,0.08)',
        position: 'relative',
        transition: 'transform 0.12s, box-shadow 0.12s',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <IconComponent size={20} color={colors.icon} strokeWidth={1.8} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          opacity: 0.25,
        }}
      >
        <ChevronRight size={14} color="#1a2744" />
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a2744', lineHeight: 1.35, marginBottom: 3 }}>
        {service.name}
      </div>
      <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>
        {service.sub}
      </div>

      {service.popular && (
        <div
          style={{
            display: 'inline-block',
            background: '#FFF3E6',
            color: '#FF9933',
            fontSize: 9,
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 50,
            marginTop: 6,
            letterSpacing: '0.3px',
          }}
        >
          Popular
        </div>
      )}
    </div>
  );
}
