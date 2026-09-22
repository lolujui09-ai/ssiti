import { FormSchema } from '../types/schema';

export interface TemplateItem {
  id: string;
  name: string;
  badge: string;
  description: string;
  schema: FormSchema;
}

export const PRESET_TEMPLATES: TemplateItem[] = [
  {
    id: 'event-registration',
    name: 'Pendaftaran Workshop & Acara',
    badge: 'Semua 9 Tipe Field',
    description: 'Mencakup text, email, number, date, select, radio, checkbox, textarea, dan file upload.',
    schema: {
      title: 'Formulir Registrasi Workshop Teknologi 2026',
      description: 'Silakan lengkapi biodata Anda untuk mengonfirmasi keikutsertaan dalam workshop intensif.',
      submitButtonText: 'Konfirmasi Pendaftaran',
      showResetButton: true,
      resetButtonText: 'Reset Isian',
      fields: [
        {
          id: 'fullName',
          type: 'text',
          label: 'Nama Lengkap (sesuai identitas)',
          placeholder: 'Contoh: Budi Santoso, S.Kom',
          required: true,
          minLength: 3,
          colSpan: 1,
          helperText: 'Nama akan dicantumkan pada sertifikat elektronik.'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Alamat Email Aktif',
          placeholder: 'budi.santoso@example.com',
          required: true,
          colSpan: 1,
          helperText: 'Tautan Zoom dan tiket acara dikirim via email.'
        },
        {
          id: 'age',
          type: 'number',
          label: 'Usia (Tahun)',
          placeholder: '24',
          min: 17,
          max: 80,
          required: true,
          colSpan: 1
        },
        {
          id: 'birthDate',
          type: 'date',
          label: 'Tanggal Lahir',
          required: true,
          colSpan: 1
        },
        {
          id: 'occupation',
          type: 'select',
          label: 'Bidang Pekerjaan / Profesi Saat Ini',
          required: true,
          colSpan: 2,
          options: [
            { label: 'Software Developer / Engineer', value: 'developer' },
            { label: 'UI/UX Designer', value: 'designer' },
            { label: 'Product Manager / Analyst', value: 'pm' },
            { label: 'Mahasiswa / Pelajar', value: 'student' },
            { label: 'Lainnya', value: 'other' }
          ]
        },
        {
          id: 'attendanceMode',
          type: 'radio',
          label: 'Metode Kehadiran',
          required: true,
          colSpan: 2,
          options: [
            { label: 'Tatap Muka (Offline di Jakarta Convention Center)', value: 'offline' },
            { label: 'Virtual Interaktif (Online via Zoom / Livestream)', value: 'online' }
          ]
        },
        {
          id: 'interestedTracks',
          type: 'checkbox',
          label: 'Topik Sesi yang Paling Ingin Dipelajari (Bisa pilih > 1)',
          required: true,
          colSpan: 2,
          options: [
            { label: 'Agentic AI & LLM System Architecture', value: 'ai_agents' },
            { label: 'Modern Frontend & Reactive Design Patterns', value: 'frontend' },
            { label: 'Cloud Infrastructure & High Scalability', value: 'devops' },
            { label: 'Product Thinking & User Experience', value: 'ux' }
          ]
        },
        {
          id: 'questions',
          type: 'textarea',
          label: 'Pertanyaan atau Ekspektasi Khusus untuk Pembicara',
          placeholder: 'Tuliskan topik spesifik atau kendala teknis yang ingin Anda diskusikan...',
          rows: 3,
          required: false,
          colSpan: 2
        },
        {
          id: 'identityProof',
          type: 'file',
          label: 'Unggah Bukti Identitas (KTP / KTM / Kartu Pegawai)',
          helperText: 'Format yang diterima: PDF, PNG, atau JPG (maksimal 5MB).',
          accept: '.pdf,.png,.jpg,.jpeg',
          required: false,
          colSpan: 2
        },
        {
          id: 'termsAgreement',
          type: 'checkbox',
          label: 'Saya menyetujui syarat, tata tertib acara, dan kebijakan privasi penyelenggara.',
          required: true,
          colSpan: 2
        }
      ]
    }
  },
  {
    id: 'job-application',
    name: 'Formulir Lamaran Pekerjaan',
    badge: 'Recruitment',
    description: 'Form penerimaan kandidat dengan upload CV/resume, posisi, nomor telepon, dan pengalaman.',
    schema: {
      title: 'Lamaran Pekerjaan di PT Inovasi Digital',
      description: 'Bergabunglah bersama tim kami. Mohon lengkapi formulir di bawah ini dengan data terkini.',
      submitButtonText: 'Kirimkan Lamaran',
      fields: [
        {
          id: 'applicantName',
          type: 'text',
          label: 'Nama Lengkap',
          placeholder: 'Nama lengkap kandidat',
          required: true,
          colSpan: 1
        },
        {
          id: 'contactEmail',
          type: 'email',
          label: 'Alamat Email',
          placeholder: 'kandidat@email.com',
          required: true,
          colSpan: 1
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Nomor WhatsApp / Telepon',
          placeholder: '081234567890',
          required: true,
          colSpan: 1
        },
        {
          id: 'yearsExperience',
          type: 'number',
          label: 'Pengalaman Kerja Relevan (Tahun)',
          placeholder: '3',
          min: 0,
          max: 40,
          required: true,
          colSpan: 1
        },
        {
          id: 'targetPosition',
          type: 'select',
          label: 'Posisi yang Dilamar',
          required: true,
          colSpan: 2,
          options: [
            { label: 'Senior Fullstack TypeScript Engineer', value: 'senior_ts' },
            { label: 'Lead Product Designer', value: 'lead_designer' },
            { label: 'Engineering Manager', value: 'eng_manager' },
            { label: 'Data & AI Specialist', value: 'data_ai' }
          ]
        },
        {
          id: 'workPreference',
          type: 'radio',
          label: 'Sistem Kerja yang Diharapkan',
          required: true,
          colSpan: 2,
          options: [
            { label: 'Full Remote (Bekerja dari mana saja)', value: 'remote' },
            { label: 'Hybrid (2 hari kantor, 3 hari remote)', value: 'hybrid' },
            { label: 'On-site di Kantor Pusat', value: 'onsite' }
          ]
        },
        {
          id: 'portfolioUrl',
          type: 'url',
          label: 'Tautan Portofolio / GitHub / LinkedIn',
          placeholder: 'https://github.com/username atau https://linkedin.com/in/...',
          required: true,
          colSpan: 2
        },
        {
          id: 'coverLetter',
          type: 'textarea',
          label: 'Ceritakan Mengapa Anda Tertarik dengan Peran Ini',
          placeholder: 'Jelaskan pencapaian terbaik Anda dan motivasi melamar...',
          rows: 4,
          required: true,
          colSpan: 2
        },
        {
          id: 'resumeFile',
          type: 'file',
          label: 'Unggah Dokumen CV / Resume (Wajib)',
          accept: '.pdf',
          helperText: 'Hanya format PDF, ukuran file maksimal 5MB.',
          required: true,
          colSpan: 2
        }
      ]
    }
  },
  {
    id: 'customer-survey',
    name: 'Survei Kepuasan Pelanggan',
    badge: 'Feedback Survey',
    description: 'Kuesioner evaluasi layanan dengan opsi radio, rating select, checkbox keluhan, dan saran.',
    schema: {
      title: 'Survei Evaluasi & Kepuasan Pelanggan',
      description: 'Bantu kami meningkatkan kualitas layanan dengan memberikan ulasan jujur Anda.',
      submitButtonText: 'Kirimkan Ulasan',
      fields: [
        {
          id: 'customerName',
          type: 'text',
          label: 'Nama Anda (Opsional)',
          placeholder: 'Dapat dikosongkan jika ingin anonim',
          required: false,
          colSpan: 1
        },
        {
          id: 'visitDate',
          type: 'date',
          label: 'Tanggal Transaksi / Kunjungan Terakhir',
          required: true,
          colSpan: 1
        },
        {
          id: 'overallRating',
          type: 'select',
          label: 'Tingkat Kepuasan Keseluruhan',
          required: true,
          colSpan: 2,
          options: [
            { label: '⭐⭐⭐⭐⭐ Sangat Puas (5/5)', value: '5' },
            { label: '⭐⭐⭐⭐ Puas (4/5)', value: '4' },
            { label: '⭐⭐⭐ Cukup / Netral (3/5)', value: '3' },
            { label: '⭐⭐ Kurang Puas (2/5)', value: '2' },
            { label: '⭐ Sangat Kecewa (1/5)', value: '1' }
          ]
        },
        {
          id: 'recommendLikelihood',
          type: 'radio',
          label: 'Apakah Anda akan merekomendasikan kami kepada rekan atau keluarga?',
          required: true,
          colSpan: 2,
          options: [
            { label: 'Pasti akan merekomendasikan', value: 'definitely' },
            { label: 'Mungkin', value: 'maybe' },
            { label: 'Tidak akan merekomendasikan', value: 'no' }
          ]
        },
        {
          id: 'aspectsLiked',
          type: 'checkbox',
          label: 'Bagian layanan apa yang paling Anda sukai?',
          required: false,
          colSpan: 2,
          options: [
            { label: 'Kecepatan respon layanan', value: 'speed' },
            { label: 'Keramahan staff / customer service', value: 'friendliness' },
            { label: 'Kualitas produk / hasil kerja', value: 'quality' },
            { label: 'Kemudahan transaksi dan pembayaran', value: 'convenience' }
          ]
        },
        {
          id: 'feedbackDetail',
          type: 'textarea',
          label: 'Kritik, Saran, atau Masukan untuk Peningkatan',
          placeholder: 'Tuliskan masukan berharga Anda secara detail di sini...',
          rows: 3,
          required: true,
          colSpan: 2
        }
      ]
    }
  }
];

