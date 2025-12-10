export default function Card({ title, icon, children }) {
  return (
    <div className="bg-fondo dark:bg-card-dark shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-texto dark:text-text-primary-dark mb-6 flex items-center gap-3">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}