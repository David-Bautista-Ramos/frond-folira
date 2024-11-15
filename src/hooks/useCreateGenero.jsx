import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateGenero() {
  const queryClient = useQueryClient();

  const { mutateAsync: createGenero, isPending: isCreatingGenero } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/geneLiter/generos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "algo salió mal");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      // Cambia a async
      toast.success("Genero creado con éxito");
      await Promise.all([
        // Añade await aquí
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createGenero, isCreatingGenero };
}

export default useCreateGenero;
