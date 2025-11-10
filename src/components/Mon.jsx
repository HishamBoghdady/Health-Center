const [lastAction, setLastAction] = useState(null); // لتخزين آخر عملية تمت

async function handleSaveRow(updatedRow) {
  const updatedPayments = selectedPatientDetails.PaymentsDetails.map((p, idx) =>
    idx + 1 === updatedRow.id ? { ...p, ...updatedRow } : p
  );

  const updatedDetails = {
    ...selectedPatientDetails,
    PaymentsDetails: updatedPayments,
    FinancialData: {
      ...selectedPatientDetails.FinancialData,
      AmountPaid: GetsumMoney({
        ...selectedPatientDetails,
        PaymentsDetails: updatedPayments,
      }),
    },
  };

  setLastAction({
    type: "edit",
    previous: selectedPatientDetails,
  });

  applyUpdate(updatedDetails);
}

async function handleDeleteRow(row) {
  const updatedPayments = selectedPatientDetails.PaymentsDetails.filter(
    (_, idx) => idx + 1 !== row.id
  );

  const updatedDetails = {
    ...selectedPatientDetails,
    PaymentsDetails: updatedPayments,
    FinancialData: {
      ...selectedPatientDetails.FinancialData,
      AmountPaid: GetsumMoney({
        ...selectedPatientDetails,
        PaymentsDetails: updatedPayments,
      }),
    },
  };

  setLastAction({
    type: "delete",
    previous: selectedPatientDetails,
  });

  applyUpdate(updatedDetails);
}

function handleAddRow() {
  const newPayment = {
    PaymentDate: new Date().toISOString().split("T")[0],
    AmountPaid: 0,
  };

  const updatedPayments = [...selectedPatientDetails.PaymentsDetails, newPayment];

  const updatedDetails = {
    ...selectedPatientDetails,
    PaymentsDetails: updatedPayments,
    FinancialData: {
      ...selectedPatientDetails.FinancialData,
      AmountPaid: GetsumMoney({
        ...selectedPatientDetails,
        PaymentsDetails: updatedPayments,
      }),
    },
  };

  setLastAction({
    type: "add",
    previous: selectedPatientDetails,
  });

  applyUpdate(updatedDetails);
}

function handleUndo() {
  if (!lastAction) return alert("❌ لا يوجد إجراء يمكن التراجع عنه");

  applyUpdate(lastAction.previous);
  setLastAction(null);
  alert("↩️ تم التراجع عن آخر عملية بنجاح");
}

// دالة موحدة لتطبيق أي تحديث
async function applyUpdate(updatedDetails) {
  setSelectedPatientDetails(updatedDetails);

  const updatedPatients = patient.map((p) =>
    p.id === selectedPatientDetails.id ||
    p.PersonalData.Name === selectedPatientDetails.PersonalData.Name
      ? updatedDetails
      : p
  );

  setPatient(updatedPatients);
  localStorage.setItem("Patient", JSON.stringify(updatedPatients));

  try {
    await updatePatient(selectedPatientDetails.id, updatedDetails);
    console.log("✅ تم حفظ التعديلات في Firebase");
  } catch (err) {
    console.error("❌ خطأ أثناء الحفظ:", err);
  }
}
