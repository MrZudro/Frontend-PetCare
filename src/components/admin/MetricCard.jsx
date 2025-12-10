const MetricCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-fondo dark:bg-card-dark shadow-lg rounded-lg p-4 flex items-center gap-4">
    {icon && <div className="text-primary text-2xl bg-primary/10 p-3 rounded-lg">{icon}</div>}
    <div>
      <h3 className="text-base font-semibold text-texto dark:text-text-primary-dark">{title}</h3>
      <p className="text-2xl font-bold text-primary">{value}</p>
      {subtitle && <p className="text-sm mt-1 text-texto/70 dark:text-text-secondary-dark">{subtitle}</p>}
    </div>
  </div>
);

export default MetricCard;