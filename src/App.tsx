import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ChevronLeft, Check, Send, 
  School, Target, Clock, Users, Box, Lightbulb, TrendingUp, Info,
  FileText, MessageCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type FormData = {
  // A
  // A
  namaSekolah: string;
  kategori: string;
  daerah: string;
  namaGuru: string;
  jawatan: string;
  noTelefon: string;
  emel: string;
  // B
  tujuan: string[];
  tarikhKejohanan: string;
  peringkatKejohanan: string;
  mingguSebelumKejohanan: string;
  // C
  tempohSesi: string;
  bilanganSlot: string;
  kekerapan: string;
  hariPilihan: string[];
  masaSesuai: string;
  tarikhMula: string;
  // D
  tahunSasaran: string;
  anggaranPelajar: string;
  tahapPelajar: string;
  pelajarKomited: string;
  adaPemainUtama: string;
  pencapaianTerakhir: string;
  // E
  jumlahSetCatur: string;
  adaPapanDemo: string;
  adaProjector: string;
  adaRuangKhas: string;
  perluBawaPeralatan: string;
  // F
  jangkaanSekolah: string;
  // G
  perancanganSusulan: string;
};

const initialFormData: FormData = {
  namaSekolah: '', kategori: '', daerah: '', namaGuru: '', jawatan: '', noTelefon: '', emel: '',
  tujuan: [], tarikhKejohanan: '', peringkatKejohanan: '', mingguSebelumKejohanan: '',
  tempohSesi: '', bilanganSlot: '', kekerapan: '', hariPilihan: [], masaSesuai: '', tarikhMula: '',
  tahunSasaran: '', anggaranPelajar: '', tahapPelajar: '', pelajarKomited: '', adaPemainUtama: '', pencapaianTerakhir: '',
  jumlahSetCatur: '', adaPapanDemo: '', adaProjector: '', adaRuangKhas: '', perluBawaPeralatan: '',
  jangkaanSekolah: '',
  perancanganSusulan: '',
};

const SECTIONS = [
  { id: 'A', title: 'Maklumat Asas', icon: School },
  { id: 'B', title: 'Tujuan Program', icon: Target },
  { id: 'C', title: 'Struktur Masa', icon: Clock },
  { id: 'D', title: 'Profil Pelajar', icon: Users },
  { id: 'E', title: 'Kemudahan', icon: Box },
  { id: 'F', title: 'Jangkaan', icon: Lightbulb },
  { id: 'G', title: 'Susulan', icon: TrendingUp },
];

