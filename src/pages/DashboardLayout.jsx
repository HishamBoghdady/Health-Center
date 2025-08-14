import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Outlet } from "react-router-dom";
export default function DashboardLayout() {
  return (
    <>
      <form onSubmit={(e)=>{e.preventDefault();}}>
        <Navbar />
          <div className="content">
            <div className="form-container">
              <Outlet />
            </div>
          </div>
        <Footer />
      </form>
    </>
  );
}
