export default function Card({ children, className = "", padded = true }) {
  const hasCustomBackground = /(^|\s)bg-/.test(className);

  return (
    <div
      className={`${hasCustomBackground ? "" : "bg-surface-lowest"} rounded-md shadow-soft ${padded ? "p-5 md:p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
