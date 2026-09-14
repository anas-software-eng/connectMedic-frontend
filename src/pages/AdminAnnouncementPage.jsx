import { useState } from "react";
import { Megaphone } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";

const AUDIENCES = [
  { id: "all", label: "Everyone" },
  { id: "patients", label: "Patients only" },
  { id: "doctors", label: "Doctors only" },
];

const AdminAnnouncementPage = () => {
  const { broadcast } = useAdminStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSending(true);
    const ok = await broadcast({ title: title.trim(), body: body.trim(), audience });
    setIsSending(false);
    if (ok) {
      setTitle("");
      setBody("");
    }
  };

  return (
    <div className="max-w-lg space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-4 flex items-center gap-2 font-semibold">
        <Megaphone className="size-5 text-primary" /> Send an announcement
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-6 space-y-4"
      >
        <div className="form-control">
          <label className="label" htmlFor="announce-audience">
            <span className="label-text font-medium">Send to</span>
          </label>
          <select
            id="announce-audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="select select-bordered w-full"
          >
            {AUDIENCES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="announce-title">
            <span className="label-text font-medium">Title</span>
          </label>
          <input
            id="announce-title"
            type="text"
            required
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scheduled maintenance tonight"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="announce-body">
            <span className="label-text font-medium">
              Message <span className="text-base-content/65">(optional)</span>
            </span>
          </label>
          <textarea
            id="announce-body"
            rows={4}
            maxLength={2000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Details patients/doctors should know"
            className="textarea textarea-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSending || !title.trim()}>
          {isSending ? "Sending..." : "Send announcement"}
        </button>
        <p className="text-xs text-base-content/65 text-center">
          Delivered instantly as an in-app notification to everyone matching the selected audience.
        </p>
      </form>
    </div>
  );
};

export default AdminAnnouncementPage;
