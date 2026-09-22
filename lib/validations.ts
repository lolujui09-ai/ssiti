import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').max(100),
});

// ─── Form Schemas ────────────────────────────────────────────────────────────

export const FormThemeSchema = z.object({
  primaryColor: z.string().default('#4f46e5'),
  accentColor: z.string().default('#6366f1'),
  backgroundColor: z.string().default('#f8fafc'),
  fontFamily: z.string().default('Plus Jakarta Sans'),
  borderRadius: z.string().optional(),
  headerBannerImage: z.string().url().optional(),
});

export const FormSettingsSchema = z.object({
  isQuiz: z.boolean().default(false),
  releaseGradesImmediately: z.boolean().default(false),
  showMissedQuestions: z.boolean().default(true),
  showCorrectAnswers: z.boolean().default(true),
  showPointValues: z.boolean().default(true),
  defaultQuestionPoints: z.number().int().min(0).default(10),
  collectEmail: z.boolean().default(false),
  limitOneResponse: z.boolean().default(false),
  allowResponseEditing: z.boolean().default(false),
  isAcceptingResponses: z.boolean().default(true),
  closedMessage: z.string().optional(),
  showProgressBar: z.boolean().default(true),
  shuffleQuestions: z.boolean().default(false),
  confirmationMessage: z.string().default('Terima kasih! Tanggapan Anda telah tercatat.'),
  showSubmitAnotherLink: z.boolean().default(true),
});

export const OptionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  goToSectionId: z.string().optional(),
});

export const GridRowColSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const QuestionQuizSchema = z.object({
  points: z.number().int().min(0),
  correctAnswers: z.array(z.string()),
  explanation: z.string().optional(),
});

export const FormQuestionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'text', 'textarea', 'radio', 'checkbox', 'select',
    'scale', 'grid_radio', 'grid_checkbox', 'file', 'date', 'time',
  ]),
  title: z.string().min(1, 'Judul pertanyaan tidak boleh kosong'),
  description: z.string().optional(),
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  sectionId: z.string().optional(),
  options: z.array(OptionItemSchema).optional(),
  hasOtherOption: z.boolean().optional(),
  scaleMin: z.number().int().optional(),
  scaleMax: z.number().int().optional(),
  scaleMinLabel: z.string().optional(),
  scaleMaxLabel: z.string().optional(),
  rows: z.array(GridRowColSchema).optional(),
  columns: z.array(GridRowColSchema).optional(),
  validation: z.record(z.string(), z.any()).optional(),
  quiz: QuestionQuizSchema.optional(),
});

export const FormSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  afterSectionAction: z.string().optional(),
});

export const FormCreateSchema = z.object({
  title: z.string().min(1, 'Judul formulir wajib diisi').max(500),
  description: z.string().optional(),
  submitButtonText: z.string().optional(),
  themeJson: FormThemeSchema,
  settingsJson: FormSettingsSchema,
  sections: z.array(FormSectionSchema).min(1),
  questions: z.array(FormQuestionSchema),
});

export const FormUpdateSchema = FormCreateSchema.partial();

// ─── Response Schemas ────────────────────────────────────────────────────────

export const ResponseSubmitSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  answers: z.record(z.string(), z.any()),
});

// ─── Upload Schema ───────────────────────────────────────────────────────────

export const UploadSchema = z.object({
  file: z.instanceof(File),
  questionId: z.string(),
  formId: z.string(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type FormCreateInput = z.infer<typeof FormCreateSchema>;
export type FormUpdateInput = z.infer<typeof FormUpdateSchema>;
export type ResponseSubmitInput = z.infer<typeof ResponseSubmitSchema>;

