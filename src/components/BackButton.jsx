import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Goes back through history when there is somewhere to go back to, and falls
// back to `to` on a cold load (deep link, refresh, or a fresh tab).
const BackButton = ({ to = "/", label = "Back", className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.key !== "default";

  return (
    <button
      type="button"
      onClick={() => (canGoBack ? navigate(-1) : navigate(to, { replace: true }))}
      className={`btn bg-base-100  gap-2 ${className} mb-10`}
    >
      <ArrowLeft className="size-6" />
      {label}
    </button>
  );
};
export default BackButton;
