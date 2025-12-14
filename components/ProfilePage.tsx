import React, { useState } from 'react';
import { User, Post } from '../types';
import { Button } from './Button';
import { PostCard } from './PostCard';
import { ArrowLeft, Save, Edit2, MessageSquare, FileText } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  posts: Post[];
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
  onPostClick: (postId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, posts, onUpdateUser, onBack, onPostClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');

  const handleSave = () => {
    if (!name.trim()) {
        alert("El nombre no puede estar vacío");
        return;
    }
    onUpdateUser({ ...user, name, avatar: avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' });
    setIsEditing(false);
  };

  // Filter posts created by user
  const myPosts = posts.filter(p => p.author.id === user.id);

  // Find comments created by user
  const myComments = posts.flatMap(p => 
    p.comments.filter(c => c.author.id === user.id).map(c => ({
      ...c,
      postTitle: p.title,
      postId: p.id
    }))
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Volver
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col sm:flex-row justify-between items-end -mt-12 mb-6">
            <div className="relative mb-4 sm:mb-0">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img src={isEditing ? avatar : user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {!isEditing ? (
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 size={14} className="mr-2" /> Editar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  setIsEditing(false);
                  setName(user.name);
                  setAvatar(user.avatar);
                }}>Cancelar</Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  <Save size={14} className="mr-2" /> Guardar
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 max-w-md bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: Viajero del Tiempo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen de Perfil</label>
                <input 
                  type="text" 
                  value={avatar} 
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-2">Pega el enlace de una imagen (ej: de DiceBear, Unsplash, etc).</p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-sm">Crononauta desde {new Date().getFullYear()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6 mb-6 border-b border-gray-200 px-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'posts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <FileText size={16} /> 
          Mis Debates
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{myPosts.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'comments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <MessageSquare size={16} /> 
          Mis Comentarios
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{myComments.length}</span>
        </button>
      </div>

      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 gap-6">
          {myPosts.length > 0 ? (
            myPosts.map(post => (
              <PostCard key={post.id} post={post} onClick={() => onPostClick(post.id)} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p>No has iniciado ningún debate aún.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {myComments.length > 0 ? (
            myComments.map(comment => (
              <div 
                key={comment.id} 
                className="bg-white p-5 rounded-xl border border-gray-100 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all group"
                onClick={() => onPostClick(comment.postId)}
              >
                <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500">
                        En: <span className="font-medium text-indigo-600 group-hover:underline">{comment.postTitle}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
              <p>No has comentado nada aún.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};