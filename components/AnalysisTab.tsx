import React, { useState } from 'react';
import { Field, Machine, AnalysisResult } from '../types';
import { analyzeFarmData } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Sparkles, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AnalysisTabProps {
  fields: Field[];
  machines: Machine[];
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({ fields, machines }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await analyzeFarmData(fields, machines);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = fields.map(f => ({
    name: f.name,
    acres: f.acres
  }));

  const machineTypeData = Object.values(machines.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map((count, i, arr) => {
      // Reconstruct simple object for PieChart, key not strictly needed if index-based mapping
      // But let's be cleaner
      const types = Object.keys(machines.reduce((acc, curr) => {
        acc[curr.type] = 1;
        return acc;
      }, {} as Record<string, number>));
      return { name: types[i], value: count };
  });


  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Acreage by Field</h3>
          {fields.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="acres" fill="#10b981" radius={[4, 4, 0, 0]}>
                   {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">No field data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Machine Fleet Distribution</h3>
          {machines.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={machineTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {machineTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">No machine data available</div>
          )}
        </div>
      </div>

      {/* AI Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              AI Farm Consultant
            </h2>
            <p className="text-indigo-600/80 mt-1">
              Generate optimization insights based on your current fields and equipment.
            </p>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || (fields.length === 0 && machines.length === 0)}
            className={`px-6 py-3 rounded-xl font-semibold shadow-sm flex items-center gap-2 transition ${
              loading || (fields.length === 0 && machines.length === 0)
                ? 'bg-indigo-200 text-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                <p className="text-sm font-medium text-slate-500 mb-2">Efficiency Score</p>
                <div className="flex items-end gap-2">
                  <span className={`text-4xl font-bold ${
                    analysis.efficiencyScore >= 80 ? 'text-green-600' :
                    analysis.efficiencyScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {analysis.efficiencyScore}
                  </span>
                  <span className="text-slate-400 mb-1">/ 100</span>
                </div>
              </div>
              <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                <p className="text-sm font-medium text-slate-500 mb-2">Executive Summary</p>
                <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                Strategic Recommendations
              </h3>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                    <span className="bg-indigo-100 text-indigo-600 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};