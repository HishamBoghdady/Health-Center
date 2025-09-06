// export default function CollectionMoney(Arr) {
//     const Filtred = Arr.flatMap(e => e.PaymentsDetails.map(s => Number(s.AmountPaid)));
//     const sum = Filtred.reduce((acc, curr) => acc + curr, 0);
//     return sum
// }
// --------------------------
export function GetsumMoney(person) {
    if (!person || !person.PaymentsDetails) return 0;
    const sum = person.PaymentsDetails.map(s => Number(s.AmountPaid)).reduce((acc, curr) => acc + curr, 0);

    return sum;
}