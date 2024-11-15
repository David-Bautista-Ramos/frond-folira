import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUsers = (userId) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/users/upadateUsers/${userId}`, 
          {
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
    onSuccess: () => {
      toast.success("Perfil actualizado exitosamente");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateUsers, isUpdatingUsers };
};

export default useUpdateUsers;