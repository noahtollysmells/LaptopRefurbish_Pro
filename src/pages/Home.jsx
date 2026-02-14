import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, PlayCircle, FileText, Laptop } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 mb-4">
            <Laptop className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Laptop Refurb
          </h1>
          <p className="text-slate-500">
            Guided refurbishment &amp; certification
          </p>
        </div>

        {/* Main Actions */}
        <div className="space-y-4">
          <Link to={createPageUrl('NewRefurb')}>
            <Button className="w-full h-16 text-lg bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-200">
              <Plus className="w-6 h-6 mr-3" />
              New Refurb Job
            </Button>
          </Link>

          <Link to={createPageUrl('ContinueRefurb')}>
            <Button variant="outline" className="w-full h-16 text-lg rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
              <PlayCircle className="w-6 h-6 mr-3" />
              Continue Refurb Job
            </Button>
          </Link>

          <Link to={createPageUrl('Certificates')}>
            <Button variant="outline" className="w-full h-16 text-lg rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
              <FileText className="w-6 h-6 mr-3" />
              Certificates
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}