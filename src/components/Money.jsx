import { ProvInfoUse } from "../context/ContextData";
import { Getsum } from "../utils/CollectionMoney";
import { useEffect, useState } from "react";
import Styles from '../assets/MD_PersonSE.module.css'
import splitDateTime from "../utils/DateSplit"
// 
import CollectionDate from "../utils/CollectionDate"
import CheckMoney from '../utils/CollectionOwed';
import {updatePatient,getPatients} from "../firebase/Firebase.config" 
//
export default function Money() {
  const { patient, setPatient } = ProvInfoUse()
  const [querysearch, setQuerysearch] = useState("");
  const [PatientSed, setPatientSed] = useState({ name: '', date: '' })
  const [selectedPerson, setSelectedPerson] = useState([])
  const [addMoneyDetail, setAddDetailMoney] = useState({ PaymentDate: '', AmountPaid: '' })
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
        console.log("err:"+error)
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
  function HandleAddMoneyAndSum() {
    const updatedPatient = patient.map((e) => {
      if (e.id === selectedPerson.id) {
        return {
          ...e,
          PaymentsDetails: [...(e.PaymentsDetails || []), addMoneyDetail],
          FinancialData: {
            ...e.FinancialData, AmountPaid: Getsum({
              ...e,
              PaymentsDetails: [...(e.PaymentsDetails || []), addMoneyDetail],
            }),
          },
        };
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
    setAddDetailMoney({ PaymentDate: '', AmountPaid: '' })
  }
  return (
    <>
      {/*------------*/}
      {/* قسم البحث */}
      {/*------------*/}
      <section className="section">

        <h2>اضافة مدفوعات</h2>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="search">ابحث عن المريض</label>
            <input type="text" id="search" name="search" placeholder="اكتب اسم أو رقم المريض" className="form-control" value={querysearch}
              onChange={(e) => { setQuerysearch(e.target.value) }} />
          </div>

          <div className="form-group">
            <ol className={Styles.olStyle}>{MappedFiltred}</ol>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="patient-name">اسم المريض</label>
            <input type="text" id="patient-name" name="patient-name" className="form-control" disabled value={PatientSed.name} />
          </div>

          <div className="form-group">
            <label htmlFor="entry-date">ميعاد الدخول</label>
            <input type="date" id="entry-date" name="entry-date" className="form-control" disabled value={PatientSed.date} />
          </div>
        </div>

      </section>
      {/*-------------------*/}
      {/* تفاصيل المدفوعات */}
      {/*-------------------*/}
      <section className="section">

        <h2>تفاصيل المدفوعات</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="session-date">تاريخ الدفع</label>
            <input type="date" id="session-date" name="session-date" className="form-control" value={addMoneyDetail.PaymentDate}
              onChange={(e) => { setAddDetailMoney(prev => ({ ...prev, PaymentDate: e.target.value })) }} />
          </div>

          <div className="form-group">
            <label htmlFor="session-count">مبلغ المدفوع</label>
            <input type="number" id="session-count" name="session-count" className="form-control" value={addMoneyDetail.AmountPaid}
              onChange={(e) => { setAddDetailMoney(prev => ({ ...prev, AmountPaid: e.target.value })) }} />
          </div>
        </div>

      </section>
      {/*----------------------*/}
      {/* Save & Delete Buttons*/}
      {/*----------------------*/}
      <div className="text-end mt-4">
        <button type="submit" className="btn btn-primary" id="saveBtn" onClick={HandleAddMoneyAndSum}>
          <i className="bi bi-floppy" style={{ fontStyle: "normal" }}> Add Money</i>
        </button>
        <button type="submit" className="btn btn-danger" id="delBtn" onClick={HandleResetInput}>
          <i className="bi bi-x-circle" style={{ fontStyle: "normal" }}> Reset</i>
        </button>
      </div>
    </>
  )
}