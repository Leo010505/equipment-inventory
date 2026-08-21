import { useState } from 'react';
import { createCategory, updateCategory } from '../services/category.service';
import type { Category } from '../types/category';

interface CategoryFormProps {
    categoryToEdit?: Category;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CategoryForm({ categoryToEdit, onClose, onSuccess }: CategoryFormProps) {
    const [name, setName] = useState(categoryToEdit?.name || '');
    const [description, setDescription] = useState(categoryToEdit?.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (categoryToEdit) {
                await updateCategory(categoryToEdit.id, { name, description });
            } else {
                await createCategory({ name, description });
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError('Error al guardar la categoría. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
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
                            placeholder="Ej. Redes, Servidores..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Breve descripción de la categoría..."
                            rows={3}
                        />
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
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Guardando...' : categoryToEdit ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}