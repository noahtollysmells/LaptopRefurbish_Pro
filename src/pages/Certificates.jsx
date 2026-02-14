import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import base44 from "@/api/base44Client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Search, FileText, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Certificates() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    const certs = await base44.entities.RefurbCertificate.list('-created_date');
    setCertificates(certs);
    setLoading(false);
  };

  const filteredCertificates = certificates.filter(cert => {
    const searchLower = search.toLowerCase();
    return (
      cert.certificate_number?.toLowerCase().includes(searchLower) ||
      cert.manufacturer?.toLowerCase().includes(searchLower) ||
      cert.model?.toLowerCase().includes(searchLower) ||
      cert.serial_number?.toLowerCase().includes(searchLower)
    );
  });

  const handleCertificateClick = (cert) => {
    navigate(createPageUrl(`CertificatePreview?certId=${cert.id}`));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Certificates</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates..."
            className="pl-10 h-12 rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              {search ? 'No matching certificates' : 'No certificates yet'}
            </h2>
            <p className="text-slate-500">
              {search ? 'Try a different search term' : 'Complete a refurb job to create one'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCertificates.map((cert) => (
              <button
                key={cert.id}
                onClick={() => handleCertificateClick(cert)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all text-left flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {cert.manufacturer} {cert.model}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {cert.certificate_number}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      cert.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {cert.status || 'Draft'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {cert.created_date || cert.created_at
                        ? format(new Date(cert.created_date || cert.created_at), 'dd MMM yyyy')
                        : 'Date unavailable'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}