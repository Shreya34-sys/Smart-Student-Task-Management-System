export default function StatCard({ label, value, tone = "teal" }) {
  const tones = {
    teal: "bg-teal-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    sky: "bg-sky-500"
  };

  return (
    <div className="glass rounded-lg p-5 transition hover:-translate-y-1 hover:shadow-soft">
      <div className={`mb-4 h-2 w-12 rounded-full ${tones[tone]}`} />
      <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
