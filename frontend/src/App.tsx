import { useState } from 'react';
import EquipmentList from './components/EquipmentList';
import CategoryList from './components/CategoryList';
import MovementList from './components/MovementList';

function App() {
  const [currentTab, setCurrentTab] = useState<'equipments' | 'categories' | 'movements'>('equipments');

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Barra de Navegación / Cabecera */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Sistema de Gestión</h1>
            <p className="text-gray-600 text-sm mt-0.5">Administración de inventario, categorías y movimientos</p>
          </div>

          <nav className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentTab('equipments')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${currentTab === 'equipments'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Equipos
            </button>
            <button
              onClick={() => setCurrentTab('categories')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${currentTab === 'categories'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Categorías
            </button>
            <button
              onClick={() => setCurrentTab('movements')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${currentTab === 'movements'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Movimientos
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal según la pestaña seleccionada */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8">
        {currentTab === 'equipments' && <EquipmentList />}
        {currentTab === 'categories' && <CategoryList />}
        {currentTab === 'movements' && <MovementList />}
      </main>
    </div>
  );
}

export default App;