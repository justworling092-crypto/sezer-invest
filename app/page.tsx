'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  price: number;
  listing_type: string;
  property_type: string;
  is_eids_verified: boolean;
  city: string;
  district: string;
  bedrooms: string;
  net_sqm: number;
  images: string[];
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hepsi');

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true);

      if (!error && data) {
        setListings(data);
      }
      setLoading(false);
    }

    fetchListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    if (activeTab === 'hepsi') return true;
    return item.listing_type === activeTab;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Üst Bar / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block">SEZER INVEST</span>
              <span className="text-xs text-slate-500 font-medium">Gayrimenkul & Yatırım</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" /> EİDS Doğrulanmış Sistem
            </span>
            <Link href="/ilan-ver" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm inline-block">
              İlan Ver
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Alanı & Arama Filtreleri */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Hayalinizdeki Mülkü Güvenle Bulun
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            EİDS doğrulamalı, 360° sanal turlu satılık, kiralık ve devredilen ticari gayrimenkuller.
          </p>

          <div className="inline-flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 gap-1 mt-4">
            {[
              { id: 'hepsi', label: 'Tüm İlanlar' },
              { id: 'satilik', label: 'Satılık' },
              { id: 'kiralik', label: 'Kiralık' },
              { id: 'devredilen', label: 'Devredilen' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* İlan Kartları Listesi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Öne Çıkan İlanlar</h2>
          <span className="text-sm text-slate-500 font-medium">{filteredListings.length} ilan gösteriliyor</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">İlanlar yükleniyor...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200">
            Bu kategoride henüz yayınlanmış bir ilan bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <Link
                key={item.id}
                href={`/ilan/${item.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer block"
              >
                <div className="h-48 bg-slate-100 relative flex items-center justify-center border-b border-slate-100">
                  <Building2 className="w-12 h-12 text-slate-300" />
                  
                  {item.is_eids_verified && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5" /> EİDS Onaylı
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                    {item.listing_type}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-blue-600 font-bold text-xl">
                    {Number(item.price).toLocaleString('tr-TR')} TL
                  </div>
                  <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center text-xs text-slate-500 gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.city} / {item.district}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>{item.property_type}</span>
                    <span>{item.bedrooms}</span>
                    <span>{item.net_sqm} m² Net</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}