export default function GetsumSession(person) {
    if (!person || !person.SessionDetails) return 0;
    const sum = person.SessionDetails.map(s => Number(s.NumberSession)).reduce((acc, curr) => acc + curr, 0);

    return sum;
}
// export function CollectionSession(Arr) {
//     const sum = Arr.reduce((total, e) => {
//         return total + e.SessionDetails.reduce((subTotal, s) => subTotal + Number(s.NumberSession), 0);
//     }, 0);
//     return sum
// }


