import { useEffect, useState } from "react";
import Styles from '../assets/MD_PersonSE.module.css'
import { ProvInfoUse } from "../context/ContextData";
import {updatePatient,getPatients} from "../firebase/Firebase.config" 
import { DataGrid } from "@mui/x-data-grid"; // ✅ لإضافة الجدول الحديث من MUI
// 
// import  GetsumMoney  from "../utils/CollectionMoney";
// import splitDateTime from "../utils/DateSplit"
// import CollectionDate from "../utils/CollectionDate"
// import CheckMoney from '../utils/CollectionOwed';
//---
import utilsFuncs from "../utils";
//
export default function Money() {
  const {GetsumMoney,splitDateTime,CollectionDate,CheckMoney}=utilsFuncs()
  const { patient, setPatient } = ProvInfoUse()
  const [querysearch, setQuerysearch] = useState("");
  const [PatientSed, setPatientSed] = useState({ name: '', date: '' })
  const [selectedPerson, setSelectedPerson] = useState([])
  const [addMoneyDetail, setAddDetailMoney] = useState({ PaymentDate: '', AmountPaid: '' })
  const [selectedPatientDetails, setSelectedPatientDetails] = useState({PaymentsDetails: []});
  // const [lastAction, setLastAction] = useState(null); // لتخزين آخر عملية تمت
  const [historyStack, setHistoryStack] = useState([]);
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
              setSelectedPatientDetails(e)
            }}>Select
            </button>
          </div>
        </div>
      </li>
    )
  }
  )
  // (------------:-{Function Add money And FinancialDetails.AmountPaid}-:---------------)
// نسخ مساعدة لتحويل PaymentsDetails إلى نسخة قابلة للتحديث
const pushHistory = (prevDetails) => {
  setHistoryStack((s) => [...s, JSON.parse(JSON.stringify(prevDetails))]);
  // حافظ على حدود للسجل لو أردت (مثلاً آخر 10 تغييرات)
  // setHistoryStack((s) => [...s.slice(-9), JSON.parse(JSON.stringify(prevDetails))]);
};

// دالة تعديل الحقول محليًا (تحافظ على قابلية التعديل في الجداول العادية)
function handleEditChange(index, field, value) {
  // خزن الحالة الحالية في التاريخ قبل التعديل
  pushHistory(selectedPatientDetails);

  const payments = [...selectedPatientDetails.PaymentsDetails];
  const updated = { ...payments[index], [field]: field === "AmountPaid" ? Number(value) : value };
  payments[index] = updated;

  const updatedDetails = {
    ...selectedPatientDetails,
    PaymentsDetails: payments,
    FinancialData: {
      ...selectedPatientDetails.FinancialData,
      AmountPaid: GetsumMoney({ ...selectedPatientDetails, PaymentsDetails: payments }),
    },
  };

  setSelectedPatientDetails(updatedDetails);
  // لا تحفظ على الفور في firebase هنا — نسمح للحفظ اليدوي لكل صف أو حفظ الكل
}

// حفظ صف واحد (بناءً على الفهرس)
async function handleSaveRowByIndex() {
  try {
    // خزن التاريخ الحالي للسماح بالتراجع
    pushHistory(selectedPatientDetails);

    // إعادة حساب المبالغ
    const payments = [...selectedPatientDetails.PaymentsDetails];
    const updatedDetails = {
      ...selectedPatientDetails,
      PaymentsDetails: payments,
      FinancialData: {
        ...selectedPatientDetails.FinancialData,
        AmountPaid: GetsumMoney({ ...selectedPatientDetails, PaymentsDetails: payments }),
      },
    };

    await applyUpdate(updatedDetails);
    alert("✅ تم حفظ الصف بنجاح");
  } catch (err) {
    console.error(err);
    alert("❌ خطأ أثناء الحفظ");
  }
}

// حذف صف حسب الفهرس
async function handleDeleteRowByIndex(index) {
  if (!window.confirm("هل أنت متأكد من حذف هذه الدفعة؟")) return;

  try {
    pushHistory(selectedPatientDetails);

    const payments = selectedPatientDetails.PaymentsDetails.filter((_, i) => i !== index);
    const updatedDetails = {
      ...selectedPatientDetails,
      PaymentsDetails: payments,
      FinancialData: {
        ...selectedPatientDetails.FinancialData,
        AmountPaid: GetsumMoney({ ...selectedPatientDetails, PaymentsDetails: payments }),
      },
    };

    await applyUpdate(updatedDetails);
    alert("🗑️ تم الحذف والحفظ");
  } catch (err) {
    console.error(err);
    alert("❌ خطأ أثناء الحذف");
  }
}

