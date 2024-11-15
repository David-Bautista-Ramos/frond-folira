const GenerosLiterarios = ({ generos }) => {
  
    return (
      <div className='flex flex-col mt-4 -mb-3'>
        {/* Usamos flex y flex-wrap para que los géneros se acomoden según el espacio disponible */}
        <div className='flex flex-wrap gap-4'>
          {generos.map((genero) => (
            <div 
              key={genero.nombre} 
              className='flex items-center border rounded-full p-2 bg-white min-w-[120px] max-w-[150px] truncate'
            >
              <img src={genero.fotoGenero} alt={genero.nombre} className='w-8 h-8 mr-2' />
              <span className="truncate">{genero.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default GenerosLiterarios;
  