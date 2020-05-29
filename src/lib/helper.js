export function compare(a, b, property) {
    let ret = 0;

    if (+a[property] > +b[property]) {
        ret = -1;
    } else if (+a[property] < +b[property]) {
        ret = 1;
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

export function getTimes() {
    return [
        {
          codigo: 1,
          nome: 'tabata',
          cor: '#F53107',
          checked: true,
          analistas: ['tabata', 'tábata', 'edmar', 'rafael morais', 'edmar/tábata', 'tábata/rafael morais']
        },
        {
          codigo: 2,
          nome: 'suporte',
          cor: '#07F536',
          checked: true,
          analistas: [
            'maria', 'luan', 'josiel', 'gustavo', 'marcos', 'maria andressa/josiel', 'luan/maria', 'marcos/maria andressa', 'josiel/marcos', 
            'maria/josiel', 'josiel/maria andressa', 'gustavo/marcos', 'gustavo/marcos', 'maria andressa/luan'
          ]
        },
        {
          codigo: 3,
          nome: 'rondinele',
          cor: '#EAF507',
          checked: true,
          analistas: ['rondinele', 'joão', 'joao', 'bruno', 'bruno alves', 'joão gabriel / rondinele', 'joão gabriel /bruno / rondinele']
        },
        {
          codigo: 4,
          nome: 'lilian',
          cor: '#07ADF5',
          checked: true,
          analistas: ['mussak', 'caires', 'lilian lamarca/diego ruguê']
        },
        {
          codigo: 5,
          nome: 'passos',
          cor: '#a300ff',
          checked: true,
          analistas: ['felipe', 'douglas', 'guilherme', 'felipe e guilherme']
        },
        {
            codigo: 6,
            nome: 'outros',
            cor: '#ddd',
            checked: true,
            analistas: ['rivia', 'rívia']
        },
    ];
}
