import type { Resident } from '../types';
import { X, Printer, Users } from 'lucide-react';

interface KartuKeluargaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKK: Resident | null;
  familyMembers: Resident[];
  onPrint: () => void;
}

export default function KartuKeluargaModal({
  isOpen,
  onClose,
  currentKK,
  familyMembers,
  onPrint,
}: KartuKeluargaModalProps) {
  if (!isOpen || !currentKK) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="printable-kk"
        className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-100"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="text-center w-full">
            <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-slate-900">
              KARTU KELUARGA (KK) RT 04 / RW 12
            </h3>
            <p className="text-xs text-emerald-800 font-bold tracking-tight">
              PERUMAHAN TAMAN BUAH SUKAMANTRI
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center no-print shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-slate-500 font-medium">No. Rumah / Blok:</p>
            <p className="font-extrabold text-slate-900 text-sm">{currentKK.rumah}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Kepala Keluarga / Warga Terkait:</p>
            <p className="font-extrabold text-slate-900 text-sm">{currentKK.nama}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Alamat:</p>
            <p className="font-bold text-slate-900">Perum Taman Buah Sukamantri RT 04/12</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Desa / Kecamatan:</p>
            <p className="font-bold text-slate-900">Sukamantri, Kec. Pasar Kemis, Kab. Tangerang</p>
          </div>
        </div>

        {/* Family Member Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daftar Anggota Keluarga / Domisili Rumah ({1 + familyMembers.length} Jiwa)</span>
            </h4>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">NIK</th>
                  <th className="p-3">L/P</th>
                  <th className="p-3">Pekerjaan</th>
                  <th className="p-3">Agama</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-emerald-50/40">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{currentKK.nama}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                      Kepala Keluarga
                    </span>
                  </td>
                  <td className="p-3 font-mono font-medium text-slate-800">{currentKK.nik}</td>
                  <td className="p-3">{currentKK.gender}</td>
                  <td className="p-3">{currentKK.pekerjaan}</td>
                  <td className="p-3">{currentKK.agama}</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      {currentKK.status}
                    </span>
                  </td>
                </tr>
                {familyMembers.map((fam) => (
                  <tr key={fam.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{fam.nama}</td>
                    <td className="p-3 font-mono">{fam.nik}</td>
                    <td className="p-3">{fam.gender}</td>
                    <td className="p-3">{fam.pekerjaan}</td>
                    <td className="p-3">{fam.agama}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        {fam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 no-print">
          <button
            onClick={onPrint}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu Keluarga</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm cursor-pointer transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
