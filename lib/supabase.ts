import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type ApplicationStatus =
  | 'submitted'
  | 'docs_pending'
  | 'under_review'
  | 'approved'
  | 'completed'
  | 'rejected';

export interface Application {
  id: string;
  ref_id: string;
  service_id: number;
  service_name: string;
  user_name: string;
  user_phone: string;
  status: ApplicationStatus;
  is_tatkal: boolean;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export const statusConfig: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  submitted:    { label: 'Submitted',      color: '#1e40af', bg: '#DBEAFE' },
  docs_pending: { label: 'Docs Pending',   color: '#92400E', bg: '#FEF3C7' },
  under_review: { label: 'Under Review',   color: '#6B21A8', bg: '#F3E8FF' },
  approved:     { label: 'Approved',       color: '#166534', bg: '#DCFCE7' },
  completed:    { label: 'Completed',      color: '#166534', bg: '#DCFCE7' },
  rejected:     { label: 'Rejected',       color: '#991B1B', bg: '#FEE2E2' },
};

// Mock applications for demo
export const mockApplications: Application[] = [
  {
    id: '1',
    ref_id: 'RF-2024-001234',
    service_id: 1,
    service_name: 'Caste Certificate',
    user_name: 'Rahul Kumar',
    user_phone: '+91 98765 43210',
    status: 'under_review',
    is_tatkal: false,
    created_at: '2024-12-10T10:00:00Z',
    updated_at: '2024-12-11T14:00:00Z',
    notes: 'Documents verified. Under review at Block Office.',
  },
  {
    id: '2',
    ref_id: 'RF-2024-001198',
    service_id: 2,
    service_name: 'Income Certificate',
    user_name: 'Rahul Kumar',
    user_phone: '+91 98765 43210',
    status: 'docs_pending',
    is_tatkal: false,
    created_at: '2024-12-08T11:00:00Z',
    updated_at: '2024-12-09T09:00:00Z',
    notes: 'Aadhaar copy pending — please upload.',
  },
];

export const mockCompleted: Application[] = [
  {
    id: '3',
    ref_id: 'RF-2024-000889',
    service_id: 3,
    service_name: 'Residence Certificate',
    user_name: 'Rahul Kumar',
    user_phone: '+91 98765 43210',
    status: 'completed',
    is_tatkal: false,
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-11-28T16:00:00Z',
  },
  {
    id: '4',
    ref_id: 'RF-2024-000712',
    service_id: 16,
    service_name: 'PAN Card',
    user_name: 'Rahul Kumar',
    user_phone: '+91 98765 43210',
    status: 'completed',
    is_tatkal: false,
    created_at: '2024-11-05T10:00:00Z',
    updated_at: '2024-11-15T12:00:00Z',
  },
];
