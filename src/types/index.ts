export type Role = 'pengurus' | 'warga';

export interface User {
  nama: string;
  role: Role;
  jabatan?: string;
  nik?: string;
}

export type StatusWarga = 'Tetap' | 'Kontrak' | 'Meninggal' | 'Cerai';
export type Gender = 'Laki-Laki' | 'Perempuan';
export type Agama = 'Islam' | 'Kristen' | 'Katholik' | 'Hindu' | 'Budha' | 'Konghucu';

export interface Resident {
  id: number;
  nik: string;
  nama: string;
  rumah: string;
  gender: Gender;
  agama: Agama | string;
  pekerjaan: string;
  status: StatusWarga;
  pendidikan: string;
  usia: number;
  tempatLahir: string;
  tanggalLahir: string;
  kendaraan: string;
  listrik: string;
  internet: string;
  air: string;
}

export interface Pengurus {
  id: number;
  nama: string;
  jabatan: string;
  tugas: string;
  icon: string;
}

export type ProkerKategori = 'Pendek' | 'Menengah' | 'Panjang';

export interface Proker {
  id: number;
  kategori: ProkerKategori;
  judul: string;
  deskripsi: string;
  icon: string;
}

export interface Misi {
  id: number;
  teks: string;
}

export interface KontakInfo {
  alamat: string;
  hotline: string;
  email: string;
  lokasiNama: string;
  lokasiDetail: string;
  gmapsUrl: string;
}

export type TransaksiJenis = 'Pemasukan' | 'Pengeluaran';

export interface KasTransaction {
  id: number;
  tanggal: string;
  ket: string;
  kategori: string;
  jenis: TransaksiJenis;
  nominal: number;
}

export interface Agenda {
  id: number;
  judul: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  status: string;
}

export interface Aspirasi {
  id: number;
  nama: string;
  rumah: string;
  kategori: string;
  pesan: string;
  tanggal: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai';
}

export interface SuratFormData {
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  gender: string;
  agama: string;
  pekerjaan: string;
  usia: string | number;
  rumah: string;
  jenis: string;
  keperluan: string;
}
