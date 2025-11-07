import { Outlet,Navigate } from "react-router-dom";
import { LoginUse } from "../context/ContextLogin";
import Loading from "../components/Loading";
export default function ProtectRoute(){

    const {login, loading}=LoginUse()

    // if (loading) {return <p>جار التحقق من الجلسة...</p>;}
 if (loading) {return <Loading/>;}

    return(login ? <Outlet/> : <Navigate to="/"/>)
}