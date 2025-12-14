import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Clock, Calendar, Zap, LayoutGrid, ListFilter } from 'lucide-react';
import { Post, Comment, User, CategoryType } from './types';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetail } from './components/PostDetail';
import { Button } from './components/Button';

// Usuario actual (Simulamos una sesión activa)
const CURRENT_USER: User = {
  id: 'u_me',
  name: 'Yo (Usuario)',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
};

const STORAGE_KEY = 'chronotalk_posts_data';

export default function App() {
  // Inicializamos el estado leyendo del LocalStorage
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEY);
      return savedPosts ? JSON.parse(savedPosts) : [];
    } catch (error) {
      console.error("Error loading posts:", error);
      return [];
    }
  });

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Efecto para guardar en LocalStorage cada vez que cambian los posts
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const activePost = useMemo(() => 
    posts.find(p => p.id === selectedPostId), 
  [posts, selectedPostId]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const handleCreatePost = (title: string, content: string, category: CategoryType) => {
    const newPost: Post = {
      id: Date.now().toString(), // ID único basado en tiempo
      title,
      content,
      category,
      author: CURRENT_USER,
      timestamp: Date.now(),
      likes: 0,
      comments: []
    };
    // Añadimos al principio del array
    setPosts([newPost, ...posts]);
  };

  const handleAddComment = (postId: string, content: string, isAi: boolean = false) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          author: isAi ? { id: 'ai', name: 'ChronoBot', avatar: '' } : CURRENT_USER,
          content,
          timestamp: Date.now(),
          isAiGenerated: isAi
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        // En una app real validaríamos si el usuario ya dio like, 
        // pero para este MVP permitimos incrementar (o podríamos hacer toggle)
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedPostId(null)}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Clock size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              ChronoTalk
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar debates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="hidden sm:flex shadow-indigo-200">
              <Plus size={18} className="mr-1" /> Nuevo Post
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-[2px]">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                <img src={CURRENT_USER.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {selectedPostId && activePost ? (
          <PostDetail 
            post={activePost} 
            currentUser={CURRENT_USER}
            onBack={() => setSelectedPostId(null)}
            onAddComment={handleAddComment}
            onLike={handleLike}
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar / Filters */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ListFilter size={18} /> Categorías
                </h3>
                <div className="space-y-1">
                  <button 
                    onClick={() => setActiveCategory('All')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'All' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    🚀 Todo
                  </button>
                  {Object.values(CategoryType).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white text-center">
                    <Zap className="mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-semibold mb-2">¡Desafío Semanal!</p>
                    <p className="text-xs opacity-90 mb-3">Reduce tu tiempo en pantalla un 10% esta semana.</p>
                    <button className="text-xs bg-white text-indigo-600 px-3 py-1 rounded-full font-bold hover:bg-indigo-50">Aceptar</button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Feed */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <LayoutGrid size={24} className="text-indigo-500" />
                  Feed de Tiempo
                </h2>
                <span className="text-sm text-gray-500 font-medium">{filteredPosts.length} discusiones</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {filteredPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onClick={() => setSelectedPostId(post.id)} 
                  />
                ))}
                
                {filteredPosts.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 flex flex-col items-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                      <Calendar size={40} className="text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Está muy tranquilo por aquí...</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">No hay debates sobre el tiempo todavía. ¡Sé el primero en iniciar la conversación!</p>
                    <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="shadow-lg shadow-indigo-200">
                      <Plus size={20} className="mr-2" />
                      Crear Primer Post
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center z-40 hover:scale-105 transition-transform"
      >
        <Plus size={28} />
      </button>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreatePost}
        currentUser={CURRENT_USER}
      />
    </div>
  );
}