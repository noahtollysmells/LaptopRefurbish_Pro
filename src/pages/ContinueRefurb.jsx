import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import base44 from "@/api/base44Client"
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Inbox } from 'lucide-react';
import JobCard from '@/components/refurb/JobCard';

export default function ContinueRefurb() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    
    // Get all process runs that are not completed
    const processRuns = await base44.entities.RefurbProcessRun.filter(
      { status: 'In Progress' },
      '-created_date'
    );

    // Get certificates for these runs
    const certificateIds = processRuns.map(r => r.certificate_id);
    const certificates = await base44.entities.RefurbCertificate.list('-created_date');
    
    // Match them up
    const jobsData = processRuns.map(run => {
      const cert = certificates.find(c => c.id === run.certificate_id);
      return { processRun: run, certificate: cert };
    }).filter(job => job.certificate);

    setJobs(jobsData);
    setLoading(false);
  };

  const handleJobClick = (processRun) => {
    navigate(createPageUrl(`RefurbSteps?runId=${processRun.id}`));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Continue Refurb Job</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
              <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No jobs in progress</h2>
            <p className="text-slate-500 mb-6">Start a new refurb job to get started</p>
            <Link to={createPageUrl('NewRefurb')}>
              <Button className="bg-slate-900 hover:bg-slate-800">
                Start New Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(({ processRun, certificate }) => (
              <JobCard
                key={processRun.id}
                certificate={certificate}
                processRun={processRun}
                onClick={() => handleJobClick(processRun)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}