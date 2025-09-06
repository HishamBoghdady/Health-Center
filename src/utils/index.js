import CollectionDate from "./CollectionDate";
import { GetsumMoney } from "./CollectionMoney";
import CheckMoney from "./CollectionOwed";
// import { Getsum } from "./CollectionSession";
import splitDateTime from "./DateSplit";

export default function utilsFuncs() {
    return {
        CollectionDate, GetsumMoney, CheckMoney, splitDateTime
    }
}

