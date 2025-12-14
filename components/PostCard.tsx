import React from 'react';
import { MessageCircle, Heart, Clock, User as UserIcon } from 'lucide-react';
import { Post, CATEGORY_COLORS } from '../types';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${CATEGORY_COLORS[post.category]}`}>
          {post.category}
        </span>
        <div className="flex items-center text-xs text-gray-400 gap-1">
          <Clock size={12} />
          {new Date(post.timestamp).toLocaleDateString()}
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
        {post.title}
      </h3>
      
      <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
        {post.content}
      </p>

      <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
             {post.author.avatar ? (
               <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
             ) : (
               <UserIcon size={14} className="text-gray-500" />
             )}
          </div>
          <span className="text-xs font-medium text-gray-500">{post.author.name}</span>
        </div>

        <div className="flex gap-4 text-gray-400">
          <div className="flex items-center gap-1 group-hover:text-pink-500 transition-colors">
            <Heart size={16} />
            <span className="text-xs font-medium">{post.likes}</span>
          </div>
          <div className="flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
            <MessageCircle size={16} />
            <span className="text-xs font-medium">{post.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};