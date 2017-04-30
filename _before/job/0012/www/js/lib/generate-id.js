/**
 * Created by dmitry.turovtsov on 11.04.2017.
 */

let idCounter = 0;

export default function () {
    idCounter += 1;
    return String(idCounter);
}
