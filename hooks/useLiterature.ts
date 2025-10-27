
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Literature, LiteratureDTO } from '../types';

export function useLiterature() {
  const [literature, setLiterature] = useState<Literature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiterature = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('literature')
        .select('*')
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      setLiterature(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching literature:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiterature();

    const channel = supabase
      .channel('literature-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'literature' },
        (payload) => {
          console.log('Change received!', payload);
          switch (payload.eventType) {
            case 'INSERT':
              setLiterature(prev => 
                [...prev, payload.new as Literature].sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
              );
              break;
            case 'UPDATE':
              setLiterature(prev =>
                prev.map(work => (work.id === payload.new.id ? payload.new as Literature : work))
                  .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
              );
              break;
            case 'DELETE':
              setLiterature(prev => prev.filter(work => work.id !== (payload.old as Literature).id));
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLiterature]);

  const addLiterature = async (work: LiteratureDTO) => {
    const { error } = await supabase.from('literature').insert([work]);
    if (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateLiterature = async (id: string, updates: Partial<LiteratureDTO>) => {
    const { error } = await supabase.from('literature').update(updates).eq('id', id);
    if (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteLiterature = async (id: string) => {
    const { error } = await supabase.from('literature').delete().eq('id', id);
    if (error) {
      setError(error.message);
      throw error;
    }
  };

  return { literature, isLoading, error, addLiterature, updateLiterature, deleteLiterature };
}
