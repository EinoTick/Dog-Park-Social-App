import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyDogs, createDog, updateDog, deleteDog } from "../../api/dogs";
import type { DogCreate, DogUpdate, DogSize } from "../../types";
import type { Dog } from "../../types";

export default function DogsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [dogToDelete, setDogToDelete] = useState<Dog | null>(null);
  const [dogToEdit, setDogToEdit] = useState<Dog | null>(null);

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

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DogUpdate }) => updateDog(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-dogs"] });
      setDogToEdit(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-dogs"] });
      setDogToDelete(null);
    },
  });

  const dialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dogToDelete) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dogToDelete]);

  useEffect(() => {
    if (dogToEdit) {
      editDialogRef.current?.showModal();
    } else {
      editDialogRef.current?.close();
    }
  }, [dogToEdit]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setDogToDelete(null);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  useEffect(() => {
    const dialog = editDialogRef.current;
    if (!dialog) return;
    const handleClose = () => setDogToEdit(null);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  const confirmDelete = () => {
    if (dogToDelete) deleteMutation.mutate(dogToDelete.id);
  };

  const closeModal = () => setDogToDelete(null);

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

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dogToEdit) return;
    const form = new FormData(e.currentTarget);
    const payload: DogUpdate = {
      name: form.get("name") as string,
      breed: (form.get("breed") as string) || "Mixed",
      size: (form.get("size") as DogSize) || "medium",
      good_with_others: form.get("good_with_others") === "on",
      personality_notes: (form.get("personality_notes") as string) || undefined,
    };
    updateMutation.mutate({ id: dogToEdit.id, payload });
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
            <div key={dog.id} className="card bg-base-200 shadow flex flex-col min-h-[12rem]">
              <div className="card-body py-3 flex flex-col flex-1 min-h-0">
                <div className="flex justify-between items-start gap-2 shrink-0 flex-1 min-h-0">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="card-title mb-0 text-lg">{dog.name}</h2>
                      <span className="badge badge-sm">{dog.good_with_others ? "Friendly" : "Needs space"}</span>
                    </div>
                    <p className="text-sm text-base-content/60">{dog.breed} &middot; {dog.size}</p>
                    {dog.personality_notes && <p className="text-sm mt-1">{dog.personality_notes}</p>}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-error hover:bg-base-300 shrink-0"
                    onClick={() => setDogToDelete(dog)}
                    title="Remove dog"
                    aria-label="Remove dog"
                  >
                    <span className="text-xl leading-none pb-1" aria-hidden>×</span>
                  </button>
                </div>
                <div className="card-actions justify-end mt-auto pt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setDogToEdit(dog)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base-content/60">No dogs yet. Add your first dog above!</p>
      )}

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Remove dog?</h3>
          <p className="py-2">
            Are you sure you want to remove <strong>{dogToDelete?.name}</strong>? This cannot be undone.
          </p>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={closeModal}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>

      <dialog ref={editDialogRef} className="modal">
        {dogToEdit && (
          <>
            <div className="modal-box">
              <h3 className="font-bold text-lg">Edit {dogToEdit.name}</h3>
              <form onSubmit={handleUpdate} className="space-y-3 mt-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Name</span></label>
                  <input
                    name="name"
                    defaultValue={dogToEdit.name}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Breed</span></label>
                  <input
                    name="breed"
                    defaultValue={dogToEdit.breed}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Size</span></label>
                  <select name="size" className="select select-bordered w-full" defaultValue={dogToEdit.size}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="good_with_others"
                    className="checkbox"
                    defaultChecked={dogToEdit.good_with_others}
                  />
                  <span>Good with other dogs</span>
                </label>
                <div className="form-control">
                  <label className="label"><span className="label-text">Personality notes</span></label>
                  <textarea
                    name="personality_notes"
                    defaultValue={dogToEdit.personality_notes ?? ""}
                    className="textarea textarea-bordered w-full"
                    placeholder="Optional"
                  />
                </div>
                <div className="modal-action">
                  <button type="button" className="btn btn-ghost" onClick={() => setDogToEdit(null)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Save"}
                  </button>
                </div>
              </form>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button type="submit" onClick={() => setDogToEdit(null)}>close</button>
            </form>
          </>
        )}
      </dialog>
    </div>
  );
}
