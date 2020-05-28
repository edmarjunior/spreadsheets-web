export function compare(a, b) {
    let ret = 0;

    if (a.minutosAprovados > b.minutosAprovados) {
        ret = -1;
    } else if (a.minutosAprovados < b.minutosAprovados) {
        ret = 1;
    }
    return ret;
}


export function convertToHour(minutos) {
    return (minutos / 60).toFixed(2);
}
