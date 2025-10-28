import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Literature } from '../types';
import { getErrorMessage } from '../utils';

export function useLiteratureDetail(id: string | undefined) {
  const [work, setWork] = useState<Literature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWork = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    };
    
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('literature')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setWork(data);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error(`Error fetching literature detail for id ${id}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWork();
  }, [fetchWork]);

  return { work, isLoading, error, refetch: fetchWork };
}
