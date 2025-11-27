import React, { useState } from 'react';
import { FieldsTab } from './components/FieldsTab';
import { MachinesTab } from './components/MachinesTab';
import { AnalysisTab } from './components/AnalysisTab';
import { FieldWorksTab } from './components/FieldWorksTab';
import { MachineRepairsTab } from './components/MachineRepairsTab';
import { Field, Machine, FieldWork, MachineRepair, COMMON_MACHINE_TYPES } from './types';
import { Sprout, Tractor, BarChart3, Menu, ClipboardList, Wrench } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fields' | 'machines' | 'works' | 'repairs' | 'analysis'>('fields');
  const [fields, setFields] = useState<Field[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [works, setWorks] = useState<FieldWork[]>([]);
  const [repairs, setRepairs] = useState<MachineRepair[]>([]);
  const [machineTypes, setMachineTypes] = useState<string[]>(COMMON_MACHINE_TYPES);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        <div className="p-6 border-t border-slate-100">
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
        <div className="fixed inset-0 bg-white z-30 pt-20 px-4 space-y-2 md:hidden">
          <NavButton tab="fields" icon={Sprout} label="Fields" />
          <NavButton tab="works" icon={ClipboardList} label="Field Works" />
          <NavButton tab="machines" icon={Tractor} label="Machinery" />
          <NavButton tab="repairs" icon={Wrench} label="Repairs" />
          <NavButton tab="analysis" icon={BarChart3} label="Fleet Analysis" />
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full mt-8 p-3 bg-slate-100 rounded-lg text-slate-500 text-sm font-medium"
          >
            Close Menu
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pt-20 md:pt-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
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
    </div>
  );
};

export default App;