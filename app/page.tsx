'use client';
import { useRouter } from 'next/navigation';
import { Sparkles, FileText, Zap, Shield, BarChart3, ArrowRight, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Gradient blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[5px] bg-white text-slate-950 font-mono font-bold text-sm flex items-center justify-center">
              S
            </div>
            <span className="text-sm font-bold tracking-tight">Ssiti Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-600/40 text-indigo-300 text-xs font-semibold mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Form Builder Cerdas dengan Prompt AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Buat Formulir,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            Kuis & Survei
          </span>
          <br />
          Tanpa Ribet
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Ssiti Studio hadir dengan visual builder yang intuitif, prompt AI untuk mempercepat
          pembuatan form, dan analitik tanggapan real-time. Semua dalam satu platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/register')}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>Mulai Gratis Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/login')}
            className="w-full sm:w-auto px-8 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Masuk ke Akun</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: FileText,
            color: 'text-indigo-400',
            bg: 'bg-indigo-600/15',
            title: 'Visual Builder Lengkap',
            desc: 'Drag-and-drop pertanyaan, buat bagian bertingkat, dan preview form secara langsung.',
          },
          {
            icon: Sparkles,
            color: 'text-violet-400',
            bg: 'bg-violet-600/15',
            title: 'Prompt AI Generator',
            desc: 'Buat prompt siap pakai untuk ChatGPT/Gemini/Claude, paste JSON hasilnya — form langsung jadi.',
          },
          {
            icon: Zap,
            color: 'text-amber-400',
            bg: 'bg-amber-600/15',
            title: 'Mode Kuis Otomatis',
            desc: 'Tetapkan kunci jawaban, bobot poin, dan sistem evaluasi otomatis untuk setiap soal.',
          },
          {
            icon: BarChart3,
            color: 'text-emerald-400',
            bg: 'bg-emerald-600/15',
            title: 'Analitik Tanggapan',
            desc: 'Dashboard respons lengkap dengan ringkasan skor, grafik, dan ekspor data.',
          },
          {
            icon: Shield,
            color: 'text-sky-400',
            bg: 'bg-sky-600/15',
            title: 'Autentikasi Aman',
            desc: 'Login/register dengan sistem autentikasi Better Auth yang andal dan terenkripsi.',
          },
          {
            icon: FileText,
            color: 'text-rose-400',
            bg: 'bg-rose-600/15',
            title: 'Upload File ke Cloud',
            desc: 'Pertanyaan file upload tersimpan langsung ke Cloudinary — aman, cepat, dan terstruktur.',
          },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/8 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
              <f.icon className={`w-5 h-5 ${f.color}`} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Ssiti Studio. Dibuat dengan ❤️ untuk pendidik &amp; peneliti Indonesia.
      </footer>
    </div>
  );
}

