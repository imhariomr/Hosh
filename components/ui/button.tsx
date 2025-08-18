interface ButtonProps{
    label:string,
    variant: "primary" | "secondary",
    size: "sm" | "md" | "lg" ,
    class?: string,
    onClick ?: () => void 
}

const variantStyles = {
    "primary" : "bg-black text-white",
    "secondary": "bg-gray-200 text-black"
}

const size = {
    "sm" : "px-1 py-1",
    "md" : "px-4 py-2",
    "lg" :  "px-8"
}

const defaultClass = "rounded-md"

export default function Button(props:ButtonProps){
    return(
        <button className={`${variantStyles[props.variant]} ${size[props.size]} ${defaultClass}`} onClick = {props.onClick}>{props.label}</button>
    )
}