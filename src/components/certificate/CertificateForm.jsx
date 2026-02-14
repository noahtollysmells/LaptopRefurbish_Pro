import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const TESTS = [
  'Memory tested',
  'SSD drive tested',
  'Sound tested',
  'Webcam tested',
  'Microphone tested',
  'Wi-Fi connected',
  'Ports tested',
  'Battery health checked',
  'Screen tested',
  'Keyboard and trackpad tested'
];

const SOFTWARE_WORK = [
  'Fresh OS installation',
  'Drivers installed and updated',
  'System fully updated',
  'Bloatware removed'
];

const TECHNICIANS = ['Mike Thomas', 'Cassie Spry', 'Noah Tolly'];

export default function CertificateForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleTestToggle = (test) => {
    const current = data.tests_performed || [];
    const updated = current.includes(test)
      ? current.filter(t => t !== test)
      : [...current, test];
    handleChange('tests_performed', updated);
  };

  const handleSoftwareToggle = (work) => {
    const current = data.software_work || [];
    const updated = current.includes(work)
      ? current.filter(w => w !== work)
      : [...current, work];
    handleChange('software_work', updated);
  };

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="certificate_number">Certificate Number</Label>
            <Input
              id="certificate_number"
              value={data.certificate_number || ''}
              disabled
              className="bg-slate-50"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={data.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="technician_name">Technician Name *</Label>
            <Input
              id="technician_name"
              list="technician-names"
              value={data.technician_name || ''}
              onChange={(e) => handleChange('technician_name', e.target.value)}
              placeholder="Enter technician name"
            />
            <datalist id="technician-names">
              {TECHNICIANS.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
        </div>
      </section>

      {/* Device Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Device Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="manufacturer">Manufacturer *</Label>
            <Select
              value={data.manufacturer || ''}
              onValueChange={(value) => handleChange('manufacturer', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lenovo">Lenovo</SelectItem>
                <SelectItem value="Dell">Dell</SelectItem>
                <SelectItem value="HP">HP</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              value={data.model || ''}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="Enter model"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="serial_number">Serial Number</Label>
            <Input
              id="serial_number"
              value={data.serial_number || ''}
              onChange={(e) => handleChange('serial_number', e.target.value)}
              placeholder="Enter serial number (optional)"
            />
          </div>
        </div>
      </section>

      {/* Physical Condition */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Physical Condition</h2>
        
        <div>
          <Label>Condition Grade</Label>
          <div className="flex gap-4 mt-2">
            {['A', 'B', 'C'].map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => handleChange('physical_condition_grade', grade)}
                className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                  data.physical_condition_grade === grade
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="physical_condition_notes">Physical Condition Notes</Label>
          <Textarea
            id="physical_condition_notes"
            value={data.physical_condition_notes || ''}
            onChange={(e) => handleChange('physical_condition_notes', e.target.value)}
            placeholder="Describe the physical condition..."
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="condition_testing_notes">Condition & Testing Notes</Label>
          <Textarea
            id="condition_testing_notes"
            value={data.condition_testing_notes || ''}
            onChange={(e) => handleChange('condition_testing_notes', e.target.value)}
            placeholder="Notes about testing..."
            rows={3}
          />
        </div>
      </section>

      {/* Tests Performed */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Tests Performed</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TESTS.map((test) => (
            <div key={test} className="flex items-center space-x-3">
              <Checkbox
                id={test}
                checked={(data.tests_performed || []).includes(test)}
                onCheckedChange={() => handleTestToggle(test)}
              />
              <label htmlFor={test} className="text-sm cursor-pointer">
                {test}
              </label>
            </div>
          ))}
        </div>
        
        <div>
          <Label htmlFor="tests_other">Other Tests</Label>
          <Input
            id="tests_other"
            value={data.tests_other || ''}
            onChange={(e) => handleChange('tests_other', e.target.value)}
            placeholder="Other tests performed..."
          />
        </div>
      </section>

      {/* Operating System */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Operating System</h2>
        
        <RadioGroup
          value={data.operating_system || ''}
          onValueChange={(value) => handleChange('operating_system', value)}
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="Windows" id="os-windows" />
            <Label htmlFor="os-windows" className="cursor-pointer">Windows</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="Linux" id="os-linux" />
            <Label htmlFor="os-linux" className="cursor-pointer">Linux</Label>
          </div>
        </RadioGroup>
        
        {data.operating_system === 'Windows' && (
          <div>
            <Label>Windows Version</Label>
            <Select
              value={data.windows_version || ''}
              onValueChange={(value) => handleChange('windows_version', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Windows version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem>
                <SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem>
                <SelectItem value="Windows 10 Home">Windows 10 Home</SelectItem>
                <SelectItem value="Windows 11 Home">Windows 11 Home</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {data.operating_system === 'Linux' && (
          <div>
            <Label htmlFor="linux_distribution">Linux Distribution</Label>
            <Input
              id="linux_distribution"
              value={data.linux_distribution || ''}
              onChange={(e) => handleChange('linux_distribution', e.target.value)}
              placeholder="e.g., Ubuntu 22.04, Linux Mint 21"
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="os_notes">OS Notes</Label>
          <Textarea
            id="os_notes"
            value={data.os_notes || ''}
            onChange={(e) => handleChange('os_notes', e.target.value)}
            placeholder="Additional OS notes (optional)..."
            rows={2}
          />
        </div>
      </section>

      {/* Software Work */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Software Work Completed</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SOFTWARE_WORK.map((work) => (
            <div key={work} className="flex items-center space-x-3">
              <Checkbox
                id={work}
                checked={(data.software_work || []).includes(work)}
                onCheckedChange={() => handleSoftwareToggle(work)}
              />
              <label htmlFor={work} className="text-sm cursor-pointer">
                {work}
              </label>
            </div>
          ))}
        </div>
        
        <div>
          <Label htmlFor="software_other">Other Software Work</Label>
          <Input
            id="software_other"
            value={data.software_other || ''}
            onChange={(e) => handleChange('software_other', e.target.value)}
            placeholder="Other software work..."
          />
        </div>
      </section>

      {/* Device Description */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Device Description</h2>
        
        <div>
          <Label htmlFor="technical_specifications">Technical Specifications</Label>
          <Textarea
            id="technical_specifications"
            value={data.technical_specifications || ''}
            onChange={(e) => handleChange('technical_specifications', e.target.value)}
            placeholder="CPU, RAM, Storage, etc."
            rows={4}
          />
        </div>
        
        <div>
          <Label htmlFor="other_description">Other Description</Label>
          <Textarea
            id="other_description"
            value={data.other_description || ''}
            onChange={(e) => handleChange('other_description', e.target.value)}
            placeholder="Any other relevant information..."
            rows={4}
          />
        </div>
      </section>

      {/* Sales */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Sales Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sale_price_gbp">Sale Price (£)</Label>
            <Input
              id="sale_price_gbp"
              type="number"
              step="0.01"
              min="0"
              value={data.sale_price_gbp || ''}
              onChange={(e) => handleChange('sale_price_gbp', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="customer_order_reference">Customer Order Reference</Label>
            <Input
              id="customer_order_reference"
              value={data.customer_order_reference || ''}
              onChange={(e) => handleChange('customer_order_reference', e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>
      </section>
    </div>
  );
}