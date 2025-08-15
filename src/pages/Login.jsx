import { useNavigate } from "react-router-dom"
import '../assets/LoginStyle.css'
import { useState } from "react"
import { LoginUse } from "../context/ContextLogin"
// 
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/Firebase.config";

import { signIn } from "../firebase/authService";
function Login() {
      const [ dbLogin , setdbLogin ] = useState({username:'',password:''})
      const { setLogin }=LoginUse()
      let navigate = useNavigate();

      const HandleLogin = async(e)=>{
        e.preventDefault();

        try{
          const q = query(collection(db, "users"),where("username", "==", dbLogin.username),where("password", "==", dbLogin.password));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                alert("✅ Login successful!");
                setLogin(true)
                navigate("/dashpoard")
            }
            else {
                alert("❌ Invalid username or password");
                setLogin(false)
                navigate("/")
            }
        }catch(err){
          console.log("err"+err)
        }
      }

       const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            await signIn(dbLogin.username, dbLogin.password);
                alert("✅ Login successful!");
                setLogin(true)
                navigate("/dashpoard")
          } catch (err) {
                alert("❌ Invalid username or password" +err);
                setLogin(false)
                navigate("/")
          }
  };
  return (
    <>
     <form onSubmit={handleSubmit}>
       {/*--------------------- Main Container ------------------------*/}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        {/*--------------------- Login Container ------------------------*/}
        <div className="row border rounded-5 p-3 bg-white shadow box-area">
          {/*------------------------- Left Box ---------------------------*/}
          <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: "#103cbe" }}>
            <div className="featured-image mb-3">
              <img src="/public/الادمان.png" className="img-fluid" style={{ width: 250 }} />
            </div>
            <p className="text-white fs-2" style={{ fontFamily: '"Courier New", Courier, monospace', fontWeight: 600 }}>
              Be Verified
            </p>
            <small className="text-white text-wrap text-center" style={{ width: "17rem", fontFamily: '"Courier New", Courier, monospace' }}>
              Join experienced Designers on this platform.
            </small>
          </div>
          {/*------------------ ------ Right Box --------------------------*/}
          <div className="col-md-6 right-box">
            <div className="row align-items-center">

              <div className="header-text mb-4">
                <h2>Hello,Again</h2>
                <p>We are happy to have you back.</p>
              </div>

              <div className="input-group mb-3">
                <input type="text" placeholder="Email address"
                  className="form-control form-control-lg bg-light fs-6" 
                  value={dbLogin.username}
                  onChange={(e)=>{setdbLogin({...dbLogin,username:e.target.value})}}
                  />
              </div>
              {/* <p style={{color:"red"}}>The username is incorrect</p> */}

              <div className="input-group mb-1">
                <input type="password" placeholder="Password"
                  className="form-control form-control-lg bg-light fs-6" 
                  value={dbLogin.password}
                  onChange={(e)=>{setdbLogin({...dbLogin,password:e.target.value})}}
                  />
              </div>
              {/* <p style={{color:"red"}}>The password is incorrect</p>  */}

              <div className="input-group mb-5 d-flex justify-content-between">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="formCheck" />
                  <label htmlFor="formCheck" className="form-check-label text-secondary">
                    <small>Remember Me</small>
                  </label>
                </div>

                <div className="forgot">
                  <small>
                    <a href="#">Forgot Password?</a>
                  </small>
                </div>
              </div>

              <div className="input-group mb-3">
                
                  <button className="btn btn-lg btn-primary w-100 fs-6" type="submit">
                    <i className="bi bi-box-arrow-in-right"></i>
                    Login
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
     </form>
    </>
  )
}

export default Login