import React from 'react';
import { 
    HomeIcon, PackageIcon, ShoppingCartIcon, FileTextIcon, 
    FilamentIcon, WrenchIcon, PrinterIcon, ClipboardListIcon,
    CreditCardIcon, TrendingUpIcon, CalendarIcon, SettingsIcon
} from './Icons';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`flex items-center p-3 text-base font-medium rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-emerald-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      <span className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-100'}>
        {icon}
      </span>
      <span className="ml-3 flex-1 whitespace-nowrap">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
        { id: 'quotes', label: 'Orçamentos', icon: <FileTextIcon className="w-6 h-6" /> },
        { id: 'filaments', label: 'Gerenciar Filamentos', icon: <FilamentIcon className="w-6 h-6" /> },
        { id: 'components', label: 'Gerenciar Componentes', icon: <WrenchIcon className="w-6 h-6" /> },
        { id: 'printers', label: 'Gerenciar Impressoras', icon: <PrinterIcon className="w-6 h-6" /> },
        { id: 'inventory', label: 'Gerenciar Produtos', icon: <PackageIcon className="w-6 h-6" /> },
        { id: 'printJobs', label: 'Trabalhos de Impressão', icon: <ClipboardListIcon className="w-6 h-6" /> },
        { id: 'sales', label: 'Registrar Venda', icon: <ShoppingCartIcon className="w-6 h-6" /> },
        { id: 'transactions', label: 'Transações Financeiras', icon: <CreditCardIcon className="w-6 h-6" /> },
        { id: 'investments', label: 'Gerenciar Investimentos', icon: <TrendingUpIcon className="w-6 h-6" /> },
        { id: 'reports', label: 'Relatórios Financeiros', icon: <CalendarIcon className="w-6 h-6" /> },
        { id: 'settings', label: 'Configurações', icon: <SettingsIcon className="w-6 h-6" /> },
    ]
  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="overflow-y-auto py-6 px-4 bg-gray-800 h-full border-r border-gray-700">
        <ul className="space-y-2">
            {navItems.map(item => (
                <NavItem 
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    isActive={activePage === item.id}
                    onClick={() => setActivePage(item.id)}
                />
            ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
