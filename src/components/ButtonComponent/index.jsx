export default function ButtonComponent({ label, type = 'submit', onClick, color = "green", size, text, children }) {
    const baseClasses = "transition hover:scale-105 px-4 py-2 text-white rounded-md flex items-center justify-center cursor-pointer"

    const colorClassesMap = {
        green: "bg-[#4bcc5e] hover:bg-green-600",
        blue: "bg-[#00549B] hover:bg-blue-700",
        red: "bg-red-500 hover:bg-red-700",
        gray: "bg-gray-400 hover:bg-gray-600",
        greenwater: "bg-[#0CB0A2] hover:bg-[#0A8C82]",
        purple: "bg-[#7D387C] hover:bg-[#642E63]"
    };

    const sizeStyles = size || "md:w-48 w-24 md:h-10 h-8" 
    const colorClasses = colorClassesMap[color] || colorClassesMap.green;
    const texStyles = text || "md:text-xl text-sm"
    return (
        <>
            <button
                type={type}
                onClick={onClick}
                className={`${colorClasses} ${baseClasses} ${sizeStyles} ${texStyles}`}
            >
                {children || label}
            </button>
        </>
    )
} 