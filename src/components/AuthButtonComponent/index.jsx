export default function AuthButtonComponent({label, type='submit', onClick}){
    return(
        <>
        <button 
            type={type}
            onClick={onClick}
            className=" bg-[#00559C] px-4 py-2 text-white text-sm rounded-md w-full h-8 flex items-center justify-center"
        >            
            {label}
        </button>
        </>
    )
}7