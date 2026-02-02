import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyDogs, createDog, deleteDog } from "../../api/dogs";
import type { DogCreate, DogSize } from "../../types";

export default function DogsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: dogs, isLoading } = useQuery({
    queryKey: ["my-dogs"],
    queryFn: getMyDogs,
  });

  const createMutation = useMutation({
    mutationFn: createDog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-dogs"] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-dogs"] }),
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: DogCreate = {
      name: form.get("name") as string,
      breed: (form.get("breed") as string) || "Mixed",
      size: (form.get("size") as DogSize) || "medium",
      good_with_others: form.get("good_with_others") === "on",
      personality_notes: (form.get("personality_notes") as string) || undefined,
    };
    createMutation.mutate(payload);
  };

  if (isLoading) return <span className="loading loading-spinner loading-lg" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Dogs</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Dog"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card bg-base-200 shadow p-4 space-y-3">
          <input name="name" placeholder="Dog name" className="input input-bordered w-full" required />
          <input name="breed" placeholder="Breed (default: Mixed)" className="input input-bordered w-full" />
          <select name="size" className="select select-bordered w-full">
            <option value="small">Small</option>
            <option value="medium" selected>Medium</option>
            <option value="large">Large</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="good_with_others" className="checkbox" defaultChecked />
            <span>Good with other dogs</span>
          </label>
          <textarea name="personality_notes" placeholder="Personality notes" className="textarea textarea-bordered w-full" />
          <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Save"}
          </button>
        </form>
      )}

      {dogs && dogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map((dog) => (
            <div key={dog.id} className="card bg-base-200 shadow">
              <div className="card-body">
                <h2 className="card-title">{dog.name}</h2>
                <p className="text-sm text-base-content/60">{dog.breed} &middot; {dog.size}</p>
                <div className="badge badge-sm">{dog.good_with_others ? "Friendly" : "Needs space"}</div>
                {dog.personality_notes && <p className="text-sm mt-1">{dog.personality_notes}</p>}
                <div className="card-actions justify-end mt-2">
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => deleteMutation.mutate(dog.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base-content/60">No dogs yet. Add your first dog above!</p>
      )}
    </div>
  );
}
