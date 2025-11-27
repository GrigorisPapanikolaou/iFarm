
import React, { useState } from 'react';
import { Plus, Calendar, ClipboardList, Trash2, Filter } from 'lucide-react';
import { Field, FieldWork } from '../types';

interface FieldWorksTabProps {
  fields: Field[];
  works: FieldWork[];
  setWorks: React.Dispatch<React.SetStateAction<FieldWork[]>>;
}

export const FieldWorksTab: React.FC<FieldWorksTabProps> = ({ fields, works, setWorks }) => {
  const [fieldId, setFieldId] = useState('');
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  
  // Filter state
  const [filterFieldId, setFilterFieldId] = useState<string>('all');
  const [filterTask, setFilterTask] = useState<string>('all');

  const handleAddWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId || !task || !date) return;

    const newWork: FieldWork = {
      id: crypto.randomUUID(),
      fieldId,
      task,
      date,
      notes
    };

    setWorks(prev => [newWork, ...prev]);
    setTask('');
    setNotes('');
  };

  const removeWork = (id: string) => {
    setWorks(prev => prev.filter(w => w.id !== id));
  };

  const getFieldName = (id: string) => fields.find(f => f.id === id)?.name || 'Unknown Field';

  // Get unique tasks for the dropdown
  const uniqueTasks = Array.from(new Set(works.map(w => w.task))).sort();

  const filteredWorks = works.filter(w => {
    const matchesField = filterFieldId === 'all' || w.fieldId === filterFieldId;
    const matchesTask = filterTask === 'all' || w.task === filterTask;
    return matchesField && matchesTask;
  });

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Log Field Work
        </h2>
        {fields.length === 0 ? (
          <div className="text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
            Please add fields in the "Fields" tab before logging work.
          </div>
        ) : (
          <form onSubmit={handleAddWork} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Field</label>
              <select
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-black"
                required
              >
                <option value="">-- Choose Field --</option>
                {fields.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.acres} ac)</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-black"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Task Performed</label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="e.g. Planting Corn, Spraying Herbicide, Soil Testing"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-black"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details about products used, weather conditions, etc."
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition h-20 resize-none text-black"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Work Record
              </button>
            </div>
          </form>
        )}
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" /> Recent Work History
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
             <div className="relative w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filterTask}
                  onChange={(e) => setFilterTask(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-black focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                >
                  <option value="all">All Tasks</option>
                  {uniqueTasks.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
             </div>
            <div className="relative w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filterFieldId}
                  onChange={(e) => setFilterFieldId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-black appearance-none"
                >
                  <option value="all">All Fields</option>
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Field</th>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Notes</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      {(filterFieldId === 'all' && filterTask === 'all')
                        ? 'No work records logged yet.' 
                        : 'No matching work records found.'}
                    </td>
                  </tr>
                ) : (
                  filteredWorks.map((work) => (
                    <tr key={work.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {work.date}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-emerald-700">{getFieldName(work.fieldId)}</td>
                      <td className="px-6 py-3 text-slate-800 font-medium">{work.task}</td>
                      <td className="px-6 py-3 text-slate-500 truncate max-w-xs">{work.notes || '-'}</td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => removeWork(work.id)}
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