export const EMPTY_SCHEMA_TEMPLATE: FormSchema = {
  title: 'Judul Formulir Anda',
  description: 'Deskripsi singkat mengenai tujuan pengisian formulir ini.',
  submitButtonText: 'Kirim',
  fields: [
    {
      id: 'nama',
      type: 'text',
      label: 'Nama Lengkap',
      placeholder: 'Masukkan nama Anda',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'nama@example.com',
      required: true
    }
  ]
};

export const SCHEMA_DOCS_PROMPT = `Format Schema JSON Resmi untuk Schema-Based Form Generator:
{
  "title": "Judul Form (string, wajib)",
  "description": "Deskripsi singkat form (string, opsional)",
  "submitButtonText": "Label tombol kirim (string, opsional, default: 'Kirim')",
  "fields": [
    {
      "id": "namaIdUnik (string, wajib)",
      "type": "text | email | number | date | textarea | select | radio | checkbox | file | tel | url",
      "label": "Label tampilan field (string, wajib)",
      "placeholder": "Petunjuk input (string, opsional)",
      "helperText": "Teks bantuan kecil di bawah input (string, opsional)",
      "required": true,
      "colSpan": 1, 
      "min": 0, 
      "max": 100, 
      "minLength": 3,
      "rows": 4, 
      "accept": ".pdf,.jpg,.png", 
      "options": [ 
        { "label": "Label Pilihan 1", "value": "nilai_1" },
        { "label": "Label Pilihan 2", "value": "nilai_2" }
      ]
    }
  ]
}

Aturan penting:
1. Field bertipe "select" dan "radio" WAJIB memiliki properti "options" berupa array minimal 1 item dengan { "label": "...", "value": "..." }.
2. Field bertipe "checkbox" jika memiliki opsi banyak dapat mengisi "options", atau jika untuk persetujuan tunggal tidak perlu "options".
3. Field bertipe "file" dapat memiliki "accept" (misal: ".pdf,.png,.jpg").
4. Setiap "id" harus unik dan menggunakan format camelCase atau snake_case.`;

export function generateAIPrompt(customRequirement: string): string {
  const requirementText = customRequirement.trim() || 'Formulir Pendaftaran Acara Workshop';
  
  return `Saya membutuhkan schema JSON untuk form dengan kebutuhan berikut:
"${requirementText}"

Ikuti aturan schema JSON berikut dengan teliti:
${SCHEMA_DOCS_PROMPT}

PENTING:
- Buat field-field yang relevan dan lengkap sesuai kebutuhan di atas (gunakan tipe text, email, number, date, select, radio, checkbox, textarea, file jika sesuai).
- Jawab HANYA dalam format JSON mentah yang valid (tanpa penjelasan pembuka/penutup, tanpa teks pembicaraan).`;
}
