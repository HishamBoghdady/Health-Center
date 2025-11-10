<div>
      {/* قائمة المرضى */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>الاسم</th>
            <th style={{ border: "1px solid black" }}>تاريخ الدخول</th>
            <th style={{ border: "1px solid black" }}>اختيار</th>
          </tr>
        </thead>
        <tbody>
          {patient.map((e, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid black" }}>{e.PersonalData.Name}</td>
              <td style={{ border: "1px solid black" }}>
                {splitDateTime(e.EnteryData.EntryTime).date}
              </td>
              <td style={{ border: "1px solid black" }}>
                <button
                  className={Styles.button}
                  onClick={() => {
                    setQuerysearch(e.PersonalData.Name);
                    setPatientSed({
                      name: e.PersonalData.Name,
                      date: splitDateTime(e.EnteryData.EntryTime).date,
                    });
                    setSelectedPerson(e);
                  }}
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* جدول تفاصيل المدفوعات يظهر بعد الضغط على الزر */}
      {selectedPerson && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            مدفوعات المريض: {selectedPerson.PersonalData.Name}
          </h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black" }}>المبلغ المدفوع</th>
                <th style={{ border: "1px solid black" }}>تاريخ الدفع</th>
              </tr>
            </thead>
            <tbody>
              {selectedPerson.PaymentsDetails?.length > 0 ? (
                selectedPerson.PaymentsDetails.map((e, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid black" }}>{e.AmountPaid}</td>
                    <td style={{ border: "1px solid black" }}>{e.PaymentDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    لا توجد مدفوعات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>