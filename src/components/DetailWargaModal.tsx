import type { Resident } from '../types';
import { X, Printer, User, Home, Calendar, Briefcase, Zap, Wifi, Droplets, Car } from 'lucide-react';

interface DetailWargaModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
  onPrint: () => void;
}

export default function DetailWargaModal({
  isOpen,
  onClose,
  resident,
  onPrint,
}: DetailWargaModalProps) {
  if (!isOpen || !resident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="printable-card"
        className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100"
      >
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold shadow-xs">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{resident.nama}</h3>
              <p className="text-xs text-slate-500 font-mono">NIK: {resident.nik}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center no-print cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>No. Rumah / Blok</span>
            </span>
            <span className="font-semibold text-slate-900">{resident.rumah}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Jenis Kelamin</span>
            <span className="font-semibold text-slate-900">{resident.gender}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Agama</span>
            <span className="font-semibold text-slate-900">{resident.agama}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Pekerjaan</span>
            </span>
            <span className="font-semibold text-slate-900">{resident.pekerjaan}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Pendidikan Terakhir</span>
            <span className="font-semibold text-slate-900">{resident.pendidikan || 'SMA'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Status Warga</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
              {resident.status}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Tempat, Tgl Lahir</span>
            </span>
            <span className="font-semibold text-slate-900">
              {resident.tempatLahir}, {resident.tanggalLahir}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Usia</span>
            <span className="font-semibold text-slate-900">{resident.usia} Tahun</span>
          </div>

          {/* Demografi Fasilitas */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <p className="text-slate-500 flex items-center gap-1">
                <Car className="w-3 h-3 text-blue-600" /> Kendaraan
              </p>
              <p className="font-bold text-slate-800 mt-0.5">{resident.kendaraan || 'Motor 1'}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <p className="text-slate-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600" /> Listrik PLN
              </p>
              <p className="font-bold text-slate-800 mt-0.5">{resident.listrik || '1300VA'}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <p className="text-slate-500 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-red-600" /> Internet
              </p>
              <p className="font-bold text-slate-800 mt-0.5">{resident.internet || 'IndiHome'}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <p className="text-slate-500 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-600" /> Sumber Air
              </p>
              <p className="font-bold text-slate-800 mt-0.5">{resident.air || 'Sumur Bor'}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2 no-print">
          <button
            onClick={onPrint}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Kartu</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm cursor-pointer transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
