import { Outlet,Navigate } from "react-router-dom";
import { LoginUse } from "../context/ContextLogin";

export default function ProtectRoute(){

    const {login, loading}=LoginUse()

    if (loading) {return <p>جار التحقق من الجلسة...</p>;}

    return(login ? <Outlet/> : <Navigate to="/"/>)
}