import { createClient } from "@/lib/supabase/server";
import AddVoiceForm from "./AddVoiceForm";
import VoiceRow from "./VoiceRow";

export default async function AdminVoicesPage() {
  const supabase = await createClient();

  const { data: voices } = await supabase
    .from("voices")
    .select("id, type, name, designation, message, order_index")
    .order("order_index");

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Voices</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Messages from the Moderator and Faculty Advisor.
        </p>
      </div>

      <AddVoiceForm />

      <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h3 className="text-title-md text-surface-on">
            All voices ({voices?.length ?? 0})
          </h3>
        </div>

        {!voices || voices.length === 0 ? (
          <div className="p-10 text-center text-body-md text-surface-on-variant">
            No voices yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high">
                <tr className="text-label-md text-surface-on-variant uppercase">
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Designation</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {voices.map((v) => (
                  <VoiceRow key={v.id} voice={v} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}