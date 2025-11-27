
import React, { useState } from 'react';
import { Plus, Trash2, Tractor, Settings, X, Info, Save, Pencil, ArrowUp, ArrowDown } from 'lucide-react';
import { Machine } from '../types';

interface MachinesTabProps {
  machines: Machine[];
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
  machineTypes: string[];
  setMachineTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

export const MachinesTab: React.FC<MachinesTabProps> = ({ machines, setMachines, machineTypes, setMachineTypes }) => {
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('Tractor');
  
  // State for managing types
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  // State for Machine Details Modal
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  
  // Temporary state for the modal form
  const [editManufacturer, setEditManufacturer] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editHp, setEditHp] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editUsage, setEditUsage] = useState('');
  const [editFuel, setEditFuel] = useState('');

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manufacturer || !model || !type) return;

    const newMachine: Machine = {
      id: crypto.randomUUID(),
      manufacturer,
      model,
      name: `${manufacturer} ${model}`,
      type
    };

    setMachines(prev => [...prev, newMachine]);
    setManufacturer('');
    setModel('');
    setType(machineTypes[0] || 'Tractor');
  };

  const removeMachine = (id: string) => {
    setMachines(prev => prev.filter(m => m.id !== id));
  };

  // Type Management Functions
  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName || machineTypes.includes(newTypeName)) return;
    setMachineTypes(prev => [...prev, newTypeName]);
    setNewTypeName('');
  };

  const handleDeleteType = (typeToDelete: string) => {
    setMachineTypes(prev => prev.filter(t => t !== typeToDelete));
  };

  const moveType = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === machineTypes.length - 1) return;

    const newTypes = [...machineTypes];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newTypes[index], newTypes[swapIndex]] = [newTypes[swapIndex], newTypes[index]];
    setMachineTypes(newTypes);
  };

  // Details Modal Functions
  const openDetails = (machine: Machine, viewOnly: boolean) => {
    setSelectedMachine(machine);
    setIsViewMode(viewOnly);
    setEditManufacturer(machine.manufacturer);
    setEditModel(machine.model);
    setEditLicense(machine.licensePlate || '');
    setEditHp(machine.horsepower?.toString() || '');
    setEditYear(machine.year?.toString() || '');
    setEditUsage(machine.usage || '');
    setEditFuel(machine.fuelType || '');
  };

  const closeDetails = () => {
    setSelectedMachine(null);
    setIsViewMode(false);
  };

  const saveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;

    const updatedMachine: Machine = {
      ...selectedMachine,
      manufacturer: editManufacturer,
      model: editModel,
      name: `${editManufacturer} ${editModel}`,
      licensePlate: editLicense,
      horsepower: editHp ? parseFloat(editHp) : undefined,
      year: editYear ? parseInt(editYear) : undefined,
      usage: editUsage,
      fuelType: editFuel
    };

    setMachines(prev => prev.map(m => m.id === selectedMachine.id ? updatedMachine : m));
    closeDetails();
  };

  return (
    <div className="space-y-6">
      <style>{`
        /* Remove spinners for number inputs in this tab */
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .no-spinner {
            -moz-appearance: textfield;
        }
      `}</style>

      {/* Type Manager Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowTypeManager(!showTypeManager)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <Settings className="w-4 h-4" />
          {showTypeManager ? 'Hide Type Manager' : 'Manage Machine Types'}
        </button>
      </div>

      {/* Type Manager Section */}
      {showTypeManager && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
           <h3 className="text-sm font-semibold text-slate-700 mb-3">Manage Machine Types</h3>
           <div className="flex gap-2 mb-4">
             <input 
                type="text" 
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="New type name (e.g. Drone)"
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-black outline-none focus:border-blue-500"
             />
             <button 
                onClick={handleAddType}
                disabled={!newTypeName}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
             >
               Add
             </button>
           </div>
           <div className="space-y-2">
             {machineTypes.map((t, index) => (
               <div key={t} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-sm">
                 <span className="text-slate-800 font-medium">{t}</span>
                 <div className="flex items-center gap-1">
                   <button 
                    onClick={() => moveType(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"
                   >
                     <ArrowUp className="w-4 h-4" />
                   </button>
                   <button 
                    onClick={() => moveType(index, 'down')}
                    disabled={index === machineTypes.length - 1}
                    className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"
                   >
                     <ArrowDown className="w-4 h-4" />
                   </button>
                   <div className="w-px h-4 bg-slate-200 mx-1"></div>
                   <button onClick={() => handleDeleteType(t)} className="p-1 text-slate-400 hover:text-red-500">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Machine
        </h2>
        <form onSubmit={handleAddMachine} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
            <input
              type="text"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
              placeholder="e.g. John Deere"
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
              placeholder="e.g. 8R 410"
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black appearance-none"
            >
              {machineTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Machine
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-4">
           <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Machines</p>
              <p className="text-2xl font-bold text-blue-900">{machines.length} units</p>
            </div>
            <Tractor className="w-8 h-8 text-blue-400 opacity-50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {machines.length === 0 ? (
               <div className="col-span-2 py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                  <Tractor className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No machines in the fleet.</p>
               </div>
            ) : (
              machines.map((machine) => (
                <div key={machine.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition relative flex flex-col justify-between overflow-hidden">
                  <div className="p-4 relative">
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={() => openDetails(machine, false)} // Edit Mode
                        className="text-slate-300 hover:text-blue-500 transition"
                        title="Edit Details"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeMachine(machine.id)}
                        className="text-slate-300 hover:text-red-500 transition"
                        title="Delete Machine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Tractor className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{machine.manufacturer}</h3>
                        <p className="text-slate-600 font-medium">{machine.model}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wide">
                          {machine.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openDetails(machine, true)} // View Mode
                    className="w-full py-2 bg-slate-50 border-t border-slate-100 text-blue-600 text-sm font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" /> View Details
                  </button>
                </div>
              ))
            )}
          </div>
      </div>

      {/* Machine Details Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Tractor className="w-5 h-5 text-blue-600" />
                {isViewMode ? 'Machine Details' : 'Edit Machine'}
              </h3>
              <button onClick={closeDetails} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={saveDetails} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Manufacturer</label>
                    <input
                      type="text"
                      disabled={isViewMode}
                      value={editManufacturer}
                      onChange={e => setEditManufacturer(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none ${isViewMode ? 'bg-slate-50 text-slate-600 border-transparent' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Model</label>
                    <input
                      type="text"
                      disabled={isViewMode}
                      value={editModel}
                      onChange={e => setEditModel(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none ${isViewMode ? 'bg-slate-50 text-slate-600 border-transparent' : ''}`}
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">License Plate</label>
                  <input
                    type="text"
                    disabled={isViewMode}
                    value={editLicense}
                    onChange={e => setEditLicense(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none ${isViewMode ? 'bg-slate-50 text-slate-600 border-transparent' : ''}`}
                    placeholder={!isViewMode ? "e.g. AG-1234" : ""}
                  />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Horsepower</label>
                    <input
                      type="number"
                      disabled={isViewMode}
                      value={editHp}
                      onChange={e => setEditHp(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none no-spinner ${isViewMode ? 'bg-slate-50 text-slate-600 border-transparent' : ''}`}
                      placeholder={!isViewMode ? "e.g. 350" : ""}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Year</label>
                    <input
                      type="number"
                      disabled={isViewMode}
                      value={editYear}
                      onChange={e => setEditYear(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none no-spinner ${isViewMode ? 'bg-slate-50 text-slate-600 border-transparent' : ''}`}
                      placeholder={!isViewMode ? "e.g. 2022" : ""}
                    />
                 </div>
               </div>

               <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Usage (Hours/Km)</label>
                  <input
                    type="text"
                    disabled={isViewMode}
                    value={editUsage}
                    onChange={e => setEditUsage(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none ${isViewMode ? 'bg-slate-50 text-slate-600 border-transparent' : ''}`}
                    placeholder={!isViewMode ? "e.g. 1200 hrs" : ""}
                  />
               </div>

               <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fuel Type</label>
                  <input
                    type="text"
                    disabled={isViewMode}
                    value={editFuel}
                    onChange={e => setEditFuel(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none ${isViewMode ? 'bg-slate-50 text-slate-600 border-transparent' : ''}`}
                    placeholder={!isViewMode ? "e.g. Diesel" : ""}
                  />
               </div>

               <div className="pt-4 flex gap-3">
                 {isViewMode ? (
                   <button
                     type="button"
                     onClick={closeDetails}
                     className="w-full py-2 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
                   >
                     Close
                   </button>
                 ) : (
                   <>
                     <button
                       type="button"
                       onClick={closeDetails}
                       className="flex-1 py-2 px-4 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                     >
                       <Save className="w-4 h-4" /> Save
                     </button>
                   </>
                 )}
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};