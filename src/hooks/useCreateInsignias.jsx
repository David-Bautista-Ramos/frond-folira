import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const API_URL = "https://backendfoli.onrender.com"; 

function useCreateInsignia() {
  const queryClient = useQueryClient();

  const { mutateAsync: createInisgnia, isPending: isCreatingInisgnia } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`${API_URL}/api/insignias/insignias`, {
          method: "POST",
          body: formData, // Send FormData directly
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
      toast.success("Insignia creada con éxito"); // Update the success message
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createInisgnia, isCreatingInisgnia };
}

export default useCreateInsignia;
