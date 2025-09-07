export default function CollectionDate(entryTime, exitTime) {
    try {
        const entryDate = new Date(entryTime);
        const today = new Date();
        const exitDate = exitTime ? new Date(exitTime) : today;

        if (isNaN(entryDate.getTime()) || isNaN(exitDate.getTime())) {
            return 0;
        }


        // نزيل الوقت من التاريخ لضمان دقة الحساب
        entryDate.setHours(0, 0, 0, 0);
        exitDate.setHours(0, 0, 0, 0);

        const diffTime = exitDate - entryDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    } catch {
        return 0;
    }
}
