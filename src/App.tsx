import React, { useState, useEffect, useMemo } from 'react';
import type {
  User,
  Resident,
  Pengurus,
  Proker,
  Misi,
  KontakInfo,
  KasTransaction,
  Agenda,
  Aspirasi,
  SuratFormData,
  ProkerKategori,
} from './types';
import {
  INITIAL_RESIDENTS,
  INITIAL_PENGURUS,
  INITIAL_PROKER,
  INITIAL_VISI,
  INITIAL_MISI,
  INITIAL_KONTAK,
  INITIAL_TRANSACTIONS,
  INITIAL_AGENDAS,
  INITIAL_ASPIRATIONS,
} from './data/initialData';
import DemographicsCharts from './components/DemographicsCharts';
import SuratPreview from './components/SuratPreview';
import StrukturOrganisasiBagan from './components/StrukturOrganisasiBagan';
import KartuKeluargaModal from './components/KartuKeluargaModal';
import DetailWargaModal from './components/DetailWargaModal';
import {
  Sprout,
  Users,
  Home,
  UserCheck,
  User as UserIcon,
  FileText,
  MessageSquare,
  Wallet,
  Calendar,
  Info,
  PhoneCall,
  MapPin,
  CalendarDays,
  Lock,
  LogOut,
  LogIn,
  Menu,
  X,
  Plus,
  Search,
  Eye,
  IdCard,
  Edit3,
  Trash2,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  Send,
  Bell,
  Check,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'warga' | 'surat' | 'aspirasi' | 'keuangan' | 'agenda' | 'rt04'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tentangSubTab, setTentangSubTab] = useState<'pengurus' | 'proker' | 'visimisi' | 'kontak'>('pengurus');

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rt04_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<'pengurus' | 'warga'>('pengurus');
  const [loginUsername, setLoginUsername] = useState('hadi');
  const [loginPassword, setLoginPassword] = useState('Kiora284');

  // Core Data with LocalStorage Persistence
  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem('rt04_residents');
    return saved ? JSON.parse(saved) : INITIAL_RESIDENTS;
  });

  const [pengurusList, setPengurusList] = useState<Pengurus[]>(() => {
    const saved = localStorage.getItem('rt04_pengurus');
    return saved ? JSON.parse(saved) : INITIAL_PENGURUS;
  });

  const [prokerList, setProkerList] = useState<Proker[]>(() => {
    const saved = localStorage.getItem('rt04_proker');
    return saved ? JSON.parse(saved) : INITIAL_PROKER;
  });

  const [visiText, setVisiText] = useState<string>(() => {
    return localStorage.getItem('rt04_visi') || INITIAL_VISI;
  });

  const [misiList, setMisiList] = useState<Misi[]>(() => {
    const saved = localStorage.getItem('rt04_misi');
    return saved ? JSON.parse(saved) : INITIAL_MISI;
  });

  const [kontakInfo, setKontakInfo] = useState<KontakInfo>(() => {
    const saved = localStorage.getItem('rt04_kontak');
    return saved ? JSON.parse(saved) : INITIAL_KONTAK;
  });

  const [transactions, setTransactions] = useState<KasTransaction[]>(() => {
    const saved = localStorage.getItem('rt04_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [agendas, setAgendas] = useState<Agenda[]>(() => {
    const saved = localStorage.getItem('rt04_agendas');
    return saved ? JSON.parse(saved) : INITIAL_AGENDAS;
  });

  const [aspirations, setAspirations] = useState<Aspirasi[]>(() => {
    const saved = localStorage.getItem('rt04_aspirations');
    return saved ? JSON.parse(saved) : INITIAL_ASPIRATIONS;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('rt04_residents', JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    localStorage.setItem('rt04_pengurus', JSON.stringify(pengurusList));
  }, [pengurusList]);

  useEffect(() => {
    localStorage.setItem('rt04_proker', JSON.stringify(prokerList));
  }, [prokerList]);

  useEffect(() => {
    localStorage.setItem('rt04_visi', visiText);
  }, [visiText]);

  useEffect(() => {
    localStorage.setItem('rt04_misi', JSON.stringify(misiList));
  }, [misiList]);

  useEffect(() => {
    localStorage.setItem('rt04_kontak', JSON.stringify(kontakInfo));
  }, [kontakInfo]);

  useEffect(() => {
    localStorage.setItem('rt04_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('rt04_agendas', JSON.stringify(agendas));
  }, [agendas]);

  useEffect(() => {
    localStorage.setItem('rt04_aspirations', JSON.stringify(aspirations));
  }, [aspirations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rt04_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rt04_user');
    }
  }, [currentUser]);

  // Toast Notification
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 3500);
  };

  // Live Current Date
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const canManageData = currentUser?.role === 'pengurus';

  // Currency Formatter
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  // Global Print Trigger
  const handlePrint = () => {
    window.print();
  };

  // -------------------------
  // STATS
  // -------------------------
  const stats = useMemo(() => {
    const living = residents.filter((r) => r.status !== 'Meninggal');
    const kk = living.length;
    const laki = living.filter((r) => r.gender === 'Laki-Laki').length;
    const perempuan = living.filter((r) => r.gender === 'Perempuan').length;
    return { kk, total: laki + perempuan, laki, perempuan };
  }, [residents]);

  // -------------------------
  // DATA WARGA FILTERS & MODALS
  // -------------------------
  const [searchResident, setSearchResident] = useState('');
  const [filterResidentStatus, setFilterResidentStatus] = useState('ALL');

  const filteredResidents = useMemo(() => {
    const kw = searchResident.toLowerCase().trim();
    return residents.filter((r) => {
      const matchKw =
        r.nama.toLowerCase().includes(kw) ||
        r.nik.includes(kw) ||
        r.rumah.toLowerCase().includes(kw);
      const matchSt = filterResidentStatus === 'ALL' || r.status === filterResidentStatus;
      return matchKw && matchSt;
    });
  }, [residents, searchResident, filterResidentStatus]);

  const [modalViewResident, setModalViewResident] = useState(false);
  const [currentResident, setCurrentResident] = useState<Resident | null>(null);

  const [modalViewKK, setModalViewKK] = useState(false);
  const [currentKK, setCurrentKK] = useState<Resident | null>(null);

  const familyMembers = useMemo(() => {
    if (!currentKK) return [];
    return residents.filter((r) => r.rumah === currentKK.rumah && r.id !== currentKK.id);
  }, [residents, currentKK]);

  const [modalResidentForm, setModalResidentForm] = useState(false);
  const [isEditingResident, setIsEditingResident] = useState(false);
  const [residentForm, setResidentForm] = useState<Resident>({
    id: 0,
    nik: '',
    nama: '',
    rumah: '',
    gender: 'Laki-Laki',
    agama: 'Islam',
    pekerjaan: 'Swasta',
    status: 'Tetap',
    pendidikan: 'SMA',
    tempatLahir: '',
    tanggalLahir: '',
    usia: 30,
    kendaraan: 'Motor 1',
    listrik: '1300VA',
    internet: 'IndiHome',
    air: 'Sumur Bor',
  });

  const handleOpenAddResident = () => {
    if (!canManageData) {
      showToast('Akses ditolak: Hanya pengurus RT yang dapat menambah data.');
      return;
    }
    setIsEditingResident(false);
    setResidentForm({
      id: Date.now(),
      nik: '',
      nama: '',
      rumah: '',
      gender: 'Laki-Laki',
      agama: 'Islam',
      pekerjaan: 'Swasta',
      status: 'Tetap',
      pendidikan: 'SMA',
      tempatLahir: '',
      tanggalLahir: '',
      usia: 30,
      kendaraan: 'Motor 1',
      listrik: '1300VA',
      internet: 'IndiHome',
      air: 'Sumur Bor',
    });
    setModalResidentForm(true);
  };

  const handleEditResident = (r: Resident) => {
    if (!canManageData) {
      showToast('Akses ditolak: Hanya pengurus RT yang dapat mengedit data.');
      return;
    }
    setIsEditingResident(true);
    setResidentForm({ ...r });
    setModalResidentForm(true);
  };

  const handleSaveResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingResident) {
      setResidents((prev) => prev.map((x) => (x.id === residentForm.id ? { ...residentForm } : x)));
      showToast('Data warga berhasil diperbarui!');
    } else {
      setResidents((prev) => [{ ...residentForm, id: Date.now() }, ...prev]);
      showToast('Warga baru berhasil ditambahkan ke database!');
    }
    setModalResidentForm(false);
  };

  const handleDeleteResident = (id: number) => {
    if (!canManageData) {
      showToast('Akses ditolak: Hanya pengurus RT.');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus data warga ini?')) {
      setResidents((prev) => prev.filter((r) => r.id !== id));
      showToast('Data warga berhasil dihapus.');
    }
  };

  // -------------------------
  // SURAT FORM & VERIFICATION
  // -------------------------
  const [selectedSuratWargaId, setSelectedSuratWargaId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('VAL-2026-RT04-582914');
  const [suratForm, setSuratForm] = useState<SuratFormData>({
    nama: 'Bpk. H. Ahmad Fauzi',
    nik: '3204120101850001',
    tempatLahir: 'Tangerang',
    tanggalLahir: '10 Januari 1985',
    gender: 'Laki-Laki',
    agama: 'Islam',
    pekerjaan: 'PNS',
    usia: '41',
    rumah: 'Blok A1 No. 3',
    jenis: 'Surat Keterangan Domisili',
    keperluan: 'Kelengkapan administrasi perpanjangan KTP-el dan dokumen perbankan',
  });

  const autofillSuratForm = (residentId: string) => {
    setSelectedSuratWargaId(residentId);
    const found = residents.find((r) => String(r.id) === residentId);
    if (found) {
      setSuratForm((prev) => ({
        ...prev,
        nama: found.nama,
        nik: found.nik,
        tempatLahir: found.tempatLahir,
        tanggalLahir: found.tanggalLahir,
        gender: found.gender,
        agama: found.agama,
        pekerjaan: found.pekerjaan,
        usia: String(found.usia),
        rumah: found.rumah,
      }));
      const newCode = 'VAL-2026-RT04-' + Math.floor(100000 + Math.random() * 900000);
      setVerificationCode(newCode);
      showToast(`Data pemohon ${found.nama} otomatis dimuat!`);
    }
  };

  const handleGenerateSurat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Wajib login terlebih dahulu untuk mengajukan surat!');
      setModalLoginOpen(true);
      return;
    }
    const newCode = 'VAL-2026-RT04-' + Math.floor(100000 + Math.random() * 900000);
    setVerificationCode(newCode);
    showToast('Surat resmi berhasil digenerate dengan QR Code Validasi resmi!');
  };

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // -------------------------
  // ASPIRASI
  // -------------------------
  const [selectedAspirasiWargaId, setSelectedAspirasiWargaId] = useState('');
  const [aspirasiForm, setAspirasiForm] = useState({
    nama: '',
    rumah: '',
    kategori: 'Keamanan & Ketertiban',
    pesan: '',
  });

  const autofillAspirasiForm = (residentId: string) => {
    setSelectedAspirasiWargaId(residentId);
    const found = residents.find((r) => String(r.id) === residentId);
    if (found) {
      setAspirasiForm((prev) => ({
        ...prev,
        nama: found.nama,
        rumah: found.rumah,
      }));
    }
  };

  const handleSubmitAspirasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Wajib login untuk mengirim pengaduan / aspirasi!');
      setModalLoginOpen(true);
      return;
    }
    const newAspirasi: Aspirasi = {
      id: Date.now(),
      nama: aspirasiForm.nama,
      rumah: aspirasiForm.rumah,
      kategori: aspirasiForm.kategori,
      pesan: aspirasiForm.pesan,
      tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Menunggu',
    };
    setAspirations((prev) => [newAspirasi, ...prev]);
    setAspirasiForm({
      nama: currentUser.role === 'warga' ? currentUser.nama : '',
      rumah: '',
      kategori: 'Keamanan & Ketertiban',
      pesan: '',
    });
    setSelectedAspirasiWargaId('');
    showToast('Aspirasi berhasil dikirim ke Pengurus RT!');
  };

  // -------------------------
  // KAS RT
  // -------------------------
  const totalKasIncome = useMemo(() => {
    return transactions.filter((t) => t.jenis === 'Pemasukan').reduce((acc, curr) => acc + curr.nominal, 0);
  }, [transactions]);

  const totalKasExpense = useMemo(() => {
    return transactions.filter((t) => t.jenis === 'Pengeluaran').reduce((acc, curr) => acc + curr.nominal, 0);
  }, [transactions]);

  const totalKasBalance = useMemo(() => {
    return 10000000 + totalKasIncome - totalKasExpense;
  }, [totalKasIncome, totalKasExpense]);

  const [modalTransactionForm, setModalTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    ket: '',
    jenis: 'Pemasukan' as 'Pemasukan' | 'Pengeluaran',
    nominal: 50000,
    kategori: 'Iuran Warga',
  });

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const newTx: KasTransaction = {
      id: Date.now(),
      tanggal: now,
      ket: transactionForm.ket,
      kategori: transactionForm.kategori,
      jenis: transactionForm.jenis,
      nominal: Number(transactionForm.nominal),
    };
    setTransactions((prev) => [newTx, ...prev]);
    setModalTransactionForm(false);
    showToast('Transaksi kas RT berhasil dicatat!');
  };

  // -------------------------
  // AGENDA
  // -------------------------
  const [modalAgendaForm, setModalAgendaForm] = useState(false);
  const [agendaForm, setAgendaForm] = useState({
    judul: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
  });

  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgenda: Agenda = {
      id: Date.now(),
      judul: agendaForm.judul,
      tanggal: agendaForm.tanggal,
      waktu: agendaForm.waktu,
      lokasi: agendaForm.lokasi,
      status: 'Akan Datang',
    };
    setAgendas((prev) => [newAgenda, ...prev]);
    setModalAgendaForm(false);
    showToast('Agenda kegiatan baru berhasil ditambahkan!');
  };

  // -------------------------
  // RT 04 (PENGURUS, PROKER, VISI-MISI, KONTAK)
  // -------------------------
  const [modalPengurusForm, setModalPengurusForm] = useState(false);
  const [isEditingPengurus, setIsEditingPengurus] = useState(false);
  const [pengurusForm, setPengurusForm] = useState<Pengurus>({
    id: 0,
    nama: '',
    jabatan: '',
    tugas: '',
    icon: 'user-check',
  });

  const handleSavePengurus = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingPengurus) {
      setPengurusList((prev) => prev.map((p) => (p.id === pengurusForm.id ? { ...pengurusForm } : p)));
      showToast('Data pengurus berhasil diperbarui!');
    } else {
      setPengurusList((prev) => [...prev, { ...pengurusForm, id: Date.now() }]);
      showToast('Pengurus baru berhasil ditambahkan!');
    }
    setModalPengurusForm(false);
  };

  const handleDeletePengurus = (id: number) => {
    if (!canManageData) return;
    if (window.confirm('Hapus data pengurus ini?')) {
      setPengurusList((prev) => prev.filter((p) => p.id !== id));
      showToast('Data pengurus berhasil dihapus.');
    }
  };

  // Proker Modal
  const [modalProkerForm, setModalProkerForm] = useState(false);
  const [isEditingProker, setIsEditingProker] = useState(false);
  const [prokerForm, setProkerForm] = useState<Proker>({
    id: 0,
    kategori: 'Pendek',
    judul: '',
    deskripsi: '',
    icon: 'users',
  });

  const handleSaveProker = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingProker) {
      setProkerList((prev) => prev.map((pk) => (pk.id === prokerForm.id ? { ...prokerForm } : pk)));
      showToast('Program kerja berhasil diperbarui!');
    } else {
      setProkerList((prev) => [...prev, { ...prokerForm, id: Date.now() }]);
      showToast('Program kerja baru berhasil ditambahkan!');
    }
    setModalProkerForm(false);
  };

  const handleDeleteProker = (id: number) => {
    if (!canManageData) return;
    if (window.confirm('Hapus program kerja ini?')) {
      setProkerList((prev) => prev.filter((pk) => pk.id !== id));
      showToast('Program kerja berhasil dihapus.');
    }
  };

  // Visi & Misi Modal
  const [modalVisiMisiForm, setModalVisiMisiForm] = useState(false);
  const [misiModalEditMode, setMisiModalEditMode] = useState(false);
  const [tempVisiText, setTempVisiText] = useState('');
  const [currentMisiId, setCurrentMisiId] = useState<number | null>(null);
  const [tempMisiTeks, setTempMisiTeks] = useState('');

  const handleSaveVisiMisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!misiModalEditMode) {
      setVisiText(tempVisiText);
      showToast('Visi RT berhasil diperbarui!');
    } else {
      if (currentMisiId) {
        setMisiList((prev) => prev.map((m) => (m.id === currentMisiId ? { ...m, teks: tempMisiTeks } : m)));
        showToast('Butir Misi berhasil diperbarui!');
      } else {
        setMisiList((prev) => [...prev, { id: Date.now(), teks: tempMisiTeks }]);
        showToast('Butir Misi baru berhasil ditambahkan!');
      }
    }
    setModalVisiMisiForm(false);
  };

  const handleDeleteMisi = (id: number) => {
    if (!canManageData) return;
    if (window.confirm('Hapus butir misi ini?')) {
      setMisiList((prev) => prev.filter((m) => m.id !== id));
      showToast('Butir misi berhasil dihapus.');
    }
  };

  // Kontak Modal
  const [modalKontakForm, setModalKontakForm] = useState(false);
  const [tempKontak, setTempKontak] = useState<KontakInfo>({ ...kontakInfo });

  const handleSaveKontak = (e: React.FormEvent) => {
    e.preventDefault();
    setKontakInfo({ ...tempKontak });
    setModalKontakForm(false);
    showToast('Informasi kontak & lokasi sekretariat berhasil diperbarui!');
  };

  // -------------------------
  // LOGIN SUBMISSION
  // -------------------------
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = loginUsername.trim();
    const p = loginPassword.trim();

    if (loginRole === 'pengurus') {
      if (u === 'hadi' && p === 'Kiora284') {
        const admin: User = {
          nama: 'Sofyan Hadi Prayitno',
          role: 'pengurus',
          jabatan: 'Sekretaris RT 04',
        };
        setCurrentUser(admin);
        showToast('Berhasil login sebagai Pengurus RT (Sofyan Hadi Prayitno)');
        setModalLoginOpen(false);
      } else {
        showToast('Username atau Password Pengurus salah! Gunakan: hadi / Kiora284');
      }
    } else {
      if (u === 'warga' && p === 'warga123') {
        const firstResident = residents[0];
        const wargaUser: User = {
          nama: firstResident.nama,
          role: 'warga',
          nik: firstResident.nik,
        };
        setCurrentUser(wargaUser);
        showToast(`Berhasil login sebagai Warga (${firstResident.nama})`);
        autofillSuratForm(String(firstResident.id));
        autofillAspirasiForm(String(firstResident.id));
        setModalLoginOpen(false);
      } else {
        showToast('Username atau Password Warga salah! Gunakan: warga / warga123');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari sesi portal warga.');
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'warga', name: 'Data Warga', icon: Users },
    { id: 'surat', name: 'Surat', icon: FileText },
    { id: 'aspirasi', name: 'Aspirasi Warga', icon: MessageSquare },
    { id: 'keuangan', name: 'Kas RT', icon: Wallet },
    { id: 'agenda', name: 'Agenda', icon: Calendar },
    { id: 'rt04', name: 'RT 04', icon: Info },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* SIAGA RT TOP BAR */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 shadow-inner no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse text-[10px]">
              SIAGA RT
            </span>
            <span>
              Hotline Keamanan & Ambulans: <strong>0812-3456-7890</strong> (Idrus Sadi - Ketua RT)
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Sukamantri, Kec. Pasar Kemis, Kab. Tangerang
            </span>
            <span className="hidden md:flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" /> {currentDate}
            </span>
          </div>
        </div>
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="bg-white sticky top-0 z-40 shadow-xs border-b border-slate-100 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & RT Title */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-12 h-12 bg-emerald-800 text-white rounded-2xl flex items-center justify-center shadow-md shadow-emerald-900/20 text-xl font-bold">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-snug">
                RT 04 / RW 12
              </h1>
              <p className="text-xs text-emerald-800 font-semibold">Perumahan Taman Buah Sukamantri</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User Auth Profile / Login Button */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200/80">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {currentUser.role === 'pengurus' ? (
                    <UserCheck className="w-5 h-5 text-emerald-200" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-emerald-200" />
                  )}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-bold text-slate-900 leading-tight">{currentUser.nama}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block mt-0.5 ${
                      currentUser.role === 'pengurus'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-blue-100 text-blue-900 border border-blue-200'
                    }`}
                  >
                    {currentUser.role === 'pengurus' ? 'Pengurus RT' : 'Warga Terdaftar'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModalLoginOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-2xl font-semibold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in fade-in">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
                    isActive ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-700" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD                                          */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-700 text-white p-8 sm:p-12 overflow-hidden shadow-xl shadow-emerald-950/20">
              <div className="absolute -right-8 -bottom-8 opacity-15 text-emerald-300 pointer-events-none">
                <Sprout className="w-72 h-72" />
              </div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Portal Warga Digital RT 04</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  RT 04 / RW 12 Taman Buah Sukamantri
                </h2>
                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                  Kawasan perumahan asri, rukun, dan harmonis. Menyediakan layanan administrasi surat digital
                  dengan QR Code validasi resmi, transparansi keuangan kas RT, dan basis data warga terpadu.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('surat')}
                    className="bg-white text-emerald-900 px-6 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-emerald-50 transition flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Buat Surat Resmi</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('rt04');
                      setTentangSubTab('pengurus');
                    }}
                    className="bg-emerald-900/40 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-emerald-900/60 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-emerald-200" />
                    <span>Tentang RT 04</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 flex items-center gap-4 hover:border-emerald-200 transition">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                  <Home className="w-7 h-7 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jumlah KK</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.kk}</h4>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Kepala Keluarga
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                  <Users className="w-7 h-7 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Warga</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.total}</h4>
                  <span className="text-[10px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    Jiwa Terdaftar
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 flex items-center gap-4 hover:border-indigo-200 transition">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
                  <UserIcon className="w-7 h-7 text-indigo-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Laki-Laki</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.laki}</h4>
                  <span className="text-[10px] text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    Jiwa
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 flex items-center gap-4 hover:border-pink-200 transition">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center text-2xl font-bold">
                  <UserIcon className="w-7 h-7 text-pink-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Perempuan</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.perempuan}</h4>
                  <span className="text-[10px] text-pink-800 font-bold bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                    Jiwa
                  </span>
                </div>
              </div>
            </div>

            {/* Demographics & Utility Charts */}
            <DemographicsCharts residents={residents} />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DATA WARGA                                         */}
        {/* ========================================================= */}
        {activeTab === 'warga' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Data Kependudukan Warga RT 04</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Daftar lengkap NIK, KK, Alamat, Agama, Pekerjaan & Status Domisili Warga
                  </p>
                </div>
                <div>
                  {canManageData ? (
                    <button
                      onClick={handleOpenAddResident}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Warga Baru</span>
                    </button>
                  ) : (
                    <div className="bg-amber-50 text-amber-800 text-xs font-semibold px-4 py-2.5 rounded-2xl border border-amber-200 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span>Mode Warga (Read-Only Data Warga)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchResident}
                    onChange={(e) => setSearchResident(e.target.value)}
                    placeholder="Cari nama, NIK, atau rumah..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={filterResidentStatus}
                    onChange={(e) => setFilterResidentStatus(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-600 transition"
                  >
                    <option value="ALL">Semua Status Warga</option>
                    <option value="Tetap">Warga Tetap</option>
                    <option value="Kontrak">Warga Kontrak</option>
                    <option value="Meninggal">Meninggal</option>
                    <option value="Cerai">Cerai</option>
                  </select>
                </div>
              </div>

              {/* Residents Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="p-4">NIK & Nama Lengkap</th>
                      <th className="p-4">No. Rumah</th>
                      <th className="p-4">L/P & Agama</th>
                      <th className="p-4">Pekerjaan</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredResidents.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{r.nama}</p>
                          <p className="text-xs text-slate-500 font-mono">NIK: {r.nik}</p>
                        </td>
                        <td className="p-4 text-slate-700 font-medium">{r.rumah}</td>
                        <td className="p-4">
                          <span className="font-semibold text-xs text-slate-800">{r.gender}</span>
                          <p className="text-xs text-slate-500">{r.agama}</p>
                        </td>
                        <td className="p-4 text-slate-600">{r.pekerjaan}</td>
                        <td className="p-4">
                          <span
                            className={`font-semibold text-xs px-3 py-1 rounded-full ${
                              r.status === 'Tetap'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                : r.status === 'Kontrak'
                                ? 'bg-amber-50 text-amber-800 border border-amber-100'
                                : r.status === 'Meninggal'
                                ? 'bg-rose-50 text-rose-800 border border-rose-100'
                                : 'bg-purple-50 text-purple-800 border border-purple-100'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => {
                              setCurrentResident(r);
                              setModalViewResident(true);
                            }}
                            className="text-slate-500 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition cursor-pointer"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentKK(r);
                              setModalViewKK(true);
                            }}
                            className="text-slate-500 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition cursor-pointer"
                            title="Lihat Kartu Keluarga"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                          {canManageData && (
                            <>
                              <button
                                onClick={() => handleEditResident(r)}
                                className="text-slate-500 hover:text-amber-600 p-2 rounded-xl hover:bg-amber-50 transition cursor-pointer"
                                title="Edit Data"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteResident(r.id)}
                                className="text-slate-500 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredResidents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                          Tidak ditemukan data warga yang sesuai dengan kata kunci.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SURAT RESMI RT                                      */}
        {/* ========================================================= */}
        {activeTab === 'surat' && (
          <div className="space-y-8">
            {!currentUser ? (
              <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Autentikasi Diperlukan</h3>
                  <p className="text-xs text-slate-600">
                    Warga wajib login terlebih dahulu untuk melakukan pengajuan Surat Pengantar RT resmi dengan
                    tanda tangan & QR validasi.
                  </p>
                  <button
                    onClick={() => setModalLoginOpen(true)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-3 rounded-2xl font-semibold text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login Sekarang</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Form Surat */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Pengajuan Surat RT</h3>
                      <p className="text-xs text-slate-500">
                        Pilih nama warga terdaftar untuk otomatis isi biodata lengkap & QR validasi
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleGenerateSurat} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                        Pilih Warga Pemohon (Autofill)
                      </label>
                      <select
                        value={selectedSuratWargaId}
                        onChange={(e) => autofillSuratForm(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="">-- Pilih Nama Warga dari Database --</option>
                        {residents.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nama} ({r.rumah})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={suratForm.nama}
                          onChange={(e) => setSuratForm({ ...suratForm, nama: e.target.value })}
                          required
                          placeholder="Nama lengkap pemohon..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          NIK
                        </label>
                        <input
                          type="text"
                          value={suratForm.nik}
                          onChange={(e) => setSuratForm({ ...suratForm, nik: e.target.value })}
                          required
                          placeholder="Nomor Induk Kependudukan..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          Tempat Lahir
                        </label>
                        <input
                          type="text"
                          value={suratForm.tempatLahir}
                          onChange={(e) => setSuratForm({ ...suratForm, tempatLahir: e.target.value })}
                          required
                          placeholder="Kota kelahiran..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          Tanggal Lahir
                        </label>
                        <input
                          type="text"
                          value={suratForm.tanggalLahir}
                          onChange={(e) => setSuratForm({ ...suratForm, tanggalLahir: e.target.value })}
                          required
                          placeholder="Contoh: 10 Januari 1985"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          Jenis Kelamin
                        </label>
                        <select
                          value={suratForm.gender}
                          onChange={(e) => setSuratForm({ ...suratForm, gender: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        >
                          <option value="Laki-Laki">Laki-Laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          Agama
                        </label>
                        <input
                          type="text"
                          value={suratForm.agama}
                          onChange={(e) => setSuratForm({ ...suratForm, agama: e.target.value })}
                          required
                          placeholder="Agama..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          Usia (Tahun)
                        </label>
                        <input
                          type="number"
                          value={suratForm.usia}
                          onChange={(e) => setSuratForm({ ...suratForm, usia: e.target.value })}
                          required
                          placeholder="Usia..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          Pekerjaan
                        </label>
                        <input
                          type="text"
                          value={suratForm.pekerjaan}
                          onChange={(e) => setSuratForm({ ...suratForm, pekerjaan: e.target.value })}
                          required
                          placeholder="Pekerjaan saat ini..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          No. Rumah / Alamat
                        </label>
                        <input
                          type="text"
                          value={suratForm.rumah}
                          onChange={(e) => setSuratForm({ ...suratForm, rumah: e.target.value })}
                          required
                          placeholder="Contoh: Blok A1 No. 3"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                        Jenis Surat Resmi
                      </label>
                      <select
                        value={suratForm.jenis}
                        onChange={(e) => setSuratForm({ ...suratForm, jenis: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
                        <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
                        <option value="Surat Pengantar Pembuatan KTP / KK">Surat Pengantar Pembuatan KTP / KK</option>
                        <option value="Surat Keterangan Kelahiran">Surat Keterangan Kelahiran</option>
                        <option value="Surat Keterangan Kematian">Surat Keterangan Kematian</option>
                        <option value="Surat Pengantar SKCK">Surat Pengantar SKCK</option>
                        <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                        Keperluan / Keterangan Detail
                      </label>
                      <textarea
                        value={suratForm.keperluan}
                        onChange={(e) => setSuratForm({ ...suratForm, keperluan: e.target.value })}
                        rows={3}
                        required
                        placeholder="Jelaskan keperluan pengajuan surat..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-5 h-5 text-emerald-300" />
                      <span>Generate QR & Cetak Surat Resmi RT</span>
                    </button>
                  </form>
                </div>

                {/* Surat Preview Component */}
                <SuratPreview
                  suratForm={suratForm}
                  verificationCode={verificationCode}
                  currentDate={currentDate}
                  onPrint={handlePrint}
                  onVerifyQR={() => setVerifyModalOpen(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ASPIRASI WARGA                                     */}
        {/* ========================================================= */}
        {activeTab === 'aspirasi' && (
          <div className="space-y-6">
            {!currentUser ? (
              <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Autentikasi Diperlukan</h3>
                  <p className="text-xs text-slate-600">
                    Warga wajib login terlebih dahulu untuk mengisi Kotak Aspirasi & Pengaduan Warga RT 04.
                  </p>
                  <button
                    onClick={() => setModalLoginOpen(true)}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-2xl font-semibold text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login Sekarang</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Form Input Aspirasi */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Kotak Aspirasi & Pengaduan Warga</h3>
                      <p className="text-xs text-slate-500">
                        Sampaikan saran, keluhan keamanan, kebersihan, atau fasilitas lingkungan
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitAspirasi} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                        Pilih Pelapor (Autofill dari Database Warga)
                      </label>
                      <select
                        value={selectedAspirasiWargaId}
                        onChange={(e) => autofillAspirasiForm(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="">-- Pilih Warga Pelapor --</option>
                        {residents.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nama} ({r.rumah})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          Nama Lengkap Pelapor
                        </label>
                        <input
                          type="text"
                          value={aspirasiForm.nama}
                          onChange={(e) => setAspirasiForm({ ...aspirasiForm, nama: e.target.value })}
                          required
                          placeholder="Nama lengkap..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                          No. Rumah / Blok
                        </label>
                        <input
                          type="text"
                          value={aspirasiForm.rumah}
                          onChange={(e) => setAspirasiForm({ ...aspirasiForm, rumah: e.target.value })}
                          required
                          placeholder="Contoh: Blok B1 No. 12"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                        Kategori Pengaduan / Aspirasi
                      </label>
                      <select
                        value={aspirasiForm.kategori}
                        onChange={(e) => setAspirasiForm({ ...aspirasiForm, kategori: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
                        <option value="Kebersihan & Sampah">Kebersihan & Sampah</option>
                        <option value="Infrastruktur & Jalan">Infrastruktur & Fasilitas Umum</option>
                        <option value="Saran & Masukan Lain">Saran & Masukan Umum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                        Isi Pesan / Pengaduan
                      </label>
                      <textarea
                        value={aspirasiForm.pesan}
                        onChange={(e) => setAspirasiForm({ ...aspirasiForm, pesan: e.target.value })}
                        rows={3}
                        required
                        placeholder="Tuliskan aspirasi atau pengaduan secara jelas dan rinci..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Aspirasi Warga</span>
                    </button>
                  </form>
                </div>

                {/* List Aspirasi Masuk */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Daftar Aspirasi & Pengaduan Masuk</h3>
                      <p className="text-xs text-slate-500">{aspirations.length} laporan tercatat</p>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                    {aspirations.map((asp) => (
                      <div
                        key={asp.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-amber-200 transition"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              {asp.nama} ({asp.rumah})
                            </h4>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                              {asp.kategori}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                asp.status === 'Selesai'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : asp.status === 'Diproses'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {asp.status}
                            </span>
                            {canManageData && (
                              <button
                                onClick={() => {
                                  const nextStatus =
                                    asp.status === 'Menunggu'
                                      ? 'Diproses'
                                      : asp.status === 'Diproses'
                                      ? 'Selesai'
                                      : 'Menunggu';
                                  setAspirations((prev) =>
                                    prev.map((x) => (x.id === asp.id ? { ...x, status: nextStatus } : x))
                                  );
                                  showToast(`Status aspirasi diubah menjadi "${nextStatus}"`);
                                }}
                                className="text-[10px] text-slate-500 hover:text-emerald-700 underline cursor-pointer"
                              >
                                Ubah Status
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{asp.pesan}</p>
                        <div className="text-[10px] text-slate-400 text-right">{asp.tanggal}</div>
                      </div>
                    ))}
                    {aspirations.length === 0 && (
                      <p className="text-center py-8 text-xs text-slate-400">Belum ada aspirasi tercatat.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: KAS RT                                             */}
        {/* ========================================================= */}
        {activeTab === 'keuangan' && (
          <div className="space-y-6">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-950 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-950/15 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full font-bold">
                      Saldo Kas RT
                    </span>
                    <Wallet className="w-6 h-6 text-emerald-300" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold">{formatIDR(totalKasBalance)}</h3>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-emerald-200">
                  <span>Periode: Oktober 2026</span>
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Audit OK</span>
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-bold">
                      Total Pemasukan
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <ArrowDownRight className="w-5 h-5 text-emerald-700" />
                    </div>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{formatIDR(totalKasIncome)}</h3>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  Iuran Warga & Sumbangan Lingkungan
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase tracking-wider bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold">
                      Total Pengeluaran
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-rose-700" />
                    </div>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{formatIDR(totalKasExpense)}</h3>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  Kebersihan, Perbaikan Lampu Jalan, Fasilitas
                </div>
              </div>
            </div>

            {/* Riwayat Transaksi Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Riwayat Transaksi Kas RT 04</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Catatan transparan pemasukan iuran dan pengeluaran operasional lingkungan
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-2xl font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Kas</span>
                  </button>
                  {canManageData && (
                    <button
                      onClick={() => setModalTransactionForm(true)}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Catat Transaksi Baru</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Keterangan</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Jenis</th>
                      <th className="p-4 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 text-slate-500 text-xs">{t.tanggal}</td>
                        <td className="p-4 font-semibold text-slate-900">{t.ket}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                            {t.kategori}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">{t.jenis}</td>
                        <td
                          className={`p-4 text-right font-extrabold ${
                            t.jenis === 'Pemasukan' ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {t.jenis === 'Pemasukan' ? '+ ' : '- '}
                          {formatIDR(t.nominal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: AGENDA KEGIATAN                                    */}
        {/* ========================================================= */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Agenda & Kegiatan Warga RT 04</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Jadwal kegiatan rutin gotong royong, pos siskamling ronda, dan rapat koordinasi warga
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-2xl font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Agenda</span>
                  </button>
                  {canManageData && (
                    <button
                      onClick={() => setModalAgendaForm(true)}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Agenda Baru</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agendas.map((a) => (
                  <div
                    key={a.id}
                    className="bg-slate-50 rounded-3xl p-6 border border-slate-200/70 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                          {a.status}
                        </span>
                        <CalendarDays className="w-5 h-5 text-emerald-700" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mb-2">{a.judul}</h4>
                      <p className="text-xs text-slate-600 flex items-center gap-2 mb-1.5">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {a.tanggal} ({a.waktu})
                        </span>
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{a.lokasi}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => showToast(`Pengingat agenda "${a.judul}" berhasil diaktifkan!`)}
                      className="w-full bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 py-2.5 rounded-2xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Ingatkan Saya</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: RT 04 (PROFIL, BAGAN, PROKER, VISI-MISI, KONTAK)   */}
        {/* ========================================================= */}
        {activeTab === 'rt04' && (
          <div className="space-y-6">
            <div id="printable-area" className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
              {/* Header & Sub-navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">RT 04 / RW 12</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Profil kepengurusan resmi, hierarki organisasi, otoritas tugas, program kerja, visi misi, & kontak
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl no-print">
                  <button
                    onClick={() => setTentangSubTab('pengurus')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      tentangSubTab === 'pengurus'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-emerald-800'
                    }`}
                  >
                    Struktur & Otoritas
                  </button>
                  <button
                    onClick={() => setTentangSubTab('proker')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      tentangSubTab === 'proker'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-emerald-800'
                    }`}
                  >
                    Program Kerja
                  </button>
                  <button
                    onClick={() => setTentangSubTab('visimisi')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      tentangSubTab === 'visimisi'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-emerald-800'
                    }`}
                  >
                    Visi & Misi
                  </button>
                  <button
                    onClick={() => setTentangSubTab('kontak')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      tentangSubTab === 'kontak'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-emerald-800'
                    }`}
                  >
                    Kontak
                  </button>
                </div>
              </div>

              {/* SUBTAB 1: STRUKTUR & OTORITAS */}
              {tentangSubTab === 'pengurus' && (
                <div className="space-y-6 pt-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="max-w-xl">
                      <h4 className="text-lg font-bold text-slate-900">
                        Susunan Pengurus, Bagan & List Otoritas Pengurus RT 04
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Masa bakti 2026 - 2031 Perumahan Taman Buah Sukamantri, Desa Sukamantri, Kec. Pasar Kemis, Kab. Tangerang
                      </p>
                    </div>
                    <div className="flex gap-2 no-print">
                      {canManageData && (
                        <button
                          onClick={() => {
                            setIsEditingPengurus(false);
                            setPengurusForm({ id: 0, nama: '', jabatan: '', tugas: '', icon: 'user-check' });
                            setModalPengurusForm(true);
                          }}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Pengurus</span>
                        </button>
                      )}
                      <button
                        onClick={handlePrint}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  {/* OTORITAS PENGURUS BOX */}
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>List Otoritas & Hak Akses Pengurus RT 04 / RW 12</span>
                    </h5>
                    <p className="text-xs text-slate-600">
                      Berikut adalah rincian hak akses dan otoritas khusus yang dimiliki oleh pengurus terdaftar di
                      dalam portal warga:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-2 shadow-2xs">
                        <h6 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-700" />
                          <span>Ketua RT (Idrus Sadi)</span>
                        </h6>
                        <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed">
                          <li>Akses penuh manajemen data warga (Tambah, Edit, Hapus).</li>
                          <li>Validasi & penandatanganan surat resmi warga.</li>
                          <li>Pengawasan transparansi kas & kebijakan lingkungan.</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-2 shadow-2xs">
                        <h6 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>Wakil Ketua (Marsudi)</span>
                        </h6>
                        <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed">
                          <li>Pengawasan siskamling & jadwal ronda malam blok.</li>
                          <li>Koordinasi ketertiban tamu & penanganan darurat.</li>
                          <li>Manajemen agenda kegiatan warga & kerja bakti.</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-2 shadow-2xs">
                        <h6 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-700" />
                          <span>Sekretaris (Sofyan Hadi Prayitno)</span>
                        </h6>
                        <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed">
                          <li>Administrasi surat menyurat & penerbitan nomor surat.</li>
                          <li>Sistem validasi digital & kode QR resmi portal.</li>
                          <li>Pencatatan data kependudukan & arsip notulensi pleno.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL HIERARCHY BAGAN */}
                  <StrukturOrganisasiBagan />

                  {/* Pengurus Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {pengurusList.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-3 shadow-xs relative group hover:border-emerald-400 transition"
                      >
                        {canManageData && (
                          <div className="absolute top-4 right-4 flex gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition no-print">
                            <button
                              onClick={() => {
                                setIsEditingPengurus(true);
                                setPengurusForm({ ...p });
                                setModalPengurusForm(true);
                              }}
                              className="w-7 h-7 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center text-xs hover:bg-amber-100 cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePengurus(p.id)}
                              className="w-7 h-7 bg-rose-50 text-rose-700 rounded-lg flex items-center justify-center text-xs hover:bg-rose-100 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center text-3xl font-bold shadow-xs">
                          <UserCheck className="w-9 h-9 text-emerald-800" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-base text-slate-900">{p.nama}</h5>
                          <p className="text-xs text-emerald-800 uppercase font-bold tracking-wider mt-0.5">
                            {p.jabatan}
                          </p>
                        </div>
                        <p className="text-xs text-slate-600 pt-2 border-t border-slate-100 leading-relaxed">
                          {p.tugas}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: PROGRAM KERJA */}
              {tentangSubTab === 'proker' && (
                <div className="space-y-6 pt-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Program Kerja RT 04 / RW 12</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Klasifikasi program kerja jangka pendek, menengah, dan panjang masa bakti 2026 - 2031
                      </p>
                    </div>
                    <div className="flex gap-2 no-print">
                      {canManageData && (
                        <button
                          onClick={() => {
                            setIsEditingProker(false);
                            setProkerForm({ id: 0, kategori: 'Pendek', judul: '', deskripsi: '', icon: 'users' });
                            setModalProkerForm(true);
                          }}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Program Kerja</span>
                        </button>
                      )}
                      <button
                        onClick={handlePrint}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  {(['Pendek', 'Menengah', 'Panjang'] as ProkerKategori[]).map((kat) => {
                    const list = prokerList.filter((x) => x.kategori === kat);
                    const label =
                      kat === 'Pendek'
                        ? 'Jangka Pendek (1 - 3 Bulan)'
                        : kat === 'Menengah'
                        ? 'Jangka Menengah (6 Bulan - 1 Tahun)'
                        : 'Jangka Panjang (2 - 5 Tahun / Masa Bakti 2026 - 2031)';
                    const badgeClass =
                      kat === 'Pendek'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : kat === 'Menengah'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-purple-100 text-purple-800 border-purple-200';

                    return (
                      <div key={kat} className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeClass}`}>
                            {label}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {list.map((pk) => (
                            <div
                              key={pk.id}
                              className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative group hover:border-emerald-300 transition"
                            >
                              {canManageData && (
                                <div className="absolute top-4 right-4 flex gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition no-print">
                                  <button
                                    onClick={() => {
                                      setIsEditingProker(true);
                                      setProkerForm({ ...pk });
                                      setModalProkerForm(true);
                                    }}
                                    className="w-7 h-7 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center text-xs hover:bg-amber-100 cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProker(pk.id)}
                                    className="w-7 h-7 bg-rose-50 text-rose-700 rounded-lg flex items-center justify-center text-xs hover:bg-rose-100 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-lg">
                                  <Users className="w-5 h-5 text-emerald-800" />
                                </div>
                                <h5 className="font-bold text-slate-900 text-sm pr-12">{pk.judul}</h5>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{pk.deskripsi}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SUBTAB 3: VISI & MISI */}
              {tentangSubTab === 'visimisi' && (
                <div className="space-y-6 pt-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Visi & Misi RT 04 / RW 12</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Arah dan tujuan pembangunan lingkungan warga masa bakti 2026 - 2031
                      </p>
                    </div>
                    <div className="flex gap-2 no-print">
                      {canManageData && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setMisiModalEditMode(false);
                              setTempVisiText(visiText);
                              setModalVisiMisiForm(true);
                            }}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Visi</span>
                          </button>
                          <button
                            onClick={() => {
                              setMisiModalEditMode(true);
                              setCurrentMisiId(null);
                              setTempMisiTeks('');
                              setModalVisiMisiForm(true);
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Misi</span>
                          </button>
                        </div>
                      )}
                      <button
                        onClick={handlePrint}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Visi */}
                  <div className="bg-gradient-to-r from-emerald-950 to-emerald-800 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
                      Visi Utama RT 04
                    </span>
                    <p className="text-base sm:text-lg font-medium leading-relaxed italic">
                      "{visiText}"
                    </p>
                  </div>

                  {/* List Misi */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Misi RT 04 / RW 12</h5>
                    <div className="grid grid-cols-1 gap-4">
                      {misiList.map((m, idx) => (
                        <div
                          key={m.id}
                          className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-start justify-between gap-4 relative group hover:border-emerald-300 transition"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{m.teks}</p>
                          </div>
                          {canManageData && (
                            <div className="flex gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition shrink-0 no-print">
                              <button
                                onClick={() => {
                                  setMisiModalEditMode(true);
                                  setCurrentMisiId(m.id);
                                  setTempMisiTeks(m.teks);
                                  setModalVisiMisiForm(true);
                                }}
                                className="w-7 h-7 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center text-xs hover:bg-amber-100 cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMisi(m.id)}
                                className="w-7 h-7 bg-rose-50 text-rose-700 rounded-lg flex items-center justify-center text-xs hover:bg-rose-100 cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: KONTAK */}
              {tentangSubTab === 'kontak' && (
                <div className="space-y-6 pt-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Kontak Sekretariat RT 04</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Informasi alamat lengkap, hotline pengurus, email resmi, dan peta lokasi
                      </p>
                    </div>
                    <div className="flex gap-2 no-print">
                      {canManageData && (
                        <button
                          onClick={() => {
                            setTempKontak({ ...kontakInfo });
                            setModalKontakForm(true);
                          }}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Kontak</span>
                        </button>
                      )}
                      <button
                        onClick={handlePrint}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
                      <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-emerald-700" />
                        <span>Informasi Kontak Resmi</span>
                      </h5>
                      <div className="space-y-3 text-xs leading-relaxed">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <strong className="text-slate-800">Alamat Sekretariat:</strong>
                            <p className="text-slate-600 mt-0.5">{kontakInfo.alamat}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <PhoneCall className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <strong className="text-slate-800">Hotline Ketua RT:</strong>
                            <p className="text-slate-600 mt-0.5">{kontakInfo.hotline}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <strong className="text-slate-800">Email Resmi:</strong>
                            <p className="text-slate-600 mt-0.5">{kontakInfo.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-700" />
                          <span>Peta & Lokasi Wilayah</span>
                        </h5>
                        <div className="space-y-1.5 text-xs mt-3">
                          <p className="font-bold text-slate-800">{kontakInfo.lokasiNama}</p>
                          <p className="text-slate-600">{kontakInfo.lokasiDetail}</p>
                        </div>
                      </div>
                      <a
                        href={kontakInfo.gmapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-center py-3 rounded-2xl text-xs font-semibold shadow transition flex items-center justify-center gap-2 no-print cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Buka di Google Maps</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODALS                                                    */}
      {/* ========================================================= */}

      {/* MODAL: LOGIN */}
      {modalLoginOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold">
                  <LogIn className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Login Portal RT 04</h3>
                  <p className="text-xs text-slate-500">Pilih peran dan masukkan kredensial</p>
                </div>
              </div>
              <button
                onClick={() => setModalLoginOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('pengurus');
                    setLoginUsername('hadi');
                    setLoginPassword('Kiora284');
                  }}
                  className={`p-3 rounded-2xl border-2 transition text-center space-y-1 cursor-pointer ${
                    loginRole === 'pengurus'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <UserCheck className="w-5 h-5 mx-auto text-emerald-700" />
                  <p className="text-xs">Pengurus RT</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('warga');
                    setLoginUsername('warga');
                    setLoginPassword('warga123');
                  }}
                  className={`p-3 rounded-2xl border-2 transition text-center space-y-1 cursor-pointer ${
                    loginRole === 'warga'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <UserIcon className="w-5 h-5 mx-auto text-blue-600" />
                  <p className="text-xs">Warga</p>
                </button>
              </div>

              {/* Credentials Hint Box */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Info Akun Demo:
                </p>
                {loginRole === 'pengurus' ? (
                  <p>
                    Username: <code className="font-mono font-bold text-emerald-800">hadi</code> | Password:{' '}
                    <code className="font-mono font-bold text-emerald-800">Kiora284</code> (Sekretaris RT)
                  </p>
                ) : (
                  <p>
                    Username: <code className="font-mono font-bold text-blue-800">warga</code> | Password:{' '}
                    <code className="font-mono font-bold text-blue-800">warga123</code>
                  </p>
                )}
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Username</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    placeholder="Masukkan username..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="Masukkan password..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Masuk Sekarang</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW RESIDENT DETAIL */}
      <DetailWargaModal
        isOpen={modalViewResident}
        onClose={() => setModalViewResident(false)}
        resident={currentResident}
        onPrint={handlePrint}
      />

      {/* MODAL: KARTU KELUARGA */}
      <KartuKeluargaModal
        isOpen={modalViewKK}
        onClose={() => setModalViewKK(false)}
        currentKK={currentKK}
        familyMembers={familyMembers}
        onPrint={handlePrint}
      />

      {/* MODAL: FORM RESIDENT */}
      {modalResidentForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {isEditingResident ? 'Edit Data Warga' : 'Tambah Warga Baru'}
              </h3>
              <button
                onClick={() => setModalResidentForm(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResident} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={residentForm.nama}
                  onChange={(e) => setResidentForm({ ...residentForm, nama: e.target.value })}
                  required
                  placeholder="Contoh: Bpk. H. Ahmad Fauzi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">NIK</label>
                  <input
                    type="text"
                    value={residentForm.nik}
                    onChange={(e) => setResidentForm({ ...residentForm, nik: e.target.value })}
                    required
                    placeholder="16 Digit NIK..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">No. Rumah / Blok</label>
                  <input
                    type="text"
                    value={residentForm.rumah}
                    onChange={(e) => setResidentForm({ ...residentForm, rumah: e.target.value })}
                    required
                    placeholder="Contoh: Blok A1 No. 3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Jenis Kelamin</label>
                  <select
                    value={residentForm.gender}
                    onChange={(e) => setResidentForm({ ...residentForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Agama</label>
                  <select
                    value={residentForm.agama}
                    onChange={(e) => setResidentForm({ ...residentForm, agama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katholik">Katholik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Budha">Budha</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={residentForm.tempatLahir}
                    onChange={(e) => setResidentForm({ ...residentForm, tempatLahir: e.target.value })}
                    required
                    placeholder="Kota kelahiran..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={residentForm.tanggalLahir}
                    onChange={(e) => setResidentForm({ ...residentForm, tanggalLahir: e.target.value })}
                    required
                    placeholder="10 Januari 1985"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Usia</label>
                  <input
                    type="number"
                    value={residentForm.usia}
                    onChange={(e) => setResidentForm({ ...residentForm, usia: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={residentForm.pekerjaan}
                    onChange={(e) => setResidentForm({ ...residentForm, pekerjaan: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Status Warga</label>
                  <select
                    value={residentForm.status}
                    onChange={(e) => setResidentForm({ ...residentForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Tetap">Tetap</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Meninggal">Meninggal</option>
                    <option value="Cerai">Cerai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Pendidikan</label>
                  <select
                    value={residentForm.pendidikan}
                    onChange={(e) => setResidentForm({ ...residentForm, pendidikan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="D3/S1">D3/S1</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Kendaraan</label>
                  <select
                    value={residentForm.kendaraan}
                    onChange={(e) => setResidentForm({ ...residentForm, kendaraan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Motor 1">Motor 1</option>
                    <option value="Mobil 1">Mobil 1</option>
                    <option value="Mobil 2+">Mobil 2+</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Listrik</label>
                  <select
                    value={residentForm.listrik}
                    onChange={(e) => setResidentForm({ ...residentForm, listrik: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="450VA">450VA</option>
                    <option value="900VA">900VA</option>
                    <option value="1300VA">1300VA</option>
                    <option value="2200VA+">2200VA+</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Internet</label>
                  <select
                    value={residentForm.internet}
                    onChange={(e) => setResidentForm({ ...residentForm, internet: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="IndiHome">IndiHome</option>
                    <option value="FirstMedia">FirstMedia</option>
                    <option value="XL Home">XL Home</option>
                    <option value="Seluler/Orbit">Seluler/Orbit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-600 mb-1">Air Bersih</label>
                  <select
                    value={residentForm.air}
                    onChange={(e) => setResidentForm({ ...residentForm, air: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="PAM / AETRA">PAM / AETRA</option>
                    <option value="Sumur Bor">Sumur Bor</option>
                    <option value="Galon / Isi Ulang">Galon / Isi Ulang</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalResidentForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Simpan Data Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PENGURUS FORM */}
      {modalPengurusForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {isEditingPengurus ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
              </h3>
              <button
                onClick={() => setModalPengurusForm(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSavePengurus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  value={pengurusForm.nama}
                  onChange={(e) => setPengurusForm({ ...pengurusForm, nama: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Jabatan</label>
                <input
                  type="text"
                  value={pengurusForm.jabatan}
                  onChange={(e) => setPengurusForm({ ...pengurusForm, jabatan: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Tugas / Otoritas Khusus
                </label>
                <textarea
                  value={pengurusForm.tugas}
                  onChange={(e) => setPengurusForm({ ...pengurusForm, tugas: e.target.value })}
                  rows={2}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                ></textarea>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalPengurusForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROKER FORM */}
      {modalProkerForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {isEditingProker ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
              </h3>
              <button
                onClick={() => setModalProkerForm(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProker} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Kategori Program Kerja
                </label>
                <select
                  value={prokerForm.kategori}
                  onChange={(e) => setProkerForm({ ...prokerForm, kategori: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
                >
                  <option value="Pendek">Jangka Pendek (1 - 3 Bulan)</option>
                  <option value="Menengah">Jangka Menengah (6 Bulan - 1 Tahun)</option>
                  <option value="Panjang">Jangka Panjang (2 - 5 Tahun)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Judul Program Kerja
                </label>
                <input
                  type="text"
                  value={prokerForm.judul}
                  onChange={(e) => setProkerForm({ ...prokerForm, judul: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Deskripsi Lengkap</label>
                <textarea
                  value={prokerForm.deskripsi}
                  onChange={(e) => setProkerForm({ ...prokerForm, deskripsi: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                ></textarea>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalProkerForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VISI & MISI FORM */}
      {modalVisiMisiForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {misiModalEditMode ? 'Edit / Tambah Misi RT' : 'Edit Visi RT'}
              </h3>
              <button
                onClick={() => setModalVisiMisiForm(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveVisiMisi} className="space-y-4">
              {!misiModalEditMode ? (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Teks Visi RT</label>
                  <textarea
                    value={tempVisiText}
                    onChange={(e) => setTempVisiText(e.target.value)}
                    rows={3}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  ></textarea>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Teks Butir Misi</label>
                  <textarea
                    value={tempMisiTeks}
                    onChange={(e) => setTempMisiTeks(e.target.value)}
                    rows={3}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  ></textarea>
                </div>
              )}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalVisiMisiForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONTAK FORM */}
      {modalKontakForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Edit Kontak & Lokasi RT</h3>
              <button
                onClick={() => setModalKontakForm(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveKontak} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Alamat Sekretariat</label>
                <textarea
                  value={tempKontak.alamat}
                  onChange={(e) => setTempKontak({ ...tempKontak, alamat: e.target.value })}
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Hotline Ketua RT</label>
                <input
                  type="text"
                  value={tempKontak.hotline}
                  onChange={(e) => setTempKontak({ ...tempKontak, hotline: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email Resmi</label>
                <input
                  type="text"
                  value={tempKontak.email}
                  onChange={(e) => setTempKontak({ ...tempKontak, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Nama Lokasi</label>
                <input
                  type="text"
                  value={tempKontak.lokasiNama}
                  onChange={(e) => setTempKontak({ ...tempKontak, lokasiNama: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Detail Wilayah</label>
                <input
                  type="text"
                  value={tempKontak.lokasiDetail}
                  onChange={(e) => setTempKontak({ ...tempKontak, lokasiDetail: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Google Maps URL</label>
                <input
                  type="text"
                  value={tempKontak.gmapsUrl}
                  onChange={(e) => setTempKontak({ ...tempKontak, gmapsUrl: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalKontakForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Simpan Kontak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KAS TRANSACTION */}
      {modalTransactionForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Catat Transaksi Kas Baru</h3>
              <button
                onClick={() => setModalTransactionForm(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Jenis Transaksi</label>
                <select
                  value={transactionForm.jenis}
                  onChange={(e) =>
                    setTransactionForm({ ...transactionForm, jenis: e.target.value as any })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
                >
                  <option value="Pemasukan">Pemasukan (+)</option>
                  <option value="Pengeluaran">Pengeluaran (-)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Kategori</label>
                <input
                  type="text"
                  value={transactionForm.kategori}
                  onChange={(e) => setTransactionForm({ ...transactionForm, kategori: e.target.value })}
                  required
                  placeholder="Contoh: Iuran Warga / Perbaikan"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Keterangan Detail
                </label>
                <input
                  type="text"
                  value={transactionForm.ket}
                  onChange={(e) => setTransactionForm({ ...transactionForm, ket: e.target.value })}
                  required
                  placeholder="Rincian transaksi kas..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  value={transactionForm.nominal}
                  onChange={(e) => setTransactionForm({ ...transactionForm, nominal: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalTransactionForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGENDA FORM */}
      {modalAgendaForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Tambah Agenda Baru</h3>
              <button
                onClick={() => setModalAgendaForm(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAgenda} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Judul Kegiatan / Agenda
                </label>
                <input
                  type="text"
                  value={agendaForm.judul}
                  onChange={(e) => setAgendaForm({ ...agendaForm, judul: e.target.value })}
                  required
                  placeholder="Contoh: Kerja Bakti Blok A"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Hari & Tanggal
                </label>
                <input
                  type="text"
                  value={agendaForm.tanggal}
                  onChange={(e) => setAgendaForm({ ...agendaForm, tanggal: e.target.value })}
                  required
                  placeholder="Contoh: Minggu, 25 Okt 2026"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Waktu</label>
                <input
                  type="text"
                  value={agendaForm.waktu}
                  onChange={(e) => setAgendaForm({ ...agendaForm, waktu: e.target.value })}
                  required
                  placeholder="Contoh: 08.00 - 11.00 WIB"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={agendaForm.lokasi}
                  onChange={(e) => setAgendaForm({ ...agendaForm, lokasi: e.target.value })}
                  required
                  placeholder="Contoh: Balai Warga RT 04"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalAgendaForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VERIFIKASI QR CODE DIGITAL */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full">
                Sistem Validasi Resmi
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-2">Dokumen Terverifikasi Sah</h3>
              <p className="text-xs text-slate-500 mt-1">
                Surat Resmi Rukun Tetangga 04 / Rukun Warga 12 Perumahan Taman Buah Sukamantri
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Kode Validasi:</span>
                <span className="font-mono font-bold text-emerald-800">{verificationCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Jenis Dokumen:</span>
                <span className="font-semibold text-slate-900">{suratForm.jenis}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Nama Pemohon:</span>
                <span className="font-semibold text-slate-900">{suratForm.nama}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">NIK:</span>
                <span className="font-mono text-slate-900">{suratForm.nik}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Validasi:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resmi & Aktif
                </span>
              </div>
            </div>

            <button
              onClick={() => setVerifyModalOpen(false)}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl text-xs transition cursor-pointer"
            >
              Tutup Status Validasi
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastShow && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-2 border border-slate-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-800 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-xs">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">RT 04 / RW 12 Perumahan Taman Buah Sukamantri</p>
              <p className="text-xs text-slate-500 mt-0.5">Kecamatan Pasar Kemis, Kabupaten Tangerang, Banten</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button
              onClick={() => {
                if (window.confirm('Reset data portal kembali ke data contoh default?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="hover:text-emerald-700 underline cursor-pointer"
            >
              Reset Data Contoh
            </button>
            <span>&copy; 2026 Portal Warga RT 04. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
