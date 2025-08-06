export default function ButtonComponent({ label, type = 'submit', onClick, color = "green" }) {
    const baseClasses = "transition px-4 py-2 text-white md:text-xl text-sm rounded-md md:w-50 w-35 h-8 md:ml-35 md:h-10 flex items-center justify-center"

    const colorClassesMap = {
        green: "bg-[#7EE38E] hover:bg-green-500",
        blue: "bg-[#00549B] hover:bg-blue-700",
        red: "bg-blue-500 hover:bg-red-700",
        gray: "bg-gray-400 hover:bg-gray-600",
    };

    const colorClasses = colorClassesMap[color] || colorClassesMap.green;
    return (
        <>
            <button
                type={type}
                onClick={onClick}
                className={`${colorClasses} ${baseClasses}`}
            >
                {label}
            </button>
        </>
    )
} 7