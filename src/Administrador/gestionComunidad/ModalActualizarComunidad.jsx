import { useState, useRef, useEffect } from 'react';
import useUpdateComunidad from '../../hooks/useUpdateComunidad';

const ModalActualizarComunidad = ({ isOpen, onClose, token, comunidadId,obtenerComunidades }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fotoComunidad: "",
    fotoBanner: "",
    generoLiterarios: [],
    admin: ""
  });

  const { updatecomunidad, isUpdatingcomunidad } = useUpdateComunidad(comunidadId,obtenerComunidades);
  const [fotoComunidad, setFotoComunidad] = useState(null);
  const [fotoBanner, setFotoBanner] = useState(null);
  const fotoBannerRef = useRef(null);
  const fotoComunidadRef = useRef(null);
  const [generoLiterarios, setgeneroLiterarios] = useState([]);
  const [usuarioAdminOpciones, setUsuarioAdminOpciones] = useState([]);
  const [miembros, setMiembros] = useState([]); // Nuevo estado para los miembros
  const [miembrosSeleccionados, setMiembrosSeleccionados] = useState([]); // Estado para los miembros seleccionados

  const handleImgChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "coverImg") {
          setFotoBanner(reader.result);
        } else if (type === "profileImg") {
          setFotoComunidad(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const response = await fetch('/api/geneLiter/getgeneros', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const generos = await response.json();
        if (generos) {
          setgeneroLiterarios(generos);
        }
      } catch (error) {
        console.error("Error al obtener los géneros literarios:", error);
      }
    };
    fetchGeneros();
  }, [token]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('/api/users/allUsers', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const usuarios = await response.json();
        setUsuarioAdminOpciones(usuarios || []);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsuarios();
  }, [token]);

  useEffect(() => {
    const fetchComunidad = async () => {
      try {
        const response = await fetch(`/api/comunidad/comunidad/${comunidadId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const comunidad = await response.json();
        if (comunidad) {
          setFormData({
            nombre: comunidad.nombre || "",
            descripcion: comunidad.descripcion || "",
            fotoComunidad: comunidad.fotoComunidad || "",
            fotoBanner: comunidad.fotoBanner || "",
            admin: comunidad.admin?._id || "",
            generoLiterarios:comunidad.generoLiterarios.map(generoLiterarios => generoLiterarios._id) || [],
          });
          setFotoComunidad(comunidad.fotoComunidad);
          setFotoBanner(comunidad.fotoBanner);
          setMiembros(comunidad.miembros || []); // Ensure this is an array
          setMiembrosSeleccionados(comunidad.miembrosSeleccionados || []); // Nueva lógica para miembros seleccionados
        }
      } catch (error) {
        console.error("Error al obtener la comunidad:", error);
      }
    };
  
    if (comunidadId) {
      fetchComunidad();
    }
  }, [comunidadId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatecomunidad({
      ...formData,
      fotoComunidad,
      fotoBanner,
      miembrosSeleccionados // Enviar los miembros seleccionados al actualizar la comunidad
    });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "generos") {
      if (checked && formData.generoLiterarios.length < 5) {
        setFormData((prevData) => ({
          ...prevData,
          generoLiterarios: [...prevData.generoLiterarios, value],
        }));
      } else if (!checked) {
        setFormData((prevData) => ({
          ...prevData,
          generoLiterarios: prevData.generoLiterarios.filter((genero) => genero !== value),
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAdminChange = (e) => {
    setFormData({ ...formData, admin: e.target.value });
  };

  const handleMiembroSelect = (miembroId) => {
    setMiembrosSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(miembroId)
        ? prevSeleccionados.filter(id => id !== miembroId) // Deselecciona el miembro si ya está seleccionado
        : [...prevSeleccionados, miembroId] // Selecciona el miembro
    );
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
  <div className="relative bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-custom" onClick={(e) => e.stopPropagation()}>
    <div className="border-b-2 border-primary pb-2 mb-4">
      <h2 className="text-xl text-primary text-center">Actualizar Comunidad</h2>
    </div>

    <div className="relative mb-6">
      <img
        src={fotoBanner || "/cover.png"}
        className="h-32 w-full object-cover rounded-lg"
        alt="cover image"
      />
      <button
        className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded-full opacity-75 hover:opacity-100"
        onClick={() => fotoBannerRef.current.click()}
      >
        Editar
      </button>
      <input
        type="file"
        hidden
        accept="image/*"
        ref={fotoBannerRef}
        onChange={(e) => handleImgChange(e, "coverImg")}
      />

      <div className="absolute bottom-[-25px] left-4 w-20 h-20">
        <img
          src={fotoComunidad || "/avatar-placeholder.png"}
          className="w-full h-full rounded-full border-2 border-white object-cover"
          alt="profile avatar"
          onClick={() => fotoComunidadRef.current.click()}
        />
        <input
          type="file"
          hidden
          accept="image/*"
          ref={fotoComunidadRef}
          onChange={(e) => handleImgChange(e, "profileImg")}
        />
      </div>
    </div>

    {/* Contenedor de dos columnas */}
    <div className="grid grid-cols-2 gap-x-4">
      {/* Primera columna */}
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          value={formData.nombre || ""}
          onChange={handleInputChange}
          name="nombre"
          placeholder="Nombre de la comunidad"
          className="w-full p-2 mb-2 border rounded focus:border-primary focus:outline-none text-sm"
        />

        <label className="block mb-1">Descripción</label>
        <textarea
          value={formData.descripcion || ""}
          onChange={handleInputChange}
          name="descripcion"
          placeholder="Descripción de la comunidad"
          className="w-full p-2 mb-2 border rounded focus:border-primary focus:outline-none text-sm"
          maxLength={200} // Limita a 200 caracteres
          rows={4} // Puedes ajustar el número de filas si es necesario
        />

        {/* Contador de caracteres */}
        <p className="text-sm text-gray-500">{formData.descripcion?.length || 0}/200 caracteres</p>


<h4 className="text-sm font-bold mb-2">
              Selecciona 1 Usuario como Administrador:
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-4 h-32 overflow-y-auto border rounded p-2">
              {usuarioAdminOpciones.map((usuario) => (
                <label key={usuario._id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="admin"
                    value={usuario._id}
                    checked={formData.admin === usuario._id}
                    onChange={handleAdminChange}
                    className="hidden"
                  />
                  <div
                    className={`flex items-center border rounded-full p-2 text-sm ${
                      formData.admin === usuario._id
                        ? "bg-primary text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <img
                      src={usuario.fotoPerfil || "/avatar-placeholder.png"}
                      className="w-10 h-10 rounded-full mr-2"
                      alt={usuario.nombre}
                    />
                    <span>{usuario.nombre}</span>
                  </div>
                </label>
              ))}
            </div>
      </div>

      {/* Segunda columna */}
      <div>
        <h4 className='font-bold mb-2'>Selecciona hasta 5 géneros literarios:</h4>
        <div className='grid grid-cols-2 gap-2 mb-4'>
          {generoLiterarios.map((genero) => (
            <label key={genero._id} className='flex items-center cursor-pointer'>
              <input
                type='checkbox'
                name='generos'
                value={genero._id}
                checked={formData.generoLiterarios.includes(genero._id)}
                onChange={handleInputChange}
                className='hidden'
              />
              <div
                className={`flex items-center border rounded-full p-2 ${formData.generoLiterarios.includes(genero._id) ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <span>{genero.nombre}</span>
              </div>
            </label>
          ))}
        </div>

        <h4 className="text-sm font-bold mb-2">Selecciona Miembros de la Comunidad:</h4>
        <div className="grid grid-cols-2 gap-2 mb-4 h-24 overflow-y-auto border rounded p-2">
          {miembros.map((miembro) => (
            <label key={miembro._id} className="flex items-center cursor-pointer">
              <input
                type="button"
                checked={miembrosSeleccionados.includes(miembro._id)}
                onChange={() => handleMiembroSelect(miembro._id)}
                className="mr-2"
              />
              <span>{miembro.nombre}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    {/* Botón de actualizar a la derecha */}
    <div className="flex justify-end mt-4">
      <button
        onClick={handleSubmit}
        disabled={isUpdatingcomunidad}
        className={`bg-primary mt-3 text-white px-4 py-2 rounded-md hover:bg-blue-950 transition ${isUpdatingcomunidad ? "opacity-50 " : ""}`}
      >
        {isUpdatingcomunidad ? "Actualizando..." : "Actualizar Comunidad"}
      </button>

      <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  mt-3 ml-4 hover:bg-gray-400"
        >
            Cancelar
        </button>
    </div>


  </div>
</div>



  
  );
};

export default ModalActualizarComunidad;
