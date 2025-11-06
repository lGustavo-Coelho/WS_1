import React, { useMemo } from 'react';
import { Transaction, Sale, Investment, Settings, TransactionCategory } from '../types';
import { ShoppingCartIcon, TrendingUpIcon, WalletIcon } from '../components/Icons';

// --- Chart Components (embedded here to avoid creating new files) ---

// BarChart component
interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      color: string;
    }[];
  };
  title: string;
  settings: Settings;
}

const BarChart: React.FC<BarChartProps> = ({ data, title, settings }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);
  const maxValue = Math.max(1, ...data.datasets.flatMap(d => d.data)); // Ensure maxValue is at least 1 to avoid division by zero
  const chartHeight = 250;
  const barWidth = 25;
  const numSets = data.datasets.length;
  const groupWidth = numSets * barWidth;
  const groupGap = 30;
  const chartWidth = data.labels.length * (groupWidth + groupGap);

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
      <div className="overflow-x-auto pb-4">
        <div className="flex" style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}>
          {data.labels.map((label, index) => (
            <div key={label} className="flex-1 flex flex-col justify-end items-center">
              <div className="flex items-end" style={{ height: `${chartHeight}px` }}>
                {data.datasets.map(dataset => {
                  const value = dataset.data[index] || 0;
                  const barHeight = (value / maxValue) * chartHeight;
                  return (
                    <div key={dataset.label} className="mx-1 group relative transition-all duration-300 hover:opacity-80" style={{ width: `${barWidth}px`, height: `${barHeight}px`, backgroundColor: dataset.color }}>
                       <div className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {dataset.label}: {formatCurrency(value)}
                      </div>
                    </div>
                  )
                })}
              </div>
              <span className="text-xs text-gray-400 mt-2">{label}</span>
            </div>
          ))}
        </div>
      </div>
       <div className="flex justify-center mt-4 space-x-4">
        {data.datasets.map(dataset => (
          <div key={dataset.label} className="flex items-center text-sm text-gray-400">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: dataset.color }}></span>
            <span>{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// PieChart Component
interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title: string;
  settings: Settings;
}

const PIE_CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const PieChart: React.FC<PieChartProps> = ({ data, title, settings }) => {
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);
    const total = data.values.reduce((a, b) => a + b, 0);

    if (total === 0) {
        return (
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-gray-500">Nenhum dado de despesa para exibir.</p>
                </div>
            </div>
        );
    }
    
    const getGradient = () => {
        let gradientParts: string[] = [];
        let cumulativePercent = 0;
        data.values.forEach((value, i) => {
            const percent = value / total;
            const startAngle = cumulativePercent * 360;
            const endAngle = (cumulativePercent + percent) * 360;
            gradientParts.push(`${PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]} ${startAngle}deg ${endAngle}deg`);
            cumulativePercent += percent;
        });
        return `conic-gradient(${gradientParts.join(', ')})`;
    }

    return (
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 h-full">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div 
                    className="w-40 h-40 rounded-full flex-shrink-0"
                    style={{ background: getGradient() }}
                    role="img"
                    aria-label={`Gráfico de pizza: ${title}`}
                ></div>
                <div className="text-sm space-y-2 w-full">
                    {data.labels.map((label, i) => (
                        <div key={label} className="flex items-center justify-between">
                            <div className="flex items-center text-gray-300">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_CHART_COLORS[i % PIE_CHART_COLORS.length] }}></span>
                                <span>{label}</span>
                            </div>
                            <span className="font-semibold text-gray-200">{formatCurrency(data.values[i])} <span className="text-gray-400">({((data.values[i] / total) * 100).toFixed(1)}%)</span></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


// --- Main Page Component ---

interface ReportsPageProps {
  transactions: Transaction[];
  sales: Sale[];
  investments: Investment[];
  settings: Settings;
}

const ReportCard: React.FC<{ title: string, value: string, icon: React.ReactNode, change?: string, changeColor?: string }> = ({ title, value, icon, change, changeColor }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-400">{title}</h3>
             {icon}
        </div>
        <div className="flex items-baseline mt-2">
            <p className="text-3xl font-bold text-gray-100">{value}</p>
            {change && <span className={`ml-2 text-sm font-semibold ${changeColor}`}>{change}</span>}
        </div>
    </div>
);

const ReportsPage: React.FC<ReportsPageProps> = ({ transactions, sales, investments, settings }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);

  // Memoized calculations for performance
  const financialSummary = useMemo(() => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let totalRevenue = 0;
    let totalExpenses = 0;
    const monthlyData: { [key: string]: { income: number, expense: number } } = {};
    const expenseByCategory: { [key in TransactionCategory]?: number } = {};

    sortedTransactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        totalRevenue += t.amount;
        monthlyData[month].income += t.amount;
      } else {
        totalExpenses += t.amount;
        monthlyData[month].expense += t.amount;
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      }
    });

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      monthlyData,
      expenseByCategory,
    };
  }, [transactions]);

  const monthlyChartData = useMemo(() => {
    const labels = Object.keys(financialSummary.monthlyData);
    const incomeData = labels.map(l => financialSummary.monthlyData[l].income);
    const expenseData = labels.map(l => financialSummary.monthlyData[l].expense);
    return {
        labels,
        datasets: [
            { label: 'Receita', data: incomeData, color: '#34D399' },
            { label: 'Despesa', data: expenseData, color: '#F87171' }
        ]
    };
  }, [financialSummary.monthlyData]);

  const expenseChartData = useMemo(() => {
    const sortedCategories = Object.entries(financialSummary.expenseByCategory)
      .sort(([, a], [, b]) => b - a);
      
    return {
        labels: sortedCategories.map(([label]) => label),
        values: sortedCategories.map(([, value]) => value)
    }
  }, [financialSummary.expenseByCategory]);

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard 
                title="Receita Bruta" 
                value={formatCurrency(financialSummary.totalRevenue)} 
                icon={<WalletIcon className="h-7 w-7 text-green-400"/>} 
            />
            <ReportCard 
                title="Despesas Totais" 
                value={formatCurrency(financialSummary.totalExpenses)} 
                icon={<ShoppingCartIcon className="h-7 w-7 text-red-400"/>} 
            />
             <ReportCard 
                title="Lucro Líquido" 
                value={formatCurrency(financialSummary.netProfit)} 
                icon={<TrendingUpIcon className={`h-7 w-7 ${financialSummary.netProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}/>} 
            />
        </div>

        <BarChart 
            data={monthlyChartData} 
            title="Receitas vs. Despesas Mensais"
            settings={settings}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PieChart 
                data={expenseChartData} 
                title="Despesas por Categoria" 
                settings={settings}
            />
             <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Outras Métricas</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Investido em Ativos</span>
                        <span className="font-bold text-lg text-gray-200">{formatCurrency(investments.reduce((sum, i) => sum + i.initialCost, 0))}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-400">Número Total de Vendas</span>
                        <span className="font-bold text-lg text-gray-200">{sales.length}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-400">Ticket Médio por Venda</span>
                        <span className="font-bold text-lg text-gray-200">{formatCurrency(sales.length > 0 ? sales.reduce((sum, s) => sum + s.total, 0) / sales.length : 0)}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default ReportsPage;
