import { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  DoughnutController,
  PieController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { Resident } from '../types';
import { RefreshCw, Users, GraduationCap, Briefcase, Home, Sparkles, Car, Zap, Wifi, Droplets } from 'lucide-react';

Chart.register(
  BarController,
  DoughnutController,
  PieController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface DemographicsChartsProps {
  residents: Resident[];
}

export default function DemographicsCharts({ residents }: DemographicsChartsProps) {
  const chartRefs = {
    usia: useRef<HTMLCanvasElement | null>(null),
    pendidikan: useRef<HTMLCanvasElement | null>(null),
    pekerjaan: useRef<HTMLCanvasElement | null>(null),
    statusTinggal: useRef<HTMLCanvasElement | null>(null),
    agama: useRef<HTMLCanvasElement | null>(null),
    kendaraan: useRef<HTMLCanvasElement | null>(null),
    listrik: useRef<HTMLCanvasElement | null>(null),
    internet: useRef<HTMLCanvasElement | null>(null),
    air: useRef<HTMLCanvasElement | null>(null),
  };

  useEffect(() => {
    const instances: Chart[] = [];

    const defaultPlugins = {
      legend: {
        position: 'bottom' as const,
        labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } },
      },
      datalabels: {
        color: '#1e293b',
        font: { weight: 'bold' as const, size: 10, family: 'Inter' },
        formatter: (value: number, context: any) => {
          const dataset = context.chart.data.datasets[context.datasetIndex];
          const total = dataset.data.reduce((acc: number, curr: number) => acc + (curr || 0), 0);
          if (total === 0 || value === 0) return '';
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return `${value} (${percentage})`;
        },
        clamp: true,
      },
    };

    // 1. Usia Group
    if (chartRefs.usia.current) {
      let balita = 0, anak = 0, remaja = 0, dewasa = 0, lansia = 0;
      residents.forEach((r) => {
        const u = Number(r.usia) || 0;
        if (u <= 5) balita++;
        else if (u <= 12) anak++;
        else if (u <= 18) remaja++;
        else if (u <= 50) dewasa++;
        else lansia++;
      });

      instances.push(
        new Chart(chartRefs.usia.current, {
          type: 'bar',
          data: {
            labels: ['Balita (0-5)', 'Anak (6-12)', 'Remaja (13-18)', 'Dewasa (19-50)', 'Lansia (51+)'],
            datasets: [
              {
                label: 'Jumlah Jiwa',
                data: [balita, anak, remaja, dewasa, lansia],
                backgroundColor: '#059669',
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              ...defaultPlugins,
              datalabels: {
                ...defaultPlugins.datalabels,
                anchor: 'end',
                align: 'top',
              },
            },
            scales: {
              y: { beginAtZero: true, grid: { display: false }, ticks: { stepSize: 1 } },
              x: { grid: { display: false } },
            },
          },
        })
      );
    }

    // 2. Pendidikan
    if (chartRefs.pendidikan.current) {
      let pendSD = 0, pendSMP = 0, pendSMA = 0, pendS1 = 0, pendLain = 0;
      residents.forEach((r) => {
        const p = (r.pendidikan || 'SMA').toUpperCase();
        if (p.includes('SD')) pendSD++;
        else if (p.includes('SMP')) pendSMP++;
        else if (p.includes('SMA')) pendSMA++;
        else if (p.includes('D3') || p.includes('S1')) pendS1++;
        else pendLain++;
      });

      instances.push(
        new Chart(chartRefs.pendidikan.current, {
          type: 'doughnut',
          data: {
            labels: ['SD', 'SMP', 'SMA', 'D3/S1', 'Lainnya'],
            datasets: [
              {
                data: [pendSD, pendSMP, pendSMA, pendS1, pendLain],
                backgroundColor: ['#94a3b8', '#38bdf8', '#16a34a', '#6366f1', '#f59e0b'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: defaultPlugins,
          },
        })
      );
    }

    // 3. Pekerjaan
    if (chartRefs.pekerjaan.current) {
      let pekPNS = 0, pekSwasta = 0, pekWira = 0, pekBuruh = 0, pekLain = 0;
      residents.forEach((r) => {
        const pk = (r.pekerjaan || 'Swasta').toLowerCase();
        if (pk.includes('pns')) pekPNS++;
        else if (pk.includes('swasta')) pekSwasta++;
        else if (pk.includes('wira')) pekWira++;
        else if (pk.includes('buruh')) pekBuruh++;
        else pekLain++;
      });

      instances.push(
        new Chart(chartRefs.pekerjaan.current, {
          type: 'bar',
          data: {
            labels: ['PNS', 'Swasta', 'Wiraswasta', 'Buruh', 'Lainnya'],
            datasets: [
              {
                label: 'Jumlah Jiwa',
                data: [pekPNS, pekSwasta, pekWira, pekBuruh, pekLain],
                backgroundColor: '#16a34a',
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              ...defaultPlugins,
              datalabels: {
                ...defaultPlugins.datalabels,
                anchor: 'end',
                align: 'top',
              },
            },
            scales: {
              y: { beginAtZero: true, grid: { display: false }, ticks: { stepSize: 1 } },
              x: { grid: { display: false } },
            },
          },
        })
      );
    }

    // 4. Status Tempat Tinggal
    if (chartRefs.statusTinggal.current) {
      let stTetap = 0, stKontrak = 0, stMeninggal = 0, stCerai = 0;
      residents.forEach((r) => {
        if (r.status === 'Tetap') stTetap++;
        else if (r.status === 'Kontrak') stKontrak++;
        else if (r.status === 'Meninggal') stMeninggal++;
        else if (r.status === 'Cerai') stCerai++;
      });

      instances.push(
        new Chart(chartRefs.statusTinggal.current, {
          type: 'pie',
          data: {
            labels: ['Di Dalam (Tetap/Kontrak)', 'Meninggal', 'Cerai'],
            datasets: [
              {
                data: [stTetap + stKontrak, stMeninggal, stCerai],
                backgroundColor: ['#16a34a', '#ef4444', '#8b5cf6'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: defaultPlugins,
          },
        })
      );
    }

    // 5. Agama
    if (chartRefs.agama.current) {
      let agIslam = 0, agKristen = 0, agKatholik = 0, agHindu = 0, agBudha = 0, agLain = 0;
      residents.forEach((r) => {
        const a = (r.agama || 'Islam').toLowerCase();
        if (a.includes('islam')) agIslam++;
        else if (a.includes('kristen')) agKristen++;
        else if (a.includes('katholik')) agKatholik++;
        else if (a.includes('hindu')) agHindu++;
        else if (a.includes('budha')) agBudha++;
        else agLain++;
      });

      instances.push(
        new Chart(chartRefs.agama.current, {
          type: 'doughnut',
          data: {
            labels: ['Islam', 'Kristen', 'Katholik', 'Hindu', 'Budha', 'Lainnya'],
            datasets: [
              {
                data: [agIslam, agKristen, agKatholik, agHindu, agBudha, agLain],
                backgroundColor: ['#16a34a', '#0ea5e9', '#6366f1', '#f97316', '#eab308', '#cbd5e1'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: defaultPlugins,
          },
        })
      );
    }

    // 6. Kendaraan
    if (chartRefs.kendaraan.current) {
      let kMotor = 0, kMobil = 0, kLain = 0;
      residents.forEach((r) => {
        const k = (r.kendaraan || 'Motor 1').toLowerCase();
        if (k.includes('motor')) kMotor++;
        else if (k.includes('mobil')) kMobil++;
        else kLain++;
      });

      instances.push(
        new Chart(chartRefs.kendaraan.current, {
          type: 'bar',
          data: {
            labels: ['Motor', 'Mobil', 'Lainnya'],
            datasets: [
              {
                label: 'Jumlah KK',
                data: [kMotor, kMobil, kLain],
                backgroundColor: '#0284c7',
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              ...defaultPlugins,
              datalabels: {
                ...defaultPlugins.datalabels,
                anchor: 'end',
                align: 'top',
              },
            },
            scales: {
              y: { beginAtZero: true, grid: { display: false }, ticks: { stepSize: 1 } },
              x: { grid: { display: false } },
            },
          },
        })
      );
    }

    // 7. Listrik
    if (chartRefs.listrik.current) {
      let v450 = 0, v900 = 0, v1300 = 0, v2200 = 0;
      residents.forEach((r) => {
        const l = r.listrik || '1300VA';
        if (l.includes('450')) v450++;
        else if (l.includes('900')) v900++;
        else if (l.includes('1300')) v1300++;
        else v2200++;
      });

      instances.push(
        new Chart(chartRefs.listrik.current, {
          type: 'pie',
          data: {
            labels: ['450VA', '900VA', '1300VA', '2200VA+'],
            datasets: [
              {
                data: [v450, v900, v1300, v2200],
                backgroundColor: ['#e11d48', '#f59e0b', '#16a34a', '#2563eb'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: defaultPlugins,
          },
        })
      );
    }

    // 8. Internet
    if (chartRefs.internet.current) {
      let netIndi = 0, netFirst = 0, netXL = 0, netSel = 0;
      residents.forEach((r) => {
        const n = r.internet || 'IndiHome';
        if (n.includes('IndiHome')) netIndi++;
        else if (n.includes('First')) netFirst++;
        else if (n.includes('XL')) netXL++;
        else netSel++;
      });

      instances.push(
        new Chart(chartRefs.internet.current, {
          type: 'doughnut',
          data: {
            labels: ['IndiHome', 'FirstMedia', 'XL Home', 'Seluler/Orbit'],
            datasets: [
              {
                data: [netIndi, netFirst, netXL, netSel],
                backgroundColor: ['#dc2626', '#2563eb', '#059669', '#d97706'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: defaultPlugins,
          },
        })
      );
    }

    // 9. Sumber Air
    if (chartRefs.air.current) {
      let airPam = 0, airSumur = 0, airGalon = 0;
      residents.forEach((r) => {
        const ar = r.air || 'Sumur Bor';
        if (ar.includes('PAM')) airPam++;
        else if (ar.includes('Sumur')) airSumur++;
        else airGalon++;
      });

      instances.push(
        new Chart(chartRefs.air.current, {
          type: 'bar',
          data: {
            labels: ['PAM / AETRA', 'Sumur Bor', 'Galon / Isi Ulang'],
            datasets: [
              {
                label: 'Jumlah KK',
                data: [airPam, airSumur, airGalon],
                backgroundColor: '#0ea5e9',
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              ...defaultPlugins,
              datalabels: {
                ...defaultPlugins.datalabels,
                anchor: 'end',
                align: 'top',
              },
            },
            scales: {
              y: { beginAtZero: true, grid: { display: false }, ticks: { stepSize: 1 } },
              x: { grid: { display: false } },
            },
          },
        })
      );
    }

    return () => {
      instances.forEach((c) => c.destroy());
    };
  }, [residents]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Statistik & Demografi Warga RT 04 / RW 12</span>
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Tersinkronisasi otomatis secara real-time dengan database Data Warga ({residents.length} data jiwa)
          </p>
        </div>
        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-100">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          <span>Live Sync Active</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {/* 1. Usia Group */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Statistik Kelompok Usia</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">Distribusi usia warga (Balita s/d Lansia)</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.usia}></canvas>
          </div>
        </div>

        {/* 2. Pendidikan */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Statistik Pendidikan</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">Tingkat pendidikan terakhir warga</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.pendidikan}></canvas>
          </div>
        </div>

        {/* 3. Pekerjaan */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Statistik Pekerjaan</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">Mata pencaharian warga RT 04</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.pekerjaan}></canvas>
          </div>
        </div>

        {/* 4. Status Tinggal */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600" />
              <span>Status Tempat Tinggal</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">Domisili & status kependudukan</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.statusTinggal}></canvas>
          </div>
        </div>

        {/* 5. Agama */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Statistik Agama</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">Kepercayaan / agama warga</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.agama}></canvas>
          </div>
        </div>

        {/* 6. Kendaraan */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>Kepemilikan Kendaraan</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">Jumlah motor & mobil per KK</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.kendaraan}></canvas>
          </div>
        </div>

        {/* 7. Listrik */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Voltase Listrik Rumah</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">Daya listrik PLN terpasang</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.listrik}></canvas>
          </div>
        </div>

        {/* 8. Internet */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span>Penggunaan Internet</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">Provider internet warga</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.internet}></canvas>
          </div>
        </div>

        {/* 9. Sumber Air */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <span>Sumber Air Rumah Tangga</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">PAM, sumur bor, atau air bersih</p>
          </div>
          <div className="w-full h-60 relative">
            <canvas ref={chartRefs.air}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
