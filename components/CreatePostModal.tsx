import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { Button } from './Button';
import { CategoryType, User } from '../types';
import { generatePostDraft } from '../services/geminiService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, category: CategoryType) => void;
  currentUser: User;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.PRODUCTIVITY);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleAiGenerate = async () => {
    if (!title) {
      alert("Por favor escribe un título o tema primero para que la IA se inspire.");
      return;
    }
    setIsGenerating(true);
    try {
      const draft = await generatePostDraft(title, category);
      setContent(draft);
    } catch (e) {
      alert("La IA está tomando una siesta. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit(title, content, category);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            ⏱️ Nuevo Debate
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título / Tema</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: ¿Por qué siempre llego tarde?"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              {Object.values(CategoryType).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Contenido</label>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold disabled:opacity-50"
              >
                <Sparkles size={14} />
                {isGenerating ? 'Escribiendo...' : 'Autocompletar con IA'}
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comparte tu experiencia, pregunta o consejo..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary">
              <Send size={16} className="mr-2" />
              Publicar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};