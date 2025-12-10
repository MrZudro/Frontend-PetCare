const QuickAction = ({ label, description, icon: Icon }) => (
  <button className="flex items-center justify-between bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-3 py-3 rounded-lg shadow-xl text-left w-full transition">
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-white/80">{description}</p>
    </div>
    <Icon className="text-xl ml-4" />
  </button>
);
export default QuickAction;