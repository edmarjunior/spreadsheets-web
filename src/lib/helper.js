export function compare(a, b, property, direction = 'desc') {
    let ret = 0;

    if (direction === 'desc') {
        if (+a[property] > +b[property]) {
            ret = -1;
        } else if (+a[property] < +b[property]) {
            ret = 1;
        }
        return ret;
    }

    if (+a[property] > +b[property]) {
        ret = 1;
    } else if (+a[property] < +b[property]) {
        ret = -1;
    }

    return ret;
}

export function convertToHour(minutos) {
    return (minutos / 60).toFixed(2);
}

export function sum(array, coluna) {
    const total = array.reduce((acumulador, current) => {
        return acumulador + +current[coluna];
    }, 0);

    return total.toFixed(2);
}
