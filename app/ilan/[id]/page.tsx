'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, MapPin, Building2, Phone, ArrowLeft, Compass } from 'lucide-react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  listing_type: string;
  property_type: string;
  is_eids_verified: boolean;
  ttbs_no?: string;
  city: string;
  district: string;
  neighborhood?: string;
  bedrooms: string;
  net_sqm: number;
  gross_sqm?: number;
  created_at: string;
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (!error && data) {
        setListing(data);
      }
      setLoading(false);
    }

    fetchListing();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        İlan detayları yükleniyor...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">İlan Bulunamadı</h2>
        <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Üst Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-medium">
            <ArrowLeft className="w-4 h-4" /> İlanlara Dön
          </Link>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-600 capitalize">
            {listing.listing_type}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Başlık ve Fiyat */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {listing.city} / {listing.district} {listing.neighborhood && `/ ${listing.neighborhood}`}
              </span>
              {listing.is_eids_verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Yetkili & Onaylı Portföy
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {listing.title}
            </h1>
          </div>

          <div className="md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Portföy Bedeli</div>
            <div className="text-3xl font-black text-blue-600">
              {Number(listing.price).toLocaleString('tr-TR')} TL
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon: Sanal Tur ve Açıklama */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" /> 360° Sanal Tur & Mekan Görünümü
                </span>
                <span className="text-xs text-slate-500 font-medium">İnteraktif Deneyim</span>
              </div>
              
              <div className="h-96 bg-slate-900 relative flex flex-col items-center justify-center text-white p-6 text-center">
                <Building2 className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold mb-2">360° Sanal Tur Aktif</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Mülkün iç mekan detaylarını dijital tur ile keşfedin.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Açıklama & Detaylar
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {listing.description || 'Bu ilan için henüz detaylı açıklama girilmemiştir.'}
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Özellikler ve İletişim */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Genel Bilgiler
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Kategori</span>
                  <span className="font-semibold text-slate-900">{listing.property_type}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">İşlem Türü</span>
                  <span className="font-semibold text-slate-900 capitalize">{listing.listing_type}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Net Alan</span>
                  <span className="font-semibold text-slate-900">{listing.net_sqm} m²</span>
                </div>
                {listing.gross_sqm && (
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Brüt Alan</span>
                    <span className="font-semibold text-slate-900">{listing.gross_sqm} m²</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Oda / Bölüm</span>
                  <span className="font-semibold text-slate-900">{listing.bedrooms}</span>
                </div>
                {listing.ttbs_no && (
                  <div className="flex justify-between py-1.5 text-xs text-emerald-700 bg-emerald-50/50 px-2 rounded">
                    <span>TTBS Yetki No</span>
                    <span className="font-mono font-bold">{listing.ttbs_no}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  SI
                </div>
                <div>
                  <h4 className="font-bold text-sm">Sezer Invest</h4>
                  <p className="text-xs text-slate-400">Kurumsal Gayrimenkul Danışmanlığı</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-sm">
                <Phone className="w-4 h-4" /> Portföy Yöneticisini Ara
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
