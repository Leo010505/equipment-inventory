import { useState, useEffect } from 'react';
import { createEquipment, updateEquipment } from '../services/equipment.service';
import { getCategories } from '../services/category.service';
import type { Equipment } from '../types/equipment';
import type { Category } from '../types/category';

interface EquipmentFormProps {
    equipmentToEdit?: Equipment; // Si viene, estamos editando; si no, creando
    onClose: () => void;
    onSuccess: () => void;
}

export default function EquipmentForm({ equipmentToEdit, onClose, onSuccess }: EquipmentFormProps) {
    const [name, setName] = useState(equipmentToEdit?.name || '');
    const [description, setDescription] = useState(equipmentToEdit?.description || '');
    const [serialNumber, setSerialNumber] = useState(equipmentToEdit?.serialNumber || '');

    // Mantenemos la interfaz del frontend ('ACTIVE' | 'MAINTENANCE' | 'RETIRED')
    const [status, setStatus] = useState<'ACTIVE' | 'MAINTENANCE' | 'RETIRED'>(
        equipmentToEdit?.status || 'ACTIVE'
    );

    const [categoryId, setCategoryId] = useState((equipmentToEdit as any)?.category?.id || (equipmentToEdit as any)?.categoryId || '');

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar las categorías al abrir el modal
    useEffect(() => {
        getCategories()
            .then((data) => setCategories(data))
            .catch(() => setError('No se pudieron cargar las categorías'));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) {
            setError('Por favor selecciona una categoría.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Mapeamos el estado del frontend al formato que el DTO del backend acepta ('AVAILABLE' | 'IN_USE' | 'MAINTENANCE')
            let backendStatus = 'AVAILABLE';
            if (status === 'ACTIVE') backendStatus = 'AVAILABLE';
            else if (status === 'MAINTENANCE') backendStatus = 'MAINTENANCE';
            else if (status === 'RETIRED') backendStatus = 'IN_USE';

            // Usamos 'any' en el tipo de status del payload para evitar conflictos de tipado estricto con el backend
            const payload: any = {
                name,
                description,
                serialNumber,
                status: backendStatus,
                categoryId
            };

            if (equipmentToEdit) {
                // Modo Edición
                await updateEquipment(equipmentToEdit.id, payload);
            } else {
                // Modo Creación
                await createEquipment(payload);
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError('Error al guardar el equipo. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {equipmentToEdit ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
                </h3>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Ej. Servidor Principal"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Detalles del equipo..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                        <input
                            type="text"
                            required
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Ej. SN-998822"
                        />
                    </div>

                    {/* Selector de Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            required
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                            <option value="">Selecciona una categoría...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Estado visual intacto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'MAINTENANCE' | 'RETIRED')}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                            <option value="ACTIVE">Activo (ACTIVE)</option>
                            <option value="MAINTENANCE">Mantenimiento (MAINTENANCE)</option>
                            <option value="RETIRED">Retirado (RETIRED)</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Guardando...' : equipmentToEdit ? 'Actualizar Equipo' : 'Guardar Equipo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}