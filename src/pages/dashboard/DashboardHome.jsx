import { Link } from "react-router-dom";
import { ArrowUpRight, Inbox } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <div className="group bg-base-100 border border-base-300/70 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-base-content/60">{stat.label}</span>
        <span className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
          {Icon && <Icon className="size-4" />}
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold tabular-nums leading-none">{stat.value}</div>
      {stat.hint && <div className="mt-2 text-xs text-base-content/45">{stat.hint}</div>}
    </div>
  );
};

const Section = ({ section }) => {
  const Icon = section.icon;
  return (
    <section className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-base-300/70">
        <h2 className="font-semibold flex items-center gap-2">
          {Icon && <Icon className="size-4 text-primary" />}
          {section.title}
        </h2>
        {section.action && (
          <Link
            to={section.action.to}
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            {section.action.label}
            <ArrowUpRight className="size-3" />
          </Link>
        )}
      </header>

      {section.items?.length ? (
        <ul className="divide-y divide-base-300/70">
          {section.items.map((item, i) => (
            <li key={i} className="px-5 py-3 text-sm hover:bg-base-200/50 transition-colors">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-5 py-10 flex flex-col items-center text-center gap-2">
          <span className="p-3 rounded-2xl bg-base-200 text-base-content/40">
            <Inbox className="size-5" />
          </span>
          <p className="text-sm text-base-content/50">{section.empty}</p>
        </div>
      )}
    </section>
  );
};

const DashboardHome = () => {
  const { config, liveValues } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {config.stats.map((stat) => (
          <StatCard key={stat.id} stat={{ ...stat, value: liveValues[stat.id] ?? stat.value }} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2 items-start">
        {config.sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};
export default DashboardHome;
