import { Field, ErrorMessage } from "formik";

export default function FormInputComponent({ label, name, type, placeholder}) {
    return (
        <>
            
                {label && (
                    <label
                        htmlFor={name}
                        className="block mb-1 text-sm font-normal text-gray-700 ml-1 "
                    >
                        {label}
                    </label>
                )}
            
            <Field
                name={name}
                type={type}
                placeholder={placeholder}
                className= 'border border-gray-200 w-full h-8 rounded-md placeholder-gray-400 placeholder-opacity-70 placeholder:text-xs px-2 focus:outline-none focus:ring-1 focus:ring-gray-200'
                
            />
            <ErrorMessage name={name} component="div" className="text-red-600 text-sm mt-1"/>
        </>
    )
}