import BackButton from "../components/BackButton";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Good morning - how has the new blood pressure medication been?", isSent: false },
  { id: 2, content: "Much better. Readings have been around 124/78 all week.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <BackButton to="/" className="mb-4" />
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-sm text-base-content/70">Choose a calm, readable theme for your care messages</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {THEMES.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`text-left rounded-2xl border p-4 transition-all ${
                  isActive
                    ? "border-primary ring-2 ring-primary/30 bg-base-200/60"
                    : "border-base-300/70 hover:border-primary/40 hover:bg-base-200/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-16 rounded-lg overflow-hidden border border-base-300 shrink-0"
                    data-theme={t.id}
                  >
                    <div className="h-full w-full bg-base-100 grid grid-cols-3 gap-px p-1.5">
                      <div className="rounded bg-primary" />
                      <div className="rounded bg-base-content/20" />
                      <div className="rounded bg-base-300" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.name}</span>
                      <span className="badge badge-ghost">{t.mode}</span>
                      {isActive && <span className="badge badge-primary">Active</span>}
                    </div>
                    <p className="text-xs text-base-content/72 mt-0.5">{t.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      A
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Dr. Amara Osei</h3>
                      <p className="text-xs text-base-content/70">Primary Care - Available now</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Message your care team..."
                      value="Preview only"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
