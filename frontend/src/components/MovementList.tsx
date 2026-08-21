import { useEffect, useState } from 'react';
import type { Movement } from '../types/movement';
import { getMovements } from '../services/movement.service';
import MovementForm from './MovementForm';

export default function MovementList() {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMovements();
            setMovements(data);
        } catch (err) {
            setError('Error al cargar el historial de movimientos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Historial de Movimientos</h2>
                    <p className="text-indigo-200 text-sm mt-1">Auditoría de asignaciones, devoluciones y mantenimientos</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                    + Nuevo Movimiento
                </button>
            </div>

            {error && movements.length === 0 && (
                <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm shadow-sm">
                    <p className="font-semibold">Atención</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="overflow-x-auto p-2 sm:p-6">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                            <th className="px-6 py-4">Equipo</th>
                            <th className="px-6 py-4">Responsable</th>
                            <th className="px-6 py-4">Acción</th>
                            <th className="px-6 py-4">Notas</th>
                            <th className="px-6 py-4">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && movements.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 animate-pulse font-medium">
                                    Cargando movimientos...
                                </td>
                            </tr>
                        ) : movements.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                                    No hay movimientos registrados.
                                </td>
                            </tr>
                        ) : (
                            movements.map((mov) => (
                                <tr key={mov.id} className="hover:bg-indigo-50/40 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {mov.equipment?.name || 'Equipo desconocido'}
                                        <span className="block text-xs text-gray-400 font-mono">{mov.equipment?.serialNumber}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 text-sm">
                                        {mov.user?.name || 'Usuario desconocido'}
                                        <span className="block text-xs text-gray-400">{mov.user?.email}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase inline-block ${mov.action === 'CHECK_OUT'
                                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            }`}>
                                            {mov.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{mov.notes || 'Sin observaciones'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">
                                        {new Date(mov.createdAt).toLocaleDateString()} {new Date(mov.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <MovementForm
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchMovements}
                />
            )}
        </div>
    );
}