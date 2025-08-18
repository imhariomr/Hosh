interface InputProps{
    className:string
}

const defaultClass = 'my-2';
export default function Input(props:InputProps){
    return(
        <div>
            <input className={`${props.className} ${defaultClass}`}/>
        </div>
    )
}