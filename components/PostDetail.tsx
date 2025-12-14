import React, { useState } from 'react';
import { ArrowLeft, Send, Heart, MessageCircle, Bot, User as UserIcon } from 'lucide-react';
import { Post, Comment, User, CATEGORY_COLORS } from '../types';
import { Button } from './Button';
import { generateAiComment } from '../services/geminiService';

interface PostDetailProps {
  post: Post;
  currentUser: User;
  onBack: () => void;
  onAddComment: (postId: string, content: string, isAi?: boolean) => void;
  onLike: (postId: string) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ 
  post, 
  currentUser, 
  onBack, 
  onAddComment,
  onLike
}) => {
  const [newComment, setNewComment] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment);
    setNewComment('');
  };

  const handleAiInteraction = async (mood: 'supportive' | 'critical' | 'funny') => {
    setIsAiLoading(true);
    try {
      const response = await generateAiComment(post.content, mood);
      onAddComment(post.id, response, true);
    } catch (e) {
      alert("La IA está descansando un momento.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Volver al Feed
      </button>

      {/* Main Post Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-bold tracking-wide ${CATEGORY_COLORS[post.category]}`}>
              {post.category}
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleDateString()}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-indigo-600 font-bold text-lg">{post.author.name[0]}</span>
                )}
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900">{post.author.name}</p>
                <p className="text-xs text-gray-500">Autor</p>
             </div>
          </div>
          
          <div className="prose prose-indigo max-w-none text-gray-700 leading-8 text-lg">
            {post.content.split('\n').map((p, i) => (
              <p key={i} className="mb-4">{p}</p>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex gap-4">
             <button 
              onClick={() => onLike(post.id)}
              className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors"
             >
                <Heart size={20} className={post.likes > 0 ? "fill-pink-50 fill-current text-pink-600" : ""} />
                <span className="font-semibold">{post.likes} Me gusta</span>
             </button>
             <div className="flex items-center gap-2 text-gray-500">
                <MessageCircle size={20} />
                <span className="font-semibold">{post.comments.length} Comentarios</span>
             </div>
          </div>
        </div>
      </div>

      {/* AI Actions */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button 
          onClick={() => handleAiInteraction('supportive')}
          disabled={isAiLoading}
          className="p-3 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2 border border-green-200"
        >
          <Bot size={16} /> IA: Apóyame
        </button>
        <button 
          onClick={() => handleAiInteraction('critical')}
          disabled={isAiLoading}
          className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
        >
          <Bot size={16} /> IA: Debateme
        </button>
        <button 
          onClick={() => handleAiInteraction('funny')}
          disabled={isAiLoading}
          className="p-3 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-semibold hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2 border border-yellow-200"
        >
          <Bot size={16} /> IA: Bromea
        </button>
      </div>

      {/* Comment Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Discusion</h3>
        
        {/* New Comment Input */}
        <form onSubmit={handleCommentSubmit} className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
             <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
             <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Únete al debate..."
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-200 resize-none text-sm"
                rows={2}
             />
             <div className="flex justify-end mt-2">
               <Button type="submit" size="sm" disabled={!newComment.trim()}>
                 Comentar
               </Button>
             </div>
          </div>
        </form>

        {/* Comment List */}
        <div className="space-y-4 pb-10">
          {post.comments.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">
              Se el primero en comentar... el tiempo corre ⏳
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className={`flex gap-4 p-4 rounded-xl ${comment.isAiGenerated ? 'bg-indigo-50 border border-indigo-100' : 'bg-white border border-gray-100'}`}>
                <div className="flex-shrink-0">
                  {comment.isAiGenerated ? (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
                      <Bot size={20} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold text-sm ${comment.isAiGenerated ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {comment.author.name} {comment.isAiGenerated && <span className="text-xs font-normal opacity-75">(Guru del Tiempo)</span>}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};