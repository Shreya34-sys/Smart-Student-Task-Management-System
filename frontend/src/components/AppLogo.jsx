import { GraduationCap } from "lucide-react";

export default function AppLogo({ showText = true, size = "md" }) {
  const sizes = {
    sm: "h-9 w-9 rounded-xl",
    md: "h-10 w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl"
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size]} relative grid place-items-center overflow-hidden bg-gradient-to-br from-teal-300 via-sky-300 to-violet-400 text-slate-950 shadow-lg shadow-teal-500/20`}>
        <div className="absolute inset-0 bg-white/25 opacity-0 transition hover:opacity-100" />
        <GraduationCap className={size === "lg" ? "h-7 w-7" : "h-6 w-6"} />
      </div>
      {showText && (
        <div className="leading-tight">
          <p className="text-base font-black text-white">Smart Student</p>
          <p className="text-xs font-semibold text-teal-200">Task Management</p>
        </div>
      )}
    </div>
  );
}
