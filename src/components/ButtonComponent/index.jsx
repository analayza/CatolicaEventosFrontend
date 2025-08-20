export default function ButtonComponent({ label, type = 'submit', onClick, color = "green", size, text }) {
    const baseClasses = "transition hover:scale-105 px-4 py-2 text-white rounded-md md:ml-35 flex items-center justify-center"

    const colorClassesMap = {
        green: "bg-[#4bcc5e] hover:bg-green-600",
        blue: "bg-[#00549B] hover:bg-blue-700",
        red: "bg-blue-500 hover:bg-red-700",
        gray: "bg-gray-400 hover:bg-gray-600",
    };

    const sizeStyles = size || "md:w-50 w-25 md:h-10 h-8" 
    const colorClasses = colorClassesMap[color] || colorClassesMap.green;
    const texStyles = text || "md:text-xl text-sm"
    return (
        <>
            <button
                type={type}
                onClick={onClick}
                className={`${colorClasses} ${baseClasses} ${sizeStyles} ${texStyles}`}
            >
                {label}
            </button>
        </>
    )
} 