import { useState, useCallback, useEffect } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"; 
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const LibrosTuyos = () => {
  const queryClient = useQueryClient();
  const [librosGuardados, setLibrosGuardados] = useState([]);
  const [filtro, setFiltro] = useState(""); // Estado para manejar el filtro
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [isLoading, setIsLoading] = useState(true);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const booksPerPage = 6; // Libros por página

  const fetchLibrosGuardados = useCallback(async () => {
    if (!authUser || !authUser._id) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/guardarLibros/libros-guardados/${authUser._id}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("Error al obtener libros guardados");
      const data = await response.json();
      setLibrosGuardados(data.librosGuardados);
    } catch (error) {
      console.error("Error fetching libros guardados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchLibrosGuardados();
  }, [authUser, fetchLibrosGuardados]);

  const { mutate: deleteLibro, isLoading: isDeleting } = useMutation({
    mutationFn: async (libroId) => {
      const res = await fetch(`/api/libros/${libroId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar el libro");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Libro eliminado con éxito");
      queryClient.invalidateQueries(["libros"]);
      fetchLibrosGuardados();
    },
  });

  const handleSaveToggle = async (libroId) => {
    const libro = librosGuardados.find((l) => l._id === libroId);
    const endpoint = libro
      ? `/api/guardarLibros/eliminar-libro`
      : `/api/guardarLibros/guardar-libro`;

    try {
      const response = await fetch(endpoint, {
        method: libro ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authUser._id, libroId }),
      });
      if (!response.ok) throw new Error("Error al actualizar el libro guardado");

      if (libro) {
        setLibrosGuardados((prev) => prev.filter((l) => l._id !== libroId));
        toast.success("Libro eliminado de guardados");
      } else {
        fetchLibrosGuardados();
        toast.success("Libro guardado");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Filtrar libros guardados según el texto ingresado en el buscador
  const librosFiltrados = librosGuardados.filter((libro) =>
    libro.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  // Calcular los libros a mostrar en la página actual
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = librosFiltrados.reverse().slice(indexOfFirstBook, indexOfLastBook);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar libro por título..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:border-primary"
      />

      {isLoading ? (
        <p>Cargando...</p>
      ) : librosFiltrados.length === 0 ? (
        <p>No tienes libros guardados.</p>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentBooks.map((libro) => (
              <div
                key={libro._id}
                className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between h-full"
              >
                <Link to={`/fichaLibro/${libro._id}`} className="flex flex-col items-center">
                  <img
                    src={libro.portada || "/book-placeholder.png"}
                    alt={libro.titulo}
                    className="w-35 h-60 object-cover rounded"
                  />
                  <h2
                    className="text-lg font-semibold mt-4 text-center"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2, // Limitar a 2 líneas
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {libro.titulo}
                  </h2>
                </Link>

                <div className="mt-auto">
                  <button
                    onClick={() => handleSaveToggle(libro._id)}
                    className={`mt-4 w-full rounded px-4 py-2 ${
                      librosGuardados.some((l) => l._id === libro._id)
                        ? "bg-slate-600"
                        : "bg-gray-800"
                    } text-white hover:${
                      librosGuardados.some((l) => l._id === libro._id)
                        ? "bg-slate-700"
                        : "bg-gray-900"
                    } transition`}
                  >
                    {librosGuardados.some((l) => l._id === libro._id)
                      ? "Eliminar"
                      : "Guardar"}
                  </button>

                  {libro.userId === authUser?._id && (
                    <div className="flex gap-1 items-center mt-2">
                      {!isDeleting ? (
                        <FaTrash
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => deleteLibro(libro._id)}
                        />
                      ) : (
                        <FaSpinner className="animate-spin text-blue-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-4 gap-4">
          <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
            >
              <BsArrowLeft />
            </button>
            <span className="px-4 py-2 text-gray-800">
              Página {currentPage}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * booksPerPage >= librosFiltrados.length}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-r-md disabled:opacity-50"
            >
              <BsArrowRight  />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrosTuyos;
