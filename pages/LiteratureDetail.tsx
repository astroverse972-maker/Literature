
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useComments } from '../hooks/useComments';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLiteratureDetail } from '../hooks/useLiteratureDetail';

const LiteratureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { work, isLoading, error, refetch } = useLiteratureDetail(id);
  const { comments, addComment, isLoading: isCommentsLoading } = useComments(id!);
  
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading work...</p>
      </div>
    );
  }

  if (error) {
    return (
      <AnimatedPage>
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-2">Failed to load this work</h2>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={() => refetch()}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </AnimatedPage>
    );
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