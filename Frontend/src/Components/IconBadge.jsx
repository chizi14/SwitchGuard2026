const toneStyles = {
  primary: "bg-primary-container/10 text-primary-container",
  secondary: "bg-secondary-container/40 text-on-secondary-container",
  success: "bg-tertiary-container/15 text-on-tertiary-container",
  error: "bg-error-container text-on-error-container",
  neutral: "bg-surface-container text-on-surface-variant",
};

export default function IconBadge({ icon: Icon, tone = "primary", size = 44 }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${toneStyles[tone]}`}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.5} strokeWidth={2} />
    </div>
  );
}
