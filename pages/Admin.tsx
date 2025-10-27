import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { useLiterature } from '../hooks/useLiterature';
import { Literature, LiteratureDTO, LiteratureType } from '../types';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';

const Admin: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { literature, addLiterature, updateLiterature, deleteLiterature, isLoading, error } = useLiterature();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Literature | null>(null);
  const [formData, setFormData] = useState<Partial<LiteratureDTO>>({
    title: '',
    type: 'Poem',
    content: '',
    excerpt: '',
    published_date: new Date().toISOString().split('T')[0],
    author: 'Admin',
  });

  useEffect(() => {
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error('Error logging in:', error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      toast.error("Please upload a valid .txt file.");
      e.target.value = ''; // Clear the input
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      setFormData(prev => ({ ...prev, content: fileContent }));
      toast.success("File content loaded successfully.");
    };
    reader.onerror = () => {
      toast.error("Failed to read the file.");
    };
    reader.readAsText(file);
    
    e.target.value = '';
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Poem',
      content: '',
      excerpt: '',
      published_date: new Date().toISOString().split('T')[0],
      author: 'Admin',
    });
    setEditingWork(null);
  };
  
  const closeAndResetForm = () => {
    resetForm();
    setIsFormOpen(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.published_date || !formData.author || !formData.type) {
        toast.error("Please fill out all required fields.");
        return;
    }

    const workData: LiteratureDTO = {
        title: formData.title,
        content: formData.content,
        published_date: formData.published_date,
        author: formData.author,
        type: formData.type as LiteratureType,
        excerpt: formData.excerpt || formData.content.substring(0, 150),
    };

    try {
        if (editingWork) {
            await updateLiterature(editingWork.id, workData);
            toast.success('Work updated successfully!');
        } else {
            await addLiterature(workData);
            toast.success('Work added successfully!');
        }
        closeAndResetForm();
    } catch (err: any) {
        toast.error(`Error: ${err.message}`);
    }
  };

  const handleEdit = (work: Literature) => {
    setEditingWork(work);
    setFormData({
        title: work.title,
        type: work.type,
        content: work.content,
        excerpt: work.excerpt,
        published_date: work.published_date.split('T')[0],
        author: work.author,
    });
    setIsFormOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
        try {
            await deleteLiterature(id);
            toast.success('Work deleted successfully!');
        } catch(err: any) {
            toast.error(`Error: ${err.message}`);
        }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!session) {
    return (
      <AnimatedPage>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
          <p className="mb-6">Please log in to manage the literary works.</p>
          <button
            onClick={handleLogin}
            className="bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Login with GitHub
          </button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Logged in as {user?.email}</p>
            </div>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>

        {!isFormOpen ? (
             <button
                onClick={() => { resetForm(); setIsFormOpen(true); }}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mb-8"
            >
                + Add New Work
            </button>
        ) : (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4">{editingWork ? 'Edit Work' : 'Add New Work'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
                    </div>
                     <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select name="type" id="type" value={formData.type} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                            <option>Poem</option>
                            <option>Essay</option>
                            <option>Short Story</option>
                        </select>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                             <div>
                                <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Upload from .txt
                                </label>
                                <input id="file-upload" type="file" className="hidden" accept=".txt" onChange={handleFileChange} />
                            </div>
                        </div>
                        <textarea name="content" id="content" rows={10} value={formData.content} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
                    </div>
                     <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt (Optional)</label>
                        <textarea name="excerpt" id="excerpt" rows={3} value={formData.excerpt} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="published_date" className="block text-sm font-medium text-gray-700">Published Date</label>
                            <input type="date" name="published_date" id="published_date" value={formData.published_date} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
                        </div>
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                            <input type="text" name="author" id="author" value={formData.author} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={closeAndResetForm} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">{editingWork ? 'Update' : 'Save'}</button>
                    </div>
                </form>
            </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Manage Works</h2>
            {isLoading && <p>Loading works...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <ul className="space-y-3">
                {literature.map(work => (
                    <li key={work.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                            <p className="font-semibold">{work.title}</p>
                            <p className="text-sm text-gray-500">{work.type} - Published: {new Date(work.published_date).toLocaleDateString()}</p>
                        </div>
                        <div className="space-x-2">
                           <button onClick={() => handleEdit(work)} className="text-sm bg-yellow-400 text-white py-1 px-3 rounded hover:bg-yellow-500">Edit</button>
                           <button onClick={() => handleDelete(work.id)} className="text-sm bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </AnimatedPage>
  );
};

export default Admin;