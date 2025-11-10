export function Button({ children, className, variant, ...props }) {
  let base = "px-6 py-2 rounded-full font-medium transition-colors duration-200";
  if (variant === "outline") {
    base += " border border-gray-400 text-gray-700 hover:bg-gray-100";
  } else {
    base += " bg-black text-white hover:bg-gray-800";
  }
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}
