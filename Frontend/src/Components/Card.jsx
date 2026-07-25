export default function Card({ children, className = "", padded = true }) {
  return (
    <div
      className={`bg-surface-lowest rounded-md shadow-soft ${padded ? "p-5 md:p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
