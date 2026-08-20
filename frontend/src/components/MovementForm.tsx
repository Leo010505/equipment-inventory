import { useState, useEffect } from 'react';
import { createMovement } from '../services/movement.service';
import { getEquipments } from '../services/equipment.service';
import { getUsers } from '../services/user.service';
import type { Equipment } from '../types/equipment';
import type { User } from '../types/user';
import type { MovementAction } from '../types/movement';

interface MovementFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function MovementForm({ onClose, onSuccess }: MovementFormProps) {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [equipmentId, setEquipmentId] = useState('');
    const [userId, setUserId] = useState('');
    const [action, setAction] = useState<MovementAction>('CHECK_OUT');
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Cargamos equipos y usuarios en paralelo al abrir el modal
        Promise.all([getEquipments(), getUsers()])
            .then(([eqData, userData]) => {
                setEquipments(eqData);
                setUsers(userData);
            })
            .catch(() => setError('Error al cargar equipos o usuarios.'));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!equipmentId || !userId) {
            setError('Por favor selecciona un equipo y un usuario.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await createMovement({
                equipmentId,
                userId,
                action,
                notes: notes.trim() ? notes : undefined,
            });

            onSuccess();
            onClose();
        } catch (err) {
            setError('Error al registrar el movimiento. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Registrar Movimiento / Préstamo</h3>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipo</label>
                        <select
                            required
                            value={equipmentId}
                            onChange={(e) => setEquipmentId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-sm"
                        >
                            <option value="">Selecciona un equipo...</option>
                            {equipments.map((eq) => (
                                <option key={eq.id} value={eq.id}>
                                    {eq.name} ({eq.serialNumber})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario Responsable</label>
                        <select
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-sm"
                        >
                            <option value="">Selecciona un usuario...</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Acción</label>
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value as MovementAction)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-sm"
                        >
                            <option value="CHECK_OUT">Préstamo (CHECK_OUT)</option>
                            <option value="RETURN">Devolución (RETURN)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                            placeholder="Detalles de entrega..."
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors cursor-pointer text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 transition-colors cursor-pointer text-sm"
                        >
                            {loading ? 'Guardando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}