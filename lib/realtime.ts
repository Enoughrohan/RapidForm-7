'use client';

import { useEffect, useState } from 'react';
import { supabase, type Application, type ApplicationStatus } from '@/lib/supabase';

// Hook: subscribe to live application updates
export function useApplications(userId: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    const fetchApps = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) setApplications(data as Application[]);
      setLoading(false);
    };

    fetchApps();

    // Realtime subscription
    const channel = supabase
      .channel(`applications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setApplications((prev) => [payload.new as Application, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setApplications((prev) =>
              prev.map((app) =>
                app.id === payload.new.id ? (payload.new as Application) : app
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setApplications((prev) => prev.filter((app) => app.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { applications, loading };
}

// Hook: subscribe to single application status
export function useApplicationStatus(applicationId: string) {
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [history, setHistory] = useState<{ status: ApplicationStatus; note?: string; created_at: string }[]>([]);

  useEffect(() => {
    if (!applicationId) return;

    // Fetch current status + history
    const fetchStatus = async () => {
      const [appRes, histRes] = await Promise.all([
        supabase.from('applications').select('status').eq('id', applicationId).single(),
        supabase
          .from('status_history')
          .select('status, note, created_at')
          .eq('application_id', applicationId)
          .order('created_at', { ascending: true }),
      ]);

      if (appRes.data) setStatus(appRes.data.status);
      if (histRes.data) setHistory(histRes.data);
    };

    fetchStatus();

    // Live updates
    const channel = supabase
      .channel(`app_status:${applicationId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'applications', filter: `id=eq.${applicationId}` },
        (payload) => setStatus(payload.new.status)
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'status_history', filter: `application_id=eq.${applicationId}` },
        (payload) => setHistory((prev) => [...prev, payload.new as typeof history[0]])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [applicationId]);

  return { status, history };
}

// Action: submit a new application
export async function submitApplication(data: {
  userId: string;
  serviceId: number;
  serviceName: string;
  serviceCat: string;
  district: string;
  isTatkal: boolean;
}) {
  const { data: app, error } = await supabase
    .from('applications')
    .insert({
      user_id:      data.userId,
      service_id:   data.serviceId,
      service_name: data.serviceName,
      service_cat:  data.serviceCat,
      district:     data.district,
      is_tatkal:    data.isTatkal,
    })
    .select()
    .single();

  if (error) throw error;

  // Log initial status
  await supabase.from('status_history').insert({
    application_id: app.id,
    status:         'submitted',
    note:           'Application submitted successfully.',
  });

  return app as Application;
}

// Action: upload a document
export async function uploadDocument(applicationId: string, file: File, docName: string) {
  const ext = file.name.split('.').pop();
  const path = `applications/${applicationId}/${docName.replace(/\s+/g, '_')}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase.from('documents').insert({
    application_id: applicationId,
    doc_name:       docName,
    storage_path:   path,
  });

  if (dbError) throw dbError;

  return path;
}
