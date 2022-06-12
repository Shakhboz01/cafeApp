import { css } from "styled-components"

 export const mobile=((size,props)=>{
     
     
    return css`
    @media only screen and (max-width:${size}px){
        ${props} 
    }
    `;
});