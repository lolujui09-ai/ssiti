export interface PromptGeneratorOptions {
  formContext: string;
  formType: 'quiz' | 'survey' | 'registration' | 'general';
  rawQuestions: string;
  extraRequirements?: string;
  targetQuestionCount?: number;
}

export function buildCompleteAIPrompt(options: PromptGeneratorOptions): string {
  const {
    formContext,
    formType,
    rawQuestions,
    extraRequirements,
    targetQuestionCount,
  } = options;

  let formTypeDesc = 'Formulir Kuesioner/Survei standar';
  let quizInstructions = '';
  if (formType === 'quiz') {
    formTypeDesc = 'Kuis / Ujian Berbobot Nilai (Quiz Mode)';
    quizInstructions = `
- Wajib sertakan properti "quiz" pada setiap pertanyaan pilihan ganda/jawaban singkat:
  "quiz": {
    "points": 10,
    "correctAnswers": ["Jawaban Benar"],
    "explanation": "Penjelasan singkat mengenai alasan jawaban ini benar"
  }
- Pastikan "settings.isQuiz" bernilai true dan "settings.releaseGradesImmediately" bernilai true.`;
  } else if (formType === 'registration') {
    formTypeDesc = 'Formulir Pendaftaran / Registrasi';
  }

  const rawQuestionsBlock = rawQuestions.trim()
    ? `
BERIKUT ADALAH KUMPULAN PERTANYAAN / KEBUTUHAN SPESIFIK DARI PENGGUNA:
"""
${rawQuestions.trim()}
"""
PENTING: Gunakan dan kembangkan pertanyaan-pertanyaan di atas menjadi tipe field yang paling tepat (misal radio untuk pilihan tunggal, checkbox untuk multi-pilihan, scale untuk skala nilai, grid untuk matriks evaluasi, textarea untuk uraian, file untuk berkas, date untuk tanggal).`
    : `(Buatkan ${targetQuestionCount || 5} pertanyaan yang sangat relevan, komprehensif, dan realistis untuk konteks formulir ini).`;

  const extraReqBlock = extraRequirements?.trim()
    ? `
KEBUTUHAN KHUSUS TAMBAHAN:
${extraRequirements.trim()}`
    : '';

  return `Kamu adalah Form Architect & Schema Expert untuk aplikasi Form Builder.
Tugasmu adalah menghasilkan SATU OBJEK JSON MURNI (valid JSON tanpa penjelasan tambahan dan tanpa markdown pembungkus di luar \`\`\`json) yang merepresentasikan formulir lengkap sesuai kebutuhan berikut:

KONTEKS / TOPIK FORMULIR:
${formContext || 'Formulir Kuesioner & Evaluasi'}

TIPE FORMULIR:
${formTypeDesc}
${quizInstructions}
${rawQuestionsBlock}
${extraReqBlock}

STRUKTUR SCHEMA JSON YANG WAJIB DIIKUTI:
\`\`\`json
{
  "id": "form_${Date.now().toString(36)}",
  "title": "${formContext ? formContext.replace(/"/g, "'") : 'Judul Formulir'}",
  "description": "Deskripsi singkat yang jelas dan profesional tentang tujuan pengisian formulir ini.",
  "submitButtonText": "Kirim Formulir",
  "theme": {
    "primaryColor": "#4f46e5",
    "accentColor": "#6366f1",
    "backgroundColor": "#f8fafc",
    "fontFamily": "Plus Jakarta Sans",
    "borderRadius": "xl"
  },
  "settings": {
    "isQuiz": ${formType === 'quiz'},
    "releaseGradesImmediately": ${formType === 'quiz'},
    "showMissedQuestions": true,
    "showCorrectAnswers": true,
    "showPointValues": true,
    "defaultQuestionPoints": 10,
    "collectEmail": false,
    "limitOneResponse": false,
    "allowResponseEditing": false,
    "isAcceptingResponses": true,
    "showProgressBar": true,
    "shuffleQuestions": false,
    "confirmationMessage": "Terima kasih! Tanggapan Anda telah berhasil kami catat.",
    "showSubmitAnotherLink": true
  },
  "sections": [
    {
      "id": "section_1",
      "title": "Bagian 1",
      "description": "Silakan lengkapi pertanyaan di bawah ini dengan seksama.",
      "afterSectionAction": "submit"
    }
  ],
  "questions": [
    {
      "id": "q1",
      "sectionId": "section_1",
      "type": "text",
      "title": "Nama Lengkap",
      "required": true,
      "placeholder": "Ketik nama lengkap Anda..."
    },
    {
      "id": "q2",
      "sectionId": "section_1",
      "type": "radio",
      "title": "Contoh Pertanyaan Pilihan Ganda",
      "required": true,
      "options": [
        { "id": "opt1", "label": "Pilihan A", "value": "A" },
        { "id": "opt2", "label": "Pilihan B", "value": "B" },
        { "id": "opt3", "label": "Pilihan C", "value": "C" }
      ]
    }
  ],
  "responses": []
}
\`\`\`

TIPE FIELD PERTANYAAN ("type") YANG DIDUKUNG:
- "text" : Jawaban Singkat
- "textarea" : Paragraf / Uraian Panjang
- "radio" : Pilihan Ganda (Satu Pilihan) -> wajib sertakan "options" array
- "checkbox" : Kotak Centang (Pilihan Jamak) -> wajib sertakan "options" array
- "select" : Dropdown Pilihan
- "scale" : Skala Linier (misal 1-5 atau 1-10) -> sertakan "scaleMin": 1, "scaleMax": 5, "scaleMinLabel": "Kurang", "scaleMaxLabel": "Sangat Baik"
- "grid_radio" : Kisi Pilihan Ganda (Matriks baris & kolom) -> sertakan "rows": [{"id":"r1","label":"Baris 1"}], "columns": [{"id":"c1","label":"Kolom 1"}]
- "grid_checkbox" : Kisi Kotak Centang
- "date" : Pemilih Tanggal
- "time" : Waktu
- "file" : Unggah Berkas

ATURAN PENTING:
1. Pastikan JSON valid secara sintaks (kutip ganda untuk key dan string value, tidak ada trailing comma).
2. Setiap opsi di dalam "options" memiliki properti "id", "label", dan "value".
3. Hasilkan output HANYA kode JSON valid tanpa kalimat pengantar atau penutup.`;
}
