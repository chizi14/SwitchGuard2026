const TONE_STYLES = {
  primary: "bg-primary-container text-on-primary-container",
  success: "bg-tertiary-container text-on-tertiary-container",
  danger: "bg-error-container text-on-error-container",
  warning: "bg-secondary-container text-on-secondary-container",
  neutral: "bg-surface-high text-on-surface-variant",
};

export default function IconBadge({ icon: Icon, tone = "primary", size = 44 }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${TONE_STYLES[tone]}`}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.5} strokeWidth={2} />
    </div>
  );
}