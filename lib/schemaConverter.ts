import { FullFormSchema, FormQuestion, ValidationResult, ValidationError } from '@/types/schema';
import { SAMPLE_FORMS } from '@/lib/sampleForms';

export function validateFormSchema(rawJson: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!rawJson || rawJson.trim() === '') {
    return {
      isValid: false,
      errors: [{ message: 'Schema JSON masih kosong. Masukkan kode JSON valid.', type: 'error' }],
      warnings: [],
      parsedSchema: null,
    };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err: any) {
    const errorMsg = err.message || 'Sintaks JSON tidak valid';
    let line: number | undefined;
    const lineMatch = errorMsg.match(/line\s+(\d+)/i);
    if (lineMatch) {
      line = parseInt(lineMatch[1], 10);
    } else {
      const posMatch = errorMsg.match(/position\s+(\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        line = rawJson.substring(0, pos).split('\n').length;
      }
    }
    return {
      isValid: false,
      errors: [{ message: `Sintaks JSON tidak valid: ${errorMsg}`, type: 'error', line }],
      warnings: [],
      parsedSchema: null,
    };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      isValid: false,
      errors: [{ message: 'Root schema harus berupa JSON Object { ... }', type: 'error' }],
      warnings: [],
      parsedSchema: null,
    };
  }

  // Normalize title
  const title = typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title : 'Formulir Tanpa Judul';

  // Extract questions: either parsed.questions or parsed.fields
  const rawQuestions = parsed.questions || parsed.fields || [];
  if (!Array.isArray(rawQuestions)) {
    errors.push({
      message: 'Properti "questions" (atau "fields") harus berupa array daftar pertanyaan.',
      type: 'error',
    });
  }

  // Normalize questions
  const normalizedQuestions: FormQuestion[] = [];
  const seenQIds = new Set<string>();
  if (Array.isArray(rawQuestions)) {
    rawQuestions.forEach((q: any, idx: number) => {
      if (typeof q !== 'object' || q === null) return;
      let qId = q.id || `q-${idx + 1}`;
      if (seenQIds.has(qId)) {
        qId = `${qId}_${idx + 1}_${Math.random().toString(36).substring(2, 6)}`;
      }
      seenQIds.add(qId);
      const qTitle = q.title || q.label || `Pertanyaan #${idx + 1}`;
      const qType = q.type || 'text';

      let options = q.options;
      if (Array.isArray(options)) {
        options = options.map((opt: any, optIdx: number) => {
          if (typeof opt === 'string') {
            return { id: `opt-${optIdx}`, label: opt, value: opt };
          }
          return {
            id: opt.id || `opt-${optIdx}`,
            label: opt.label || opt.value || `Opsi ${optIdx + 1}`,
            value: opt.value !== undefined ? String(opt.value) : `opt-${optIdx}`,
            goToSectionId: opt.goToSectionId,
          };
        });
      }

      normalizedQuestions.push({
        id: qId,
        type: qType,
        title: qTitle,
        description: q.description || q.helperText || '',
        required: Boolean(q.required),
        placeholder: q.placeholder || '',
        sectionId: q.sectionId || 'sec-1',
        options: options,
        hasOtherOption: Boolean(q.hasOtherOption),
        scaleMin: q.scaleMin !== undefined ? q.scaleMin : 1,
        scaleMax: q.scaleMax !== undefined ? q.scaleMax : 5,
        scaleMinLabel: q.scaleMinLabel || '',
        scaleMaxLabel: q.scaleMaxLabel || '',
        rows: q.rows,
        columns: q.columns,
        validation: q.validation,
        quiz: q.quiz,
      });
    });
  }

  if (normalizedQuestions.length === 0) {
    warnings.push({
      message: 'Formulir belum memiliki pertanyaan. Anda dapat menambahkan pertanyaan secara visual.',
      type: 'warning',
    });
  }

  // Normalize sections
  let sections = parsed.sections;
  if (!Array.isArray(sections) || sections.length === 0) {
    sections = [
      {
        id: 'sec-1',
        title: 'Bagian 1',
        description: '',
        afterSectionAction: 'submit',
      },
    ];
  }

  // Normalize settings
  const baseSettings = SAMPLE_FORMS[0].settings;
  const settings = {
    ...baseSettings,
    ...(parsed.settings || {}),
  };

  // Normalize theme
  const baseTheme = SAMPLE_FORMS[0].theme;
  const theme = {
    ...baseTheme,
    ...(parsed.theme || {}),
  };

  const finalSchema: FullFormSchema = {
    id: parsed.id || `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    description: parsed.description || '',
    submitButtonText: parsed.submitButtonText || 'Kirim',
    theme,
    settings,
    sections,
    questions: normalizedQuestions,
    responses: Array.isArray(parsed.responses) ? parsed.responses : [],
  };

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    parsedSchema: errors.length === 0 ? finalSchema : null,
  };
}

