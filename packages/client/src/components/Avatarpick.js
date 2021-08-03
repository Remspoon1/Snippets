import react from "react"
import { useState } from "react"



function AvatarPicker(props) {

    let imgs = [
        '/bird.svg',
        '/dog.svg',
        '/fox.svg',
        '/frog.svg',
        '/lion.svg',
        '/owl.svg',
        '/tiger.svg',
        '/whale.svg',
    ]
    return (
        <div>
            {imgs.map((pic)=>{
            return (<img height="50" width="50" src={pic} onClick={(event) => {
                props.firetruck(pic)
            }}
            style={pic===props.profileImage ? {border: "1px solid blue"} : {}}
            ></img>)
            })}
        </div>
    )
}

export default AvatarPicker