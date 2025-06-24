export default function Button({ children, onClick, disabled, variant = "primary" }) {
  return (
    <button
      className={`mt-4 ${variant === "primary" ? "bg-amber-400 hover:bg-amber-500" : "bg-zinc-200 hover:bg-zinc-300"} text-zinc-800 font-semibold tracking-wide text-lg p-2 rounded px-6 py-3 rounded-xl shadow-md transition duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
