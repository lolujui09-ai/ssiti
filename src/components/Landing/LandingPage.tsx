import { useState } from 'react';
import { Sparkles, ArrowRight, Check, Play, ExternalLink } from 'lucide-react';
import { User } from '../../types/auth';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenLogin: () => void;
  user: User | null;
}

export const LandingPage = ({ onGetStarted, onOpenLogin, user }: LandingPageProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Showcase interactive state
  const [demoName, setDemoName] = useState('Budi Pratama');
  const [demoEmail, setDemoEmail] = useState('budi@example.com');
  const [demoDivisi, setDemoDivisi] = useState('Engineering');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => setDemoSubmitted(false), 3000);
  };

  return (
    <div className="ssiti-landing bg-white text-[#15171a] font-['Inter',sans-serif] selection:bg-[#edecfb] selection:text-[#3730a3]">
      <style>{`
        .ssiti-landing {
          --bg: #ffffff;
          --bg-alt: #f7f7f5;
          --ink: #15171a;
          --ink-dim: #55585f;
          --ink-faint: #8a8d94;
          --line: #e3e3df;
          --line-strong: #c9c9c3;
          --accent: #3730a3;
          --accent-dim: #4c46c4;
          --accent-tint: #edecfb;
          --sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --mono: 'IBM Plex Mono', 'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace;
        }
        .ssiti-wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
        @media (max-width: 620px){ .ssiti-wrap { padding: 0 20px; } }
      `}</style>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/92 backdrop-blur-md border-b border-[#e3e3df]">
        <div className="ssiti-wrap flex items-center justify-between h-[68px]">
          {/* Brand */}
          <a href="#top" className="flex items-center gap-2.5 text-inherit no-underline">
            <span className="w-7 h-7 rounded-[4px] bg-[#15171a] text-white font-['IBM_Plex_Mono',monospace] text-[13px] font-semibold flex items-center justify-center">
              S
            </span>
            <span className="text-lg font-bold tracking-[-0.01em]">Ssiti</span>
          </a>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-9 text-[14.5px] text-[#55585f] font-medium">
            <a href="#produk" className="hover:text-[#15171a] transition-colors no-underline">Product</a>
            <a href="#fitur" className="hover:text-[#15171a] transition-colors no-underline">Features</a>
            <a href="#alur" className="hover:text-[#15171a] transition-colors no-underline">How It Works</a>
            <a href="#usecase" className="hover:text-[#15171a] transition-colors no-underline">Use Cases</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <button
                type="button"
                onClick={onGetStarted}
                className="hidden sm:inline-block text-[14px] font-semibold text-[#15171a] hover:text-[#3730a3] transition-colors cursor-pointer"
              >
                Masuk ke Dashboard ({user.name.split(' ')[0]}) &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="hidden sm:inline-block text-[14.5px] font-semibold text-[#55585f] hover:text-[#15171a] transition-colors cursor-pointer"
              >
                Masuk
              </button>
            )}

            <button
              type="button"
              onClick={onGetStarted}
              className="bg-[#3730a3] hover:bg-[#4c46c4] text-white font-semibold text-[14.5px] px-5 py-2.5 rounded-[4px] transition-colors cursor-pointer"
            >
              {user ? 'Buka Dashboard' : 'Mulai gratis'}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.25 p-1.5 cursor-pointer bg-transparent border-none"
              aria-label="Toggle menu"
            >
              <span className="w-5.5 h-0.5 bg-[#15171a] block"></span>
              <span className="w-5.5 h-0.5 bg-[#15171a] block"></span>
              <span className="w-5.5 h-0.5 bg-[#15171a] block"></span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#e3e3df] bg-white px-5 py-4 space-y-3">
            <a
              href="#produk"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-[#15171a] border-b border-[#e3e3df]"
            >
              Product
            </a>
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-[#15171a] border-b border-[#e3e3df]"
            >
              Features
            </a>
            <a
              href="#alur"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-[#15171a] border-b border-[#e3e3df]"
            >
              How It Works
            </a>
            <a
              href="#usecase"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-[#15171a] border-b border-[#e3e3df]"
            >
              Use Cases
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full bg-[#3730a3] text-white font-semibold text-sm py-2.5 rounded-[4px]"
              >
                Mulai gratis
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="pt-16 sm:pt-22 pb-16">
          <div className="ssiti-wrap">
            <div className="max-w-[780px]">
              <p className="text-[13px] font-bold text-[#3730a3] tracking-[0.01em] mb-4.5">
                LEBIH DARI SEKADAR TANYA JAWAB
              </p>
              <h1 className="text-[36px] sm:text-[52px] lg:text-[62px] font-extrabold tracking-[-0.025em] leading-[1.06] text-[#15171a] mb-6.5">
                AI yang biasa kamu ajak ngobrol, sekarang bisa bikinkan form kamu.
              </h1>
              <p className="text-[17px] sm:text-[18.5px] text-[#55585f] max-w-[54ch] mb-9 leading-relaxed">
                Nggak perlu susun form satu per satu lagi. Cukup salin satu format sederhana, ceritakan kebutuhan formmu ke AI yang sudah kamu pakai sehari-hari, lalu tempel hasilnya. Form langsung jadi, tanpa buang waktu dan tanpa harus ngerti teknis.
              </p>
              <div className="flex gap-3.5 flex-wrap items-center mb-5">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="bg-[#3730a3] hover:bg-[#4c46c4] text-white font-semibold text-[14.5px] px-6 py-3 rounded-[4px] cursor-pointer transition-colors shadow-xs"
                >
                  Coba sekarang, gratis
                </button>
                <a
                  href="#produk"
                  className="border border-[#15171a] text-[#15171a] hover:bg-[#15171a] hover:text-white font-semibold text-[14.5px] px-5 py-3 rounded-[4px] cursor-pointer transition-colors no-underline"
                >
                  Lihat contohnya
                </a>
              </div>
            </div>

            {/* PRODUCT SHOWCASE */}
            <div className="mt-14 sm:mt-16" id="produk">
              <p className="text-[13.5px] text-[#8a8d94] mb-3.5">
                Contoh di bawah ini otomatis disusun AI. Kamu tidak perlu bisa coding atau menulis tampilan seperti ini sendiri.
              </p>

              <div className="border border-[#e3e3df] rounded-[10px] overflow-hidden bg-[#f7f7f5] shadow-xs">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4.5 py-3 border-b border-[#e3e3df] bg-white">
                  <span className="w-2 h-2 rounded-full bg-[#c9c9c3]" />
                  <span className="w-2 h-2 rounded-full bg-[#c9c9c3]" />
                  <span className="w-2 h-2 rounded-full bg-[#c9c9c3]" />
                  <span className="ml-auto font-['IBM_Plex_Mono',monospace] text-xs text-[#8a8d94]">
                    ssiti.app/generate
                  </span>
                </div>

                {/* Showcase Body (Code on Left, Rendered Form on Right) */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left: JSON Schema */}
                  <div className="p-6 sm:p-7">
                    <p className="font-['IBM_Plex_Mono',monospace] text-[11.5px] text-[#8a8d94] mb-3.5 font-medium">
                      YANG KAMU TEMPEL DARI AI
                    </p>
                    <pre className="m-0 font-['IBM_Plex_Mono',monospace] text-[12.6px] leading-[1.75] text-[#55585f] overflow-x-auto bg-white border border-[#e3e3df] rounded-[6px] p-4 select-all">
{`{
  "title": "Formulir Pendaftaran",
  "fields": [
    {"type":"text","label":"Nama Lengkap"},
    {"type":"email","label":"Email"},
    {"type":"select","label":"Divisi"}
  ]
}`}
                    </pre>
                  </div>

                  {/* Right: Live Interactive Form Result */}
                  <div className="p-6 sm:p-7 border-t md:border-t-0 md:border-l border-[#e3e3df] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <p className="font-['IBM_Plex_Mono',monospace] text-[11.5px] text-[#8a8d94] font-medium">
                          YANG LANGSUNG JADI
                        </p>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Live Interactive
                        </span>
                      </div>

                      <form onSubmit={handleDemoSubmit} className="space-y-3">
                        <div className="bg-white border border-[#e3e3df] rounded-[6px] p-3.5">
                          <label className="block text-xs text-[#8a8d94] font-semibold mb-1.5">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={demoName}
                            onChange={(e) => setDemoName(e.target.value)}
                            className="w-full h-[32px] rounded-[4px] border border-[#e3e3df] bg-[#f7f7f5] px-2.5 text-xs text-[#15171a] focus:outline-none focus:border-[#3730a3]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white border border-[#e3e3df] rounded-[6px] p-3.5">
                            <label className="block text-xs text-[#8a8d94] font-semibold mb-1.5">
                              Email
                            </label>
                            <input
                              type="email"
                              value={demoEmail}
                              onChange={(e) => setDemoEmail(e.target.value)}
                              className="w-full h-[32px] rounded-[4px] border border-[#e3e3df] bg-[#f7f7f5] px-2.5 text-xs text-[#15171a] focus:outline-none focus:border-[#3730a3]"
                            />
                          </div>

                          <div className="bg-white border border-[#e3e3df] rounded-[6px] p-3.5">
                            <label className="block text-xs text-[#8a8d94] font-semibold mb-1.5">
                              Divisi
                            </label>
                            <select
                              value={demoDivisi}
                              onChange={(e) => setDemoDivisi(e.target.value)}
                              className="w-full h-[32px] rounded-[4px] border border-[#e3e3df] bg-[#f7f7f5] px-2 text-xs text-[#15171a] focus:outline-none focus:border-[#3730a3]"
                            >
                              <option value="Engineering">Engineering</option>
                              <option value="Design">Design</option>
                              <option value="Marketing">Marketing</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full mt-2 h-[38px] rounded-[4px] bg-[#3730a3] hover:bg-[#4c46c4] text-white font-semibold text-[13px] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          {demoSubmitted ? '✓ Tanggapan Terkirim!' : 'Kirim Formulir'}
                        </button>
                      </form>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#e3e3df] flex items-center justify-between text-[11px] text-[#8a8d94]">
                      <span>Siap diedit di Form Builder lengkap</span>
                      <button
                        type="button"
                        onClick={onGetStarted}
                        className="font-bold text-[#3730a3] hover:underline cursor-pointer"
                      >
                        Buka di Ssiti Builder &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE PROP GRID */}
        <section className="border-t border-[#e3e3df] py-18">
          <div className="ssiti-wrap">
            <div className="max-w-[640px] mb-6">
              <p className="text-[13px] font-bold text-[#3730a3] tracking-[0.01em] mb-3">
                KENAPA LEBIH HEMAT WAKTU
              </p>
              <h2 className="text-[28px] sm:text-[38px] font-bold tracking-[-0.02em] leading-[1.15] text-[#15171a] max-w-[16ch]">
                Empat alasan ini lebih cepat dibanding bikin form manual
              </h2>
            </div>
          </div>

          <div className="ssiti-wrap !p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#e3e3df]">
              <div className="p-7 sm:p-8 border-r border-b border-[#e3e3df]">
                <div className="w-[34px] h-[34px] border-[1.5px] border-[#15171a] rounded-[6px] flex items-center justify-center mb-5 text-[15px] font-bold">
                  ✓
                </div>
                <h3 className="text-[16.5px] font-bold text-[#15171a] mb-2 tracking-[-0.005em]">
                  Bisa dicek dan diedit
                </h3>
                <p className="text-[14px] text-[#55585f] leading-[1.55] m-0">
                  Sebelum dipakai, kamu bisa lihat dulu hasil formnya dan edit langsung kalau ada yang mau diubah, sama seperti website pembuat form lainnya.
                </p>
              </div>

              <div className="p-7 sm:p-8 border-r border-b border-[#e3e3df]">
                <div className="w-[34px] h-[34px] border-[1.5px] border-[#15171a] rounded-[6px] flex items-center justify-center mb-5 text-[15px] font-bold">
                  ＋
                </div>
                <h3 className="text-[16.5px] font-bold text-[#15171a] mb-2 tracking-[-0.005em]">
                  Pakai AI favoritmu
                </h3>
                <p className="text-[14px] text-[#55585f] leading-[1.55] m-0">
                  Mau ChatGPT, Gemini, Claude, atau AI lain yang biasa kamu pakai, semuanya bisa dipakai tanpa harus pindah aplikasi.
                </p>
              </div>

              <div className="p-7 sm:p-8 border-r border-b border-[#e3e3df]">
                <div className="w-[34px] h-[34px] border-[1.5px] border-[#15171a] rounded-[6px] flex items-center justify-center mb-5 text-[15px] font-bold">
                  ↻
                </div>
                <h3 className="text-[16.5px] font-bold text-[#15171a] mb-2 tracking-[-0.005em]">
                  Gampang diubah
                </h3>
                <p className="text-[14px] text-[#55585f] leading-[1.55] m-0">
                  Mau tambah atau ganti pertanyaan? Minta AI ubah, lalu tempel lagi, nggak perlu mengulang dari awal.
                </p>
              </div>

              <div className="p-7 sm:p-8 border-r border-b border-[#e3e3df]">
                <div className="w-[34px] h-[34px] border-[1.5px] border-[#15171a] rounded-[6px] flex items-center justify-center mb-5 text-[15px] font-bold">
                  ▤
                </div>
                <h3 className="text-[16.5px] font-bold text-[#15171a] mb-2 tracking-[-0.005em]">
                  Bisa dipakai lagi
                </h3>
                <p className="text-[14px] text-[#55585f] leading-[1.55] m-0">
                  Hasilnya cuma teks biasa, jadi gampang disimpan dan dipakai ulang untuk form berikutnya.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE STORY SECTIONS */}
        <section className="border-t border-[#e3e3df] py-20 sm:py-24" id="fitur">
          <div className="ssiti-wrap space-y-20 sm:space-y-24">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-18 items-center">
              <div>
                <p className="font-['IBM_Plex_Mono',monospace] text-xs text-[#3730a3] mb-4">
                  LANGKAH 01: SALIN &amp; MINTA AI
                </p>
                <h3 className="text-[24px] sm:text-[30px] font-bold tracking-[-0.015em] text-[#15171a] mb-4 max-w-[15ch]">
                  AI-mu bisa lebih dari sekadar jawab pertanyaan
                </h3>
                <p className="text-[15.5px] text-[#55585f] max-w-[46ch] mb-5 leading-relaxed">
                  Salin satu contoh sederhana, lalu ceritakan ke AI yang biasa kamu ajak ngobrol form seperti apa yang kamu butuhkan. AI-nya yang menyusun detailnya, kamu tinggal jelaskan maksudmu pakai bahasa sehari-hari.
                </p>
                <ul className="list-none p-0 m-0 space-y-2.5 text-[14.5px] text-[#15171a]">
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Bisa untuk isian teks, email, angka, tanggal, pilihan, sampai upload file
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Cukup bilang mana yang wajib diisi dan pilihannya apa saja
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Nggak perlu ngerti coding, cukup jelaskan seperti bicara ke orang biasa
                  </li>
                </ul>
              </div>

              <div>
                <div className="border border-[#e3e3df] rounded-[10px] p-6 bg-[#f7f7f5]">
                  <pre className="m-0 font-['IBM_Plex_Mono',monospace] text-[12.6px] leading-[1.75] text-[#55585f] bg-white border border-[#e3e3df] rounded-[6px] p-4 overflow-x-auto">
{`{
  "type": "select",
  "label": "Divisi",
  "required": true,
  "options": ["Engineering", "Design"]
}`}
                  </pre>
                  <p className="text-[12.5px] text-[#8a8d94] mt-3 mb-0">
                    Ini otomatis disusun AI, bukan sesuatu yang perlu kamu tulis sendiri.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 (Reversed) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-18 items-center">
              <div className="md:order-2">
                <p className="font-['IBM_Plex_Mono',monospace] text-xs text-[#3730a3] mb-4">
                  LANGKAH 02: CEK DAN EDIT
                </p>
                <h3 className="text-[24px] sm:text-[30px] font-bold tracking-[-0.015em] text-[#15171a] mb-4 max-w-[15ch]">
                  Bisa dicek dulu, bisa diedit langsung
                </h3>
                <p className="text-[15.5px] text-[#55585f] max-w-[46ch] mb-5 leading-relaxed">
                  Sebelum dipakai, kamu bisa lihat dulu hasil formnya. Kalau ada bagian yang belum pas, kamu bisa langsung edit di sini, sama seperti website pembuat form pada umumnya.
                </p>
                <ul className="list-none p-0 m-0 space-y-2.5 text-[14.5px] text-[#15171a]">
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Preview form bisa dilihat sebelum dipakai
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Kalau ada yang kurang pas, ditunjukkan bagian mana yang perlu diperbaiki
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Bisa diedit langsung di sini, nggak harus lewat AI dulu
                  </li>
                </ul>
              </div>

              <div className="md:order-1">
                <div className="border border-[#e3e3df] rounded-[10px] p-6 bg-[#f7f7f5] space-y-0 divide-y divide-[#e3e3df]">
                  <div className="flex items-center gap-2.5 py-2.5 text-[13.5px]">
                    <span className="text-[#0f766e] font-bold font-['IBM_Plex_Mono',monospace] text-[11px]">OK</span>
                    <span>Judul form: sudah pas</span>
                  </div>
                  <div className="flex items-center gap-2.5 py-2.5 text-[13.5px]">
                    <span className="text-[#0f766e] font-bold font-['IBM_Plex_Mono',monospace] text-[11px]">OK</span>
                    <span>Isian nama: dikenali dengan baik</span>
                  </div>
                  <div className="flex items-center gap-2.5 py-2.5 text-[13.5px]">
                    <span className="text-[#b42318] font-bold font-['IBM_Plex_Mono',monospace] text-[11px]">PERLU DICEK</span>
                    <span>Isian ketiga: bentuknya belum dikenali, mungkin maksudnya "pilihan"?</span>
                  </div>
                  <div className="flex items-center gap-2.5 py-2.5 text-[13.5px]">
                    <span className="text-[#b45309] font-bold font-['IBM_Plex_Mono',monospace] text-[11px]">PERINGATAN</span>
                    <span>Isian keempat: pilihan jawabannya masih kosong</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-18 items-center">
              <div>
                <p className="font-['IBM_Plex_Mono',monospace] text-xs text-[#3730a3] mb-4">
                  LANGKAH 03: LANGSUNG JADI
                </p>
                <h3 className="text-[24px] sm:text-[30px] font-bold tracking-[-0.015em] text-[#15171a] mb-4 max-w-[15ch]">
                  Lihat formnya, bukan urus rumitnya
                </h3>
                <p className="text-[15.5px] text-[#55585f] max-w-[46ch] mb-5 leading-relaxed">
                  Formnya langsung bisa dilihat dan dicoba begitu jadi. Kalau masih ada yang mau diubah, tinggal minta AI-nya sesuaikan lagi terus tempel ulang hasilnya, atau langsung edit sendiri di sini.
                </p>
                <ul className="list-none p-0 m-0 space-y-2.5 text-[14.5px] text-[#15171a]">
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Form langsung tampil begitu semuanya siap
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Mau ubah? Minta AI sesuaikan dan tempel lagi, atau edit langsung sendiri
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3730a3]">
                    Nggak ada yang tersembunyi, apa yang kamu minta itu yang muncul
                  </li>
                </ul>
              </div>

              <div>
                <div className="border border-[#e3e3df] rounded-[10px] p-6 bg-[#f7f7f5] space-y-3">
                  <div className="bg-white border border-[#e3e3df] rounded-[6px] p-3.5">
                    <label className="block text-xs text-[#8a8d94] font-semibold mb-1">Nama Lengkap</label>
                    <div className="h-[30px] rounded-[4px] border border-[#e3e3df] bg-[#f7f7f5]" />
                  </div>
                  <div className="bg-white border border-[#e3e3df] rounded-[6px] p-3.5">
                    <label className="block text-xs text-[#8a8d94] font-semibold mb-1">Email</label>
                    <div className="h-[30px] rounded-[4px] border border-[#e3e3df] bg-[#f7f7f5]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-[#e3e3df] rounded-[6px] p-3.5">
                      <label className="block text-xs text-[#8a8d94] font-semibold mb-1">Tanggal Lahir</label>
                      <div className="h-[30px] rounded-[4px] border border-[#e3e3df] bg-[#f7f7f5]" />
                    </div>
                    <div className="bg-white border border-[#e3e3df] rounded-[6px] p-3.5">
                      <label className="block text-xs text-[#8a8d94] font-semibold mb-1">Divisi</label>
                      <div className="h-[30px] rounded-[4px] border border-[#e3e3df] bg-[#f7f7f5]" />
                    </div>
                  </div>
                  <div className="mt-1.5 h-[38px] rounded-[4px] bg-[#3730a3] flex items-center justify-center text-white font-semibold text-[13px]">
                    Kirim Formulir
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES SECTION */}
        <section className="border-t border-[#e3e3df] py-20" id="usecase">
          <div className="ssiti-wrap">
            <div className="max-w-[640px] mb-4">
              <p className="text-[13px] font-bold text-[#3730a3] tracking-[0.01em] mb-3">USE CASES</p>
              <h2 className="text-[28px] sm:text-[38px] font-bold tracking-[-0.02em] leading-[1.15] text-[#15171a] mb-8">
                Untuk siapa saja yang butuh form cepat, tanpa builder
              </h2>
            </div>

            <div className="border-t border-[#e3e3df] divide-y divide-[#e3e3df]">
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-8 py-7.5 items-baseline">
                <h3 className="text-xl font-bold text-[#15171a] m-0 tracking-[-0.01em]">
                  Developer &amp; freelancer
                </h3>
                <p className="m-0 text-[#55585f] text-[15px] max-w-[58ch]">
                  Butuh form untuk proyek klien dengan cepat, tanpa menulis komponen form dari nol tiap kali kebutuhan berubah.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-8 py-7.5 items-baseline">
                <h3 className="text-xl font-bold text-[#15171a] m-0 tracking-[-0.01em]">
                  Tim produk &amp; ops
                </h3>
                <p className="m-0 text-[#55585f] text-[15px] max-w-[58ch]">
                  Menyusun form internal, seperti pendaftaran, survei, atau request, tanpa bergantung antrian tim engineering.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-8 py-7.5 items-baseline">
                <h3 className="text-xl font-bold text-[#15171a] m-0 tracking-[-0.01em]">
                  Mahasiswa &amp; peneliti
                </h3>
                <p className="m-0 text-[#55585f] text-[15px] max-w-[58ch]">
                  Membuat form pengumpulan data penelitian atau tugas dengan struktur field yang konsisten dan mudah diaudit.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-8 py-7.5 items-baseline">
                <h3 className="text-xl font-bold text-[#15171a] m-0 tracking-[-0.01em]">
                  Organisasi &amp; komunitas
                </h3>
                <p className="m-0 text-[#55585f] text-[15px] max-w-[58ch]">
                  Form pendaftaran acara atau anggota yang bisa disusun ulang tiap event tanpa membangun ulang dari nol.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (4 STEPS) */}
        <section className="border-t border-[#e3e3df] py-20" id="alur">
          <div className="ssiti-wrap">
            <div className="max-w-[640px] mb-6">
              <p className="text-[13px] font-bold text-[#3730a3] tracking-[0.01em] mb-3">HOW IT WORKS</p>
              <h2 className="text-[28px] sm:text-[38px] font-bold tracking-[-0.02em] leading-[1.15] text-[#15171a] mb-8">
                Empat langkah dari kebutuhan ke form jadi
              </h2>
            </div>
          </div>

          <div className="ssiti-wrap !p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#e3e3df]">
              <div className="p-8 border-r border-b border-[#e3e3df]">
                <p className="text-[34px] font-extrabold text-[#c9c9c3] mb-4.5 tracking-[-0.02em] m-0">01</p>
                <h3 className="text-[16px] font-bold text-[#15171a] mb-2 m-0">Salin format skema</h3>
                <p className="text-[13.8px] text-[#55585f] leading-[1.55] m-0">
                  Ambil template skema baku, sudah dirancang supaya gampang dibaca AI maupun manusia.
                </p>
              </div>

              <div className="p-8 border-r border-b border-[#e3e3df]">
                <p className="text-[34px] font-extrabold text-[#c9c9c3] mb-4.5 tracking-[-0.02em] m-0">02</p>
                <h3 className="text-[16px] font-bold text-[#15171a] mb-2 m-0">Jelaskan ke AI</h3>
                <p className="text-[13.8px] text-[#55585f] leading-[1.55] m-0">
                  Tempel format itu ke ChatGPT, Gemini, atau Claude, lalu ceritakan form seperti apa yang kamu butuhkan.
                </p>
              </div>

              <div className="p-8 border-r border-b border-[#e3e3df]">
                <p className="text-[34px] font-extrabold text-[#c9c9c3] mb-4.5 tracking-[-0.02em] m-0">03</p>
                <h3 className="text-[16px] font-bold text-[#15171a] mb-2 m-0">Tempel hasilnya</h3>
                <p className="text-[13.8px] text-[#55585f] leading-[1.55] m-0">
                  Salin skema yang sudah diisi AI, tempel ke kotak validasi di Ssiti.
                </p>
              </div>

              <div className="p-8 border-r border-b border-[#e3e3df]">
                <p className="text-[34px] font-extrabold text-[#c9c9c3] mb-4.5 tracking-[-0.02em] m-0">04</p>
                <h3 className="text-[16px] font-bold text-[#15171a] mb-2 m-0">Form siap dipakai</h3>
                <p className="text-[13.8px] text-[#55585f] leading-[1.55] m-0">
                  Sistem memvalidasi struktur dan tipe data tiap field, lalu langsung menampilkan preview form.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="bg-[#15171a] text-white text-center py-24">
          <div className="ssiti-wrap">
            <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.02em] text-white max-w-[18ch] mx-auto mb-4.5">
              Nggak perlu bikin form dari nol lagi.
            </h2>
            <p className="text-[#b9bac0] max-w-[46ch] mx-auto mb-8.5 text-base leading-relaxed">
              Ceritakan kebutuhanmu ke AI yang sudah kamu pakai, tempel hasilnya, dan formmu langsung jadi.
            </p>
            <button
              type="button"
              onClick={onGetStarted}
              className="bg-white hover:bg-[#e9e9e9] text-[#15171a] font-semibold text-[14.5px] px-7 py-3.5 rounded-[4px] cursor-pointer transition-colors shadow-lg"
            >
              Coba sekarang, gratis
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#e3e3df] pt-16 pb-10 bg-white">
        <div className="ssiti-wrap">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 mb-12">
            <div>
              <a href="#top" className="flex items-center gap-2.5 text-inherit no-underline">
                <span className="w-7 h-7 rounded-[4px] bg-[#15171a] text-white font-['IBM_Plex_Mono',monospace] text-[13px] font-semibold flex items-center justify-center">
                  S
                </span>
                <span className="text-lg font-bold tracking-[-0.01em]">Ssiti</span>
              </a>
              <p className="text-[#55585f] text-sm max-w-[32ch] mt-3.5 leading-relaxed">
                Bantu kamu memanfaatkan AI lebih dari sekadar tanya jawab, cukup salin, minta, tempel, dan formmu jadi.
              </p>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-[#15171a] mb-4">Product</h4>
              <div className="space-y-3 text-sm text-[#55585f]">
                <div><a href="#produk" className="hover:text-[#15171a] no-underline">Overview</a></div>
                <div><a href="#fitur" className="hover:text-[#15171a] no-underline">Fitur</a></div>
                <div><a href="#alur" className="hover:text-[#15171a] no-underline">Cara kerja</a></div>
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-[#15171a] mb-4">Resources</h4>
              <div className="space-y-3 text-sm text-[#55585f]">
                <div><a href="#alur" className="hover:text-[#15171a] no-underline">Format skema</a></div>
                <div><a href="#usecase" className="hover:text-[#15171a] no-underline">Use cases</a></div>
                <div>
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="hover:text-[#15171a] text-left cursor-pointer"
                  >
                    Buka App Builder
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-[#15171a] mb-4">Contact</h4>
              <div className="space-y-3 text-sm text-[#55585f]">
                <div><span className="text-[#15171a]">hello@ssiti.app</span></div>
                <div><span>Jakarta, Indonesia</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-[#e3e3df] pt-6 text-[13px] text-[#8a8d94] gap-2.5">
            <span>© 2026 Ssiti</span>
            <span>Skema → Validasi → Form</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
