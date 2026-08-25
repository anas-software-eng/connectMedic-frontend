import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";

// Stand-in for dashboard areas that don't have real data yet. Swap a route's
// element for a real page as each one gets built.
const PlaceholderPage = ({ title, description }) => {
  const { config } = useDashboard();

  return (
    <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm px-6 py-16 flex flex-col items-center text-center gap-3">
      <span className="p-4 rounded-2xl bg-primary/10 text-primary">
        <Construction className="size-6" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-base-content/55 max-w-sm">
        {description ?? `This area isn't wired up yet for the ${config.label.toLowerCase()} view.`}
      </p>
      <Link to="/dashboard" className="btn btn-sm btn-outline mt-2">
        Back to overview
      </Link>
    </div>
  );
};
export default PlaceholderPage;
