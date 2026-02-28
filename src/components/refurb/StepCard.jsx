import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export default function StepCard({
  step,
  stepResult,
  totalSteps,
  onComplete,
  onPrevious,
  onNext,
  onCompleteLater,
  isFirst,
  isLast
}) {
  const [notes, setNotes] = useState(stepResult?.notes || '');
  const [completed, setCompleted] = useState(stepResult?.completed || false);
  const [touchscreenValue, setTouchscreenValue] = useState('');

  const isTouchscreenStep = step.input_type === 'touchscreen' || step.step_key === 'touchscreen_check';

  // Sync local state with stepResult prop when it changes (e.g., navigating between steps)
  useEffect(() => {
    setNotes(stepResult?.notes || '');
    setCompleted(stepResult?.completed || false);
    setTouchscreenValue(extractTouchscreenValue(stepResult?.notes || ''));
  }, [stepResult, step.step_number]);

  const handleComplete = () => {
    if (isTouchscreenStep && !touchscreenValue) return;

    const newCompleted = !completed;
    setCompleted(newCompleted);
    // Only update this specific step's completion status
    onComplete(step.step_number, newCompleted, notes);
  };

  const handleNotesChange = (value) => {
    setNotes(value);
    // Save notes immediately if step is already completed
    if (completed) {
      onComplete(step.step_number, completed, value);
    }
  };

  const handleNotesBlur = () => {
    // Save notes on blur even if step is not completed
    if (notes !== (stepResult?.notes || '')) {
      onComplete(step.step_number, completed, notes);
    }
  };

  const handleTouchscreenChange = (value) => {
    const nextNotes = value === 'yes' ? 'Touchscreen: Yes' : 'Touchscreen: No';
    setTouchscreenValue(value);
    setNotes(nextNotes);
    onComplete(step.step_number, completed, nextNotes);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Progress Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-500">
            Step {step.step_number} of {totalSteps}
          </span>
          {completed && (
            <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Complete
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-slate-800 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step.step_number / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {step.step_title}
          </h2>
          {step.step_instructions && (
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {step.step_instructions}
            </p>
          )}
        </div>

        {step.acceptance_criteria && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              Acceptance Criteria
            </h3>
            <p className="text-sm text-blue-700">
              {step.acceptance_criteria}
            </p>
          </div>
        )}

        {isTouchscreenStep && (
          <div>
            <Label className="block text-sm font-medium text-slate-700 mb-3">
              Is this laptop touchscreen?
            </Label>
            <RadioGroup
              value={touchscreenValue}
              onValueChange={handleTouchscreenChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id={`touchscreen-yes-${step.step_number}`} />
                <Label htmlFor={`touchscreen-yes-${step.step_number}`} className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id={`touchscreen-no-${step.step_number}`} />
                <Label htmlFor={`touchscreen-no-${step.step_number}`} className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Notes */}
        {step.notes_allowed && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder={isTouchscreenStep ? 'Touchscreen status is auto-filled above.' : 'Add any notes for this step...'}
              rows={3}
              className="resize-none"
              readOnly={isTouchscreenStep}
            />
          </div>
        )}

        {/* Completion Checkbox - Moved to bottom */}
        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
          <Checkbox
            id={`complete-${step.step_number}`}
            checked={completed}
            onCheckedChange={handleComplete}
            className="mt-0.5 h-6 w-6"
            disabled={isTouchscreenStep && !touchscreenValue}
          />
          <label
            htmlFor={`complete-${step.step_number}`}
            className="text-base font-medium text-slate-700 cursor-pointer flex-1"
          >
            Mark this step as complete
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-3">
        {!isLast && onCompleteLater && (
          <Button
            variant="outline"
            onClick={onCompleteLater}
            className="w-full h-10 text-slate-600 hover:text-slate-700 hover:bg-slate-100"
          >
            <Clock className="w-4 h-4 mr-2" />
            Complete Later
          </Button>
        )}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className="flex-1 h-12"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={step.required && !completed}
            className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          >
            {isLast ? 'Finish' : 'Next'}
            {!isLast && <ChevronRight className="w-5 h-5 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function extractTouchscreenValue(notes) {
  const normalized = String(notes || '').trim().toLowerCase();
  if (normalized.includes('touchscreen: yes')) return 'yes';
  if (normalized.includes('touchscreen: no')) return 'no';
  return '';
}