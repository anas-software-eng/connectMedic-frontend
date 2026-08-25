import { Activity, CalendarCheck, FileHeart, Lock, MessagesSquare, Stethoscope } from "lucide-react";

const TILES = [
  { icon: <Stethoscope className="size-7" />, filled: true },
  { icon: <MessagesSquare className="size-7" />, filled: false },
  { icon: <FileHeart className="size-7" />, filled: true },
  { icon: <CalendarCheck className="size-7" />, filled: false },
  { icon: <Activity className="size-7" />, filled: true },
  { icon: <Lock className="size-7" />, filled: false },
];

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {TILES.map((tile, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl flex items-center justify-center ${
                tile.filled
                  ? "bg-primary text-primary-content"
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}
            >
              {tile.icon}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
