import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { getHashQueryParams } from '@/lib/hashParams';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Printer, Pencil, Trash2 } from 'lucide-react';
import CertificatePreviewComponent from '@/components/certificate/CertificatePreview';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CertificatePreviewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [stepResults, setStepResults] = useState([]);
  const [templateSteps, setTemplateSteps] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

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
    
    // Load step results
    const processRuns = await base44.entities.RefurbProcessRun.filter({ certificate_id: certId });
    if (processRuns.length > 0) {
      const runId = processRuns[0].id;
      const templateId = processRuns[0].template_id;

      if (templateId) {
        const templates = await base44.entities.RefurbProcessTemplate.filter({ id: templateId });
        setTemplateSteps(templates[0]?.ordered_steps || []);
      }

      const results = await base44.entities.RefurbStepResult.filter({ process_run_id: runId });
      setStepResults(results);
    }
    
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (deletePassword !== 'b3G0n3') {
      setDeleteError('Incorrect password');
      return;
    }

    // Find and delete related process run and step results
    const processRuns = await base44.entities.RefurbProcessRun.filter({ certificate_id: certId });
    if (processRuns.length > 0) {
      const runId = processRuns[0].id;
      
      // Delete step results
      const stepResults = await base44.entities.RefurbStepResult.filter({ process_run_id: runId });
      for (const result of stepResults) {
        await base44.entities.RefurbStepResult.delete(result.id);
      }
      
      // Delete process run
      await base44.entities.RefurbProcessRun.delete(runId);
    }

    // Delete certificate
    await base44.entities.RefurbCertificate.delete(certId);

    navigate(createPageUrl('Home'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Header - Hidden on print */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Certificates')}>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-slate-900">Certificate Preview</h1>
          </div>
          <div className="flex gap-2">
            <Link to={createPageUrl(`CertificateForm?certId=${certId}`)}>
              <Button variant="outline" className="rounded-lg">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleDeleteClick}
              className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 rounded-lg">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="max-w-3xl mx-auto py-8 px-4 print:p-0 print:max-w-none">
        <div className="bg-white rounded-2xl shadow-lg print:shadow-none print:rounded-none">
          <CertificatePreviewComponent
            certificate={certificate}
            stepResults={stepResults}
            steps={templateSteps}
          />
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this certificate and any associated refurbishment job data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="delete-password">Enter password to confirm</Label>
            <Input
              id="delete-password"
              type="password"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value);
                setDeleteError('');
              }}
              className="mt-2"
              placeholder="Password"
            />
            {deleteError && (
              <p className="text-sm text-red-600 mt-2">{deleteError}</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          html, body {
            width: auto;
            height: auto;
            margin: 0;
            padding: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 18px;
          }
          #certificate-print {
            width: calc(210mm - 16mm);
            min-height: auto;
            margin: 0;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}