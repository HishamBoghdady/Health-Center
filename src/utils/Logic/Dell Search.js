export default function DellLogic({ patient, setPatient, selectedPatientDelete, setSelectedPatientDelete, setOpenDeleteDialog, deletePatient }) {
    const handleOpenPatientDelete = (id) => {
        const found = patient.find(p => p.id === id);
        setSelectedPatientDelete(found);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (!selectedPatientDelete) return;

        const filtered = patient.filter(p => p.id !== selectedPatientDelete.id);
        setOpenDeleteDialog(false); // إغلاق النافذة
        setSelectedPatientDelete(null); // إعادة التهيئة
        setPatient(filtered);
        localStorage.setItem("Patient", JSON.stringify(filtered));

        // 7️⃣ حذف المريض من Firestore
        deletePatient(selectedPatientDelete.id)
            .then(() => console.log("✅ تم حذف المريض من Firestore"))
            .catch(err => console.error("❌ خطأ في حذف المريض من Firestore:", err));
    }; return { handleOpenPatientDelete, confirmDelete }
}