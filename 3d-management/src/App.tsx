import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import FilamentsPage from './pages/FilamentsPage';
import ComponentsPage from './pages/ComponentsPage';
import PrintersPage from './pages/PrintersPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import QuotesPage from './pages/QuotesPage';
import PrintJobsPage from './pages/PrintJobsPage';
import TransactionsPage from './pages/TransactionsPage';
import InvestmentsPage from './pages/InvestmentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import {
    mockFilaments, mockComponents, mockPrinters, mockProducts,
    mockPrintJobs, mockQuotes, mockSales, mockTransactions, mockInvestments, mockSettings, mockUsers
} from './data/mockData';
import {
    Filament, Component, Printer, Product, PrintJob,
    Quote, Sale, Transaction, Investment, Settings, User
} from './types';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');
    
    // State for all data
    const [filaments, setFilaments] = useState<Filament[]>(mockFilaments);
    const [components, setComponents] = useState<Component[]>(mockComponents);
    const [printers, setPrinters] = useState<Printer[]>(mockPrinters);
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [printJobs, setPrintJobs] = useState<PrintJob[]>(mockPrintJobs);
    const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
    const [sales, setSales] = useState<Sale[]>(mockSales);
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
    const [settings, setSettings] = useState<Settings>(mockSettings);
    const [users] = useState<User[]>(mockUsers);

    const handleLogin = (email: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const matchedUser = users.find(
            (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
        );

        if (matchedUser) {
            setIsAuthenticated(true);
            return true;
        }

        return false;
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const pageTitles: { [key: string]: string } = {
        dashboard: 'Dashboard',
        quotes: 'Orçamentos',
        filaments: 'Gerenciar Filamentos',
        components: 'Gerenciar Componentes',
        printers: 'Gerenciar Impressoras',
        inventory: 'Gerenciar Produtos',
        printJobs: 'Trabalhos de Impressão',
        sales: 'Registrar Venda',
        transactions: 'Transações Financeiras',
        investments: 'Gerenciar Investimentos',
        reports: 'Relatórios Financeiros',
        settings: 'Configurações',
    };

    const dashboardStats = useMemo(() => ({
        filaments: filaments.length,
        printers: printers.length,
        jobs: printJobs.filter(j => j.status === 'printing').length,
        revenue: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    }), [filaments.length, printers.length, printJobs, transactions]);

    const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <DashboardPage 
                stats={dashboardStats}
                recentTransactions={recentTransactions}
                printJobs={printJobs}
                settings={settings}
            />;
            case 'filaments': return <FilamentsPage filaments={filaments} setFilaments={setFilaments} setTransactions={setTransactions} settings={settings} />;
            case 'components': return <ComponentsPage components={components} setComponents={setComponents} setTransactions={setTransactions} settings={settings} />;
            case 'printers': return <PrintersPage printers={printers} setPrinters={setPrinters} setTransactions={setTransactions} />;
            case 'inventory': return <InventoryPage products={products} setProducts={setProducts} filaments={filaments} printers={printers} settings={settings} />;
            case 'sales': return <SalesPage sales={sales} setSales={setSales} products={products} setProducts={setProducts} setTransactions={setTransactions} settings={settings} />;
            case 'quotes': return <QuotesPage quotes={quotes} setQuotes={setQuotes} settings={settings} filaments={filaments} printers={printers} setPrintJobs={setPrintJobs} />;
            case 'printJobs': return <PrintJobsPage printJobs={printJobs} setPrintJobs={setPrintJobs} printers={printers} setPrinters={setPrinters} filaments={filaments} setFilaments={setFilaments} />;
            case 'transactions': return <TransactionsPage transactions={transactions} setTransactions={setTransactions} settings={settings} />;
            case 'investments': return <InvestmentsPage investments={investments} setInvestments={setInvestments} settings={settings} />;
            case 'reports': return <ReportsPage transactions={transactions} sales={sales} investments={investments} settings={settings} />;
            case 'settings': return <SettingsPage settings={settings} setSettings={setSettings} />;
            default: return <div>Página não encontrada</div>;
        }
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-900 font-sans">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
                    <div className="container mx-auto px-6 py-8">
                        <Header title={pageTitles[activePage] || 'Dashboard'} onLogout={handleLogout} />
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
