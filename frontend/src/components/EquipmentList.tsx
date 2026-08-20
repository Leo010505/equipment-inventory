import { useEffect, useState, useMemo } from 'react';
import type { Equipment } from '../types/equipment';
import { getEquipments, deleteEquipment } from '../services/equipment.service';
import EquipmentForm from './EquipmentForm';

export default function EquipmentList() {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para búsqueda y filtrado
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    // Estados para controlar el modal (Crear / Editar)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | undefined>(undefined);

    useEffect(() => {
        fetchEquipments();
    }, []);

    const fetchEquipments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getEquipments();
            setEquipments(data);
        } catch (err) {
            setError('Error al conectar con el servidor. Verifica que el backend esté encendido.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
            try {
                await deleteEquipment(id);
                fetchEquipments(); // Recarga la tabla tras eliminar
            } catch (err) {
                alert('Error al eliminar el equipo.');
            }
        }
    };

    const handleOpenCreateModal = () => {
        setSelectedEquipment(undefined); // Limpia por si acaso
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (equipment: Equipment) => {
        setSelectedEquipment(equipment); // Pasa el equipo a editar
        setIsModalOpen(true);
    };

    // Filtrado inteligente en tiempo real de equipos
    const filteredEquipments = useMemo(() => {
        return equipments.filter((eq) => {
            const matchesSearch =
                eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || eq.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [equipments, searchTerm, statusFilter]);

    return (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300">
            {/* Cabecera de la Tarjeta */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Inventario de Equipos</h2>
                    <p className="text-indigo-200 text-sm mt-1">Gestiona y monitorea los dispositivos tecnológicos de la organización</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nuevo Equipo
                </button>
            </div>

            {/* Barra de Búsqueda y Filtros por Estado */}
            <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Input de Búsqueda */}
                <div className="w-full md:w-96 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o N° de serie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                    />
                </div>

                {/* Filtros rápidos por Estado */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    {['ALL', 'ACTIVE', 'MAINTENANCE', 'RETIRED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === status
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status === 'ALL' ? 'TODOS' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mensaje de Error */}
            {error && equipments.length === 0 && (
                <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm shadow-sm">
                    <p className="font-semibold">Atención</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Contenido / Tabla */}
            <div className="overflow-x-auto p-2 sm:p-6">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">N° Serie</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && equipments.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 animate-pulse font-medium">
                                    Cargando registros del inventario...
                                </td>
                            </tr>
                        ) : filteredEquipments.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-base font-medium text-gray-500">No se encontraron equipos coincidentes.</p>
                                        <p className="text-xs text-gray-400">Prueba ajustando tu término de búsqueda o filtro de estado.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredEquipments.map((equipment) => (
                                <tr key={equipment.id} className="hover:bg-indigo-50/40 transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {equipment.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{equipment.serialNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase inline-block ${equipment.status === 'ACTIVE'
                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                : equipment.status === 'MAINTENANCE'
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                            }`}>
                                            {equipment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenEditModal(equipment)}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(equipment.id)}
                                            className="text-rose-600 hover:text-rose-900 font-medium text-sm px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para Crear / Editar equipo */}
            {isModalOpen && (
                <EquipmentForm
                    equipmentToEdit={selectedEquipment}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchEquipments}
                />
            )}
        </div>
    );
}