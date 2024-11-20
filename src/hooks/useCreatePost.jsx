import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const API_URL = "https://backendfoli.onrender.com"; 

function useCreatePost() {
    const queryClient = useQueryClient();
    
    const { mutateAsync: createPost, isPending: isCreatingPost } = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await fetch(`${API_URL}/api/posts/createAd`, {
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
        onSuccess: async () => { // Cambia a async
            toast.success("Publicacion creado con éxito");
            await Promise.all([ // Añade await aquí
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
            ]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { createPost, isCreatingPost };
}

export default useCreatePost;