// إضافة صف جديد
async function handleAddRow() {
  pushHistory(selectedPatientDetails);

  const newPayment = {
    PaymentDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    PaymentTime: "", // وقت افتراضي فارغ
    AmountPaid: 0,
  };

  const payments = [...(selectedPatientDetails.PaymentsDetails || []), newPayment];

  const updatedDetails = {
    ...selectedPatientDetails,
    PaymentsDetails: payments,
    FinancialData: {
      ...selectedPatientDetails.FinancialData,
      AmountPaid: GetsumMoney({ ...selectedPatientDetails, PaymentsDetails: payments }),
    },
  };

  await applyUpdate(updatedDetails);
  // لا نعرض alert لكي لا يزعج المستخدم عند الإضافة السريعة
}

// حفظ كل التغييرات دفعة واحدة (زر ⬆️)
async function handleSaveAll(payments) {
  try {
    pushHistory(selectedPatientDetails);

    const updatedDetails = {
      ...selectedPatientDetails,
      PaymentsDetails: payments,
      FinancialData: {
        ...selectedPatientDetails.FinancialData,
        AmountPaid: GetsumMoney({ ...selectedPatientDetails, PaymentsDetails: payments }),
      },
    };

    await applyUpdate(updatedDetails);
    alert("💾 تم حفظ جميع التغييرات");
  } catch (err) {
    console.error(err);
    alert("❌ خطأ أثناء حفظ الكل");
  }
}

// التراجع - نستعيد آخر حالة من الستاك
async function handleUndo() {
  const last = historyStack[historyStack.length - 1];
  if (!last) return alert("لا يوجد شيء للتراجع عنه");

  try {
    // حدّث الستاك
    setHistoryStack((s) => s.slice(0, -1));

    // نطبق الاستعادة
    await applyUpdate(last);
    alert("↩️ تم التراجع عن آخر عملية");
  } catch (err) {
    console.error(err);
    alert("❌ خطأ أثناء التراجع");
  }
}

