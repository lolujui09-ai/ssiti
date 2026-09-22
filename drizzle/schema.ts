import { mysqlTable, varchar, text, boolean, int, json, timestamp, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// BETTER AUTH TABLES (required by better-auth drizzle adapter)
// ─────────────────────────────────────────────────────────────────────────────

export const user = mysqlTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const session = mysqlTable('session', {
  id: varchar('id', { length: 36 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  ipAddress: varchar('ip_address', { length: 255 }),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = mysqlTable('account', {
  id: varchar('id', { length: 36 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 36 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// SSITI CUSTOM TABLES
// ─────────────────────────────────────────────────────────────────────────────

export const forms = mysqlTable(
  'forms',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 500 }).notNull().default('Formulir Tanpa Judul'),
    description: text('description'),
    submitButtonText: varchar('submit_button_text', { length: 255 }).default('Kirim Formulir'),
    /** JSON: FormTheme */
    themeJson: json('theme_json')
      .$type<{
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        fontFamily: string;
        borderRadius?: string;
        headerBannerImage?: string;
      }>()
      .notNull(),
    /** JSON: FormSettings */
    settingsJson: json('settings_json').$type<Record<string, any>>().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (t) => [index('forms_user_idx').on(t.userId)]
);

export const formSections = mysqlTable(
  'form_sections',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    formId: varchar('form_id', { length: 36 })
      .notNull()
      .references(() => forms.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 500 }).notNull().default('Bagian 1'),
    description: text('description'),
    afterSectionAction: varchar('after_section_action', { length: 100 }).default('submit'),
    /** Display order within the form */
    order: int('order').notNull().default(0),
  },
  (t) => [index('sections_form_idx').on(t.formId)]
);

export const formQuestions = mysqlTable(
  'form_questions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    formId: varchar('form_id', { length: 36 })
      .notNull()
      .references(() => forms.id, { onDelete: 'cascade' }),
    sectionId: varchar('section_id', { length: 36 }),
    type: varchar('type', { length: 50 }).notNull().default('text'),
    title: text('title').notNull(),
    description: text('description'),
    required: boolean('required').notNull().default(false),
    placeholder: varchar('placeholder', { length: 500 }),
    /** JSON: OptionItem[] */
    optionsJson: json('options_json').$type<any[]>(),
    hasOtherOption: boolean('has_other_option').default(false),
    scaleMin: int('scale_min').default(1),
    scaleMax: int('scale_max').default(5),
    scaleMinLabel: varchar('scale_min_label', { length: 255 }),
    scaleMaxLabel: varchar('scale_max_label', { length: 255 }),
    /** JSON: GridRowCol[] */
    rowsJson: json('rows_json').$type<any[]>(),
    /** JSON: GridRowCol[] */
    columnsJson: json('columns_json').$type<any[]>(),
    /** JSON: QuestionValidation */
    validationJson: json('validation_json').$type<Record<string, any>>(),
    /** JSON: QuestionQuiz */
    quizJson: json('quiz_json').$type<{
      points: number;
      correctAnswers: string[];
      explanation?: string;
    }>(),
    /** Display order within the form */
    order: int('order').notNull().default(0),
  },
  (t) => [
    index('questions_form_idx').on(t.formId),
    index('questions_section_idx').on(t.sectionId),
  ]
);

export const formResponses = mysqlTable(
  'form_responses',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    formId: varchar('form_id', { length: 36 })
      .notNull()
      .references(() => forms.id, { onDelete: 'cascade' }),
    submittedAt: timestamp('submitted_at').notNull().defaultNow(),
    email: varchar('email', { length: 255 }),
    /** JSON: Record<questionId, answer> */
    answersJson: json('answers_json').$type<Record<string, any>>().notNull(),
    /** JSON: quiz score result */
    quizScoreJson: json('quiz_score_json').$type<{
      totalPoints: number;
      maxPoints: number;
      breakdown: Record<string, { earned: number; max: number; isCorrect: boolean }>;
    }>(),
  },
  (t) => [index('responses_form_idx').on(t.formId)]
);

// Type exports for use in API routes
export type User = typeof user.$inferSelect;
export type Form = typeof forms.$inferSelect;
export type FormSection = typeof formSections.$inferSelect;
export type FormQuestion = typeof formQuestions.$inferSelect;
export type FormResponse = typeof formResponses.$inferSelect;

// Relations for relational queries
export const userRelations = relations(user, ({ many }) => ({
  forms: many(forms),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  user: one(user, {
    fields: [forms.userId],
    references: [user.id],
  }),
  sections: many(formSections),
  questions: many(formQuestions),
  responses: many(formResponses),
}));

export const formSectionsRelations = relations(formSections, ({ one, many }) => ({
  form: one(forms, {
    fields: [formSections.formId],
    references: [forms.id],
  }),
  questions: many(formQuestions),
}));

export const formQuestionsRelations = relations(formQuestions, ({ one }) => ({
  form: one(forms, {
    fields: [formQuestions.formId],
    references: [forms.id],
  }),
  section: one(formSections, {
    fields: [formQuestions.sectionId],
    references: [formSections.id],
  }),
}));

export const formResponsesRelations = relations(formResponses, ({ one }) => ({
  form: one(forms, {
    fields: [formResponses.formId],
    references: [forms.id],
  }),
}));


