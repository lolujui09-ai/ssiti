export type QuestionType =
  | 'text'          // Jawaban Singkat
  | 'textarea'      // Paragraf
  | 'radio'         // Pilihan Ganda
  | 'checkbox'      // Kotak Centang
  | 'select'        // Dropdown
  | 'scale'         // Skala Linier
  | 'grid_radio'    // Kisi Pilihan Ganda
  | 'grid_checkbox' // Kisi Kotak Centang
  | 'file'          // Upload File
  | 'date'          // Tanggal
  | 'time';         // Waktu

export interface OptionItem {
  id: string;
  label: string;
  value: string;
  goToSectionId?: string; // Logic jump: 'next' | 'submit' | sectionId
}

export interface GridRowCol {
  id: string;
  label: string;
}

export interface QuestionValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minSelect?: number;
  maxSelect?: number;
  accept?: string;
  maxFileSizeMB?: number;
}

export interface QuestionQuiz {
  points: number;
  correctAnswers: string[]; // single value for radio/select/text, multiple values for checkbox, rowId:colId for grid
  explanation?: string;
}

export interface FormQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  sectionId?: string; // which section this question belongs to

  // For radio, checkbox, select
  options?: OptionItem[];
  hasOtherOption?: boolean; // "Tambahkan 'Lainnya'"

  // For Linear Scale
  scaleMin?: number; // e.g. 1 or 0
  scaleMax?: number; // e.g. 5 or 10
  scaleMinLabel?: string; // e.g. "Sangat Kurang"
  scaleMaxLabel?: string; // e.g. "Sangat Baik"

  // For Grid (Matrix)
  rows?: GridRowCol[];
  columns?: GridRowCol[];

  // Validation rules
  validation?: QuestionValidation;

  // Quiz Mode Config
  quiz?: QuestionQuiz;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  afterSectionAction?: 'next' | 'submit' | string; // sectionId to jump to
}

export interface FormSettings {
  // Quiz
  isQuiz: boolean;
  releaseGradesImmediately: boolean; // true = immediately, false = later
  showMissedQuestions: boolean;
  showCorrectAnswers: boolean;
  showPointValues: boolean;
  defaultQuestionPoints: number;

  // Responses
  collectEmail: boolean;
  limitOneResponse: boolean;
  allowResponseEditing: boolean;
  isAcceptingResponses: boolean;
  closedMessage?: string;

  // Presentation
  showProgressBar: boolean;
  shuffleQuestions: boolean;
  confirmationMessage: string;
  showSubmitAnotherLink: boolean;
}

export interface FormTheme {
  primaryColor: string; // e.g. '#673ab7' (Google Forms purple)
  accentColor: string;
  backgroundColor: string; // e.g. '#f0ebf8'
  fontFamily: string;
  headerBannerImage?: string;
  borderRadius?: 'none' | 'md' | 'xl' | string;
}

// Backward compatibility aliases
export type FieldType = string;
export interface FormField {
  id: string;
  name: string;
  label: string;
  title?: string;
  type?: string;
  placeholder?: string;
  helperText?: string;
  description?: string;
  required?: boolean;
  options?: any[];
  [key: string]: any;
}

export interface FormSchema {
  id?: string;
  title: string;
  description?: string;
  submitButtonText?: string;
  showResetButton?: boolean;
  resetButtonText?: string;
  fields: any[];
  questions?: FormQuestion[];
  theme?: any;
  settings?: any;
  sections?: any[];
  responses?: any[];
  [key: string]: any;
}

export interface FormResponseItem {
  id: string;
  submittedAt: string;
  email?: string;
  answers: Record<string, any>; // questionId -> answer (string | string[] | Record<rowId, colId>)
  quizScore?: {
    totalPoints: number;
    maxPoints: number;
    breakdown: Record<string, { earned: number; max: number; isCorrect: boolean }>;
  };
}

export interface FullFormSchema {
  id: string;
  title: string;
  description?: string;
  submitButtonText?: string;
  theme: FormTheme;
  settings: FormSettings;
  sections: FormSection[];
  questions: FormQuestion[];
  responses: FormResponseItem[];
}

export interface ValidationError {
  fieldIndex?: number;
  fieldId?: string;
  message: string;
  type: 'error' | 'warning';
  line?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  parsedSchema: any;
}
