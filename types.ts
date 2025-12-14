export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: number;
  isAiGenerated?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: CategoryType;
  author: User;
  timestamp: number;
  likes: number;
  comments: Comment[];
}

export enum CategoryType {
  PRODUCTIVITY = 'Productividad',
  PROCRASTINATION = 'Procrastinación',
  WORK_LIFE = 'Vida y Trabajo',
  MINDFULNESS = 'Mindfulness',
  TOOLS = 'Herramientas',
  OTHER = 'Otros'
}

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  [CategoryType.PRODUCTIVITY]: 'bg-blue-100 text-blue-800',
  [CategoryType.PROCRASTINATION]: 'bg-red-100 text-red-800',
  [CategoryType.WORK_LIFE]: 'bg-green-100 text-green-800',
  [CategoryType.MINDFULNESS]: 'bg-purple-100 text-purple-800',
  [CategoryType.TOOLS]: 'bg-orange-100 text-orange-800',
  [CategoryType.OTHER]: 'bg-gray-100 text-gray-800',
};