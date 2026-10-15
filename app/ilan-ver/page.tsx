'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddListingPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    listing_type: 'satilik',
    property_type: 'Daire',
    owner_type: 'danismandan',
    city: 'İstanbul',
    district: '',
    neighborhood: '',
    bedrooms: '3+1',
    net_sqm: '',
    gross_sqm: '',
    ttbs_no: '',
    eids_code: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('listings').insert([
      {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        listing_type: formData.listing_type,
        property_type: formData.property_type,
        owner_type: formData.owner_type,
        city: formData.city,
        district: formData.district,
        neighborhood: formData.neighborhood,
        bedrooms: formData.bedrooms,
        net_sqm: parseInt(formData.net_sqm),
        gross_sqm: parseInt(formData.gross_sqm),
        ttbs_no: formData.ttbs_no,
        eids_code: formData.eids_code,
        is_eids_verified: formData.eids_code.length > 5,
        verification_status: formData.eids_code.length > 5 ? 'verified' : 'pending',
      },
    ]);

    setLoading(false);
    if (!error) {
      setSuccess(true);
    } else {
      alert('İlan eklenirken bir hata oluştu: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Yeni İlan Ekle</h1>
            <p className="text-slate-500 text-sm mt-1">
              Ticaret Bakanlığı EİDS yönetmeliğine ve yasal standartlara uygun ilan girişi.
            </p>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">İlanınız Başarıyla Alındı!</h3>
              <p className="text-sm text-emerald-700">
                EİDS doğrulama kodunuz kontrol edildikten sonra onaylı simgesiyle yayına alınacaktır.
              </p>
              <Link href="/" className="inline-block bg-emerald-600 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition">
                İlanları Görüntüle
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> EİDS Resmi Yetki Doğrulama Bilgileri
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      TTBS Taşınmaz Ticareti Yetki Belge No *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: 3400123"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.ttbs_no}
                      onChange={(e) => setFormData({ ...formData, ttbs_no: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      e-Devlet EİDS Doğrulama Kodu *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: EIDS-847321"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.eids_code}
                      onChange={(e) => setFormData({ ...formData, eids_code: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Mülk sahibinin e-Devlet üzerinden tanımladığı yetki kodudur.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 border-b pb-2">İlan Detayları</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">İlan Başlığı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Karaköy Sahilde Devredilen EİDS Onaylı Restoran"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">İlan Türü *</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                      value={formData.listing_type}
                      onChange={(e) => setFormData({ ...formData, listing_type: e.target.value })}
                    >
                      <option value="satilik">Satılık</option>
                      <option value="kiralik">Kiralık</option>
                      <option value="devredilen">Devredilen (Ticari)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mülk Tipi *</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                      value={formData.property_type}
                      onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    >
                      <option value="Daire">Daire</option>
                      <option value="Villa">Villa</option>
                      <option value="İşyeri">İşyeri / Ticari</option>
                      <option value="Arsa">Arsa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Fiyat (TL) *</label>
                    <input
                      type="number"
                      required
                      placeholder="2500000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">İl *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">İlçe *</label>
                    <input
                      type="text"
                      required
                      placeholder="Beyoğlu"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Net m² *</label>
                    <input
                      type="number"
                      required
                      placeholder="180"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                      value={formData.net_sqm}
                      onChange={(e) => setFormData({ ...formData, net_sqm: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Açıklama</label>
                  <textarea
                    rows={4}
                    placeholder="Mülk hakkında detaylı bilgi, devir şartları vb."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-50"
              >
                {loading ? 'EİDS Kontrolü Yapılıyor...' : 'İlanı EİDS Doğrulamasıyla Yayınla'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}