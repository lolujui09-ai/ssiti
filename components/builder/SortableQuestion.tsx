'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QuestionCard } from './QuestionCard';
import { FormQuestion, FormSection } from '@/types/schema';
import { GripVertical } from 'lucide-react';

interface SortableQuestionProps {
  question: FormQuestion;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: (q: FormQuestion) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isQuizMode: boolean;
  sections: FormSection[];
  themeColor: string;
}

export function SortableQuestion(props: SortableQuestionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.question.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-7 p-1.5 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <QuestionCard {...props} />
    </div>
  );
}

