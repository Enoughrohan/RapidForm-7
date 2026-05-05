'use client';

import { useState, useCallback } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { services } from '@/lib/services';
import { useAppStore } from '@/store/app';
import ServiceCard from '@/components/ui/ServiceCard';

const catTabs = [
  { id: 0, label: 'All Services' },
  { id: 1, label: 'Personal Docs' },
  { id: 2, label: 'Academic' },
  { id: 3, label: 'Business' },
  { id: 4, label: 'Gov Schemes' },
] as const;

const catMap = ['', 'personal', 'academic', 'business', 'schemes'];
const catTitles = [
  '',
  'Personal Documents & Certificates',
  'Academic & Education Services',
  'Business & Professional Services',
  'Government Schemes',
];

export default function HomePage() {
  const { activeCat, setActiveCat, schemeTab, setSchemeTab } = useAppStore();
  const [query, setQuery] = useState('');

  const filteredServices = useCallback(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      return services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.sub.toLowerCase().includes(q) ||
          s.desc.toLowerCase().includes(q)
      );
    }
    if (activeCat === 0) return [];
    if (activeCat === 4) {
      return services.filter((s) =>
        schemeTab === 'central' ? s.cat === 'schemes-central' : s.cat === 'schemes-bihar'
      );
    }
    return services.filter((s) => s.cat === catMap[activeCat]);
  }, [query, activeCat, schemeTab]);

  const popularPersonal = services.filter((s) => s.popular && s.cat === 'personal').slice(0, 4);
  const popularSchemes = services.filter(
    (s) => s.popular && (s.cat === 'schemes-central' || s.cat === 'schemes-bihar')
  ).slice(0, 4);

  const showHome = activeCat === 0 && !query.trim();
  const filtered = filteredServices();

  return (
    <div style={{ overflowY: 'auto', height: 'calc(100vh - 60px)', paddingBottom: 88 }}>
      {/* Search */}
      <div style={{ padding: '14px 18px 0' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 14px',
            boxShadow: '0 2px 12px rgba(0,48,135,0.08)',
          }}
        >
          <Search size={16} color="#9CA3AF" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search any service..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#1a2744',
              flex: 1,
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div
        className="no-scrollbar"
        style={{
          overflowX: 'auto',
          padding: '14px 18px 0',
          display: 'flex',
          gap: 8,
        }}
      >
        {catTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setQuery(''); setActiveCat(tab.id); }}
            style={{
              whiteSpace: 'nowrap',
              padding: '8px 16px',
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              border: '1.5px solid transparent',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
              background: activeCat === tab.id && !query ? '#003087' : '#fff',
              color: activeCat === tab.id && !query ? '#fff' : '#4B5563',
              borderColor: activeCat === tab.id && !query ? '#003087' : '#E5E7EB',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search results */}
      {query.trim() && (
        <div>
          <div style={{ padding: '14px 18px 8px', fontSize: 13, color: '#6B7280' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;<strong style={{ color: '#1a2744' }}>{query}</strong>&rdquo;
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 30px' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: '#E8EEF8',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <Search size={24} color="#003087" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a2744', marginBottom: 5 }}>
                No results found
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Try a different keyword</div>
            </div>
          ) : (
            <div style={{ padding: '0 18px' }}>
              {filtered.map((s) => (
                <ServiceCard key={s.id} service={s} variant="list" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Home content */}
      {showHome && (
        <>
          {/* Hero banner */}
          <div
            style={{
              margin: '14px 18px 0',
              background: 'linear-gradient(135deg, #003087 0%, #1a4fa0 100%)',
              borderRadius: 16,
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: -20,
                top: -20,
                width: 120,
                height: 120,
                background: 'rgba(255,153,51,0.15)',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 20,
                bottom: -30,
                width: 80,
                height: 80,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 18,
                color: '#fff',
                lineHeight: 1.3,
                marginBottom: 4,
                position: 'relative',
              }}
            >
              Documents Ready<br />in 24–48 Hours
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', lineHeight: 1.5, position: 'relative' }}>
              Caste, Income, Residence &<br />50+ more certificates from home.
            </div>
            <button
              onClick={() => setActiveCat(1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#FF9933',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 50,
                border: 'none',
                cursor: 'pointer',
                marginTop: 12,
                fontFamily: "'DM Sans', sans-serif",
                position: 'relative',
              }}
            >
              Browse All Services <ChevronRight size={12} />
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '14px 18px 0' }}>
            {[
              { num: '50K+', label: 'Applications\nCompleted' },
              { num: '111',  label: 'Services\nAvailable' },
              { num: '4.8',  label: 'Customer\nRating' },
            ].map(({ num, label }) => (
              <div
                key={num}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '12px 10px',
                  textAlign: 'center',
                  boxShadow: '0 2px 12px rgba(0,48,135,0.08)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 20,
                    color: '#003087',
                  }}
                >
                  {num}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Popular Services */}
          <SectionHead title="Popular Services" onSeeAll={() => setActiveCat(1)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 18px' }}>
            {popularPersonal.map((s) => (
              <ServiceCard key={s.id} service={s} variant="grid" />
            ))}
          </div>

          {/* Government Schemes */}
          <SectionHead title="Government Schemes" onSeeAll={() => setActiveCat(4)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 18px' }}>
            {popularSchemes.map((s) => (
              <ServiceCard key={s.id} service={s} variant="grid" />
            ))}
          </div>
        </>
      )}

      {/* Category list */}
      {!showHome && !query.trim() && activeCat !== 4 && (
        <div>
          <div
            style={{
              padding: '16px 18px 8px',
              fontFamily: "'DM Serif Display', serif",
              fontSize: 18,
              color: '#1a2744',
            }}
          >
            {catTitles[activeCat]}
          </div>
          <div style={{ padding: '0 18px 4px 18px', fontSize: 12, color: '#9CA3AF' }}>
            {filtered.length} services available
          </div>
          <div style={{ padding: '4px 18px 0' }}>
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={s} variant="list" />
            ))}
          </div>
        </div>
      )}

      {/* Schemes tab */}
      {!showHome && !query.trim() && activeCat === 4 && (
        <div>
          <div
            style={{
              padding: '16px 18px 0',
              fontFamily: "'DM Serif Display', serif",
              fontSize: 18,
              color: '#1a2744',
            }}
          >
            Government Schemes
          </div>
          {/* Sub tabs */}
          <div style={{ display: 'flex', gap: 8, padding: '12px 18px 0' }}>
            {(['central', 'bihar'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSchemeTab(t)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  border: '1.5px solid transparent',
                  transition: 'all 0.15s',
                  background: schemeTab === t ? '#003087' : '#fff',
                  color: schemeTab === t ? '#fff' : '#4B5563',
                  borderColor: schemeTab === t ? '#003087' : '#E5E7EB',
                }}
              >
                {t === 'central' ? 'Central Schemes' : 'Bihar State'}
              </button>
            ))}
          </div>
          <div style={{ padding: '12px 18px 4px', fontSize: 12, color: '#9CA3AF' }}>
            {filtered.length} schemes available
          </div>
          <div style={{ padding: '0 18px' }}>
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={s} variant="list" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHead({ title, onSeeAll }: { title: string; onSeeAll: () => void }) {
  return (
    <div
      style={{
        padding: '18px 18px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: '#1a2744' }}>{title}</span>
      <button
        onClick={onSeeAll}
        style={{
          fontSize: 12,
          color: '#003087',
          fontWeight: 500,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        See all
      </button>
    </div>
  );
}
