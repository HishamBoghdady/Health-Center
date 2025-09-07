export default function GetsumMoney(person) {
    if (!person || !person.PaymentsDetails) return 0;
    const sum = person.PaymentsDetails.map(s => Number(s.AmountPaid)).reduce((acc, curr) => acc + curr, 0);

    return sum;
}