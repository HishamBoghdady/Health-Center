import { Link } from "react-router-dom";
import Button from "./components/Button";
// 
import './btn.css'
import { LoginUse } from "../context/ContextLogin";
import { auth } from "../firebase/Firebase.config";

export default function Navbar() {
const {setLogin}=LoginUse()
function HandleExit(){
    setLogin(false)
    auth.signOut()
}
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          
          <Link to="/dashpoard/about"><img src="/Elmanar.jpg" alt="" className="LOGO" /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <Link to="/dashpoard/newpatient" className="nav-item">
                <Button title="تسجيل حاله" icon="bi bi-person-plus-fill"/>
              </Link>
              <Link to="/dashpoard/session">
                <Button title={"جلسات"} icon={"bi bi-person-workspace"}/>
              </Link>
              <Link to="/dashpoard/money">
                <Button title={"الماليات"} icon={"bi bi-cash-stack"}/>
              </Link>
              <Link to="/dashpoard/searsh">
                <Button title={"الاستعلامات"} icon={"bi bi-search"}/>
              </Link>
            </ul>

              <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                  Exit <i className="bi bi-box-arrow-left"></i>
              </button>
          </div>
        </div>
      </nav>
      

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" 
          aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">Exit page</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">Are you sure Exit Dashboard
                  <h2>MRS: {auth.currentUser?.email}</h2>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-danger" onClick={HandleExit}>Exit</button>
                {/* <a href='/' type="button" className="btn btn-danger">Exit</a> */}
                </div>
              </div>
          </div>
        </div>
      
      <button class="fab-btn" >
        <i class="bi bi-plus"></i>
      </button>
    </>
  );
}
