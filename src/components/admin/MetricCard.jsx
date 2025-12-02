const MetricCard = ({ title, value, subtitle }) => (
  <div className="bg-fondo dark:bg-(--color-card) shadow-lg rounded-xl p-8">
  <h3 className="text-base font-semibold text-texto) dark:text-(--color-text-primary)">{title}</h3>
    <p className="text-3xl font-bold text-teal-600">{value}</p>
    <p className="text-sm text-gray-500 mt-1 wrap-break-words">{subtitle}</p>
  </div>
);
export default MetricCard;