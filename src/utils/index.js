import CollectionDate from "./functions/CollectionDate";
import GetsumMoney from "./functions/CollectionMoney";
import CheckMoney from "./functions/CollectionOwed";
import GetsumSession from "./functions/CollectionSession";
import splitDateTime from "./functions/DateSplit";

export default function utilsFuncs() {
    return {
        CollectionDate,
        GetsumMoney,
        CheckMoney,
        GetsumSession,
        splitDateTime
    }
}

