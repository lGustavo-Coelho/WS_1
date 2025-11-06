import React from 'react';
import { Transaction, PrintJob, Settings } from '../types';
import { PrinterIcon, FilamentIcon, DollarSignIcon, ClipboardListIcon, TrendingUpIcon, WalletIcon } from '../components/Icons';

interface DashboardStats {
  filaments: number;
  printers: number;
  jobs: number;
  revenue: number;
}

interface DashboardPageProps {
  stats: DashboardStats;
  recentTransactions: Transaction[];
  printJobs: PrintJob[];
  settings: Settings;
}

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, color: string }> = ({ icon, title, value, color }) => (
    <div className={`bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center space-x-4`}>
        <div className={`rounded-full p-3 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-100">{value}</p>
        </div>
    </div>
);


const DashboardPage: React.FC<DashboardPageProps> = ({ stats, recentTransactions, printJobs, settings }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  const activeJobs = printJobs.filter(j => j.status === 'printing');
  const queuedJobs = printJobs.filter(j => j.status === 'queued');

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FilamentIcon className="h-6 w-6 text-white"/>} title="Tipos de Filamento" value={stats.filaments} color="bg-blue-500" />
        <StatCard icon={<PrinterIcon className="h-6 w-6 text-white"/>} title="Impressoras Ativas" value={stats.printers} color="bg-green-500" />
        <StatCard icon={<ClipboardListIcon className="h-6 w-6 text-white"/>} title="Trabalhos Atuais" value={stats.jobs} color="bg-yellow-500" />
        <StatCard icon={<DollarSignIcon className="h-6 w-6 text-white"/>} title="Receita Total" value={formatCurrency(stats.revenue)} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center"><WalletIcon className="h-5 w-5 mr-2 text-gray-400"/> Transações Recentes</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-sm text-gray-400">
                            <th className="py-2">Descrição</th>
                            <th className="py-2">Data</th>
                            <th className="py-2 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map(t => (
                            <tr key={t.id} className="border-t border-gray-700">
                                <td className="py-3 font-medium text-gray-200">{t.description}</td>
                                <td className="py-3 text-gray-400">{formatDate(t.date)}</td>
                                <td className={`py-3 text-right font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                    {t.type === 'expense' && '- '}{formatCurrency(t.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Print Jobs Overview */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center"><TrendingUpIcon className="h-5 w-5 mr-2 text-gray-400"/> Status dos Trabalhos</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-300">Em Impressão ({activeJobs.length})</h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-400">
                        {activeJobs.map(job => <li key={job.id}>{job.name}</li>)}
                        {activeJobs.length === 0 && <p className="text-gray-500">Nenhum trabalho em andamento.</p>}
                    </ul>
                </div>
                <div className="pt-4 border-t border-gray-700">
                    <h4 className="font-semibold text-gray-300">Na Fila ({queuedJobs.length})</h4>
                     <ul className="mt-2 space-y-2 text-sm text-gray-400">
                        {queuedJobs.map(job => <li key={job.id}>{job.name}</li>)}
                        {queuedJobs.length === 0 && <p className="text-gray-500">Fila de impressão vazia.</p>}
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
