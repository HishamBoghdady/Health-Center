// Hooks from React
import { Routes, Route } from "react-router-dom";
// Emports Components
import DashboardLayout from './pages/DashboardLayout';
import Login from "./pages/Login";
import Intro from './components/Intro'
import Money from './components/Money'
import Error from './components/Error'
import Search from './components/Search'
import Session from './components/Session'
import EntryDB from './components/EntryDB'
// Emports Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Emports CSSSheeys
import './assets/App.css'
// Emport Auth
import ProtectRoute from "./auth/ProtectRoute";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Error />} />
        <Route element={<ProtectRoute />}>
          <Route path="/dashpoard" element={<DashboardLayout />}>
            <Route index element={<Intro />} />
            <Route path='about' element={<Intro />} />
            <Route path='newpatient' element={<EntryDB />} />
            <Route path='session' element={<Session />} />
            <Route path='money' element={<Money />} />
            <Route path='searsh' element={<Search />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}