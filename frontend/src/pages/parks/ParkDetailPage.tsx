import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPark } from "../../api/parks";
import { getVisits } from "../../api/visits";

export default function ParkDetailPage() {
  const { parkId } = useParams<{ parkId: string }>();
  const id = Number(parkId);

  const { data: park } = useQuery({
    queryKey: ["park", id],
    queryFn: () => getPark(id),
  });

  const { data: visits } = useQuery({
    queryKey: ["visits", { park_id: id, upcoming: true }],
    queryFn: () => getVisits({ park_id: id, upcoming: true }),
  });

  if (!park) return <span className="loading loading-spinner loading-lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{park.name}</h1>
        <p className="text-base-content/60">{park.address}</p>
        {park.description && <p className="mt-2">{park.description}</p>}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Upcoming Visits</h2>
        {visits && visits.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>When</th>
                  <th>Dogs</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.user.username}</td>
                    <td>
                      {new Date(visit.start_time).toLocaleString()} &ndash;{" "}
                      {new Date(visit.end_time).toLocaleTimeString()}
                    </td>
                    <td>{visit.dogs.map((d) => d.name).join(", ")}</td>
                    <td>{visit.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-base-content/60">No upcoming visits at this park.</p>
        )}
      </div>
    </div>
  );
}
