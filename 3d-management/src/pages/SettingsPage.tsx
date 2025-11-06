import React, { useState } from 'react';
import { Settings } from '../types';

interface SettingsPageProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, setSettings }) => {
  const [formData, setFormData] = useState<Settings>(settings);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newState = { ...prev };
        if (name === 'currency') {
            newState.currency = value as 'BRL' | 'USD';
        } else {
            newState[name as 'kwhCost' | 'profitMargin' | 'designHourlyRate' | 'preparationHourlyRate' | 'postProcessingHourlyRate'] = parseFloat(value) || 0;
        }
        return newState;
    });
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      setSettings(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide message after 3 seconds
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-200 mb-6">Configurações Gerais</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Símbolo da Moeda</label>
          <select 
            name="currency" 
            value={formData.currency} 
            onChange={handleChange}
            className="mt-1"
          >
            <option value="BRL">Real Brasileiro (BRL)</option>
            <option value="USD">Dólar Americano (USD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Custo do kWh de Energia</label>
          <input 
            type="number" 
            step="0.01"
            name="kwhCost" 
            value={formData.kwhCost} 
            onChange={handleChange}
            className="mt-1"
           />
           <p className="mt-1 text-xs text-gray-400">Usado para calcular o custo de energia das impressões.</p>
        </div>
        
        <div className="pt-4 border-t border-gray-700">
             <h3 className="text-lg font-semibold text-gray-300">Custos de Mão de Obra</h3>
             <p className="mt-1 text-sm text-gray-400 mb-4">Defina os valores por hora para cada etapa do processo. Eles serão usados no cálculo de orçamentos.</p>
             <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-300">Custo da Hora de Design/Modelagem</label>
                  <input type="number" step="0.01" name="designHourlyRate" value={formData.designHourlyRate} onChange={handleChange} className="mt-1" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-300">Custo da Hora de Preparação</label>
                  <input type="number" step="0.01" name="preparationHourlyRate" value={formData.preparationHourlyRate} onChange={handleChange} className="mt-1" />
                  <p className="mt-1 text-xs text-gray-400">Cobre o tempo para fatiar modelos, preparar arquivos e a impressora.</p>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-300">Custo da Hora de Pós-Processamento</label>
                  <input type="number" step="0.01" name="postProcessingHourlyRate" value={formData.postProcessingHourlyRate} onChange={handleChange} className="mt-1" />
                   <p className="mt-1 text-xs text-gray-400">Inclui remoção de suportes, lixamento, pintura, etc.</p>
                </div>
             </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Precificação</h3>
             <div>
              <label className="block text-sm font-medium text-gray-300">Margem de Lucro Padrão (%)</label>
               <input 
                type="number" 
                step="1"
                name="profitMargin" 
                value={formData.profitMargin} 
                onChange={handleChange}
                className="mt-1"
               />
               <p className="mt-1 text-xs text-gray-400">Usado como base para calcular preços em orçamentos.</p>
            </div>
        </div>

        <div className="pt-4 flex justify-end items-center gap-4">
            {showSuccess && <p className="text-sm text-green-400 font-semibold">Configurações salvas com sucesso!</p>}
            <button type="submit" className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">
                Salvar Alterações
            </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