export default function App() {
  const [step, setStep] = useState(0); // 0 is Hero, 1-7 are Sections, 8 is Summary
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const updateForm = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'tujuan' | 'hariPilihan', item: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 8));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, send data to server here
    console.log('Form Submitted:', formData);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      
      // --- WATERMARK ---
      try {
        const imgUrl = "https://raw.githubusercontent.com/luqmanjuhar/kamus-catur-portal/0817c7e9adff47b3ab7528bfd37c80630066463c/LOGO%20LANDSCAPE%20(2).png";
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const base64data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        
        doc.setGState(new (doc as any).GState({opacity: 0.15}));
        doc.addImage(base64data, 'PNG', 45, 88.5, 120, 120);
        doc.setGState(new (doc as any).GState({opacity: 1}));
      } catch (error) {
        console.error("Error loading watermark image:", error);
      }
      // -----------------
      
      doc.setFontSize(18);
      doc.setTextColor(234, 88, 12); // text-orange-600
      doc.text('Laporan Perancangan Program Catur Sekolah', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tarikh: ${new Date().toLocaleDateString('ms-MY')}`, 14, 30);
    
    const tableOptions = {
      headStyles: { fillColor: [249, 115, 22] as [number, number, number], textColor: 255, fontStyle: 'bold' as const }, // bg-orange-500
      alternateRowStyles: { fillColor: [255, 247, 237] as [number, number, number] }, // bg-orange-50
      styles: { fontSize: 10, cellPadding: 5 },
      margin: { top: 10 },
    };

    autoTable(doc, {
      startY: 38,
      head: [['Seksyen A: Maklumat Asas', 'Butiran']],
      body: [
        ['Nama Sekolah', formData.namaSekolah],
        ['Kategori', formData.kategori],
        ['Daerah', formData.daerah],
        ['Guru Bertanggungjawab', `${formData.namaGuru} (${formData.jawatan})`],
        ['No Telefon', formData.noTelefon],
        ['Emel', formData.emel],
      ],
      ...tableOptions
    });

    autoTable(doc, {
      head: [['Seksyen B: Tujuan Program', 'Butiran']],
      body: [
        ['Tujuan', formData.tujuan.join(', ')],
        ...(formData.tujuan.includes("Persiapan kejohanan") ? [
          ['Tarikh Kejohanan', formData.tarikhKejohanan],
          ['Peringkat', formData.peringkatKejohanan],
          ['Minggu Sebelum', formData.mingguSebelumKejohanan],
        ] : []),
      ],
      ...tableOptions
    });

    autoTable(doc, {
      head: [['Seksyen C: Struktur Masa & Slot', 'Butiran']],
      body: [
        ['Tempoh Sesi', formData.tempohSesi],
        ['Bilangan Slot', formData.bilanganSlot],
        ['Kekerapan', formData.kekerapan],
        ['Hari Pilihan', formData.hariPilihan.join(', ')],
        ['Masa Sesuai', formData.masaSesuai],
        ['Tarikh Mula', formData.tarikhMula],
      ],
      ...tableOptions
    });

    autoTable(doc, {
      head: [['Seksyen D: Profil Pelajar', 'Butiran']],
      body: [
        ['Tahun/Tingkatan Sasaran', formData.tahunSasaran],
        ['Anggaran Pelajar', formData.anggaranPelajar],
        ['Tahap Pelajar', formData.tahapPelajar],
        ['Pelajar Komited', formData.pelajarKomited],
        ['Ada Pemain Utama?', formData.adaPemainUtama],
        ...(formData.adaPemainUtama === 'Ya' ? [['Pencapaian Terakhir', formData.pencapaianTerakhir]] : []),
      ],
      ...tableOptions
    });

    autoTable(doc, {
      head: [['Seksyen E: Kemudahan & Logistik', 'Butiran']],
      body: [
        ['Jumlah Set Catur', formData.jumlahSetCatur],
        ['Papan Demo', formData.adaPapanDemo],
        ['Projector', formData.adaProjector],
        ['Ruang Khas', formData.adaRuangKhas],
        ['Perlu Bawa Peralatan', formData.perluBawaPeralatan],
      ],
      ...tableOptions
    });

    autoTable(doc, {
      head: [['Seksyen F & G: Jangkaan & Susulan', 'Butiran']],
      body: [
        ['Jangkaan Sekolah', formData.jangkaanSekolah],
        ['Perancangan Susulan', formData.perancanganSusulan],
      ],
      ...tableOptions
    });

    doc.save(`Perancangan_Catur_${formData.namaSekolah.replace(/\s+/g, '_') || 'Sekolah'}.pdf`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendWhatsApp = () => {
    // Sila tukar nombor ini kepada nombor WhatsApp Kamus Catur yang sebenar
    const phone = "60182046224"; 
    
    let text = `*BORANG PERANCANGAN PROGRAM CATUR SEKOLAH*\n\n`;
    
    text += `*A. MAKLUMAT ASAS*\n`;
    text += `Sekolah: ${formData.namaSekolah}\n`;
    text += `Kategori: ${formData.kategori}\n`;
    text += `Daerah: ${formData.daerah}\n`;
    text += `Guru: ${formData.namaGuru} (${formData.jawatan})\n`;
    text += `No Tel: ${formData.noTelefon}\n`;
    text += `Emel: ${formData.emel}\n\n`;
    
    text += `*B. TUJUAN PROGRAM*\n`;
    text += `Tujuan: ${formData.tujuan.join(', ')}\n`;
    if (formData.tujuan.includes("Persiapan kejohanan")) {
      text += `Tarikh Kejohanan: ${formData.tarikhKejohanan}\n`;
      text += `Peringkat: ${formData.peringkatKejohanan}\n`;
      text += `Minggu Sebelum: ${formData.mingguSebelumKejohanan}\n`;
    }
    text += `\n`;
    
    text += `*C. STRUKTUR MASA & SLOT*\n`;
    text += `Tempoh Sesi: ${formData.tempohSesi}\n`;
    text += `Bilangan Slot: ${formData.bilanganSlot}\n`;
    text += `Kekerapan: ${formData.kekerapan}\n`;
    text += `Hari Pilihan: ${formData.hariPilihan.join(', ')}\n`;
    text += `Masa Sesuai: ${formData.masaSesuai}\n`;
    text += `Tarikh Mula: ${formData.tarikhMula}\n\n`;
    
    text += `*D. PROFIL PELAJAR*\n`;
    text += `Sasaran: ${formData.tahunSasaran}\n`;
    text += `Anggaran Pelajar: ${formData.anggaranPelajar}\n`;
    text += `Tahap Pelajar: ${formData.tahapPelajar}\n`;
    text += `Pelajar Komited: ${formData.pelajarKomited}\n`;
    text += `Ada Pemain Utama: ${formData.adaPemainUtama}\n`;
    if (formData.adaPemainUtama === 'Ya') {
      text += `Pencapaian Terakhir: ${formData.pencapaianTerakhir}\n`;
    }
    text += `\n`;
    
    text += `*E. KEMUDAHAN & LOGISTIK*\n`;
    text += `Jumlah Set Catur: ${formData.jumlahSetCatur}\n`;
    text += `Papan Demo: ${formData.adaPapanDemo}\n`;
    text += `Projector: ${formData.adaProjector}\n`;
    text += `Ruang Khas: ${formData.adaRuangKhas}\n`;
    text += `Perlu Bawa Peralatan: ${formData.perluBawaPeralatan}\n\n`;
    
    text += `*F. JANGKAAN SEKOLAH*\n`;
    text += `${formData.jangkaanSekolah}\n\n`;
    
    text += `*G. PERANCANGAN SUSULAN*\n`;
    text += `${formData.perancanganSusulan}`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
  };

  const renderHero = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <div className="mb-8">
        <img 
          src="https://raw.githubusercontent.com/luqmanjuhar/kamus-catur-portal/0817c7e9adff47b3ab7528bfd37c80630066463c/LOGO%20LANDSCAPE%20(2).png" 
          alt="Logo Kamus Catur" 
          className="w-64 md:w-80 h-auto drop-shadow-xl"
          referrerPolicy="no-referrer"
        />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
        Borang Perancangan <br className="hidden md:block" />
        <span className="text-orange-500">Program Catur Sekolah</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed">
        Sila lengkapkan maklumat berikut bagi membantu pihak jurulatih merancang program latihan yang sesuai dengan keperluan sekolah anda.
      </p>
      <button 
        onClick={nextStep}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1"
      >
        Mulakan Borang <ChevronRight className="w-5 h-5" />
      </button>
      <div className="mt-12 text-sm text-gray-400 font-medium tracking-widest uppercase">
        Kamus Catur
      </div>
    </motion.div>
  );

  const renderSectionA = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <School className="text-orange-500" /> Seksyen A: Maklumat Asas Sekolah
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah</label>
          <input type="text" value={formData.namaSekolah} onChange={e => updateForm('namaSekolah', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Contoh: SK Taman Tun Dr Ismail 1" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select value={formData.kategori} onChange={e => updateForm('kategori', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white">
              <option value="">Pilih Kategori</option>
              <option value="Rendah">Sekolah Rendah</option>
              <option value="Menengah">Sekolah Menengah</option>
              <option value="Swasta">Sekolah Swasta / Antarabangsa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daerah</label>
            <input type="text" value={formData.daerah} onChange={e => updateForm('daerah', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Contoh: Petaling Perdana" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Guru Bertanggungjawab</label>
          <input type="text" value={formData.namaGuru} onChange={e => updateForm('namaGuru', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Nama penuh guru" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jawatan</label>
            <input type="text" value={formData.jawatan} onChange={e => updateForm('jawatan', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Contoh: Guru Penasihat" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Telefon</label>
            <input type="tel" value={formData.noTelefon} onChange={e => updateForm('noTelefon', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="01X-XXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emel</label>
            <input type="email" value={formData.emel} onChange={e => updateForm('emel', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="guru@sekolah.edu.my" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionB = () => {
    const tujuanOptions = [
      "Sekadar pendedahan asas catur",
      "Bengkel 1–3 jam",
      "Penubuhan kelab catur",
      "Latihan berkala",
      "Persiapan kejohanan",
      "Mencari bakat berpotensi",
      "Aktiviti kokurikulum tambahan"
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Target className="text-orange-500" /> Seksyen B: Tujuan Sebenar Program
        </h2>
        
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih tujuan program (Boleh pilih lebih dari satu)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tujuanOptions.map(opt => (
              <label key={opt} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.tujuan.includes(opt) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                <div className="mt-0.5 flex-shrink-0">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.tujuan.includes(opt) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                    {formData.tujuan.includes(opt) && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <span className={`text-sm ${formData.tujuan.includes(opt) ? 'font-medium text-orange-900' : 'text-gray-700'}`}>{opt}</span>
                <input type="checkbox" className="hidden" checked={formData.tujuan.includes(opt)} onChange={() => toggleArrayItem('tujuan', opt)} />
              </label>
            ))}
          </div>

          {formData.tujuan.includes("Persiapan kejohanan") && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-5 bg-orange-50 rounded-xl border border-orange-100 space-y-4">
              <h3 className="font-semibold text-orange-900 mb-2">Maklumat Kejohanan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh Kejohanan</label>
                  <input type="date" value={formData.tarikhKejohanan} onChange={e => updateForm('tarikhKejohanan', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peringkat</label>
                  <select value={formData.peringkatKejohanan} onChange={e => updateForm('peringkatKejohanan', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white">
                    <option value="">Pilih Peringkat</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Daerah">Daerah</option>
                    <option value="Negeri">Negeri</option>
                    <option value="MSSM">MSSM</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minggu Sebelum Kejohanan</label>
                  <input type="number" min="1" value={formData.mingguSebelumKejohanan} onChange={e => updateForm('mingguSebelumKejohanan', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white" placeholder="Cth: 4" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  const renderSectionC = () => {
    const hariOptions = ["Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu", "Ahad"];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Clock className="text-orange-500" /> Seksyen C: Struktur Masa & Slot
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tempoh setiap sesi</label>
            <div className="space-y-2">
              {["1 Jam", "2 Jam", "3 Jam"].map(opt => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.tempohSesi === opt ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                  <input type="radio" name="tempohSesi" value={opt} checked={formData.tempohSesi === opt} onChange={e => updateForm('tempohSesi', e.target.value)} className="text-orange-500 focus:ring-orange-500" />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bilangan slot dirancang</label>
            <div className="space-y-2">
              {["1 Slot", "2–4 Slot", "5–8 Slot", "Lebih 8 Slot"].map(opt => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.bilanganSlot === opt ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                  <input type="radio" name="bilanganSlot" value={opt} checked={formData.bilanganSlot === opt} onChange={e => updateForm('bilanganSlot', e.target.value)} className="text-orange-500 focus:ring-orange-500" />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kekerapan</label>
            <div className="space-y-2">
              {["Sekali sahaja", "Mingguan", "Dua kali sebulan", "Intensif (Beberapa hari berturut)"].map(opt => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.kekerapan === opt ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                  <input type="radio" name="kekerapan" value={opt} checked={formData.kekerapan === opt} onChange={e => updateForm('kekerapan', e.target.value)} className="text-orange-500 focus:ring-orange-500" />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hari pilihan (Boleh pilih lebih dari satu)</label>
              <div className="flex flex-wrap gap-2">
                {hariOptions.map(hari => (
                  <button
                    key={hari}
                    type="button"
                    onClick={() => toggleArrayItem('hariPilihan', hari)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.hariPilihan.includes(hari) ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {hari}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Masa sesuai</label>
                <input type="time" value={formData.masaSesuai} onChange={e => updateForm('masaSesuai', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh mula cadangan</label>
                <input type="date" value={formData.tarikhMula} onChange={e => updateForm('tarikhMula', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSectionD = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Users className="text-orange-500" /> Seksyen D: Profil Pelajar
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun / Tingkatan sasaran</label>
          <input type="text" value={formData.tahunSasaran} onChange={e => updateForm('tahunSasaran', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Contoh: Tahun 4-6 / Tingkatan 1-3" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anggaran jumlah pelajar</label>
          <input type="number" min="1" value={formData.anggaranPelajar} onChange={e => updateForm('anggaranPelajar', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Contoh: 30" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tahap sebenar pelajar</label>
          <div className="space-y-2">
            {["Zero langsung", "Tahu gerakan asas sahaja", "Sudah bermain secara aktif", "Sudah menyertai pertandingan"].map(opt => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.tahapPelajar === opt ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                <input type="radio" name="tahapPelajar" value={opt} checked={formData.tahapPelajar === opt} onChange={e => updateForm('tahapPelajar', e.target.value)} className="text-orange-500 focus:ring-orange-500" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Berapa orang yang benar-benar komited?</label>
            <input type="number" min="0" value={formData.pelajarKomited} onChange={e => updateForm('pelajarKomited', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Anggaran pelajar komited" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adakah sekolah sudah mempunyai pemain utama?</label>
            <div className="flex gap-4">
              {["Ya", "Tidak"].map(opt => (
                <label key={opt} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.adaPemainUtama === opt ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium' : 'border-gray-200 hover:border-orange-200 text-gray-600'}`}>
                  <input type="radio" name="adaPemainUtama" value={opt} checked={formData.adaPemainUtama === opt} onChange={e => updateForm('adaPemainUtama', e.target.value)} className="hidden" />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {formData.adaPemainUtama === 'Ya' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nyatakan pencapaian terakhir</label>
              <textarea value={formData.pencapaianTerakhir} onChange={e => updateForm('pencapaianTerakhir', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all min-h-[80px]" placeholder="Contoh: Johan Daerah 2023" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSectionE = () => {
    const booleanOptions = ["Ya", "Tidak"];
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Box className="text-orange-500" /> Seksyen E: Kemudahan & Logistik
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah set catur tersedia di sekolah</label>
            <input type="number" min="0" value={formData.jumlahSetCatur} onChange={e => updateForm('jumlahSetCatur', e.target.value)} className="w-full md:w-1/2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Contoh: 10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'adaPapanDemo', label: 'Ada papan demo besar?' },
              { id: 'adaProjector', label: 'Ada projector?' },
              { id: 'adaRuangKhas', label: 'Ada ruang khas/bilik catur?' },
              { id: 'perluBawaPeralatan', label: 'Perlu jurulatih bawa semua peralatan?' },
            ].map(item => (
              <div key={item.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{item.label}</label>
                <div className="flex gap-4">
                  {booleanOptions.map(opt => (
                    <label key={opt} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData[item.id as keyof FormData] === opt ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium' : 'border-gray-200 hover:border-orange-200 text-gray-600'}`}>
                      <input type="radio" name={item.id} value={opt} checked={formData[item.id as keyof FormData] === opt} onChange={e => updateForm(item.id as keyof FormData, e.target.value)} className="hidden" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSectionF = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Lightbulb className="text-orange-500" /> Seksyen F: Jangkaan Pihak Sekolah
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Apakah hasil yang pihak sekolah harapkan selepas program?</label>
        <textarea 
          value={formData.jangkaanSekolah} 
          onChange={e => updateForm('jangkaanSekolah', e.target.value)} 
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all min-h-[150px] resize-y" 
          placeholder="Sila nyatakan harapan dan objektif utama sekolah..." 
        />
        <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
          <p>Contoh: Dapat hantar wakil kejohanan, tubuhkan kelab aktif, atau sekadar pendedahan asas kepada murid-murid tahap 2.</p>
        </div>
      </div>
    </div>
  );

  const renderSectionG = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <TrendingUp className="text-orange-500" /> Seksyen G: Perancangan Susulan
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Selepas program ini, pihak sekolah bercadang untuk:</label>
        <div className="space-y-3">
          {["Tamat setakat program ini sahaja", "Sambung latihan berkala", "Fokus khas kepada pasukan kejohanan", "Masih dalam perbincangan"].map(opt => (
            <label key={opt} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.perancanganSusulan === opt ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 hover:border-orange-200'}`}>
              <input type="radio" name="perancanganSusulan" value={opt} checked={formData.perancanganSusulan === opt} onChange={e => updateForm('perancanganSusulan', e.target.value)} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300" />
              <span className={`text-base ${formData.perancanganSusulan === opt ? 'font-medium text-orange-900' : 'text-gray-700'}`}>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSummary = () => {
    const SummaryItem = ({ label, value }: { label: string, value: any }) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return null;
      return (
        <div className="py-3 border-b border-gray-100 last:border-0">
          <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
          <dd className="text-base text-gray-900 font-medium">
            {Array.isArray(value) ? value.join(', ') : value}
          </dd>
        </div>
      );
    };

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Semakan Terakhir</h2>
          <p className="text-gray-500 mt-2">Sila semak maklumat sebelum menghantar borang.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <School className="w-5 h-5 text-orange-500" /> Maklumat Asas
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryItem label="Nama Sekolah" value={formData.namaSekolah} />
            <SummaryItem label="Kategori" value={formData.kategori} />
            <SummaryItem label="Daerah" value={formData.daerah} />
            <SummaryItem label="Guru Bertanggungjawab" value={`${formData.namaGuru} (${formData.jawatan})`} />
            <SummaryItem label="No Telefon" value={formData.noTelefon} />
            <SummaryItem label="Emel" value={formData.emel} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" /> Program & Masa
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryItem label="Tujuan Program" value={formData.tujuan} />
            {formData.tujuan.includes("Persiapan kejohanan") && (
              <>
                <SummaryItem label="Tarikh Kejohanan" value={formData.tarikhKejohanan} />
                <SummaryItem label="Peringkat" value={formData.peringkatKejohanan} />
              </>
            )}
            <SummaryItem label="Tempoh Sesi" value={formData.tempohSesi} />
            <SummaryItem label="Bilangan Slot" value={formData.bilanganSlot} />
            <SummaryItem label="Kekerapan" value={formData.kekerapan} />
            <SummaryItem label="Hari Pilihan" value={formData.hariPilihan} />
            <SummaryItem label="Masa & Tarikh Mula" value={`${formData.masaSesuai} | ${formData.tarikhMula}`} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" /> Pelajar & Kemudahan
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryItem label="Sasaran" value={`${formData.tahunSasaran} (${formData.anggaranPelajar} pelajar)`} />
            <SummaryItem label="Tahap Pelajar" value={formData.tahapPelajar} />
            <SummaryItem label="Pelajar Komited" value={formData.pelajarKomited} />
            <SummaryItem label="Pemain Utama" value={formData.adaPemainUtama === 'Ya' ? `Ya - ${formData.pencapaianTerakhir}` : 'Tidak'} />
            <SummaryItem label="Jumlah Set Catur" value={formData.jumlahSetCatur} />
            <SummaryItem label="Papan Demo" value={formData.adaPapanDemo} />
            <SummaryItem label="Projector" value={formData.adaProjector} />
            <SummaryItem label="Ruang Khas" value={formData.adaRuangKhas} />
            <SummaryItem label="Perlu Bawa Peralatan" value={formData.perluBawaPeralatan} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-500" /> Jangkaan & Susulan
            </h3>
          </div>
          <div className="p-6">
            <SummaryItem label="Jangkaan Sekolah" value={formData.jangkaanSekolah} />
            <SummaryItem label="Perancangan Susulan" value={formData.perancanganSusulan} />
          </div>
        </div>

      </div>
    );
  };

  const renderSuccess = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} 
      className="text-center py-16 px-4 max-w-lg mx-auto"
    >
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Terima Kasih!</h2>
      <p className="text-lg text-gray-600 mb-8">
        Maklumat perancangan program catur sekolah anda telah berjaya disimpan. Sila muat turun laporan dan hantar kepada pihak jurulatih Kamus Catur.
      </p>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-900 hover:bg-gray-50 text-gray-900 px-6 py-4 rounded-xl font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-5 h-5" /> {isGeneratingPDF ? 'Menjana Laporan...' : 'Muat Turun Laporan (PDF)'}
        </button>
        
        <button 
          onClick={handleSendWhatsApp}
          className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-[#25D366]/30"
        >
          <MessageCircle className="w-5 h-5" /> Hantar ke WhatsApp
        </button>
      </div>

      <button 
        onClick={() => { setStep(0); setFormData(initialFormData); setIsSubmitted(false); }}
        className="text-gray-500 hover:text-gray-800 font-medium underline underline-offset-4 transition-colors"
      >
        Kembali ke Laman Utama
      </button>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderSectionA();
      case 2: return renderSectionB();
      case 3: return renderSectionC();
      case 4: return renderSectionD();
      case 5: return renderSectionE();
      case 6: return renderSectionF();
      case 7: return renderSectionG();
      case 8: return renderSummary();
      default: return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        {renderSuccess()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-orange-200 selection:text-orange-900">
      {step === 0 ? (
        renderHero()
      ) : (
        <div className="max-w-3xl mx-auto pt-8 pb-24 px-4 md:px-6">
          
          {/* Header & Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setStep(0)} className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-orange-500 transition-colors">
                <img 
                  src="https://raw.githubusercontent.com/luqmanjuhar/kamus-catur-portal/0817c7e9adff47b3ab7528bfd37c80630066463c/LOGO%20LANDSCAPE%20(2).png" 
                  alt="Logo" 
                  className="w-24 h-auto"
                  referrerPolicy="no-referrer"
                />
              </button>
              <div className="text-sm font-medium text-gray-500">
                Langkah {step} daripada 8
              </div>
            </div>
            
            <div className="flex gap-1 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-orange-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          {/* Main Card */}
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-gray-100"
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button 
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              disabled={step === 1}
            >
              <ChevronLeft className="w-5 h-5" /> Kembali
            </button>
            
            {step < 8 ? (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-gray-900/20"
              >
                Seterusnya <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-500/30"
              >
                Hantar Maklumat <Send className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {step === 8 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Maklumat ini akan membantu pihak jurulatih menyediakan cadangan modul latihan yang lebih tepat dan sesuai dengan situasi sebenar sekolah.
            </p>
          )}

        </div>
      )}
    </div>
  );
}
