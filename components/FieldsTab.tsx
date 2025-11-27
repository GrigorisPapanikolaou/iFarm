import React, { useState } from 'react';
import { Plus, Trash2, Map } from 'lucide-react';
import { Field } from '../types';

interface FieldsTabProps {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
}

export const FieldsTab: React.FC<FieldsTabProps> = ({ fields, setFields }) => {
  const [name, setName] = useState('');
  const [acres, setAcres] = useState('');

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !acres) return;

    const newField: Field = {
      id: crypto.randomUUID(),
      name,
      acres: parseFloat(acres),
      cropType: 'Unspecified'
    };

    setFields(prev => [...prev, newField]);
    setName('');
    setAcres('');
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const totalAcres = fields.reduce((sum, f) => sum + f.acres, 0);

  return (
    <div className="space-y-6">
      <style>{`
        /* Target Webkit browsers (Chrome, Edge, Safari) */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
            opacity: 1;
            filter: grayscale(100%);
            background: #f1f5f9; /* Slate-100 to make it look neutral/grey */
            height: 100%;
        }
      `}</style>
      
      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Field
        </h2>
        <form onSubmit={handleAddField} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Field Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-black"
              placeholder="e.g. North 40"
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Acres</label>
            <input
              type="number"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-black"
              placeholder="0.0"
              step="0.1"
              min="0"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Field
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div>
            <p className="text-sm text-emerald-600 font-medium">Total Acreage</p>
            <p className="text-2xl font-bold text-emerald-900">{totalAcres.toLocaleString()} acres</p>
          </div>
          <Map className="w-8 h-8 text-emerald-400 opacity-50" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3 text-right">Acres</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fields.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                      No fields added yet.
                    </td>
                  </tr>
                ) : (
                  fields.map((field) => (
                    <tr key={field.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3 font-medium text-slate-800">{field.name}</td>
                      <td className="px-6 py-3 text-right">{field.acres}</td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => removeField(field.id)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
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