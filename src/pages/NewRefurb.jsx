import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import base44 from "@/api/base44Client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function NewRefurb() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    manufacturer: '',
    model: '',
    serial_number: '',
    technician_name: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
    if (userData?.full_name) {
      setFormData(prev => ({ ...prev, technician_name: userData.full_name }));
    }
  };

  const generateCertificateNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RC-${year}${month}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.manufacturer || !formData.model || !formData.technician_name) {
      return;
    }

    setLoading(true);

    // Create the certificate
    const certificate = await base44.entities.RefurbCertificate.create({
      ...formData,
      certificate_number: generateCertificateNumber(),
      status: 'Draft'
    });

    // Get or create the default template
    let templates = await base44.entities.RefurbProcessTemplate.filter({ active: true });
    let template = templates[0];

    if (!template) {
      template = await base44.entities.RefurbProcessTemplate.create({
        name: 'Standard Laptop Refurb Process v1',
        active: true,
        ordered_steps: getDefaultSteps()
      });
    }

    // Create the process run
    const processRun = await base44.entities.RefurbProcessRun.create({
      certificate_id: certificate.id,
      template_id: template.id,
      started_at: new Date().toISOString(),
      status: 'In Progress',
      current_step: 1
    });

    navigate(createPageUrl(`RefurbSteps?runId=${processRun.id}`));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <h1 className="text-xl font-bold text-slate-900">New Refurb Job</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Device Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Device Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Select
                  value={formData.manufacturer}
                  onValueChange={(value) => handleChange('manufacturer', value)}
                >
                  <SelectTrigger className="h-12 mt-1">
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
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="e.g., ThinkPad T480"
                  className="h-12 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => handleChange('serial_number', e.target.value)}
                  placeholder="Optional"
                  className="h-12 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Technician Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Technician Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="technician_name">Technician Name *</Label>
                <Input
                  id="technician_name"
                  list="technician-name-options"
                  value={formData.technician_name}
                  onChange={(e) => handleChange('technician_name', e.target.value)}
                  placeholder="Enter your name"
                  className="h-12 mt-1"
                />
                <datalist id="technician-name-options">
                  <option value="Noah Tolly" />
                  <option value="Cassie Spry" />
                  <option value="Mike Thomas" />
                </datalist>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="h-12 mt-1"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.manufacturer || !formData.model || !formData.technician_name}
            className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Start Refurbishment'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

function getDefaultSteps() {
  return [
    { step_number: 1, step_title: 'Visual inspection and cosmetic condition', step_instructions: 'Inspect all ports, lid, base, palm rest, keyboard, and screen. Take notes of any cracks or damage, pressure marks to the screen, worn keys, heavy scratches, etc.', acceptance_criteria: 'Cosmetic condition documented', required: true, notes_allowed: true },
    { step_number: 2, step_title: 'Check charger and accessories', step_instructions: 'Confirm the correct charger is present and functional. Note any missing accessories and free of damage or exposed wires.', acceptance_criteria: 'Charger tested and accessories noted', required: true, notes_allowed: true },
    { step_number: 3, step_title: 'Check BIOS access and passwords', step_instructions: 'Power on the device and confirm BIOS access. Remove BIOS passwords where possible and note if any remain.', acceptance_criteria: 'BIOS accessible', required: true, notes_allowed: true },
    { step_number: 4, step_title: 'Select correct OS edition during installation', step_instructions: 'When prompted for OS version:\n\n• Check the chassis for a Windows Pro or Home license sticker.\n• If no sticker is present, assume corporate laptops use Windows Pro.\n• Select \'I don\'t have a license\' if required.\n• Install the Pro version where applicable.\n\nNote that Windows will activate automatically once connected to the internet.', acceptance_criteria: 'Correct OS edition selected', required: true, notes_allowed: true },
    { step_number: 5, step_title: 'Confirm storage is empty and prepare partitions', step_instructions: 'Verify all existing partitions are removed and allow the OS installer to create required partitions automatically.', acceptance_criteria: 'Storage cleared and ready for OS', required: true, notes_allowed: true },
    { step_number: 6, step_title: 'Create local user account', step_instructions: 'When prompted for network connection:\n\n• Select \'I don\'t have internet\'.\n• Create a local user account named \'user\'.\n• Do not set a password.', acceptance_criteria: 'Local user account created', required: true, notes_allowed: true },
    { step_number: 7, step_title: 'Install manufacturer software and run diagnostics', step_instructions: 'Connect to the internet and install the appropriate tool:\n\n• Dell SupportAssist\n• Lenovo Vantage\n• HP Support Assistant\n\nRun basic diagnostics and then a full hardware scan.', acceptance_criteria: 'Diagnostics software installed and scan completed', required: true, notes_allowed: true },
    { step_number: 8, step_title: 'Test screen', step_instructions: 'Inspect for dead pixels, brightness issues, and backlight problems.', acceptance_criteria: 'Screen functioning correctly', required: true, notes_allowed: true },
    { step_number: 9, step_title: 'Test keyboard and trackpad', step_instructions: 'Verify all keys and touchpad functions correctly.', acceptance_criteria: 'Keyboard and trackpad working', required: true, notes_allowed: true },
    { step_number: 10, step_title: 'Test ports', step_instructions: 'Test all applicable ports including USB, HDMI, USB-C, and others.', acceptance_criteria: 'All ports functional', required: true, notes_allowed: true },
    { step_number: 11, step_title: 'Test audio, microphone, and webcam', step_instructions: 'Confirm speakers, mic input, and camera function correctly.', acceptance_criteria: 'Audio, mic, and camera working', required: true, notes_allowed: true },
    { step_number: 12, step_title: 'Create battery health report and record capacity percentage', step_instructions: 'Open Command Prompt and run:\npowercfg /batteryreport\n\nThe battery report will be saved in the root user folder.\n\nFrom the report:\n\n• Identify the Full Charge Capacity (larger number)\n• Identify the Current Capacity (lower number)\n• Divide the current capacity by the full charge capacity and convert the result into a percentage.\n\nRecord the final battery health percentage in the notes field for this step.', acceptance_criteria: 'Battery health percentage recorded', required: true, notes_allowed: true },
    { step_number: 13, step_title: 'Complete and print refurb certificate', step_instructions: 'Fill in all certificate details including tests, OS, specifications, and notes. Preview and print the Certificate of Refurbishment.', acceptance_criteria: 'Certificate completed and printed', required: true, notes_allowed: true },
    { step_number: 14, step_title: 'Clean device', step_instructions: 'Clean screen, keyboard, ports, and exterior surfaces.', acceptance_criteria: 'Device cleaned and presentable', required: true, notes_allowed: true },
    { step_number: 15, step_title: 'Assign condition grade', step_instructions: 'Assign Grade A, B, or C based on cosmetic condition.', acceptance_criteria: 'Grade assigned', required: true, notes_allowed: true },
    { step_number: 16, step_title: 'Confirm device ready for sale', step_instructions: 'Final check that all required steps are complete.', acceptance_criteria: 'Device approved for sale', required: true, notes_allowed: true },
    { step_number: 17, step_title: 'Photograph laptop from the front, both sides, and top', step_instructions: 'Take photos ready for listing on social media and website. (Sales stock only - skip for refurb services or special orders)', acceptance_criteria: 'Photos taken and ready for listing', required: false, notes_allowed: true }
  ];
}