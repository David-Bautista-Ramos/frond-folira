import { useState, useRef, useEffect } from "react";
import useCreateLibro from "../../hooks/useCreateLibro";
const API_URL = "https://backendfoli-production.up.railway.app"; 

function ModalCrearLibro({ isOpen, onClose, token }) {
  const [formData, setFormData] = useState({
    titulo: "",
    isbn: "",
    calificacion: "",
    saga: "",
    fechaPublicacion: "",
    editorial: "",
    sinopsis: "",
  });

  const [fotoLibro, setFotoLibro] = useState("");
  const [availableGeneros, setAvailableGeneros] = useState([]);
  const [availableAutor, setAvailableAutores] = useState([]);
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [selectedAutores, setSelectedAutores] = useState([]);
  const [showGeneros, setShowGeneros] = useState(false);
  const [showAutores, setShowAutores] = useState(false);
  const fotoLibroRef = useRef(null);
  const { createLibro, isCreatingLibro } = useCreateLibro();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFotoLibro(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGeneroChange = (generoId) => {
    setSelectedGeneros((prevSelected) =>
      prevSelected.includes(generoId)
        ? prevSelected.filter((g) => g !== generoId)
        : [...prevSelected, generoId]
    );
  };

  const handleAutoresChange = (autorId) => {
    setSelectedAutores((prevSelected) =>
      prevSelected.includes(autorId)
        ? prevSelected.filter((a) => a !== autorId)
        : [...prevSelected, autorId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLibro({
        ...formData,
        generos: selectedGeneros,
        autores: selectedAutores,
        portada: fotoLibro,
      });
      setFormData({
        titulo: "",
        isbn: "",
        calificacion: "",
        saga: "",
        fechaPublicacion: "",
        editorial: "",
        sinopsis: "",
      });
      console.log(createLibro);
      setSelectedGeneros([]);
      setSelectedAutores([]);
      setFotoLibro("");
      onClose();
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const toggleGeneros = () => setShowGeneros(!showGeneros);
  const toggleAutores = () => setShowAutores(!showAutores);

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const response = await fetch(`${API_URL}/api/geneLiter/getgeneros`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const generos = await response.json();
        setAvailableGeneros(generos);
      } catch (error) {
        console.error("Error al obtener los géneros literarios:", error);
      }
    };
    fetchGeneros();
  }, [token]);

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const response = await fetch(`${API_URL}/api/autror/autores`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const autores = await response.json();
        setAvailableAutores(autores);
      } catch (error) {
        console.error("Error al obtener los autores:", error);
      }
    };
    fetchAutores();
  }, [token]);

  if (!isOpen) return null;

  return (
<div
  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  onClick={onClose}
>
  <div
    className="bg-white p-5 rounded-lg w-full md:w-[800px] relative overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="border-b-2 border-primary pb-2 mb-5">
      <h2 className="text-lg text-center text-primary">CREAR LIBRO</h2>
    </div>
    <form onSubmit={handleSubmit} className="overflow-y-auto max-h-80 text-[#503B31] text-lg modal-scrollbar">

      {/* Contenedor de columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Columna 1 */}
  <div>
    <label className="block mb-1 text-primary">Portada</label>
    <div className="relative group/cover mb-4">
      <img
        src={fotoLibro || "/cover.png"}
        className="h-52 w-full object-cover"
        alt="cover image"
      />
      <div
        className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
        onClick={() => fotoLibroRef.current.click()}
      >
        <span className="w-5 h-5 text-white">Editar</span>
      </div>
      <input
        type="file"
        hidden
        accept="image/*"
        ref={fotoLibroRef}
        onChange={handleImgChange}
      />
    </div>

    {/* Inputs de la primera columna */}
    <label className="block mb-1 text-primary">Titulo Del Libro</label>
    <input
      type="text"
      name="titulo"
      value={formData.titulo}
      onChange={handleInputChange}
      placeholder="Titulo del libro"
      className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
    />
    <label className="block mb-1 text-primary">ISBN</label>
    <input
      type="text"
      name="isbn"
      value={formData.isbn}
      onChange={handleInputChange}
      placeholder="ISBN del libro"
      className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
    />
    <label className="block mb-1 text-primary">Fecha de Publicación</label>
    <input
      type="date"
      name="fechaPublicacion"
      value={formData.fechaPublicacion}
      onChange={handleInputChange}
      className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
    />
    <label className="block mb-1 text-primary">Sinopsis</label>
    <textarea
      name="sinopsis"
      value={formData.sinopsis}
      onChange={handleInputChange}
      placeholder="Sinopsis"
      className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
    />
  </div>

  {/* Columna 2 */}
  <div className="mt-6 md:mt-0">
    <label className="block mb-1 text-primary">Editorial</label>
    <input
      type="text"
      name="editorial"
      value={formData.editorial}
      onChange={handleInputChange}
      placeholder="Editorial"
      className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
    />
    <label className="block mb-1 text-primary">Saga</label>
    <input
      type="text"
      name="saga"
      value={formData.saga}
      onChange={handleInputChange}
      placeholder="Saga"
      className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
    />
    <label className="block mb-1 text-primary">Calificacion</label>
    <input
      type="number"
      name="calificacion"
      value={formData.calificacion}
      onChange={handleInputChange}
      placeholder="Calificacion"
      className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
    />

    {/* Autores */}
    <div>
      <label className="block mb-1 text-primary">Autores</label>
      <button
        type="button"
        onClick={toggleAutores}
        className="bg-primary text-white p-2 rounded mb-2"
      >
        {showAutores ? "Ocultar Autores" : "Mostrar Autores"}
      </button>
      {showAutores && (
        <div className="max-h-48 overflow-y-auto border border-gray-300 p-2 rounded">
          <div className="flex flex-wrap">
            {availableAutor.map((autor) => (
              <div key={autor.id || autor.nombre} className="flex items-center mr-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedAutores.includes(autor._id)}
                  onChange={() => handleAutoresChange(autor._id)}
                  className="mr-1"
                />
                <span>{autor.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Géneros */}
    <div>
      <label className="block mb-1 text-primary">Géneros</label>
      <button
        type="button"
        onClick={toggleGeneros}
        className="bg-primary text-white p-2 rounded mb-2"
      >
        {showGeneros ? "Ocultar Géneros" : "Mostrar Géneros"}
      </button>
      {showGeneros && (
        <div className="max-h-48 overflow-y-auto border border-gray-300 p-2 rounded">
          <div className="flex flex-wrap">
            {availableGeneros.map((genero) => (
              <div key={genero.id || genero.nombre} className="flex items-center mr-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedGeneros.includes(genero._id)}
                  onChange={() => handleGeneroChange(genero._id)}
                  className="mr-1"
                />
                <span>{genero.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

      </div>
    </div>
      <div className="border-t border-gray-300 flex justify-end">
        <button
            type="submit"
            className="bg-primary mt-3 text-white px-4 py-2 rounded-md hover:bg-blue-950"
            disabled={isCreatingLibro}
        >
            {isCreatingLibro ? "Creando..." : "Crear Libro"}
        </button>
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mt-3 ml-4 hover:bg-gray-400"
        >
            Cerrar
        </button>
      </div>
      
    </form>

      
  </div>
</div>


  );
}

export default ModalCrearLibro;