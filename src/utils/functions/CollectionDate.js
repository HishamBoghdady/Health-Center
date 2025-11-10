// export default function CollectionDate(entryTime, exitTime) {
//     try {
//         const entryDate = new Date(entryTime);
//         const today = new Date();
//         const exitDate = exitTime ? new Date(exitTime) : today;

//         if (isNaN(entryDate.getTime()) || isNaN(exitDate.getTime())) {
//             return 0;
//         }


//         // نزيل الوقت من التاريخ لضمان دقة الحساب
//         entryDate.setHours(0, 0, 0, 0);
//         exitDate.setHours(0, 0, 0, 0);

//         const diffTime = exitDate - entryDate;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//         return diffDays;
//     } catch {
//         return 0;
//     }
// }
// //////////////////////////////
// export default function CollectionDate(entryTime, exitTime) {
//     try {
//         // دالة لتحويل أي قيمة تاريخ إلى كائن Date آمن بدون خطأ التوقيت
//         const toSafeDate = (value) => {
//             if (!value) return null;

//             // الحالة 1: قيمة من input type="date" مثل "2024-10-29"
//             if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//                 const [year, month, day] = value.split('-').map(Number);
//                 return new Date(year, month - 1, day);
//             }

//             // الحالة 2: قيمة كاملة مثل "2024-10-29T00:00:00Z" أو بها توقيت
//             const d = new Date(value);
//             if (isNaN(d.getTime())) return null;

//             return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // تجاهل الوقت
//         };

//         const today = new Date();
//         const entryDate = toSafeDate(entryTime);
//         const exitDate = exitTime ? toSafeDate(exitTime) : toSafeDate(today.toISOString().slice(0, 10));

//         if (!entryDate || !exitDate) return 0;

//         // نزيل الوقت لتأكيد الحساب بالتاريخ فقط
//         entryDate.setHours(0, 0, 0, 0);
//         exitDate.setHours(0, 0, 0, 0);

//         const diffTime = exitDate - entryDate;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

//         return diffDays;
//     } catch {
//         return 0;
//     }
// }
///////////////////////////////
// export default function CollectionDate(entryTime, exitTime) {
//     try {
//         // دالة لتحويل أي تاريخ إلى كائن بدون توقيت محلي أو UTC
//         const toSafeDate = (value) => {
//             if (!value) return null;

//             // حالة input type="date" (مثل 2024-10-30)
//             if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//                 const [y, m, d] = value.split('-').map(Number);
//                 return new Date(y, m - 1, d);
//             }

//             // حالة قيم مثل 2024-10-30T00:00:00Z
//             const date = new Date(value);
//             if (isNaN(date)) return null;
//             return new Date(date.getFullYear(), date.getMonth(), date.getDate());
//         };

//         const today = new Date();
//         const entryDate = toSafeDate(entryTime);
//         const exitDate = exitTime ? toSafeDate(exitTime) : toSafeDate(today.toISOString().slice(0, 10));

//         if (!entryDate || !exitDate) return 0;

//         // نحسب الفرق بعد تصفير الوقت
//         entryDate.setHours(0, 0, 0, 0);
//         exitDate.setHours(0, 0, 0, 0);

//         // نحول الفرق إلى UTC حتى نتجنب أي انزياح بسبب DST
//         const diffTime = Date.UTC(exitDate.getFullYear(), exitDate.getMonth(), exitDate.getDate()) -
//             Date.UTC(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());

//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

//         return diffDays;
//     } catch {
//         return 0;
//     }
// }
export default function CollectionDate(entryTime, exitTime) {
    try {
        const toSafeDate = (value) => {
            if (!value) return null;

            // input type="date"
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                const [y, m, d] = value.split('-').map(Number);
                return new Date(Date.UTC(y, m - 1, d)); // 👈 نحولها لـ UTC مباشرة
            }

            // input type="datetime-local"
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
                const [y, m, d] = value.split('T')[0].split('-').map(Number);
                return new Date(Date.UTC(y, m - 1, d)); // 👈 نحولها أيضًا لـ UTC
            }

            const date = new Date(value);
            if (isNaN(date)) return null;
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        };

        const today = new Date();
        const entryDate = toSafeDate(entryTime);
        const exitDate = exitTime ? toSafeDate(exitTime) : toSafeDate(today.toISOString().slice(0, 10));

        if (!entryDate || !exitDate) return 0;

        const diffTime = exitDate - entryDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        return diffDays > 0 ? diffDays : 0;
    } catch {
        return 0;
    }
}
