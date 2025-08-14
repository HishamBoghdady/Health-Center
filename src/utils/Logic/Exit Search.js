export default function ExitLogic({ patient, setPatient, selectedPatientExit, setSelectedPatientExit, UP, handleClickOpen, setOpenExit }) {
    // -- (Edit button Logic) -- //
    const exitPatient = (id) => {
        const foundPatient = patient.find(p => p.id === id);
        return foundPatient;
    };
    // -- (Update Logic) -- //
    const updatePatientExit = (id, updatedFields) => {
        const updated = patient.map(p =>
            p.id === id
                ? {
                    ...p,
                    ExitData: {
                        ...p.ExitData,
                        ...updatedFields.ExitData,
                    }, EnteryData: {
                        ...p.EnteryData,
                        Condition: "out",
                    }
                } : p
        );
        setPatient(updated); // تحديث الحالة في الـ Context
        localStorage.setItem("Patient", JSON.stringify(updated)); // حفظ التعديلات في localStorage

        const updatedPerson = updated.find(p => p.id === id);
        if (updatedPerson) {
            UP(id, updatedPerson)
                .then(() => console.log("✅ تم تحديث المريض في Firestore"))
                .catch(err => console.error("❌ خطأ في تحديث المريض:", err));
        }
    };
    // -- (Btn Edit Click) -- //
    const handleOpenExit = (id) => {
        const patient = exitPatient(id);
        if (patient.EnteryData.Condition === "out") {
            handleClickOpen()
            return;
        }
        setSelectedPatientExit({
            id: patient.id,
            ExitTime: patient.ExitData.ExitTime,
            ReasonExit: patient.ExitData.ReasonExit,
        });
        setOpenExit(true);
    };
    // -- (Update Submit) -- //
    const handleSaveExit = () => {
        updatePatientExit(selectedPatientExit.id, {
            ExitData: {
                ExitTime: selectedPatientExit.ExitTime,
                ReasonExit: selectedPatientExit.ReasonExit,
            }
        });
        setOpenExit(false);
    };
    return {
        handleOpenExit, handleSaveExit, exitPatient, updatePatientExit
    }
}