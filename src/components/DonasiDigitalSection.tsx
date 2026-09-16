import React, { useState } from 'react';
import { 
  HeartHandshake, 
  QrCode, 
  CreditCard, 
  Building2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Printer, 
  Download, 
  Heart, 
  Sparkles, 
  ChevronRight,
  Receipt,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DonationRecord, DonationCategory } from '../types';
import { CHURCH_INFO, INITIAL_DONATIONS } from '../data/churchData';

interface DonasiDigitalSectionProps {
  isHighContrast: boolean;
}

export const DonasiDigitalSection: React.FC<DonasiDigitalSectionProps> = ({ isHighContrast }) => {
  const [activeTab, setActiveTab] = useState<'berikan' | 'transparansi'>('berikan');
  
  // Donation form states
  const [category, setCategory] = useState<DonationCategory>('persembahan_minggu');
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('100000');
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prayerWish, setPrayerWish] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_papua' | 'bca' | 'mandiri' | 'bri' | 'gopay'>('qris');

  // Completed Receipt state
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Recent donations list state
  const [donationsList, setDonationsList] = useState<DonationRecord[]>(INITIAL_DONATIONS);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];

  const categoryLabels: Record<DonationCategory, string> = {
    persembahan_minggu: 'Persembahan Syukur Ibadah',
    perpuluhan: 'Perpuluhan Warga Jemaat',
    pembangunan: 'Pembangunan Sarana & Gedung Gereja',
    diakonia_kasih: 'Diakonia Kasih (Lansia, Janda & Yatim)',
    janji_iman: 'Aksi komitmen sukrela jemaat',
    iuran_wajib: 'Aksi tiap Sidi Jemaat Gereja'
  };

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(raw);
    setAmount(Number(raw) || 0);
  };

  const handleCopyText = async (text: string, bankId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBank(bankId);
      setTimeout(() => setCopiedBank(null), 2500);
    } catch {
      setCopiedBank(bankId);
      setTimeout(() => setCopiedBank(null), 2500);
    }
  };

  const handleProcessDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Silakan tentukan nominal persembahan.');
      return;
    }

    const receiptNum = `GKI-PW-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: DonationRecord = {
      id: `don-${Date.now()}`,
      donorName: isAnonymous ? 'Hamba Allah' : (donorName || 'Warga Jemaat'),
      isAnonymous,
      category,
      categoryLabel: categoryLabels[category],
      amount,
      paymentMethod,
      paymentMethodName: 
        paymentMethod === 'qris' ? 'QRIS Indonesia' :
        paymentMethod === 'bank_papua' ? 'Bank Papua' :
        paymentMethod === 'bca' ? 'Bank Central Asia (BCA)' :
        paymentMethod === 'mandiri' ? 'Bank Mandiri' :
        paymentMethod === 'bri' ? 'Bank BRI' : 'GoPay / E-Wallet',
      timestamp: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIT',
      prayerWish,
      receiptNumber: receiptNum,
      status: 'Berhasil',
    };

    setReceipt(newDonation);
    setDonationsList([newDonation, ...donationsList]);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <section id="donasi-digital" className={`py-12 ${isHighContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-amber-700 font-extrabold text-xs uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Persembahan & Partisipasi Pelayanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-serif mt-2">
            Persembahan & Donasi Digital GKI Petrus Waena
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Mendukung kelancaran pelayanan gereja, diakonia kaum lansia, serta pembangunan sarana ibadah secara aman, praktis, dan transparan.
          </p>

          {/* Tab Selection */}
          <div className="flex items-center justify-center gap-2 mt-6 p-1 bg-slate-200 rounded-2xl w-fit mx-auto">
            <button
              onClick={() => { setActiveTab('berikan'); setReceipt(null); }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'berikan'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-blue-900'
              }`}
            >
              Kirim Persembahan
            </button>
            <button
              onClick={() => setActiveTab('transparansi')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'transparansi'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-blue-900'
              }`}
            >
              Transparansi Digital Real-Time
            </button>
          </div>
        </div>

        {activeTab === 'berikan' && (
          <div>
            {receipt ? (
              /* Generated e-Kwitansi Sah Digital */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                <div className="text-center pb-4 border-b border-slate-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                    Tanda Terima Sah Persembahan Digital
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    GKI Jemaat Petrus Waena
                  </h3>
                  <p className="text-xs text-slate-500">
                    "Tuhan memberkati orang yang memberi dengan sukacita." (2 Korintus 9:7)
                  </p>
                </div>

                {/* Receipt Details Box */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">Nomor Tanda Terima:</span>
                      <p className="font-mono font-black text-blue-900 text-base">{receipt.receiptNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Waktu Transaksi:</span>
                      <p className="text-xs font-semibold text-slate-700">{receipt.timestamp}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Nama Pemberi Persembahan:</span>
                      <strong className="text-sm text-slate-900 block">{receipt.donorName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Pos Peruntukan:</span>
                      <strong className="text-sm text-blue-900 block">{receipt.categoryLabel}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Metode Pembayaran:</span>
                      <span className="text-slate-800 font-semibold block">{receipt.paymentMethodName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Nominal Persembahan:</span>
                      <strong className="text-lg text-emerald-700 font-black block font-mono">
                        {formatRupiah(receipt.amount)}
                      </strong>
                    </div>
                  </div>

                  {receipt.prayerWish && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs italic text-slate-700">
                      <span className="font-bold text-slate-900 not-italic block mb-0.5">Pokok Doa & Syukur:</span>
                      "{receipt.prayerWish}"
                    </div>
                  )}

                  {/* Digital Stamp Simulation */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-blue-800" />
                      <span>Terverifikasi Otomatis Sistem BPKJ Jemaat</span>
                    </div>

                    <div className="border-2 border-dashed border-blue-800/40 text-blue-900 px-3 py-1 rounded-lg text-center transform -rotate-3 text-[10px] font-black uppercase">
                      ✓ SAH DISETOR
                    </div>
                  </div>
                </div>

                {/* Print & Return buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak / Simpan e-Kwitansi PDF</span>
                  </button>

                  <button
                    onClick={() => { setReceipt(null); }}
                    className="px-5 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Kirim Persembahan Baru
                  </button>
                </div>
              </div>
            ) : (
              /* Donation Form */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
                <form onSubmit={handleProcessDonation} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      1. Pilih Pos Peruntukan Persembahan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: 'persembahan_minggu', label: 'Persembahan Syukur Ibadah' },
                        { id: 'perpuluhan', label: 'Perpuluhan Warga Jemaat' },
                        { id: 'pembangunan', label: 'Pembangunan Gedung & Fasilitas' },
                        { id: 'diakonia_kasih', label: 'Diakonia Kasih (Lansia & Orang Sakit)' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setCategory(item.id as DonationCategory)}
                          className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                            category === item.id
                              ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      2. Tentukan Nominal Persembahan (Rp)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                      {presetAmounts.map((preset) => (
                        <button
                          type="button"
                          key={preset}
                          onClick={() => handleAmountSelect(preset)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                            amount === preset
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset >= 1000000 ? `${preset / 1000000} Jt` : `${preset / 1000}rb`}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <span className="absolute left-4 top-3 text-sm font-bold text-slate-500">Rp</span>
                      <input
                        type="text"
                        required
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Atau ketik nominal lainnya..."
                        className="w-full pl-12 pr-4 py-2.5 text-base font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      3. Pilih Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* QRIS */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qris')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          paymentMethod === 'qris'
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                          <QrCode className="w-4 h-4 text-emerald-600" />
                          <span>QRIS Indonesia</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">BCA, Mandiri, BRI, GoPay, OVO, Dana</p>
                      </button>

                      {/* Bank Papua */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank_papua')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          paymentMethod === 'bank_papua'
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                          <Building2 className="w-4 h-4 text-blue-700" />
                          <span>Bank Papua</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Transfer Rekening Resmi</p>
                      </button>

                      {/* BCA */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bca')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          paymentMethod === 'bca'
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span>Bank BCA</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Transfer Bank / Virtual Acc</p>
                      </button>

                      {/* Mandiri */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mandiri')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          paymentMethod === 'mandiri'
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                          <CreditCard className="w-4 h-4 text-amber-600" />
                          <span>Bank Mandiri</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Livin' Mandiri</p>
                      </button>

                      {/* BRI */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bri')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          paymentMethod === 'bri'
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                          <CreditCard className="w-4 h-4 text-blue-800" />
                          <span>Bank BRI</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">BRImo & ATM</p>
                      </button>

                      {/* GoPay */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('gopay')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          paymentMethod === 'gopay'
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                          <CreditCard className="w-4 h-4 text-sky-600" />
                          <span>E-Wallet</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">GoPay, OVO, DANA</p>
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Details Preview */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    {paymentMethod === 'qris' && (
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="p-2 bg-white rounded-xl border border-slate-300 shadow-xs flex flex-col items-center">
                          {/* QR Code graphic mockup */}
                          <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex flex-col justify-between text-white relative">
                            <div className="flex justify-between items-start">
                              <span className="w-6 h-6 border-2 border-white rounded-xs" />
                              <span className="text-[9px] font-bold tracking-widest text-amber-400">QRIS</span>
                              <span className="w-6 h-6 border-2 border-white rounded-xs" />
                            </div>
                            <div className="text-center my-auto">
                              <span className="text-xs font-serif font-black text-amber-300">† GKI</span>
                              <span className="block text-[8px] font-mono text-slate-300 mt-0.5">Petrus Waena</span>
                            </div>
                            <div className="flex justify-between items-end">
                              <span className="w-6 h-6 border-2 border-white rounded-xs" />
                              <span className="text-[8px] text-slate-400 font-mono">{CHURCH_INFO.qrisNmid}</span>
                              <span className="w-6 h-6 border-2 border-white rounded-xs" />
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 font-bold">Pindai dengan Aplikasi Apapun</span>
                        </div>

                        <div className="space-y-1.5 text-slate-700">
                          <p className="font-bold text-slate-900 text-sm">QRIS Dinamis GKI Petrus Waena</p>
                          <p className="text-slate-500">NMID: {CHURCH_INFO.qrisNmid}</p>
                          <p className="text-slate-500">Merchant: {CHURCH_INFO.qrisMerchantName}</p>
                          <p className="text-emerald-700 font-bold mt-1">
                            Nominal Otomatis: {formatRupiah(amount)}
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'bank_papua' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">Rekening Bank Papua</p>
                          <p className="text-base font-black font-mono text-blue-900 mt-0.5">{CHURCH_INFO.rekeningBank.bankPapua.number}</p>
                          <p className="text-slate-500 text-[11px]">a.n {CHURCH_INFO.rekeningBank.bankPapua.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(CHURCH_INFO.rekeningBank.bankPapua.number, 'bank_papua')}
                          className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-2 rounded-xl font-bold"
                        >
                          {copiedBank === 'bank_papua' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBank === 'bank_papua' ? 'Tersalin!' : 'Salin Rekening'}</span>
                        </button>
                      </div>
                    )}

                    {paymentMethod === 'bca' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">Rekening Bank Central Asia (BCA)</p>
                          <p className="text-base font-black font-mono text-blue-900 mt-0.5">{CHURCH_INFO.rekeningBank.bca.number}</p>
                          <p className="text-slate-500 text-[11px]">a.n {CHURCH_INFO.rekeningBank.bca.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(CHURCH_INFO.rekeningBank.bca.number, 'bca')}
                          className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-2 rounded-xl font-bold"
                        >
                          {copiedBank === 'bca' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBank === 'bca' ? 'Tersalin!' : 'Salin Rekening'}</span>
                        </button>
                      </div>
                    )}

                    {paymentMethod === 'mandiri' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">Rekening Bank Mandiri</p>
                          <p className="text-base font-black font-mono text-blue-900 mt-0.5">{CHURCH_INFO.rekeningBank.mandiri.number}</p>
                          <p className="text-slate-500 text-[11px]">a.n {CHURCH_INFO.rekeningBank.mandiri.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(CHURCH_INFO.rekeningBank.mandiri.number, 'mandiri')}
                          className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-2 rounded-xl font-bold"
                        >
                          {copiedBank === 'mandiri' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBank === 'mandiri' ? 'Tersalin!' : 'Salin Rekening'}</span>
                        </button>
                      </div>
                    )}

                    {paymentMethod === 'bri' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">Rekening Bank BRI</p>
                          <p className="text-base font-black font-mono text-blue-900 mt-0.5">{CHURCH_INFO.rekeningBank.bri.number}</p>
                          <p className="text-slate-500 text-[11px]">a.n {CHURCH_INFO.rekeningBank.bri.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(CHURCH_INFO.rekeningBank.bri.number, 'bri')}
                          className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-2 rounded-xl font-bold"
                        >
                          {copiedBank === 'bri' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBank === 'bri' ? 'Tersalin!' : 'Salin Rekening'}</span>
                        </button>
                      </div>
                    )}

                    {paymentMethod === 'gopay' && (
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">E-Wallet (GoPay, OVO, DANA, ShopeePay)</p>
                        <p className="text-slate-600">
                          Buka aplikasi e-wallet pilihan Anda, pilih scan QRIS dan pindai kode QR di atas atau gunakan transfer bank ke rekening penampungan jemaat.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Donor Info & Prayer Wish */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        4. Identitas & Pokok Syukur
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          isAnonymous ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {isAnonymous ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isAnonymous ? 'Anonim (Hamba Allah)' : 'Sembunyikan Nama (Anonim)'}</span>
                      </button>
                    </div>

                    {!isAnonymous && (
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Nama Lengkap / Keluarga (contoh: Kel. Rumbiak)..."
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    )}

                    <textarea
                      rows={2}
                      value={prayerWish}
                      onChange={(e) => setPrayerWish(e.target.value)}
                      placeholder="Pokok doa atau ucapan syukur (opsional)..."
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm shadow-lg transition-all"
                  >
                    <HeartHandshake className="w-5 h-5" />
                    <span>Konfirmasi Persembahan {formatRupiah(amount)}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Transparansi Feed */}
        {activeTab === 'transparansi' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Riwayat & Transparansi Persembahan Masuk
                </h3>
                <p className="text-xs text-slate-500">
                  Akuntabilitas pengelolaan dana persembahan jemaat secara real-time.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Real-time Sync
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {donationsList.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.donorName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {item.paymentMethodName}
                      </span>
                    </div>
                    <p className="text-xs text-blue-900 font-semibold mt-0.5">{item.categoryLabel}</p>
                    {item.prayerWish && (
                      <p className="text-xs text-slate-500 italic mt-1">"{item.prayerWish}"</p>
                    )}
                    <span className="text-[10px] text-slate-400 mt-1 block">{item.timestamp}</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-base font-black text-emerald-700 font-mono">
                      + {formatRupiah(item.amount)}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">{item.receiptNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
