import { FiUploadCloud } from "react-icons/fi";
export default function UploadImageComponent({ onChange, id = "profile_picture", label }) {
    return (
        <label
            htmlFor={id}
            className="cursor-pointer bg-white text-center text-black text-sm border-1 rounded-xl border-gray-200 px-3 py-2 hover:bg-blue-100 transition flex flex-row items-center"
        >
            <FiUploadCloud size={18} className="mr-2" />
            {label}
            <input
                type="file"
                id={id}
                name={id}
                className="hidden"
                onChange={onChange}
            />
        </label>
    );
}
