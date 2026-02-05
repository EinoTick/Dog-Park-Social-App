import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getUpcomingActivity } from "../../api/visits";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const { data: upcoming } = useQuery({
    queryKey: ["upcoming-activity"],
    queryFn: getUpcomingActivity,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Welcome, {user?.full_name || user?.username}</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-title">Your Upcoming Visits</div>
          <div className="stat-value">{stats?.upcoming_visit_count ?? "..."}</div>
        </div>
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-title">Most Popular Park This Week</div>
          <div className="stat-value text-lg">{stats?.most_popular_park ?? "None yet"}</div>
          <div className="stat-desc">
            {stats?.most_popular_park_visit_count
              ? `${stats.most_popular_park_visit_count} visit(s)`
              : ""}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-title">Activity Next 24h</div>
          <div className="stat-value">{upcoming?.length ?? "..."}</div>
          <div className="stat-desc">visits at parks near you</div>
        </div>
      </div>

      {/* Upcoming activity list */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Upcoming Activity</h2>
        {upcoming && upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((visit) => (
              <div key={visit.id} className="card bg-base-200 shadow-sm">
                <div className="card-body py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{visit.park.name}</span>
                      <span className="text-base-content/60 ml-2">
                        by {visit.user.username}
                      </span>
                    </div>
                    <div className="text-sm text-base-content/60">
                      {new Date(visit.start_time).toLocaleString()} &ndash;{" "}
                      {new Date(visit.end_time).toLocaleTimeString()}
                    </div>
                  </div>
                  {visit.dogs.length > 0 && (
                    <div className="text-sm">
                      Dogs: {visit.dogs.map((d) => d.name).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base-content/60">No upcoming activity in the next 24 hours.</p>
        )}
      </div>
    </div>
  );
}
