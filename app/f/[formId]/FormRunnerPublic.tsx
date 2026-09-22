'use client';
import { useState } from 'react';
import { FormRunner } from '@/components/form-runner/FormRunner';
import { FullFormSchema, FormResponseItem } from '@/types/schema';

interface FormRunnerPublicProps {
  form: any;
}

export function FormRunnerPublic({ form: rawForm }: FormRunnerPublicProps) {
  // Normalize DB shape to FullFormSchema
  const form: FullFormSchema = {
    id: rawForm.id,
    title: rawForm.title,
    description: rawForm.description ?? '',
    submitButtonText: rawForm.submitButtonText ?? 'Kirim Formulir',
    theme: rawForm.themeJson ?? {
      primaryColor: '#4f46e5',
      accentColor: '#6366f1',
      backgroundColor: '#f8fafc',
      fontFamily: 'Plus Jakarta Sans',
      borderRadius: 'xl',
    },
    settings: rawForm.settingsJson ?? {},
    sections: (rawForm.sections ?? []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description ?? '',
      afterSectionAction: s.afterSectionAction ?? 'submit',
    })),
    questions: (rawForm.questions ?? []).map((q: any) => ({
      id: q.id,
      type: q.type,
      title: q.title,
      description: q.description ?? '',
      required: q.required,
      placeholder: q.placeholder ?? '',
      sectionId: q.sectionId,
      options: q.optionsJson ?? undefined,
      hasOtherOption: q.hasOtherOption ?? false,
      scaleMin: q.scaleMin ?? 1,
      scaleMax: q.scaleMax ?? 5,
      scaleMinLabel: q.scaleMinLabel ?? '',
      scaleMaxLabel: q.scaleMaxLabel ?? '',
      rows: q.rowsJson ?? undefined,
      columns: q.columnsJson ?? undefined,
      validation: q.validationJson ?? undefined,
      quiz: q.quizJson ?? undefined,
    })),
    responses: [],
  };

  const handlePublicSubmit = async (response: FormResponseItem) => {
    try {
      await fetch(`/api/forms/${form.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: response.email,
          answers: response.answers,
        }),
      });
    } catch (err) {
      console.error('Error submitting response:', err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: form.theme.backgroundColor || '#f8fafc',
        fontFamily: form.theme.fontFamily ? `"${form.theme.fontFamily}", sans-serif` : 'inherit',
        minHeight: '100vh',
      }}
      className="py-6 sm:py-10"
    >
      <FormRunner
        form={form}
        onSubmitSuccess={handlePublicSubmit}
        isRespondentView={true}
      />
    </div>
  );
}

