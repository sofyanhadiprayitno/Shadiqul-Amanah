import { UserCheck, Shield, FileText, Sparkles, Wallet, ShieldAlert, Award } from 'lucide-react';

export default function StrukturOrganisasiBagan() {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs overflow-x-auto">
      <div className="text-center space-y-1 mb-2">
        <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-800 flex items-center justify-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Bagan Hierarki Struktur Organisasi RT 04 / RW 12</span>
        </h5>
        <p className="text-xs text-slate-500">Masa Bakti 2026 - 2031 Perumahan Taman Buah Sukamantri</p>
      </div>

      <div className="flex flex-col items-center min-w-[620px] space-y-6 pt-2">
        {/* LEVEL 1: KETUA RT */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white px-7 py-4 rounded-2xl shadow-md border-2 border-emerald-600 text-center w-72 transition hover:scale-102">
            <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto flex items-center justify-center text-xl mb-2 backdrop-blur-xs">
              <UserCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <h6 className="font-extrabold text-sm sm:text-base tracking-wide">Idrus Sadi</h6>
            <span className="text-[10px] uppercase font-bold bg-white/20 text-emerald-100 px-3 py-0.5 rounded-full mt-1.5 inline-block">
              Ketua RT 04
            </span>
          </div>
          {/* Connector Down */}
          <div className="w-0.5 h-6 bg-slate-300"></div>
        </div>

        {/* LEVEL 2: WAKIL KETUA & SEKRETARIS */}
        <div className="relative w-full max-w-2xl flex justify-around items-start">
          {/* Horizontal Line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300"></div>

          {/* Wakil Ketua */}
          <div className="flex flex-col items-center pt-6 relative">
            <div className="absolute -top-6 w-0.5 h-6 bg-slate-300"></div>
            <div className="bg-white text-slate-900 border border-slate-200 px-5 py-3.5 rounded-2xl shadow-xs text-center w-60 hover:border-emerald-400 hover:shadow-sm transition">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl mx-auto flex items-center justify-center text-base mb-2">
                <Shield className="w-5 h-5 text-emerald-700" />
              </div>
              <h6 className="font-bold text-xs sm:text-sm text-slate-900">Marsudi</h6>
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 inline-block border border-emerald-100">
                Wakil Ketua RT
              </span>
            </div>
          </div>

          {/* Sekretaris */}
          <div className="flex flex-col items-center pt-6 relative">
            <div className="absolute -top-6 w-0.5 h-6 bg-slate-300"></div>
            <div className="bg-white text-slate-900 border border-slate-200 px-5 py-3.5 rounded-2xl shadow-xs text-center w-60 hover:border-blue-400 hover:shadow-sm transition">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl mx-auto flex items-center justify-center text-base mb-2">
                <FileText className="w-5 h-5 text-blue-700" />
              </div>
              <h6 className="font-bold text-xs sm:text-sm text-slate-900">Sofyan Hadi Prayitno</h6>
              <span className="text-[10px] uppercase font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full mt-1 inline-block border border-blue-100">
                Sekretaris RT
              </span>
            </div>
          </div>
        </div>

        {/* LEVEL 3: SEKSI-SEKSI BIDANG */}
        <div className="relative w-full max-w-3xl flex justify-between pt-4">
          <div className="absolute top-0 left-1/6 right-1/6 h-0.5 bg-slate-300"></div>

          {/* Seksi Keamanan */}
          <div className="flex flex-col items-center pt-6 relative px-2">
            <div className="absolute -top-6 w-0.5 h-6 bg-slate-300"></div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center w-52 shadow-xs hover:border-amber-400 transition">
              <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg mx-auto flex items-center justify-center text-sm mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
              </div>
              <h6 className="font-bold text-xs text-slate-800">Seksi Keamanan</h6>
              <p className="text-[10px] text-slate-500 mt-0.5">Koordinator Siskamling & Ronda Malam</p>
            </div>
          </div>

          {/* Seksi Kebersihan */}
          <div className="flex flex-col items-center pt-6 relative px-2">
            <div className="absolute -top-6 w-0.5 h-6 bg-slate-300"></div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center w-52 shadow-xs hover:border-emerald-400 transition">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg mx-auto flex items-center justify-center text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
              </div>
              <h6 className="font-bold text-xs text-slate-800">Seksi Kebersihan</h6>
              <p className="text-[10px] text-slate-500 mt-0.5">Pengelolaan Sampah & Drainase</p>
            </div>
          </div>

          {/* Seksi Kas & Sosial */}
          <div className="flex flex-col items-center pt-6 relative px-2">
            <div className="absolute -top-6 w-0.5 h-6 bg-slate-300"></div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center w-52 shadow-xs hover:border-purple-400 transition">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg mx-auto flex items-center justify-center text-sm mb-1.5">
                <Wallet className="w-4 h-4 text-purple-700" />
              </div>
              <h6 className="font-bold text-xs text-slate-800">Seksi Kas & Sosial</h6>
              <p className="text-[10px] text-slate-500 mt-0.5">Iuran Warga, Arisan & Santunan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
