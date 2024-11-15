import { useState } from "react";

function ModalActivarReseña({ isOpen, onClose, resenaId , obtenerResenas }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOpenActivarModal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/resenas/actresenas/${resenaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error al activar la reseña");
      }

      const data = await response.json();
      
      console.log(data.message); // Mensaje de éxito o error
      obtenerResenas(); // Vuelve a obtener los usuarios actualizados
      onClose(); // Cierra el modal después de la activación
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activar Reseña</h2>
          <p className="text-gray-600 mb-6">¿Estás seguro de que deseas activar esta reseña?</p>

          <div className="flex justify-end gap-4 mt-4">

          <button className={`px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950" ${loading ? 'opacity-50' : ''}`}
                onClick={handleOpenActivarModal}
                disabled={loading}
            >
             {loading ? "Activando..." : "Activar"}
            </button>
            
            <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
              Cancelar
            </button>
            
          </div>
        </div>
      </div>
    );
  }
  
  export default ModalActivarReseña;
  
