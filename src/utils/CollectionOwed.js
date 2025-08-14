export default function CheckMoney(NumDays = 0, AmountPaid = 0) {
    const Todaysprice = 400;
    const Pricesession = 3350;

    // تحويل القيم إلى أرقام مع التعامل مع القيم غير الصحيحة
    const days = Number(NumDays) || 0;
    const paid = Number(AmountPaid) || 0;

    return ((days * Todaysprice) + Pricesession) - paid;
}