export default function FeatureCard({ title, children }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-white/70">{children}</p>
    </div>
  );
}