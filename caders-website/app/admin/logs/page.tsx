import { createClient } from "@/lib/supabase/server";

export default async function AdminLogsPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("login_logs")
    .select(
      "id, login_time, user_agent, user:user_id (username, full_name, role)"
    )
    .order("login_time", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Login Logs</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Most recent 200 logins. Newest first.
        </p>
      </div>

      <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
        {!logs || logs.length === 0 ? (
          <div className="p-10 text-center text-body-md text-surface-on-variant">
            No login activity yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high">
                <tr className="text-label-md text-surface-on-variant uppercase">
                  <th className="px-6 py-3">When</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {logs.map((l: any) => (
                  <tr
                    key={l.id}
                    className="hover:bg-surface-container-high/50 transition"
                  >
                    <td className="px-6 py-4 text-body-md text-surface-on">
                      {new Date(l.login_time).toLocaleString("en-GB")}
                    </td>
                    <td className="px-6 py-4 text-body-md text-surface-on-variant">
                      {l.user?.username ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-body-md text-surface-on-variant">
                      {l.user?.full_name ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-container text-primary-on-container text-label-md capitalize">
                        {l.user?.role ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body-md text-surface-on-variant max-w-md truncate">
                      {l.user_agent?.slice(0, 60) ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}