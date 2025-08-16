import { useContext,createContext,useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged, setPersistence ,browserSessionPersistence} from "firebase/auth";

import { auth } from "../firebase/Firebase.config"; 

const LoginContext = createContext(null);


export default function LoginProvider({children}){
    const [login,setLogin]=useState(false)
    const [loading, setLoading] = useState(true); // حالة انتظار

    useEffect(() => {
      // نخلي الجلسة تبقى حتى بعد إغلاق المتصفح

        // setPersistence(auth, browserLocalPersistence); // يبقى بعد إغلاق المتصفح
         setPersistence(auth, browserSessionPersistence); // ينتهي مع قفل التبويب
        // setPersistence(auth, inMemoryPersistence); // ينتهي حتى مع refresh
      // مراقبة حالة المستخدم من Firebase
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setLogin(true);
        } else {
          setLogin(false);
        }
        setLoading(false); // انتهى التحقق
      });
      return () => unsubscribe();
    }, []);

  return(
    <>
      <LoginContext.Provider value={{login,setLogin,loading, setLoading}}>
        {children}
      </LoginContext.Provider>
    </>
  )
}

export function LoginUse(){
  return useContext(LoginContext)
}