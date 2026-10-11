import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import type { SuratFormData } from '../types';
import { Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SuratPreviewProps {
  suratForm: SuratFormData;
  verificationCode: string;
  currentDate: string;
  onPrint: () => void;
  onVerifyQR?: () => void;
}

export default function SuratPreview({
  suratForm,
  verificationCode,
  currentDate,
  onPrint,
  onVerifyQR,
}: SuratPreviewProps) {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (qrCanvasRef.current) {
      const qrText = `https://rt04-tamanbuah.digital/verify?code=${verificationCode}&nik=${suratForm.nik || '3204120101850001'}&nama=${encodeURIComponent(
        suratForm.nama || 'Warga'
      )}&jenis=${encodeURIComponent(suratForm.jenis)}`;

      QRCode.toCanvas(qrCanvasRef.current, qrText, {
        width: 70,
        margin: 1,
        color: {
          dark: '#14532d',
          light: '#ffffff',
        },
      }).catch((err) => {
        console.error('Error generating QR Code', err);
      });
    }
  }, [verificationCode, suratForm.nik, suratForm.nama, suratForm.jenis]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Preview Surat Resmi RT 04 (QR Validasi)</h3>
            <p className="text-xs text-slate-500">Format resmi lengkap dengan Kop Surat & Tanda Tangan Digital</p>
          </div>
          <button
            onClick={onPrint}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>Cetak Surat</span>
          </button>
        </div>

        {/* Printable Official Document */}
        <div
          id="printable-letter"
          className="bg-white border-2 border-slate-800 p-6 sm:p-8 text-slate-900 text-xs sm:text-sm font-serif space-y-4 shadow-inner rounded-xl relative"
        >
          {/* KOP SURAT */}
          <div className="text-center border-b-2 border-slate-800 pb-3">
            <h4 className="font-bold uppercase tracking-wider text-xs sm:text-sm font-sans text-slate-800">
              RUKUN TETANGGA 04 / RUKUN WARGA 12
            </h4>
            <h3 className="font-extrabold uppercase text-base sm:text-lg text-slate-950 font-sans tracking-tight">
              PERUMAHAN TAMAN BUAH SUKAMANTRI
            </h3>
            <p className="text-[11px] font-sans text-slate-600">
              Desa Sukamantri, Kec. Pasar Kemis, Kab. Tangerang, Banten 15560
            </p>
          </div>

          {/* JUDUL SURAT & NOMOR */}
          <div className="text-center py-1">
            <h4 className="font-bold uppercase underline text-xs sm:text-sm tracking-wide text-slate-900 font-sans">
              {suratForm.jenis || 'SURAT KETERANGAN DOMISILI'}
            </h4>
            <p className="text-[11px] font-sans text-slate-600 mt-0.5">
              Nomor: 04/RT-04/XII/2026
            </p>
          </div>

          {/* ISI SURAT */}
          <div className="font-sans space-y-2 text-xs leading-relaxed text-slate-800">
            <p>
              Yang bertandatangan di bawah ini Pengurus RT 04 / RW 12 Perumahan Taman Buah Sukamantri,
              Kecamatan Pasar Kemis, Kabupaten Tangerang, dengan ini menerangkan bahwa:
            </p>
            <table className="w-full pl-2 sm:pl-4 space-y-1 font-sans text-xs">
              <tbody>
                <tr>
                  <td className="w-36 font-semibold py-0.5 text-slate-700">Nama Lengkap</td>
                  <td className="py-0.5 font-medium text-slate-900">: {suratForm.nama || '..............................................'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-0.5 text-slate-700">NIK</td>
                  <td className="py-0.5 font-mono text-slate-900">: {suratForm.nik || '..............................................'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-0.5 text-slate-700">Tempat/Tanggal Lahir</td>
                  <td className="py-0.5 text-slate-900">
                    :{' '}
                    {suratForm.tempatLahir && suratForm.tanggalLahir
                      ? `${suratForm.tempatLahir}, ${suratForm.tanggalLahir}`
                      : '..............................................'}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold py-0.5 text-slate-700">Jenis Kelamin</td>
                  <td className="py-0.5 text-slate-900">: {suratForm.gender || '..............................................'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-0.5 text-slate-700">Agama</td>
                  <td className="py-0.5 text-slate-900">: {suratForm.agama || '..............................................'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-0.5 text-slate-700">Pekerjaan</td>
                  <td className="py-0.5 text-slate-900">: {suratForm.pekerjaan || '..............................................'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-0.5 text-slate-700">Usia</td>
                  <td className="py-0.5 text-slate-900">
                    : {suratForm.usia ? `${suratForm.usia} Tahun` : '..............................................'}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold py-0.5 text-slate-700">Alamat / Rumah</td>
                  <td className="py-0.5 text-slate-900">
                    : {suratForm.rumah || '..............................................'} (Perum Taman Buah Sukamantri RT 04/12)
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="pt-2">
              Adalah benar warga domisili aktif RT 04 / RW 12. Surat ini diberikan untuk keperluan:{' '}
              <strong className="text-slate-950 font-bold underline decoration-slate-400">
                {suratForm.keperluan || '......................................................................'}
              </strong>
              .
            </p>
            <p>
              Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* TANDA TANGAN & VALIDASI QR CODE */}
          <div className="pt-6 flex justify-between items-end font-sans text-xs">
            {/* Bagian QR & Sekretaris */}
            <div className="space-y-2">
              <div
                onClick={onVerifyQR}
                className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition group"
                title="Klik untuk melihat status verifikasi digital"
              >
                <div className="w-16 h-16 bg-white flex items-center justify-center p-0.5 border border-slate-200 rounded-lg shadow-xs">
                  <canvas ref={qrCanvasRef} className="w-full h-full"></canvas>
                </div>
                <div className="text-[10px] space-y-0.5">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>VALIDASI RESMI RT 04</span>
                  </div>
                  <p className="font-mono text-emerald-800 font-bold text-[11px]">{verificationCode}</p>
                  <p className="text-slate-500 group-hover:text-emerald-700 transition flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Dokumen Sah & Terverifikasi</span>
                  </p>
                </div>
              </div>
              <div className="text-[10px] text-slate-700 pl-1 font-sans">
                Sekretaris RT: <strong className="text-slate-900">Sofyan Hadi Prayitno</strong>
              </div>
            </div>

            {/* Bagian Ketua RT */}
            <div className="text-center space-y-12 pr-2">
              <p className="text-slate-800">
                Sukamantri, <span>{currentDate}</span>
                <br />
                <strong className="font-bold text-slate-900">Ketua RT 04</strong>
              </p>
              <div className="border-b border-slate-900 w-36 mx-auto"></div>
              <p className="font-bold text-slate-900">Idrus Sadi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
