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
// export default function CollectionDate(StartDatestr, EndDatestr) {
//     const EntryDate = new Date(StartDatestr);
//     let ExitDate;
//     if (EndDatestr === null) {ExitDate = new Date();
//     else {ExitDate = new Date(EndDatestr);}
//     let DiffTimes = ExitDate - EntryDate;
//     let DiffDayes = Math.floor(DiffTimes / (1000 * 60 * 60 * 24)) + 1;
//     return DiffDayes;
// }

// export default function CollectionDate(entryTime, exitTime) {
//     if (!entryTime) return 0;
//     const start = new Date(entryTime);
//     const end = exitTime ? new Date(exitTime) : new Date();
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
//     const diffTime = end - start;
//     return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
// }

