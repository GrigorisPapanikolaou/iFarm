
import React, { useState } from 'react';
import { Plus, Wrench, Calendar, Trash2, DollarSign, Clock } from 'lucide-react';
import { Machine, MachineRepair } from '../types';

interface MachineRepairsTabProps {
  machines: Machine[];
  repairs: MachineRepair[];
  setRepairs: React.Dispatch<React.SetStateAction<MachineRepair[]>>;
}

export const MachineRepairsTab: React.FC<MachineRepairsTabProps> = ({ machines, repairs, setRepairs }) => {
  const [machineId, setMachineId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');

  const handleAddRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineId || !description || !date) return;

    const newRepair: MachineRepair = {
      id: crypto.randomUUID(),
      machineId,
      description,
      date,
      cost: cost ? parseFloat(cost) : undefined,
      nextDueDate: nextDueDate || undefined
    };

    setRepairs(prev => [newRepair, ...prev]);
    setDescription('');
    setCost('');
    setNextDueDate('');
    // Keep date and machine selection for convenience
  };

  const removeRepair = (id: string) => {
    setRepairs(prev => prev.filter(r => r.id !== id));
  };

  const getMachineName = (id: string) => machines.find(m => m.id === id)?.name || 'Unknown Machine';

  const totalCost = repairs.reduce((sum, r) => sum + (r.cost || 0), 0);

  // Helper to check if next due date is close (within 7 days)
  const isUpcoming = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays >= 0 && diffDays <= 14; // Highlight if due within 2 weeks
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
      
      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Log Repair / Maintenance
        </h2>
        {machines.length === 0 ? (
          <div className="text-blue-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
             Please add machines in the "Machinery" tab before logging repairs.
          </div>
        ) : (
          <form onSubmit={handleAddRepair} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Machine</label>
              <select
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
                required
              >
                <option value="">-- Choose Machine --</option>
                {machines.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Repair Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Repair Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Oil Change, Replace Hydraulic Hose, Tire Repair"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black no-spinner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Next Due Date (Reminder)</label>
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Repair Record
              </button>
            </div>
          </form>
        )}
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Wrench className="w-5 h-5" /> Maintenance Log
          </h3>
          {totalCost > 0 && (
            <div className="bg-slate-100 px-4 py-2 rounded-lg flex items-center gap-2 text-slate-700 font-medium">
              <span>Total Maintenance Cost:</span>
              <span className="text-slate-900 font-bold">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Machine</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-right">Cost</th>
                  <th className="px-6 py-3">Next Due</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {repairs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No repair records logged yet.
                    </td>
                  </tr>
                ) : (
                  repairs.map((repair) => (
                    <tr key={repair.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {repair.date}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-blue-700">{getMachineName(repair.machineId)}</td>
                      <td className="px-6 py-3 text-slate-800 font-medium">{repair.description}</td>
                      <td className="px-6 py-3 text-right font-medium text-slate-700">
                        {repair.cost ? `$${repair.cost.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-3">
                         {repair.nextDueDate ? (
                           <div className={`flex items-center gap-1.5 ${isUpcoming(repair.nextDueDate) ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
                             <Clock className="w-3.5 h-3.5" />
                             {repair.nextDueDate}
                             {isUpcoming(repair.nextDueDate) && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Soon</span>}
                           </div>
                         ) : (
                           <span className="text-slate-400">-</span>
                         )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => removeRepair(repair.id)}
                          className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};