// دالة موحدة لتطبيق التحديث وتحديث patient و localStorage و firebase
async function applyUpdate(updatedDetails) {
  // 1. حدث selectedPatientDetails محلياً
  setSelectedPatientDetails(updatedDetails);

  // 2. حدث مصفوفة المرضى (patient)
  const updatedPatients = patient.map((p) =>
    p.id === selectedPatientDetails.id || p.PersonalData.Name === selectedPatientDetails.PersonalData.Name
      ? updatedDetails
      : p
  );

  setPatient(updatedPatients);
  localStorage.setItem("Patient", JSON.stringify(updatedPatients));

  // 3. حدث في Firebase (تأكد من أن updatePatient يطابق توقيعك)
  try {
    await updatePatient(selectedPatientDetails.id, updatedDetails);
    console.log("✅ Firebase updated");
  } catch (err) {
    console.error("Error updating Firebase:", err);
    // ممكن تضيف retry أو queue هنا لو أردت
    throw err;
  }
}
const styles = {
  container: { marginTop: 20 },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: 8,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    background: "#fff",
    border: "1px solid #e6e6e6",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Inter, Arial, sans-serif",
  },
  th: {
    textAlign: "center",
    padding: "12px 10px",
    background: "#1976d2",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #f1f1f1",
    verticalAlign: "middle",
  },
  tdIndex: { padding: "10px", textAlign: "center", fontWeight: 600, color: "#555" },
  rowEven: { background: "#fbfbfb" },
  rowOdd: { background: "#ffffff" },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "6px 10px",
    marginRight: 8,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  delBtn: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    padding: "6px 10px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  controls: { display: "flex", gap: 12, justifyContent: "flex-start", marginTop: 12 },
  addBtn: { backgroundColor: "#2e7d32", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer" },
  undoBtn: { backgroundColor: "#f9a825", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer" },
  saveAllBtn: { backgroundColor: "#0b79d0", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer" },
};

  function HandleAddMoneyAndSum() {
    const updatedPatient = patient.map((e) => {
      if (e.id === selectedPerson.id) {
        return {
          ...e,
          PaymentsDetails: [...(e.PaymentsDetails || []), addMoneyDetail],
          FinancialData: {
            ...e.FinancialData, AmountPaid: GetsumMoney({
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
    setAddDetailMoney({ PaymentDate: addMoneyDetail.PaymentDate, AmountPaid: '' })
    setSelectedPatientDetails()
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
        {/* {selectedPatientDetails?.PaymentsDetails?.length > 0 ? (
        <table style={{ width: "100%",borderCollapse: "collapse",fontFamily: "Arial, sans-serif",marginTop: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
          <thead>
            <tr style={{ backgroundColor: "#1976d2", color: "#fff" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>المبلغ المدفوع</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>تاريخ الدفع</th>
            </tr>
          </thead>
          <tbody>
            {selectedPatientDetails.PaymentsDetails.map((e, i) => (
              <tr key={i} style={{backgroundColor: i % 2 === 0 ? "#f3f3f3" : "#ffffff",transition: "background-color 0.3s",}}>
                <td style={{padding: "10px",border: "1px solid #ccc",textAlign: "center",fontWeight: "bold",color: "#333",}}>
                  {e.AmountPaid} EGP
                </td>
                <td style={{padding: "10px",border: "1px solid #ccc",textAlign: "center",color: "#555",}}>
                  {e.PaymentDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          ) : (
        <p style={{ marginTop: "20px", color: "#777", textAlign: "center" }}>لا توجد مدفوعات</p>
        )} */}





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
      <div>
        {/* ============================جدول المدفوعات - تصميم بسيط وأنيق============================ */}
          {selectedPatientDetails?.PaymentsDetails?.length > 0 ? (
            <div style={styles.container}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>تاريخ الدفع</th>
                      {/* <th style={styles.th}>الوقت (اختياري)</th> */}
                      <th style={styles.th}>المبلغ (EGP)</th>
                      <th style={styles.th}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatientDetails.PaymentsDetails.map((row, idx) => (
                      <tr key={idx} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                        <td style={styles.tdIndex}>{idx + 1}</td>

                        {/* تاريخ الدفع (input عادي من نوع date) */}
                        <td style={styles.td}>
                          <input type="date" value={row.PaymentDate || ""}
                            onChange={(e) => handleEditChange(idx, "PaymentDate", e.target.value)}
                            style={styles.input}/>
                        </td>

                        {/* وقت الدفع (input time عادي) - إن أردت يمكنك تركه فارغ */}
                        {/* <td style={styles.td}>
                          <input  type="time" value={row.PaymentTime || ""}
                            onChange={(e) => handleEditChange(idx, "PaymentTime", e.target.value)}
                            style={{ ...styles.input, width: 120 }}/>
                        </td> */}

                        {/* المبلغ (input number عادي) */}
                        <td style={styles.td}>
                          <input type="number" value={row.AmountPaid ?? ""}
                            onChange={(e) => handleEditChange(idx, "AmountPaid", e.target.value)}
                            style={{ ...styles.input, textAlign: "center" }}/>
                        </td>

                        {/* أزرار الحفظ والحذف لكل صف */}
                        <td style={{ ...styles.td, textAlign: "center" }}>
                          <button style={styles.saveBtn} onClick={() => handleSaveRowByIndex(idx)}>
                            حفظ
                          </button>
                          <button style={styles.delBtn} onClick={() => handleDeleteRowByIndex(idx)}>
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
      </table>
    </div>

    {/* أزرار عامة: إضافة دفعة + تراجع */}
    <div style={styles.controls}>
      <button style={styles.addBtn} onClick={handleAddRow}>➕ إضافة دفعة جديدة</button>
      <button style={styles.undoBtn} onClick={handleUndo}>↩️ تراجع</button>
      <button style={styles.saveAllBtn} onClick={() => handleSaveAll(selectedPatientDetails.PaymentsDetails)}>💾 حفظ الكل</button>
    </div>
  </div>
        ) : (
          <p style={{ marginTop: "20px", color: "#777", textAlign: "center" }}>لا توجد مدفوعات</p>
        )}
      </div>
    </>
  )
}