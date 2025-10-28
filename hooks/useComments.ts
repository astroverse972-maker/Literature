
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Comment, CommentDTO } from '../types';
import { getErrorMessage } from '../utils';

export function useComments(literatureId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!literatureId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('literature_id', literatureId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setComments(data || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [literatureId]);

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`comments-for-${literatureId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `literature_id=eq.${literatureId}` },
        (payload) => {
          console.log('New comment received!', payload);
          setComments((prevComments) => [...prevComments, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchComments, literatureId]);

  const addComment = async (comment: Omit<CommentDTO, 'literature_id'> & { literature_id: string }) => {
    const { data, error } = await supabase.from('comments').insert([comment]).select();
    if (error) {
      setError(error.message);
      throw error;
    }
    return data;
  };

  return { comments, isLoading, error, addComment };
}