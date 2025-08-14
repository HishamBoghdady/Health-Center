import { createContext, useContext, useState } from "react";
const ContextData = createContext([])
// Initial Data
const InitialInfo=[]
// Define Provider
export default function ProvInfo({ children }) {
    const [patient, setPatient] = useState(InitialInfo)
    
    return (
        <ContextData.Provider value={{ patient, setPatient}}>
            {children}
        </ContextData.Provider>
    )
}
// use in any Components
export function ProvInfoUse() {
    return useContext(ContextData)
}