export default function SectionHeader({ title, subtitle, center = false }) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="mt-2 text-neutral-500 text-sm md:text-base">{subtitle}</p>}
      <div className={`mt-3 h-1 w-14 bg-primary-600 rounded-full ${center ? 'mx-auto' : ''}`} />
    </div>
  );
}
