import { useEffect, useState } from 'react';
import type { Category } from '../types/category';
import { getCategories, deleteCategory } from '../services/category.service';
import CategoryForm from './CategoryForm';

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError('Error al cargar las categorías.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await deleteCategory(id);
                fetchCategories();
            } catch (err) {
                alert('No se pudo eliminar la categoría (puede que tenga equipos asociados).');
            }
        }
    };

    const handleOpenCreate = () => {
        setSelectedCategory(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 mt-8">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Gestión de Categorías</h2>
                    <p className="text-indigo-200 text-sm mt-1">Organiza las clasificaciones de los equipos del inventario</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                    + Nueva Categoría
                </button>
            </div>

            {error && (
                <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm shadow-sm">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto p-2 sm:p-6">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Descripción</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-400 animate-pulse font-medium">
                                    Cargando categorías...
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-16 text-center text-gray-400">
                                    No hay categorías registradas.
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-indigo-50/40 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{cat.description || 'Sin descripción'}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenEdit(cat)}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
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

            {isModalOpen && (
                <CategoryForm
                    categoryToEdit={selectedCategory}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchCategories}
                />
            )}
        </div>
    );
}