import { useEffect, useState } from "react";
import Styles from '../assets/MD_PersonSE.module.css'
import { ProvInfoUse } from "../context/ContextData";
import {updatePatient,getPatients} from "../firebase/Firebase.config"
// 
// import  GetsumSession  from "../utils/CollectionSession"
// import splitDateTime from "../utils/DateSplit"
// import CollectionDate from "../utils/CollectionDate"
// import CheckMoney from '../utils/CollectionOwed';
//-----
import utilsFuncs from "../utils";
//
export default function Session() {
  const {GetsumSession,splitDateTime,CollectionDate,CheckMoney}=utilsFuncs()
  const { patient, setPatient } = ProvInfoUse()
  const [querysearch, setQuerysearch] = useState("");
  const [PatientSed, setPatientSed] = useState({ name: '', date: '' })
  const [selectedPerson, setSelectedPerson] = useState([])
  const [addSessionDetail, setAddDetailSession] = useState({ SessionDate: '', NumberSession: '' })
  // 
  useEffect(() => {
    const fetchData = async () => {
      try{
        let db = await getPatients();
        // let db = JSON.parse(localStorage.getItem("Patient")) ?? []
        const UpdatedDate = db.map((e) => {
          const numberDays = CollectionDate(e.EnteryData.EntryTime, e.ExitData.ExitTime);
          const amountOwed = CheckMoney(numberDays, e.FinancialData.AmountPaid); // مرر البيانات المطلوبة
            return { ...e, FinancialData: { ...e.FinancialData, NumberDays: numberDays, AmountOwed: amountOwed, }, };
        });
        setPatient(UpdatedDate)
        localStorage.setItem("Patient", JSON.stringify(UpdatedDate))
      }catch(error){
        console.log("err"+error)
        console.error("❌ خطأ في جلب البيانات من Firestore:", error);

        // fallback: من LocalStorage
        let dbLocal = JSON.parse(localStorage.getItem("Patient")) ?? [];
        const UpdatedDate = dbLocal.map((e) => {
          const numberDays = CollectionDate(e.EnteryData.EntryTime, e.ExitData.ExitTime);
          const amountOwed = CheckMoney(numberDays, e.FinancialData.AmountPaid);
          return {...e,FinancialData: {...e.FinancialData,NumberDays: numberDays,AmountOwed: amountOwed,},};
        });
        setPatient(UpdatedDate);
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 
  const FiltredData = patient.filter((e) => e.PersonalData.Name.includes(querysearch) && e.EnteryData.Condition == "in")
  const MappedFiltred = FiltredData.map((e, index) => {
    return (
      querysearch &&
      <li key={e.id} style={{ padding: '5px 0', direction: 'rtl', listStyleType: 'none' }}>
        <div className={Styles.divMain} >
          <div className={Styles.rightDiv}>
            <div style={{ fontWeight: 'bold' }}>{(index + 1) + ":- " + e.PersonalData.Name}</div>
            <div style={{ fontSize: '12px', color: '#f87171' }}>{splitDateTime(e.EnteryData.EntryTime).date}</div>
          </div>
          <div className={Styles.centerDiv} style={{ backgroundColor: e.EnteryData.Condition == "in" ? "red" : "green" }}>
            {e.EnteryData.Condition}
          </div>
          <div>
            <button className={Styles.button} onClick={() => {
              setQuerysearch(e.PersonalData.Name)
              setPatientSed({ name: e.PersonalData.Name, date: splitDateTime(e.EnteryData.EntryTime).date })
              setSelectedPerson(e)
            }}>Select
            </button>
          </div>
        </div>
      </li>
    )
  }
  )

  // (------------:-{Function Add money And FinancialDetails.AmountPaid}-:---------------) 
  function HandleAddSessionAndSum() {
    const updatedPatient = patient.map((e) => {
      if (e.id === selectedPerson.id) {
        // أضف الجلسة الجديدة
        const newSessionDetails = [...(e.SessionDetails || []), addSessionDetail];
        // احسب مجموع الجلسات باستخدام Getsum على الشخص المحدث
        const updatedPerson = { ...e, SessionDetails: newSessionDetails };
        const newNumberSession = GetsumSession(updatedPerson);

        // أعد الكائن النهائي مع FinancialData المحدث
        return { ...updatedPerson, FinancialData: { ...e.FinancialData, NumberSession: newNumberSession, }, };

      } else {
        return e;
      }
    });

    setPatient(updatedPatient);
    localStorage.setItem("Patient", JSON.stringify(updatedPatient));
    // تحديث في Firestore للمريض المحدد فقط
    const updatedPerson = updatedPatient.find(p => p.id === selectedPerson.id);
    if (updatedPerson) {
      updatePatient(updatedPerson.id, updatedPerson)
        .then(() => console.log("✅ تم تحديث الجلسات في Firestore"))
        .catch(err => console.error("❌ خطأ في تحديث الجلسات:", err));
    }
    HandleResetInput();
  }
  // (------------:-{Function Reset Inputs}-:---------------)
  function HandleResetInput() {
    setQuerysearch("")
    setPatientSed({ name: '', date: '' })
    setSelectedPerson([])
    setAddDetailSession({ SessionDate: '', NumberSession: '' })
  }
  return (
    <>
      {/*------------*/}
      {/* قسم البحث */}
      {/*------------*/}
      <section className="section">

        <h2>اضافة جلسات</h2>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="search">ابحث عن المريض</label>
            <input type="text" placeholder="اكتب اسم أو رقم المريض" className="form-control"
              onChange={(e) => setQuerysearch(e.target.value)} value={querysearch} />
          </div>

          <div className="form-group">
            <ol className={Styles.olStyle}>{MappedFiltred}</ol>
            {/* <ol className={Styles.olStyle}>{HTMX}</ol> */}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="patient-name">اسم المريض</label>
            <input type="text" name="patient-name" className="form-control" disabled value={PatientSed.name} />
          </div>

          <div className="form-group">
            <label htmlFor="entry-date">ميعاد الدخول</label>
            <input type="date" name="entry-date" className="form-control" disabled value={PatientSed.date} />
          </div>
        </div>

      </section>
      {/*-----------------*/}
      {/* تفاصيل الجلسات */}
      {/*-----------------*/}
      <section className="section">

        <h2>تفاصيل الجلسات</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="session-date">تاريخ الجلسة</label>
            <input type="date" id="session-date" name="session-date" className="form-control" value={addSessionDetail.SessionDate}
              onChange={(e) => { setAddDetailSession(prev => ({ ...prev, SessionDate: e.target.value })) }} />
          </div>

          <div className="form-group">
            <label htmlFor="session-count">عدد الجلسات</label>
            <input type="number" id="session-count" name="session-count" className="form-control" value={addSessionDetail.NumberSession}
              onChange={(e) => { setAddDetailSession(prev => ({ ...prev, NumberSession: e.target.value })) }} />
          </div>
        </div>

      </section>
      {/*----------------------*/}
      {/* Save & Delete Buttons*/}
      {/*----------------------*/}
      <div className="text-end mt-4">
        {/* HandleAddSessionAndSumee */}
        <button type="submit" className="btn btn-primary" id="saveBtn" onClick={HandleAddSessionAndSum}>
          <i className="bi bi-floppy" style={{ fontStyle: "normal" }}> Add Session</i>
        </button>
        <button type="submit" className="btn btn-danger" id="delBtn" onClick={HandleResetInput}>
          <i className="bi bi-x-circle" style={{ fontStyle: "normal" }}> Reset</i>
        </button>
      </div>
    </>
  )
}