import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { ProvInfoUse } from "../context/ContextData";
import {SchemeDB} from "../context/StructureData"

import { GetsumMoney } from "../utils/CollectionMoney";
import CollectionDate from "../utils/CollectionDate"
import CheckMoney from '../utils/CollectionOwed';
// 
import {addPatient,getPatients} from "../firebase/Firebase.config"
// 
export default function EntryDB() {
    const [info, Setinfo] = useState(SchemeDB)
    const {patient, setPatient} = ProvInfoUse()
const [addMoneyDetail, setAddDetailMoney] = useState({ PaymentDate: '', AmountPaid: '' })

    useEffect(()=>{
        const fetchData = async () => {
            try{
                let db = await getPatients();
                // let db = JSON.parse(localStorage.getItem("Patient")) ?? []
                const UpdatedDate = db.map((e) => {
                    const numberDays = CollectionDate(e.EnteryData.EntryTime, e.ExitData.ExitTime);
                    const amountOwed = CheckMoney(numberDays, e.FinancialData.AmountPaid); // مرر البيانات المطلوبة
                    return {...e,FinancialData: {...e.FinancialData,NumberDays: numberDays,AmountOwed: amountOwed,},};
                });
                setPatient(UpdatedDate)
                // console.log(db)
                localStorage.setItem("Patient", JSON.stringify(UpdatedDate))
            }catch(error){
                console.error("Error GetData from Firestore: ❌", error);
                const dbLocal = JSON.parse(localStorage.getItem("Patient")) ?? [];
                setPatient(dbLocal);
            }
        }
        fetchData()
            // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
// 
    function HandleAddPatient() {
        const PatientAdd = {
            id: uuidv4(),
            EnteryData: {
                EntryMaterial: info.EnteryData.EntryMaterial,
                EntryTime: info.EnteryData.EntryTime,
                TypeDiseas: info.EnteryData.TypeDisease,
                CouncilCode: info.EnteryData.CouncilCode,
                Condition: "in",
            },
            PersonalData: {
                Name: info.PersonalData.Name,
                Address: info.PersonalData.Address,
                ID: info.PersonalData.ID,
                Gender: info.PersonalData.Gender,
                Work: info.PersonalData.Work,
                Age: Number(info.PersonalData.Age),
                Religion: info.PersonalData.Religion,
                SocialStatus: info.PersonalData.SocialStatus,
                Nationnality: info.PersonalData.Nationnality
            },
            AdmissionApplicant: {
                Name: info.AdmissionApplicant.Name,
                Address: info.AdmissionApplicant.Address,
                ID: info.AdmissionApplicant.ID,
                Work: info.AdmissionApplicant.Work,
                Kinship: info.AdmissionApplicant.Kinship,
                Nationnality: info.AdmissionApplicant.Nationnality,
                PhoneNumber: info.AdmissionApplicant.PhoneNumber,
                ApprovalSession: info.AdmissionApplicant.ApprovalSession
            },
            ExitData: {ExitTime: null,ReasonExit: ''},
            FinancialData: {NumberDays: null,NumberSession: null,AmountPaid: GetsumMoney({ PaymentsDetails: [addMoneyDetail] }),AmountOwed: null},
            PaymentsDetails: [addMoneyDetail],
            SessionDetails: []
        }
        const newperson = [...patient, PatientAdd]
        localStorage.setItem("Patient",JSON.stringify(newperson))
        setAddDetailMoney({ PaymentDate: '', AmountPaid: '' })
        Setinfo(SchemeDB)
        setPatient(newperson)

        // حفظ في Firestore
        addPatient(PatientAdd)
            .then(() => console.log("✅ تمت الإضافة في Firestore"))
            .catch((err) => console.error("❌ خطأ في إضافة المريض:", err));
        
    }

    return (
        <>
            <div>
                <h2> تسجيل حالة</h2>
                <section className="section">
                    <h2>بيانات الدخول</h2>
                    <div className="form-grid">
                        {/* ---------------------- */}
                        <div className="form-group" id="EntryMaterial">
                            <label htmlFor="patient-status">مادة الدخول</label>
                            <select name="patient-status" id="patient-status" value={info.EnteryData.EntryMaterial}
                                onChange={(e) => { Setinfo({ ...info, EnteryData: { ...info.EnteryData, EntryMaterial: e.target.value } }) }}>
                                <option value="null">اختر هنا</option>
                                <option value="M10">M_10</option>
                                <option value="M12">M_12</option>
                                <option value="M13">M_13</option>
                            </select>
                        </div>
                        {/* ------------------------- */}
                        <div className="form-group" id="EntryTime">
                            <label htmlFor="entry-date" className="colorRed">ميعاد الدخول</label>
                            <input type="datetime-local" id="entry-date" value={info.EnteryData.EntryTime}
                                onChange={(e) => { Setinfo({ ...info, EnteryData: { ...info.EnteryData, EntryTime: e.target.value } }) }} />
                        </div>
                        {/* ------------------------- */}
                        <div className="form-group" id="TypeDisease">
                            <label htmlFor="drug-type" className="colorRed">نوع المخدرات</label>
                            <input type="text" name="drug-type" id="drug-type" value={info.EnteryData.TypeDisease}
                                onChange={(e) => { Setinfo({ ...info, EnteryData: { ...info.EnteryData, TypeDisease: e.target.value } }) }} />
                        </div>
                        {/* ------------------------- */}
                        <div className="form-group" id="CouncilCode">
                            <label htmlFor="code-number">رقم الكود المجلس</label>
                            <input type="text" id="code-number" value={info.EnteryData.CouncilCode}
                                onChange={(e) => { Setinfo({ ...info, EnteryData: { ...info.EnteryData, CouncilCode: e.target.value } }) }} />
                        </div>
                        {/* ------------------------- */}
                        {/* <div className="form-group" id="Condition">
                            <label htmlFor="patient-status">حالة المريض</label>
                            <select name="patient-status" id="patient-status" disabled value={info.EnteryData.Condition}
                                onChange={(e) => { Setinfo({ ...info, EnteryData: { ...info.EnteryData, Condition: e.target.value } }) }}>
                                <option value="null">اختر هنا</option>
                                <option value="in">موجود</option>
                                <option value="out">خرج</option>
                            </select>
                        </div> */}
                        {/* ------------------------- */}
                    </div>
                </section>
                <hr />
                <section className="section">
                    <h2>البيانات الشخصية</h2>
                    <div className="form-grid">
                        {/* ---------------------- */}
                        <div className="form-group" id="NAME">
                            <label htmlFor="name"  className="colorRed">الاسم</label>
                            <input type="text" id="name" value={info.PersonalData.Name}
                                onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, Name: e.target.value } }) }} />
                        </div>
                        {/* ---------------------- */}
                        <div className="form-group" id="ADDRESS">
                            <label htmlFor="address"  className="colorRed">العنوان</label>
                            <input type="text" id="address" value={info.PersonalData.Address}
                                onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, Address: e.target.value } }) }} />
                        </div>
                        {/* ---------------------- */}
                        <div className="form-group" id="NATIONAL-ID">
                            <label htmlFor="national-id"  className="colorRed">الرقم القومي/جواز السفر</label>
                            <input type="text" maxLength={14} minLength={9} id="national-id" value={info.PersonalData.ID}
                                onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, ID: e.target.value } }) }} />
                        </div>
                        {/* ---------------------- */}
                        <div className="form-group" id="GENDER">
                            <label>النوع</label>
                            <div className="radio-group">
                                <input type="radio" name="gender" value="Male"
                                    checked={info.PersonalData.Gender === "Male"}
                                    onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, Gender: e.target.value } }) }} /> ذكر
                                <input type="radio" name="gender" value="Female"
                                    checked={info.PersonalData.Gender === "Female"}
                                    onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, Gender: e.target.value } }) }} /> أنثى
                            </div>
                        </div>
                        {/* ---------------------- */}
                        <div className="form-group" id="WORK">
                            <label htmlFor="occupation">الوظيفة</label>
                            <input type="text" id="occupation" value={info.PersonalData.Work}
                                onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, Work: e.target.value } }) }} />
                        </div>
                        {/* ---------------------- */}
                        <div className="form-group" id="AGE">
                            <label htmlFor="age"  className="colorRed">السن</label>
                            <input type="number" id="age" min={0} value={info.PersonalData.Age}
                                onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, Age: e.target.value } }) }} />
                        </div>
                        {/* ---------------------- */}
                        <div className="form-group" id="RELIGION">
                            <label htmlFor="religion">الديانة</label>
                            <select id="religion" value={info.PersonalData.Religion}
                                onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, Religion: e.target.value } }) }}>
                                <option value="null">لم يتم الاختيار</option>
                                <option value="مسلم">مسلم</option>
                                <option value="مسيحي">مسيحي</option>
                                <option value="يهودي">يهودي</option>
                                <option value="غير ذالك">غير ذلك</option>
                            </select>
                        </div>
                        {/* ---------------------- */}
                        <div className="form-group" id="SOCIAL-STATUS">
                            <label htmlFor="marital-status">الحالة الاجتماعية</label>
                            <select id="marital-status" value={info.PersonalData.SocialStatus}
                                onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, SocialStatus: e.target.value } }) }}>
                                <option value="null">لم يتم الاختيار</option>
                                <option value="اعزب">أعزب</option>
                                <option value="متزوج">متزوج</option>
                                <option value="مطلق">مطلق</option>
                                <option value="ارمل">أرمل</option>
                            </select>
                        </div>
                        {/* ---------------------- */}
                        <div className="form-group" id="NATION">
                            <label htmlFor="nationality">الجنسية</label>
                            <select id="nationality" value={info.PersonalData.Nationnality}
                                onChange={(e) => { Setinfo({ ...info, PersonalData: { ...info.PersonalData, Nationnality: e.target.value } }) }}>
                                <option value="null">لم يتم الاختيار</option>
                                <option value="مصري">مصري</option>
                                <option value="اجنبي">أجنبي</option>
                            </select>
                        </div>
                        {/* ---------------------- */}
                    </div>
                </section>
                <hr />
                <section className="section">
                    <h2>طالب الدخول</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="applicant-name"  className="colorRed">الاسم</label>
                            <input type="text" id="applicant-name" value={info.AdmissionApplicant.Name}
                                onChange={(e) => { Setinfo({ ...info, AdmissionApplicant: { ...info.AdmissionApplicant, Name: e.target.value } }) }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="applicant-residence"  className="colorRed">العنوان</label>
                            <input type="text" id="applicant-residence" value={info.AdmissionApplicant.Address}
                                onChange={(e) => { Setinfo({ ...info, AdmissionApplicant: { ...info.AdmissionApplicant, Address: e.target.value } }) }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="applicant-national-id"  className="colorRed">الرقم القومي</label>
                            <input type="text" id="applicant-national-id" value={info.AdmissionApplicant.ID}
                                onChange={(e) => { Setinfo({ ...info, AdmissionApplicant: { ...info.AdmissionApplicant, ID: e.target.value } }) }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="applicant-national-id">الجنسية</label>
                            <select type="text" id="applicant-national-id" value={info.AdmissionApplicant.Nationnality}
                                onChange={(e) => { Setinfo({ ...info, AdmissionApplicant: { ...info.AdmissionApplicant, Nationnality: e.target.value } }) }} >
                                <option value="null">لم يتم الاختيار</option>
                                <option value="مصري">مصري</option>
                                <option value="اجنبي">أجنبي</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>الوظيفة</label>
                            <input type="text" value={info.AdmissionApplicant.Work}
                                onChange={(e) => { Setinfo({ ...info, AdmissionApplicant: { ...info.AdmissionApplicant, Work: e.target.value } }) }} />
                        </div>
                        <div className="form-group">
                            <label>الصفة</label>
                            <input type="text" value={info.AdmissionApplicant.Kinship}
                                onChange={(e) => { Setinfo({ ...info, AdmissionApplicant: { ...info.AdmissionApplicant, Kinship: e.target.value } }) }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="applicant-phone"  className="colorRed">رقم التليفون</label>
                            <input type="text" value={info.AdmissionApplicant.PhoneNumber}
                                onChange={(e) => { Setinfo({ ...info, AdmissionApplicant: { ...info.AdmissionApplicant, PhoneNumber: e.target.value } }) }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="applicant-sessions"  className="colorRed">إقرار الجلسات</label>
                            <select value={info.AdmissionApplicant.ApprovalSession}
                                onChange={(e) => { Setinfo({ ...info, AdmissionApplicant: { ...info.AdmissionApplicant, ApprovalSession: e.target.value } }) }}>
                                <option value="">لم يتم الاختيار</option>
                                <option value="Yes">نعم</option>
                                <option value="No">لا</option>
                            </select>
                        </div>
                    </div>
                </section>
                 <section className="section">
                    <h2>دفع اولي</h2>
                    <div className="form-grid">
                        <div className="form-group" id="EntryTime">
                            <label htmlFor="entry-date" className="colorRed"> تاريخ الدفع</label>
                            <input type="date" id="entry-date" value={addMoneyDetail.PaymentDate}
                                onChange={(e) => { setAddDetailMoney(prev => ({ ...prev, PaymentDate: e.target.value })) }}/>
                        </div>

                        <div className="form-group" id="EntryTime">
                            <label htmlFor="entry-date" className="colorRed">مبلغ الدفع</label>
                            <input type="number" id="entry-date" value={addMoneyDetail.AmountPaid}
                                onChange={(e) => { setAddDetailMoney(prev => ({ ...prev, AmountPaid: e.target.value })) }} />
                        </div>

                    </div>
                </section>
                <button className="btn btn-primary" onClick={HandleAddPatient}><i className="bi bi-person-plus"  style={{fontStyle:"normal"}}>  Add</i></button>
            </div>
        </>
    )
}