'use client';

import { useEffect, useState } from 'react';
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

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      if (!params?.id) return;
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('İlan çekilirken hata oluştu:', error);
      } else {
        setListing(data);
      }
      setLoading(false);
    }

    fetchListing();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 h-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">İlan Bulunamadı</h1>
        <p className="text-gray-600 mb-6">Aradığınız ilan yayından kaldırılmış veya erişilemiyor olabilir.</p>
        <Link href="/" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Tüm İlanlara Dön
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                {listing.listing_type} - {listing.property_type}
              </span>
              {listing.is_eids_verified && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> EİDS Onaylı İlan
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <p className="flex items-center text-gray-500 text-sm gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              {listing.district}, {listing.city} {listing.neighborhood ? `(${listing.neighborhood})` : ''}
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">İlan Açıklaması</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Özellikler</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-500 block">Oda Sayısı</span>
                    <span className="text-sm font-semibold text-gray-800">{listing.bedrooms}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-500 block">Net Alan</span>
                    <span className="text-sm font-semibold text-gray-800">{listing.net_sqm} m²</span>
                  </div>
                  {listing.gross_sqm && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs text-gray-500 block">Brüt Alan</span>
                      <span className="text-sm font-semibold text-gray-800">{listing.gross_sqm} m²</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl">
                <span className="text-xs text-gray-500 block mb-1">Fiyat</span>
                <span className="text-2xl font-extrabold text-blue-600">
                  {listing.price?.toLocaleString('tr-TR')} ₺
                </span>
              </div>

              {listing.ttbs_no && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 block mb-1">TTBS Yetki Belge No</span>
                  <span className="text-sm font-mono font-medium text-gray-700">{listing.ttbs_no}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
