import { Outlet,Navigate } from "react-router-dom";
import { LoginUse } from "../context/ContextLogin";



export default function ProtectRoute(){

    const {login}=LoginUse()
    const user = login

    return(user ? <Outlet/> : <Navigate to="/"/>)
}