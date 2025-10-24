import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Literature } from '../types';
import { useComments } from '../hooks/useComments';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { GoogleGenAI } from '@google/genai';

// IMPORTANT: Replace this with your actual Gemini API key
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

const LiteratureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [work, setWork] = useState<Literature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { comments, addComment, isLoading: isCommentsLoading } = useComments(id!);
  
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const fetchWork = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('literature')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setWork(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching literature detail:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWork();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim() || !id) return;

    setIsSubmitting(true);
    try {
      await addComment({
        literature_id: id,
        author_name: authorName,
        content: newComment,
      });
      setNewComment('');
      // Author name is kept for convenience
      toast.success('Comment posted!');
    } catch (err) {
      toast.error('Failed to post comment.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const generateSummary = async () => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        toast.error("Gemini API key is not configured.");
        return;
    }
    if (!work?.content) return;
    setIsSummarizing(true);
    setSummary('');
    try {
      const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following text in about 50 words: ${work.content}`,
      });
      setSummary(response.text);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Could not generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }
  
  if (!work) {
    return <div className="text-center text-gray-500">Work not found.</div>;
  }

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto">
        <Link to="/literature" className="text-gray-600 hover:text-gray-900 mb-8 inline-block">&larr; Back to Works</Link>
        <article>
          <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{work.type}</p>
                <h1 className="text-4xl font-bold text-gray-800 mt-2">{work.title}</h1>
              </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">Published on {new Date(work.published_date).toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {work.content}
          </div>
        </article>

        <div className="my-12">
            <button
                onClick={generateSummary}
                disabled={isSummarizing}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
            >
                {isSummarizing ? 'Summarizing...' : '✨ Generate Summary with AI'}
            </button>
            {summary && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-800">AI Summary:</h4>
                    <p className="text-blue-700">{summary}</p>
                </div>
            )}
        </div>

        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments ({comments.length})</h2>
          <div className="space-y-6">
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                className="bg-gray-50 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-semibold text-gray-800">{comment.author_name}</p>
                <p className="text-gray-600 mt-1">{comment.content}</p>
                <p className="text-xs text-gray-400 mt-2 text-right">{new Date(comment.created_at).toLocaleString()}</p>
              </motion.div>
            ))}
            {comments.length === 0 && !isCommentsLoading && <p className="text-gray-500">Be the first to comment.</p>}
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave a Comment</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  id="comment"
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </AnimatedPage>
  );
};

export default LiteratureDetail;