export type QuestionType =
  | 'text'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'scale'
  | 'grid_radio'
  | 'grid_checkbox'
  | 'file'
  | 'date'
  | 'time';

export interface OptionItem {
  id: string;
  label: string;
  value: string;
  goToSectionId?: string;
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
  correctAnswers: string[];
  explanation?: string;
}

export interface FormQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  sectionId?: string;
  options?: OptionItem[];
  hasOtherOption?: boolean;
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  rows?: GridRowCol[];
  columns?: GridRowCol[];
  validation?: QuestionValidation;
  quiz?: QuestionQuiz;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  afterSectionAction?: 'next' | 'submit' | string;
}

export interface FormSettings {
  isQuiz: boolean;
  releaseGradesImmediately: boolean;
  showMissedQuestions: boolean;
  showCorrectAnswers: boolean;
  showPointValues: boolean;
  defaultQuestionPoints: number;
  collectEmail: boolean;
  limitOneResponse: boolean;
  allowResponseEditing: boolean;
  isAcceptingResponses: boolean;
  closedMessage?: string;
  showProgressBar: boolean;
  shuffleQuestions: boolean;
  confirmationMessage: string;
  showSubmitAnotherLink: boolean;
}

export interface FormTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  headerBannerImage?: string;
  borderRadius?: 'none' | 'md' | 'xl' | string;
}

export interface FormResponseItem {
  id: string;
  submittedAt: string;
  email?: string;
  answers: Record<string, any>;
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

