'use client';

import { useState } from 'react';
import {
  Plus,
  Sparkles,
  Layers,
  Trash2,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { FullFormSchema, FormQuestion, FormSection } from '@/types/schema';
import { SortableQuestion } from './SortableQuestion';

interface BuilderCanvasProps {
  form: FullFormSchema;
  onChange: (updated: FullFormSchema) => void;
  onOpenPromptAI: () => void;
}

export function BuilderCanvas({ form, onChange, onOpenPromptAI }: BuilderCanvasProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    form.questions[0]?.id || null
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag end: reorder questions
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = form.questions.findIndex((q) => q.id === active.id);
    const newIndex = form.questions.findIndex((q) => q.id === over.id);
    const reordered = arrayMove(form.questions, oldIndex, newIndex);
    onChange({ ...form, questions: reordered });
  };

  // Update Header (Title & Description)
  const handleUpdateTitle = (val: string) => {
    onChange({ ...form, title: val });
  };

  const handleUpdateDescription = (val: string) => {
    onChange({ ...form, description: val });
  };

  // Add a new question right below the active one or at the end
  const handleAddQuestion = (sectionId?: string) => {
    const targetSection = sectionId || form.sections[0]?.id || 'sec-1';
    const newId = `q-${Date.now()}`;
    const newQuestion: FormQuestion = {
      id: newId,
      sectionId: targetSection,
      type: 'radio',
      title: 'Pertanyaan Baru Tanpa Judul',
      required: false,
      options: [
        { id: `opt-1-${Date.now()}`, label: 'Opsi 1', value: 'opt-1' },
        { id: `opt-2-${Date.now()}`, label: 'Opsi 2', value: 'opt-2' },
      ],
      quiz: form.settings.isQuiz
        ? {
            points: form.settings.defaultQuestionPoints || 10,
            correctAnswers: ['opt-1'],
            explanation: '',
          }
        : undefined,
    };

    let newQuestionsList: FormQuestion[];
    if (activeQuestionId) {
      const activeIdx = form.questions.findIndex((q) => q.id === activeQuestionId);
      if (activeIdx !== -1) {
        newQuestionsList = [
          ...form.questions.slice(0, activeIdx + 1),
          newQuestion,
          ...form.questions.slice(activeIdx + 1),
        ];
      } else {
        newQuestionsList = [...form.questions, newQuestion];
      }
    } else {
      newQuestionsList = [...form.questions, newQuestion];
    }

    onChange({ ...form, questions: newQuestionsList });
    setActiveQuestionId(newId);
  };

  // Duplicate question
  const handleDuplicateQuestion = (q: FormQuestion) => {
    const duplicateId = `q-${Date.now()}`;
    const duplicate: FormQuestion = {
      ...JSON.parse(JSON.stringify(q)),
      id: duplicateId,
      title: `${q.title} (Salinan)`,
    };
    const activeIdx = form.questions.findIndex((item) => item.id === q.id);
    const updated = [
      ...form.questions.slice(0, activeIdx + 1),
      duplicate,
      ...form.questions.slice(activeIdx + 1),
    ];
    onChange({ ...form, questions: updated });
    setActiveQuestionId(duplicateId);
  };

  // Delete question
  const handleDeleteQuestion = (qId: string) => {
    const updated = form.questions.filter((q) => q.id !== qId);
    onChange({ ...form, questions: updated });
    if (activeQuestionId === qId) {
      setActiveQuestionId(updated[0]?.id || null);
    }
  };

  // Update specific question
  const handleUpdateQuestion = (updatedQ: FormQuestion) => {
    const updated = form.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
    onChange({ ...form, questions: updated });
  };

  // Add Section (Multi-step page)
  const handleAddSection = () => {
    const newSectionId = `sec-${Date.now()}`;
    const newSection: FormSection = {
      id: newSectionId,
      title: `Bagian ${form.sections.length + 1} Tanpa Judul`,
      description: '',
      afterSectionAction: 'submit',
    };

    const updatedSections = [...form.sections, newSection];
    onChange({ ...form, sections: updatedSections });

    // Also automatically create 1 question in this new section
    handleAddQuestion(newSectionId);
  };

  const handleDeleteSection = (secId: string) => {
    if (form.sections.length <= 1) return;
    const fallbackSecId = form.sections.find((s) => s.id !== secId)?.id || 'sec-1';
    const updatedSections = form.sections.filter((s) => s.id !== secId);
    const updatedQuestions = form.questions.map((q) =>
      q.sectionId === secId ? { ...q, sectionId: fallbackSecId } : q
    );
    onChange({ ...form, sections: updatedSections, questions: updatedQuestions });
  };

  const handleUpdateSection = (secId: string, updates: Partial<FormSection>) => {
    const updatedSections = form.sections.map((s) =>
      s.id === secId ? { ...s, ...updates } : s
    );
    onChange({ ...form, sections: updatedSections });
  };

  return (
    <div className="max-w-3xl mx-auto pb-32 relative">
      {/* Floating Action Palette (Google Forms Toolbar) */}
      <div className="fixed right-4 sm:right-6 lg:right-10 top-36 z-30 flex flex-col gap-1.5 p-1.5 bg-white rounded-2xl shadow-lg border border-slate-200">
        <button
          type="button"
          onClick={() => handleAddQuestion()}
          className="p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors"
          title="Tambahkan Pertanyaan Baru"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenPromptAI}
          className="p-2.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors"
          title="Buka Generator AI & Prompt Template"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleAddSection}
          className="p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors"
          title="Tambahkan Bagian / Halaman Baru"
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* GOOGLE FORMS MAIN HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          {/* Top Theme Accent Bar */}
          <div
            style={{ backgroundColor: form.theme.primaryColor }}
            className="h-2.5 w-full"
          />

          <div className="p-6 sm:p-7 space-y-4">
            {/* Form Title Input */}
            <div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                placeholder="Formulir Tanpa Judul"
                className="w-full text-2xl sm:text-3xl font-bold text-slate-900 border-b-2 border-transparent hover:border-slate-200 focus:border-indigo-600 focus:outline-none pb-1 transition-colors"
              />
            </div>

            {/* Form Description Textarea */}
            <div>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => handleUpdateDescription(e.target.value)}
                placeholder="Deskripsi formulir..."
                className="w-full text-xs sm:text-sm text-slate-600 border-b border-transparent hover:border-slate-200 focus:border-indigo-600 focus:outline-none resize-none pb-1 transition-colors"
              />
            </div>

            {/* Email Notice Card if Enabled in Settings */}
            {form.settings.collectEmail && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Formulir ini saat ini mengumpulkan alamat email responden secara wajib.</span>
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">Tercatat di Tanggapan</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTIONS & QUESTIONS LIST */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={form.questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {form.sections.map((section, sIdx) => {
              const sectionQuestions = form.questions.filter(
                (q) => (q.sectionId || form.sections[0]?.id || 'sec-1') === section.id
              );

              return (
                <div key={section.id} className="space-y-4">
                  {/* Section Header Card (if more than 1 section) */}
                  {form.sections.length > 1 && (
                    <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                          Bagian {sIdx + 1} dari {form.sections.length}
                        </span>

                        {form.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSection(section.id)}
                            className="text-indigo-300 hover:text-white p-1 rounded-lg hover:bg-indigo-800 cursor-pointer transition-colors"
                            title="Hapus Bagian Ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                        placeholder="Judul Bagian..."
                        className="w-full text-lg font-bold bg-transparent border-b border-indigo-700 focus:border-white focus:outline-none pb-1"
                      />

                      <input
                        type="text"
                        value={section.description || ''}
                        onChange={(e) => handleUpdateSection(section.id, { description: e.target.value })}
                        placeholder="Deskripsi bagian (opsional)..."
                        className="w-full text-xs text-indigo-200 bg-transparent border-b border-indigo-700/60 focus:border-white focus:outline-none pb-0.5"
                      />

                      {/* Section Jump Logic */}
                      {sIdx < form.sections.length - 1 && (
                        <div className="pt-2 flex items-center gap-2 text-xs text-indigo-200">
                          <span>Setelah bagian {sIdx + 1}:</span>
                          <select
                            value={section.afterSectionAction || 'next'}
                            onChange={(e) => handleUpdateSection(section.id, { afterSectionAction: e.target.value })}
                            className="bg-indigo-800 text-white border border-indigo-700 rounded-lg px-2 py-1 text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="next">Lanjut ke bagian berikutnya (Bagian {sIdx + 2})</option>
                            {form.sections.map((s, idx) => (
                              <option key={s.id} value={s.id}>
                                Buka Bagian {idx + 1}: {s.title}
                              </option>
                            ))}
                            <option value="submit">Kirim formulir langsung</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Questions belonging to this section */}
                  {sectionQuestions.map((q) => (
                    <SortableQuestion
                      key={q.id}
                      question={q}
                      isActive={activeQuestionId === q.id}
                      onSelect={() => setActiveQuestionId(q.id)}
                      onUpdate={handleUpdateQuestion}
                      onDuplicate={() => handleDuplicateQuestion(q)}
                      onDelete={() => handleDeleteQuestion(q.id)}
                      isQuizMode={form.settings.isQuiz}
                      sections={form.sections}
                      themeColor={form.theme.primaryColor}
                    />
                  ))}

                  {/* Quick Add Question in this specific section */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddQuestion(section.id)}
                      className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white/60 hover:bg-indigo-50/50 rounded-2xl text-xs font-bold text-slate-600 hover:text-indigo-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Pertanyaan di Bagian {sIdx + 1}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

