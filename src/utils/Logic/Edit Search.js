const splitDateTime = (datetimeStr) => {
    const [date] = datetimeStr.split('T');
    return { date };
};
export default function EditLogic({ patient, setPatient, selectedPatient, setSelectedPatient, setOpenEdit, UP }) {
    // -- (Edit button Logic) -- //
    const editPatient = (id) => {
        const foundPatient = patient.find(p => p.id === id);
        return foundPatient;
    };
    // -- (Btn Edit Click) -- //
    const handleOpenEdit = (id) => {
        const patient = editPatient(id);
        setSelectedPatient({
            id: patient.id,
            // Personal Data
            Name: patient.PersonalData.Name,
            Address: patient.PersonalData.Address,
            ID: patient.PersonalData.ID,
            Gender: patient.PersonalData.Gender,
            Work: patient.PersonalData.Work,
            Age: Number(patient.PersonalData.Age),
            Religion: patient.PersonalData.Religion,
            SocialStatus: patient.PersonalData.SocialStatus,
            Nationnality: patient.PersonalData.Nationnality,
            // Facilities
            FSName: patient.AdmissionApplicant.Name,
            FSAddress: patient.AdmissionApplicant.Address,
            FSID: patient.AdmissionApplicant.ID,
            FSWork: patient.AdmissionApplicant.Work,
            FSKinship: patient.AdmissionApplicant.Kinship,
            FSNationnality: patient.AdmissionApplicant.Nationnality,
            FSPhoneNumber: patient.AdmissionApplicant.PhoneNumber,
            FSApprovalSession: patient.AdmissionApplicant.ApprovalSession,
            // Entery Data
            EntryMaterial: patient.EnteryData.EntryMaterial,
            EntryTime: splitDateTime(patient.EnteryData.EntryTime).date,
            TypeDiseas: patient.EnteryData.TypeDiseas,
            CouncilCode: patient.EnteryData.CouncilCode,
            Condition: patient.EnteryData.Condition,
        });
        setOpenEdit(true);
    };
    // -- (Update Submit) -- //
    const handleSaveEdit = () => {
        updatePatient(selectedPatient.id, {
            EnteryData: {
                EntryMaterial: selectedPatient.EntryMaterial,
                EntryTime: splitDateTime(selectedPatient.EntryTime).date,
                TypeDiseas: selectedPatient.TypeDiseas,
                CouncilCode: selectedPatient.CouncilCode,
                Condition: selectedPatient.Condition,
            }, PersonalData: {
                Name: selectedPatient.Name,
                Address: selectedPatient.Address,
                ID: selectedPatient.ID,
                Gender: selectedPatient.Gender,
                Work: selectedPatient.Work,
                Age: Number(selectedPatient.Age),
                Religion: selectedPatient.Religion,
                SocialStatus: selectedPatient.SocialStatus,
                Nationnality: selectedPatient.Nationnality,
            },
            AdmissionApplicant: {
                Name: selectedPatient.FSName,
                Address: selectedPatient.FSAddress,
                ID: selectedPatient.FSID,
                Work: selectedPatient.FSWork,
                Kinship: selectedPatient.FSKinship,
                Nationnality: selectedPatient.FSNationnality,
                PhoneNumber: selectedPatient.FSPhoneNumber,
                ApprovalSession: selectedPatient.FSApprovalSession,
            }
        });
        setOpenEdit(false);
    };
    // -- (Update Logic) -- //
    const updatePatient = (id, updatedFields) => {
        const updated = patient.map(p =>
            p.id === id
                ? {
                    ...p,
                    EnteryData: {
                        ...p.EnteryData,
                        ...updatedFields.EnteryData,
                    },
                    PersonalData: {
                        ...p.PersonalData,
                        ...updatedFields.PersonalData,
                    }
                    , AdmissionApplicant: {
                        ...p.AdmissionApplicant,
                        ...updatedFields.AdmissionApplicant,
                    },
                    FinancialData: {
                        ...p.FinancialData,
                        ...updatedFields.FinancialData,
                    }
                } : p
        );
        setPatient(updated); // تحديث الحالة في الـ Context
        localStorage.setItem("Patient", JSON.stringify(updated)); // حفظ التعديلات في localStorage

        const EditPerson = updated.find(p => p.id === id);
        if (EditPerson) {
            UP(id, EditPerson)
                .then(() => console.log("✅ تم تحديث المريض في Firestore"))
                .catch(err => console.error("❌ خطأ في تحديث المريض:", err));
        }
    };
    return {
        handleOpenEdit, handleSaveEdit, editPatient, updatePatient
    }
}