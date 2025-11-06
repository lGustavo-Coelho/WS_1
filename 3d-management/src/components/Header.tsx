import React from 'react';

interface HeaderProps {
    title: string;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  return (
    <header className="flex justify-between items-center pb-4 mb-8 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-gray-100">{title}</h1>
        <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-emerald-400 border-2 border-gray-800 ring-2 ring-gray-600">
                S
            </div>
            <button 
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-sm transition-all"
            >
                Sair
            </button>
        </div>
    </header>
  );
};

export default Header;
