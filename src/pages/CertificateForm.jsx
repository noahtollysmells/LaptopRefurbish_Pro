import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { getHashQueryParams } from '@/lib/hashParams';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Eye, Save } from 'lucide-react';
import CertificateFormComponent from '@/components/certificate/CertificateForm';
import { toast } from 'sonner';

export default function CertificateFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const urlParams = getHashQueryParams();
  const certId = urlParams.get('certId');

  useEffect(() => {
    if (certId) {
      let mounted = true
      const doLoad = async () => {
        try {
          setLoading(true)
          await loadCertificate()
        } catch (e) {
          console.error(e)
        } finally {
          if (mounted) setLoading(false)
        }
      }
      doLoad()
      return () => { mounted = false }
    } else {
      setLoading(false)
    }
  }, [certId]);

  const loadCertificate = async () => {
    setLoading(true);
    const certificates = await base44.entities.RefurbCertificate.filter({ id: certId });
    setCertificate(certificates[0]);
    setLoading(false);
  };

  const handleChange = (data) => {
    setCertificate(data);
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_date, updated_date, created_by, ...dataToSave } = certificate;
    await base44.entities.RefurbCertificate.update(certId, dataToSave);
    toast.success('Certificate saved');
    setSaving(false);
  };

  const handlePreview = async () => {
    await handleSave();
    navigate(createPageUrl(`CertificatePreview?certId=${certId}`));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Certificate Form</h1>
              <p className="text-sm text-slate-500">{certificate?.certificate_number}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <CertificateFormComponent
            data={certificate || {}}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 sticky bottom-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="outline"
            className="flex-1 h-14 rounded-xl"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save
          </Button>
          <Button
            onClick={handlePreview}
            className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview & Print
          </Button>
        </div>
      </div>
    </div>
  );
}