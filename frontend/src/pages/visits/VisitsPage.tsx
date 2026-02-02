import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyVisits, createVisit, deleteVisit } from "../../api/visits";
import { getMyDogs } from "../../api/dogs";
import { getParks } from "../../api/parks";
import type { VisitCreate } from "../../types";

export default function VisitsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: visits, isLoading } = useQuery({
    queryKey: ["my-visits"],
    queryFn: getMyVisits,
  });

  const { data: dogs } = useQuery({ queryKey: ["my-dogs"], queryFn: getMyDogs });
  const { data: parks } = useQuery({ queryKey: ["parks"], queryFn: getParks });

  const createMutation = useMutation({
    mutationFn: createVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-visits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-visits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const selectedDogIds = form.getAll("dog_ids").map(Number);
    const payload: VisitCreate = {
      park_id: Number(form.get("park_id")),
      start_time: new Date(form.get("start_time") as string).toISOString(),
      end_time: new Date(form.get("end_time") as string).toISOString(),
      dog_ids: selectedDogIds,
      notes: (form.get("notes") as string) || undefined,
    };
    createMutation.mutate(payload);
  };

  if (isLoading) return <span className="loading loading-spinner loading-lg" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Visits</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Log a Visit"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card bg-base-200 shadow p-4 space-y-3">
          <select name="park_id" className="select select-bordered w-full" required>
            <option value="">Select a park</option>
            {parks?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label"><span className="label-text">Start</span></label>
              <input type="datetime-local" name="start_time" className="input input-bordered w-full" required />
            </div>
            <div>
              <label className="label"><span className="label-text">End</span></label>
              <input type="datetime-local" name="end_time" className="input input-bordered w-full" required />
            </div>
          </div>

          <div>
            <label className="label"><span className="label-text">Which dogs are coming?</span></label>
            {dogs && dogs.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {dogs.map((dog) => (
                  <label key={dog.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="dog_ids" value={dog.id} className="checkbox checkbox-sm" />
                    <span>{dog.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-base-content/60">Add dogs first in "My Dogs".</p>
            )}
          </div>

          <textarea name="notes" placeholder="Notes (optional)" className="textarea textarea-bordered w-full" />

          <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Save Visit"}
          </button>
        </form>
      )}

      {visits && visits.length > 0 ? (
        <div className="space-y-3">
          {visits.map((visit) => (
            <div key={visit.id} className="card bg-base-200 shadow-sm">
              <div className="card-body py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">
                      Park #{visit.park_id}
                    </div>
                    <div className="text-sm text-base-content/60">
                      {new Date(visit.start_time).toLocaleString()} &ndash;{" "}
                      {new Date(visit.end_time).toLocaleTimeString()}
                    </div>
                    {visit.dogs.length > 0 && (
                      <div className="text-sm mt-1">
                        Dogs: {visit.dogs.map((d) => d.name).join(", ")}
                      </div>
                    )}
                    {visit.notes && <div className="text-sm mt-1">{visit.notes}</div>}
                  </div>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => deleteMutation.mutate(visit.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base-content/60">No visits yet. Log your first park visit!</p>
      )}
    </div>
  );
}
