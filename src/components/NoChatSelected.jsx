import { Link } from "react-router-dom";
import { Stethoscope, Users } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-10 sm:p-16">
      <div className="max-w-md text-center space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Stethoscope className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Your secure inbox</h2>
        <p className="text-base-content/60">
          Pick someone from your care team to open a secure, encrypted conversation.
        </p>
        <Link to="/dashboard/care-team" className="btn btn-primary btn-sm gap-2">
          <Users className="size-4" />
          Browse care team
        </Link>
        <p className="text-xs text-base-content/72">
          For a medical emergency, call your local emergency number instead of messaging.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
