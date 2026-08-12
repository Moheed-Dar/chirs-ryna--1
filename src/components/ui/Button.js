export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyle = "px-6 py-3 rounded-lg font-medium transition-all";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
