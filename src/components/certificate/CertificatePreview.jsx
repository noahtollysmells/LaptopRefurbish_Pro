import React from 'react';
import { format } from 'date-fns';
import { Laptop } from 'lucide-react';

export default function CertificatePreview({ certificate, stepResults = [], steps = [] }) {
  if (!certificate) return null;
  
  // Filter step results that have notes and enrich with step titles
  const stepNotesWithContent = stepResults
    .filter((r) => r.notes && r.notes.trim())
    .map((result) => {
      const matchingStep = steps.find((s) => s.step_number === result.step_number);
      return {
        ...result,
        step_title: matchingStep?.step_title,
      };
    })
    .sort((a, b) => (a.step_number || 0) - (b.step_number || 0));

  const getOSDisplay = () => {
    if (certificate.operating_system === 'Windows') {
      return certificate.windows_version || 'Windows';
    } else if (certificate.operating_system === 'Linux') {
      return `Linux: ${certificate.linux_distribution || 'Not specified'}`;
    }
    return 'Not specified';
  };

  const getManufacturerDiagnosticsTool = () => {
    const manufacturer = certificate.manufacturer?.toLowerCase();
    if (manufacturer?.includes('dell')) return 'Dell SupportAssist';
    if (manufacturer?.includes('lenovo')) return 'Lenovo Vantage';
    if (manufacturer?.includes('hp')) return 'HP Support Assistant';
    return null;
  };

  return (
    <div
      className="bg-white p-8 max-w-3xl mx-auto print:p-12 print:max-w-none print:w-full print:mx-0 print:text-xl"
      id="certificate-print"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 print:mb-2">
        <div className="flex items-center gap-3">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697b77add3752e2758eee1dc/7ec3bf5f5_logo.png" 
            alt="Company Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <div className="text-right text-sm leading-snug">
          <div className="font-semibold text-slate-900">Mikes Laptops & Custom PCs</div>
          <div className="text-slate-600">4 Southernhay West</div>
          <div className="text-slate-600">Exeter</div>
          <div className="text-slate-600">EX2 6DN</div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6 print:mb-2">
        <h1 className="text-2xl print:text-lg font-bold text-slate-900 mb-2 print:mb-1">
          Certificate of Refurbishment
        </h1>
        <div className="h-px bg-slate-300"></div>
      </div>

      {/* Device and Technician Details */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 print:mb-2 text-sm print:gap-y-0.5">
        <div>
          <span className="font-semibold text-slate-700">Device Number:</span>{' '}
          <span className="text-slate-900">{certificate.certificate_number}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Serial Number:</span>{' '}
          <span className="text-slate-900">{certificate.serial_number || 'N/A'}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Technician:</span>{' '}
          <span className="text-slate-900">{certificate.technician_name}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Date:</span>{' '}
          <span className="text-slate-900">
            {certificate.date ? format(new Date(certificate.date), 'dd MMMM yyyy') : 'N/A'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Manufacturer:</span>{' '}
          <span className="text-slate-900">{certificate.manufacturer}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Operating System:</span>{' '}
          <span className="text-slate-900">{getOSDisplay()}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Model:</span>{' '}
          <span className="text-slate-900">{certificate.model}</span>
        </div>
      </div>

      {/* Physical Condition */}
      <div className="mb-6 print:mb-2">
        <h2 className="font-semibold text-slate-900 mb-2 print:mb-1">Physical Condition</h2>
        <div className="text-sm space-y-1">
          <div>
            <span className="font-semibold text-slate-700">Condition / Grade:</span>{' '}
            <span className="text-slate-900">{certificate.physical_condition_grade || 'Not specified'}</span>
          </div>
          {certificate.physical_condition_notes && (
            <div>
              <span className="font-semibold text-slate-700">Screen Condition Notes:</span>
              <div className="text-slate-900 whitespace-pre-wrap mt-1">{certificate.physical_condition_notes}</div>
            </div>
          )}
          {certificate.condition_testing_notes && (
            <div>
              <span className="font-semibold text-slate-700">Battery Report Results:</span>
              <div className="text-slate-900 whitespace-pre-wrap mt-1">{certificate.condition_testing_notes}</div>
            </div>
          )}
        </div>
      </div>

      {/* Condition & Testing Notes */}
      {certificate.condition_testing_notes && (
        <div className="mb-6 print:mb-2">
          <h2 className="font-semibold text-slate-900 mb-2 print:mb-1">Condition & Testing Notes</h2>
          <div className="text-sm text-slate-900 whitespace-pre-wrap leading-relaxed print:text-xs">
            {certificate.condition_testing_notes}
          </div>
        </div>
      )}

      {/* Tests and Software Confirmation */}
      <div className="mb-6 print:mb-2">
        <div className="text-sm space-y-0.5 text-slate-900">
          {certificate.tests_performed?.map((test, idx) => (
            <div key={idx}>• {test}</div>
          ))}
          {certificate.tests_other && <div>• {certificate.tests_other}</div>}
          
          {certificate.operating_system === 'Windows' && (
            <div className="mt-2">• Windows installed and updated</div>
          )}
          {certificate.operating_system === 'Linux' && (
            <div className="mt-2">• Linux installed ({certificate.linux_distribution || 'distribution stated'})</div>
          )}
          
          {getManufacturerDiagnosticsTool() && (
            <div>• Manufacturer diagnostics run: {getManufacturerDiagnosticsTool()}</div>
          )}
          
          {certificate.software_work?.map((work, idx) => (
            <div key={idx}>• {work}</div>
          ))}
          {certificate.software_other && <div>• {certificate.software_other}</div>}
        </div>
      </div>

      {/* Step Notes */}
      {stepNotesWithContent.length > 0 && (
        <div className="mb-6 print:mb-2">
          <h2 className="font-semibold text-slate-900 mb-2 print:mb-1">Refurbishment Process Notes</h2>
          <div className="text-sm text-slate-900 space-y-2 print:space-y-1 print:text-sm">
            {stepNotesWithContent.map((result) => (
              <div key={result.id || result.step_number}>
                <div className="font-medium text-slate-800">
                  Step {result.step_number}
                  {result.step_title ? `: ${result.step_title}` : ''}
                </div>
                <div className="whitespace-pre-wrap">{result.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Components */}
      <div className="mb-6 print:mb-2">
        <h2 className="font-semibold text-slate-900 mb-3 print:mb-1">Key Components</h2>
        <div className="grid grid-cols-2 gap-6 print:gap-3">
          <div>
            <h3 className="font-semibold text-slate-700 text-sm mb-2 print:mb-1">Technical Specifications</h3>
            {certificate.technical_specifications ? (
              <div className="text-sm text-slate-900 whitespace-pre-wrap leading-relaxed print:text-xs print:leading-snug">
                {certificate.technical_specifications}
              </div>
            ) : (
              <div className="text-sm text-slate-400 print:text-xs">Not specified</div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 text-sm mb-2 print:mb-1">Other Description</h3>
            {certificate.other_description ? (
              <div className="text-sm text-slate-900 whitespace-pre-wrap leading-relaxed print:text-xs print:leading-snug">
                {certificate.other_description}
              </div>
            ) : (
              <div className="text-sm text-slate-400 print:text-xs">Not specified</div>
            )}
          </div>
        </div>
      </div>

      {/* Sale Price */}
      <div className="mt-8 print:mt-2 pt-4 print:pt-2 border-t border-slate-300">
        <div className="text-lg print:text-base font-bold text-slate-900">
          Sale Price: £{certificate.sale_price_gbp?.toFixed(2) || '0.00'}
        </div>
      </div>
    </div>
  );
}