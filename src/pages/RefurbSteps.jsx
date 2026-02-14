import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { getHashQueryParams } from '@/lib/hashParams';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, FileText, X, Trash2 } from 'lucide-react';
import StepCard from '@/components/refurb/StepCard';
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

export default function RefurbSteps() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processRun, setProcessRun] = useState(null);
  const [template, setTemplate] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [stepResults, setStepResults] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const urlParams = getHashQueryParams();
  const runId = urlParams.get('runId');

  useEffect(() => {
    if (runId) {
      let mounted = true
      const doLoad = async () => {
        try {
          setLoading(true);
          await loadData();
        } catch (e) {
          console.error(e);
        } finally {
          if (mounted) setLoading(false);
        }
      }
      doLoad();
      return () => { mounted = false }
    } else {
      // No runId provided in hash query — stop loader and show fallback
      setLoading(false);
    }
  }, [runId]);
  const loadData = async () => {
    // Load process run
    const runs = await base44.entities.RefurbProcessRun.filter({ id: runId });
    const run = runs[0];
    setProcessRun(run);
    setCurrentStep(run?.current_step || 1);

    // Load template
    const templates = await base44.entities.RefurbProcessTemplate.filter({ id: run?.template_id });
    setTemplate(templates[0]);

    // Load certificate
    const certificates = await base44.entities.RefurbCertificate.filter({ id: run?.certificate_id });
    setCertificate(certificates[0]);

    // Load existing step results
    const results = await base44.entities.RefurbStepResult.filter({ process_run_id: runId });
    const resultsMap = {};
    results.forEach(r => {
      resultsMap[r.step_number] = r;
    });
    setStepResults(resultsMap);
  };

  const handleStepComplete = async (stepNumber, completed, notes) => {
    const existing = stepResults[stepNumber];
    
    if (existing) {
      await base44.entities.RefurbStepResult.update(existing.id, {
        completed,
        notes,
        completed_at: completed ? new Date().toISOString() : null
      });
    } else {
      const result = await base44.entities.RefurbStepResult.create({
        process_run_id: runId,
        step_number: stepNumber,
        completed,
        notes,
        completed_at: completed ? new Date().toISOString() : null
      });
      setStepResults(prev => ({ ...prev, [stepNumber]: result }));
    }

    // Reload step results
    const results = await base44.entities.RefurbStepResult.filter({ process_run_id: runId });
    const resultsMap = {};
    results.forEach(r => {
      resultsMap[r.step_number] = r;
    });
    setStepResults(resultsMap);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      base44.entities.RefurbProcessRun.update(runId, { current_step: newStep });
    }
  };

  const handleNext = async () => {
    const steps = template?.ordered_steps || [];
    
    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      await base44.entities.RefurbProcessRun.update(runId, { current_step: newStep });
    } else {
      // Complete the process
      await base44.entities.RefurbProcessRun.update(runId, {
        status: 'Completed',
        completed_at: new Date().toISOString()
      });
      await base44.entities.RefurbCertificate.update(certificate.id, {
        status: 'Completed'
      });
      navigate(createPageUrl(`CertificateForm?certId=${certificate.id}`));
    }
  };

  const handleCompleteLater = async () => {
    const steps = [...(template?.ordered_steps || [])];
    
    // Find the current step
    const currentStepIndex = steps.findIndex(s => s.step_number === currentStep);
    if (currentStepIndex === -1) return;

    // Remove current step and add to end
    const [movedStep] = steps.splice(currentStepIndex, 1);
    steps.push(movedStep);

    // Renumber all steps
    const renumberedSteps = steps.map((step, index) => ({
      ...step,
      step_number: index + 1
    }));

    // Update template with new order
    await base44.entities.RefurbProcessTemplate.update(template.id, {
      ordered_steps: renumberedSteps
    });

    // Reload data to reflect changes
    await loadData();
  };

  const goToCertificateForm = () => {
    navigate(createPageUrl(`CertificateForm?certId=${certificate.id}`));
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

    // Delete step results
    await base44.entities.RefurbStepResult.filter({ process_run_id: runId }).then(results => {
      results.forEach(r => base44.entities.RefurbStepResult.delete(r.id));
    });

    // Delete process run
    await base44.entities.RefurbProcessRun.delete(runId);

    // Delete certificate
    if (certificate?.id) {
      await base44.entities.RefurbCertificate.delete(certificate.id);
    }

    navigate(createPageUrl('Home'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const steps = template?.ordered_steps || [];
  const currentStepData = steps.find(s => s.step_number === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <X className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {certificate?.manufacturer} {certificate?.model}
              </h1>
              <p className="text-sm text-slate-500">{certificate?.certificate_number}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToCertificateForm}
              className="rounded-lg"
            >
              <FileText className="w-4 h-4 mr-1" />
              Certificate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Step Card */}
        {currentStepData && (
          <StepCard
            step={currentStepData}
            stepResult={stepResults[currentStep]}
            totalSteps={steps.length}
            onComplete={handleStepComplete}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onCompleteLater={handleCompleteLater}
            isFirst={currentStep === 1}
            isLast={currentStep === steps.length}
          />
        )}

        {/* Delete Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Refurbishment Job</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this job, all step results, and the associated certificate. This action cannot be undone.
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
      </div>
    </div>
  );
}