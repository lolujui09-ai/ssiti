import { useState } from 'react';
import { LogIn, Sparkles, UserCheck, ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { User } from '../../types/auth';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding?: () => void;
}

export const LoginScreen = ({ onLoginSuccess, onBackToLanding }: LoginScreenProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Mohon isi email dan password Anda.');
      return;
    }
    if (isRegister && !name.trim()) {
      setError('Mohon masukkan nama lengkap Anda.');
      return;
    }

    const loggedUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      name: isRegister ? name.trim() : email.split('@')[0],
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        isRegister ? name : email
      )}`,
    };

    onLoginSuccess(loggedUser);
  };

  const handleQuickDemoLogin = (roleName: string, roleEmail: string) => {
    const demoUser: User = {
      id: `usr_demo_${Date.now().toString(36)}`,
      name: roleName,
      email: roleEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(roleName)}`,
    };
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-['Inter',sans-serif]">
      {/* Decorative gradient backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[350px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Back to landing page button */}
      {onBackToLanding && (
        <div className="absolute top-6 left-6 z-20">
          <button
            type="button"
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Ssiti</span>
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        {/* Brand Logo & Name */}
        <div className="inline-flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white mb-5 backdrop-blur-xs">
          <span className="w-6 h-6 rounded-[4px] bg-white text-slate-950 font-mono text-xs font-bold flex items-center justify-center">
            S
          </span>
          <span className="text-sm font-bold tracking-tight text-white">Ssiti Studio</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isRegister ? 'Buat Akun Ssiti' : 'Masuk ke Ssiti Studio'}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Ubah skema menjadi form tanpa builder, dilengkapi prompt AI &amp; analitik
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda..."
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRegister ? 'Daftar Sekarang' : 'Masuk ke Akun'}</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>{isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}</span>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer transition-colors"
            >
              {isRegister ? 'Masuk di sini' : 'Daftar sekarang'}
            </button>
          </div>

          {/* Quick Demo Accounts */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Atau Masuk Cepat Akun Demo (1-Klik):
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Dr. Hendra Wijaya', 'hendra.edu@universitas.ac.id')}
                className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left cursor-pointer transition-all text-xs"
              >
                <div className="font-bold text-slate-200 truncate">Pendidik / Dosen</div>
                <div className="text-[10px] text-slate-500 truncate">hendra.edu@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Sarah Anindita', 'sarah.ux@product.co')}
                className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left cursor-pointer transition-all text-xs"
              >
                <div className="font-bold text-slate-200 truncate">Product / Riset</div>
                <div className="text-[10px] text-slate-500 truncate">sarah.ux@...</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
