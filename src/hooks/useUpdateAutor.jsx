import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateAutor = (autorId) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateAutor, isPending: isUpdatingAutor } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/autror/autores/${autorId}`, {
          method: "PUT",
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
    onSuccess: () => {
      toast.success("Autor actualizado exitosamente");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateAutor, isUpdatingAutor };
};

export default useUpdateAutor;
