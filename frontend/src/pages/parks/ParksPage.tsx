import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getParks, createPark } from "../../api/parks";
import type { ParkCreate } from "../../types";

export default function ParksPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: parks, isLoading } = useQuery({
    queryKey: ["parks"],
    queryFn: getParks,
  });

  const createMutation = useMutation({
    mutationFn: createPark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parks"] });
      setShowForm(false);
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: ParkCreate = {
      name: form.get("name") as string,
      address: form.get("address") as string,
      description: (form.get("description") as string) || undefined,
    };
    createMutation.mutate(payload);
  };

  if (isLoading) return <span className="loading loading-spinner loading-lg" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Dog Parks</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Park"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card bg-base-200 shadow p-4 space-y-3">
          <input name="name" placeholder="Park name" className="input input-bordered w-full" required />
          <input name="address" placeholder="Address" className="input input-bordered w-full" required />
          <textarea name="description" placeholder="Description" className="textarea textarea-bordered w-full" />
          <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Save"}
          </button>
        </form>
      )}

      {parks && parks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parks.map((park) => (
            <Link to={`/parks/${park.id}`} key={park.id} className="card bg-base-200 shadow hover:shadow-md transition-shadow">
              <div className="card-body">
                <h2 className="card-title">{park.name}</h2>
                <p className="text-sm text-base-content/60">{park.address}</p>
                {park.description && <p className="text-sm">{park.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-base-content/60">No parks yet. Be the first to add one!</p>
      )}
    </div>
  );
}
