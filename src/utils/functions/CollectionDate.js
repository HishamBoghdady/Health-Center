export default function CollectionDate(entryTime, exitTime) {
    try {
        // إنشاء الكائنات في توقيت UTC لتجنب تأثير التوقيت الصيفي/الشتوي
        const entryDate = new Date(entryTime);
        const exitDate = exitTime ? new Date(exitTime) : new Date();

        // التحقق من صلاحية التواريخ
        if (isNaN(entryDate.getTime()) || isNaN(exitDate.getTime())) {
            return 0;
        }

        // تحويل التاريخين إلى منتصف الليل في UTC لضمان دقة الحساب
        const entryUTC = Date.UTC(entryDate.getUTCFullYear(), entryDate.getUTCMonth(), entryDate.getUTCDate());
        const exitUTC = Date.UTC(exitDate.getUTCFullYear(), exitDate.getUTCMonth(), exitDate.getUTCDate());

        // حساب الفرق بين التاريخين
        const diffTime = exitUTC - entryUTC;

        // تحويل الفارق إلى أيام
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 لتضمين آخر يوم

        return diffDays;
    } catch {
        return 0;
    }
}
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

