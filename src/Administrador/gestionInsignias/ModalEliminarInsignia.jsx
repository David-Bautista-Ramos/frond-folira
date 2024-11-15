import { useState } from "react";

function ModalEliminarInsignia({ isOpen, onClose, insigniaId, obtenerInsignias }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOpenDeleteModal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/insignia/insignia/${insigniaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la insignia");
      }

      const data = await response.json();
      console.log(data.message); // Mensaje de éxito o error
      obtenerInsignias(); // Vuelve a obtener las insignias actualizadas
      onClose(); // Cierra el modal después de la activación
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Eliminar Insignia</h2>
        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar esta insignia?</p>
        <div className="flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950 ${loading ? 'opacity-50' : ''}`}
            onClick={handleOpenDeleteModal}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminarInsignia;
