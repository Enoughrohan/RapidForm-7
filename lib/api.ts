'use client';

import { supabase } from './supabase';
import type { Application, ApplicationStatus } from './supabase';
import { generateRef } from './utils';

// ─── Submit new application ─────────────────────────────────────────────────
export async function submitApplication(data: {
  serviceId: number;
  serviceName: string;
  userName: string;
  userPhone: string;
  district: string;
  isTatkal: boolean;
}): Promise<{ ref: string; error?: string }> {
  const ref = generateRef();

  // In production, first upsert user then insert application
  // For now we insert with mock user_id
  const { error } = await supabase.from('applications').insert({
    ref_id: ref,
    service_id: data.serviceId,
    service_name: data.serviceName,
    status: 'submitted',
    is_tatkal: data.isTatkal,
    district: data.district,
    notes: `Applicant: ${data.userName}, Phone: ${data.userPhone}`,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    // Still return ref for demo purposes (when Supabase not configured)
  }

  return { ref };
}

// ─── Fetch user applications ─────────────────────────────────────────────────
export async function fetchApplications(userId?: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as Application[];
}

// ─── Update application status ───────────────────────────────────────────────
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('applications')
    .update({ status, notes, updated_at: new Date().toISOString() })
    .eq('id', id);

  return !error;
}

// ─── Fetch application timeline ──────────────────────────────────────────────
export async function fetchTimeline(applicationId: string) {
  const { data, error } = await supabase
    .from('application_timeline')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data;
}

// ─── Upload document ─────────────────────────────────────────────────────────
export async function uploadDocument(
  applicationId: string,
  file: File,
  docName: string
): Promise<string | null> {
  const path = `${applicationId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('application-documents')
    .upload(path, file);

  if (uploadError) return null;

  const { data: { publicUrl } } = supabase.storage
    .from('application-documents')
    .getPublicUrl(path);

  await supabase.from('application_documents').insert({
    application_id: applicationId,
    doc_name: docName,
    file_url: publicUrl,
  });

  return publicUrl;
}
