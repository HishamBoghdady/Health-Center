import { useContext,createContext,useState } from "react";

const LoginContext = createContext(null);


export default function LoginProvider({children}){
  const [login,setLogin]=useState(false)
  return(
    <>
      <LoginContext.Provider value={{login,setLogin}}>
        {children}
      </LoginContext.Provider>
    </>
  )
}

export function LoginUse(){
  return useContext(LoginContext)
}