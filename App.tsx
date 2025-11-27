import React, { useState, useEffect, useRef } from 'react';
import { FieldsTab } from './components/FieldsTab';
import { MachinesTab } from './components/MachinesTab';
import { AnalysisTab } from './components/AnalysisTab';
import { FieldWorksTab } from './components/FieldWorksTab';
import { MachineRepairsTab } from './components/MachineRepairsTab';
import { Field, Machine, FieldWork, MachineRepair, COMMON_MACHINE_TYPES } from './types';
import { Sprout, Tractor, BarChart3, Menu, ClipboardList, Wrench, Save, Settings, Download, Upload, X, AlertCircle } from 'lucide-react';

// Custom hook for local storage persistence
function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fields' | 'machines' | 'works' | 'repairs' | 'analysis'>('fields');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use persistent state instead of simple useState
  const [fields, setFields] = useLocalStorage<Field[]>('farm_fields', []);
  const [machines, setMachines] = useLocalStorage<Machine[]>('farm_machines', []);
  const [works, setWorks] = useLocalStorage<FieldWork[]>('farm_works', []);
  const [repairs, setRepairs] = useLocalStorage<MachineRepair[]>('farm_repairs', []);
  const [machineTypes, setMachineTypes] = useLocalStorage<string[]>('farm_machine_types', COMMON_MACHINE_TYPES);

  const handleExport = () => {
    const data = {
      fields,
      machines,
      works,
      repairs,
      machineTypes,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        let importedCount = 0;

        if (data.fields && Array.isArray(data.fields)) {
          setFields(data.fields);
          importedCount++;
        }
        if (data.machines && Array.isArray(data.machines)) {
          setMachines(data.machines);
          importedCount++;
        }
        if (data.works && Array.isArray(data.works)) {
          setWorks(data.works);
          importedCount++;
        }
        if (data.repairs && Array.isArray(data.repairs)) {
          setRepairs(data.repairs);
          importedCount++;
        }
        if (data.machineTypes && Array.isArray(data.machineTypes)) {
          setMachineTypes(data.machineTypes);
          importedCount++;
        }
        
        if (importedCount > 0) {
          alert('Data restored successfully! The page will refresh to apply changes.');
          window.location.reload();
        } else {
          alert('No valid farm data found in this file.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to import data. The file might be corrupted or invalid.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: typeof activeTab; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-6 py-3 w-full transition-all duration-200 border-l-4 ${
        activeTab === tab
          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
          : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeTab === tab ? 'text-emerald-500' : 'text-slate-400'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800">FarmOptima</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">MANAGEMENT OS</p>
          </div>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <NavButton tab="fields" icon={Sprout} label="Fields" />
          <NavButton tab="works" icon={ClipboardList} label="Field Works" />
          <NavButton tab="machines" icon={Tractor} label="Machinery" />
          <NavButton tab="repairs" icon={Wrench} label="Repairs" />
          <div className="pt-4 pb-2 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analytics</div>
          <NavButton tab="analysis" icon={BarChart3} label="Fleet Analysis" />
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Summary</p>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Fields</span>
              <span className="font-medium text-slate-800">{fields.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Machines</span>
              <span className="font-medium text-slate-800">{machines.length}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition px-2"
          >
            <Settings className="w-4 h-4" />
            <span>Data Settings</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white border-b border-slate-200 z-20 flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg text-slate-800">FarmOptima</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-30 pt-20 px-4 space-y-2 md:hidden flex flex-col">
          <NavButton tab="fields" icon={Sprout} label="Fields" />
          <NavButton tab="works" icon={ClipboardList} label="Field Works" />
          <NavButton tab="machines" icon={Tractor} label="Machinery" />
          <NavButton tab="repairs" icon={Wrench} label="Repairs" />
          <NavButton tab="analysis" icon={BarChart3} label="Fleet Analysis" />
          
          <div className="mt-auto pb-8 pt-4 border-t border-slate-100">
             <button 
              onClick={() => {
                setIsSettingsOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 w-full text-slate-600 hover:bg-slate-50"
            >
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Data Settings</span>
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full mt-4 p-3 bg-slate-100 rounded-lg text-slate-500 text-sm font-medium"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pt-20 md:pt-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                {activeTab === 'fields' && 'Field Management'}
                {activeTab === 'works' && 'Field Operations Log'}
                {activeTab === 'machines' && 'Equipment Fleet'}
                {activeTab === 'repairs' && 'Maintenance & Repairs'}
                {activeTab === 'analysis' && 'Farm Insights'}
              </h2>
              <p className="text-slate-500 mt-2">
                {activeTab === 'fields' && 'Track your land and acreage.'}
                {activeTab === 'works' && 'Log planting, spraying, and harvesting activities.'}
                {activeTab === 'machines' && 'Manage your tractors, combines, and implements.'}
                {activeTab === 'repairs' && 'Track equipment maintenance history and costs.'}
                {activeTab === 'analysis' && 'Optimize your operation with AI-driven insights.'}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
              <Save className="w-3 h-3" />
              Auto-save enabled
            </div>
          </header>

          <div className="animate-in fade-in zoom-in-95 duration-300">
            {activeTab === 'fields' && <FieldsTab fields={fields} setFields={setFields} />}
            {activeTab === 'works' && <FieldWorksTab fields={fields} works={works} setWorks={setWorks} />}
            {activeTab === 'machines' && <MachinesTab machines={machines} setMachines={setMachines} machineTypes={machineTypes} setMachineTypes={setMachineTypes} />}
            {activeTab === 'repairs' && <MachineRepairsTab machines={machines} repairs={repairs} setRepairs={setRepairs} />}
            {activeTab === 'analysis' && <AnalysisTab fields={fields} machines={machines} />}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                Data Management
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700 flex gap-3">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <p>
                   Since this app runs in your browser, data is stored on this device only. 
                   Use Export/Import to transfer data between your phone and computer.
                 </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-xl hover:border-emerald-500 transition cursor-pointer group" onClick={handleExport}>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Download className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-800">Backup Data (Export)</h4>
                        <p className="text-xs text-slate-500">Download a JSON file of all your fields and machines.</p>
                      </div>
                   </div>
                </div>

                <div className="relative p-4 border border-slate-200 rounded-xl hover:border-blue-500 transition group">
                   <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImport}
                      accept=".json"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-800">Restore Data (Import)</h4>
                        <p className="text-xs text-slate-500">Upload a previously exported JSON file.</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;