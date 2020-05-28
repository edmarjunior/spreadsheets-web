import React, { useState, useEffect } from 'react';
import Tabletop from 'tabletop';

import { Container, Table, Scroll } from './styles';
import { compare, convertToHour } from '../../lib/helper';

export default function Dashboard() {

    const [loading, setLoading] = useState(true);
    const [analistas, setAnalistas] = useState([]);
    const [total, setTotal] = useState({
      apontado: 'calculando ...',
      aprovado: 'calculando ...',
      reprovado: 'calculando ...',
      naoAnalisado: 'calculando ...'
    });

    useEffect(() => {
        Tabletop.init({
      
            key: 'https://docs.google.com/spreadsheets/d/1__3BJG0i77uS_9y1mM-50d4fxIEs-po6OlmBp-dcrhs/edit#gid=0',
            callback: googleData => {
              let analistas = [];
      
              googleData.forEach(row => {
                let nomeAnalista = row.Analista.trim().toLowerCase();
      
                if (!nomeAnalista) {
                  return;
                }
      
                let analista = analistas.find(x => x.nome === nomeAnalista);
                
                if (!analista) {
                  analista = { 
                      nome: nomeAnalista,
                      minutosApontados: 0,
                      minutosAprovados: 0,
                      minutosReprovados: 0,
                      minutosNaoAnalisados: 0
                  };
                 
                  analistas.push(analista);
                }
      
                let minutosApontados = +row['Tempo gasto (Minutos)'];
                let indicadorAprovacao = row['Aprovado? (S/N) [Wagner]'].trim().toLocaleLowerCase();
                let aprovado = indicadorAprovacao  === 'ok' || indicadorAprovacao === 's';
      
                analista.minutosApontados += minutosApontados;
      
                if (!indicadorAprovacao){
                    analista.minutosNaoAnalisados += minutosApontados;
                } else if (aprovado) {
                    analista.minutosAprovados += minutosApontados;
                } else {
                    analista.minutosReprovados += minutosApontados;
                }
              });
      
              analistas.forEach(x => {
                x.horasApontados =  convertToHour(x.minutosApontados);
                x.horasAprovados =  convertToHour(x.minutosAprovados);
                x.horasReprovados = convertToHour(x.minutosReprovados);
                x.horasNaoAnalisados = convertToHour(x.minutosNaoAnalisados);
              })
      
              const totalApontado = analistas.reduce((acumulador, current) => {
                return acumulador + +current.horasApontados;
              }, 0);
      
              const totalAprovado = analistas.reduce((acumulador, current) => {
                return acumulador + +current.horasAprovados;
              }, 0);
      
              const totalReprovado = analistas.reduce((acumulador, current) => {
                return acumulador + +current.horasReprovados;
              }, 0);
      
              const totalNaoAnalisado = analistas.reduce((acumulador, current) => {
                return acumulador + +current.horasNaoAnalisados;
              }, 0);
      
              setAnalistas(analistas.sort(compare));

              setTotal({
                apontado: totalApontado.toFixed(2),
                aprovado: totalAprovado.toFixed(2),
                reprovado: totalReprovado.toFixed(2),
                naoAnalisado: totalNaoAnalisado.toFixed(2)
              });

              setLoading(false);
            },
            simpleSheet: true
          })
    }, [])

    return (
      <Container >
        
        <aside>
          <header>
            <h1>Apontamentos</h1>
          </header>
          <Scroll>
          <Table>
            <thead>
              <tr>
                <th>Análista</th>
                <th>Horas Apontadas ({total.apontado})</th>
                <th>Horas Aprovadas ({total.aprovado})</th>
                <th>Horas Reprovadas ({total.reprovado})</th>
                <th>Horas Não analisadas ({total.naoAnalisado})</th>
              </tr>
            </thead>
            <tbody>
                { !loading && analistas.map(analista => (
                  <tr key={analista.nome}>
                    <td>{analista.nome}</td>
                    <td>{analista.horasApontados}</td>
                    <td>{analista.horasAprovados}</td>
                    <td>{analista.horasReprovados}</td>
                    <td>{analista.horasNaoAnalisados}</td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan="5" className="no-content"> Carregando ...</td>
                  </tr>
                )}
            </tbody>
          </Table>
        </Scroll>
        </aside>
        
      </Container>
    )

  //   return (
  //     <Container>
  //       <TableApontamentos>
  //         <thead>
  //           <tr class="red">
  //             <th>Name</th>
  //             <th>Age</th>
  //             <th>Job</th>
  //             <th>Color</th>
  //             <th>URL</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //         <tr>
  //           <td>Amet!</td>
  //           <td>In.</td>
  //           <td>Officia!</td>
  //           <td>Natus?</td>
  //           <td>Tempore?</td>
  //         </tr>
  //         <tr>
  //           <td>Consequatur.</td>
  //           <td>Hic.</td>
  //           <td>Officia.</td>
  //           <td>Itaque?</td>
  //           <td>Quasi.</td>
  //         </tr>
  //         <tr>
  //           <td>Enim.</td>
  //           <td>Tenetur.</td>
  //           <td>Asperiores?</td>
  //           <td>Eos!</td>
  //           <td>Libero.</td>
  //         </tr>
  //         <tr>
  //           <td>Exercitationem.</td>
  //           <td>Quidem!</td>
  //           <td>Beatae?</td>
  //           <td>Adipisci?</td>
  //           <td>Accusamus.</td>
  //         </tr>
  //         <tr>
  //           <td>Omnis.</td>
  //           <td>Accusamus?</td>
  //           <td>Eius!</td>
  //           <td>Recusandae!</td>
  //           <td>Dolor.</td>
  //         </tr>
  //         <tr>
  //           <td>Magni.</td>
  //           <td>Temporibus!</td>
  //           <td>Odio!</td>
  //           <td>Odit!</td>
  //           <td>Voluptatum?</td>
  //         </tr>
  //         <tr>
  //           <td>Eum.</td>
  //           <td>Animi!</td>
  //           <td>Labore.</td>
  //           <td>Alias!</td>
  //           <td>Fuga.</td>
  //         </tr>
  //         <tr>
  //           <td>Quia!</td>
  //           <td>Quis.</td>
  //           <td>Neque?</td>
  //           <td>Illo.</td>
  //           <td>Ad.</td>
  //         </tr>
  //         <tr>
  //           <td>Officiis.</td>
  //           <td>Exercitationem!</td>
  //           <td>Adipisci?</td>
  //           <td>Officiis?</td>
  //           <td>In?</td>
  //         </tr>
  //         <tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr>
  //         <tr>
  //           <td>Maxime?</td>
  //           <td>Qui!</td>
  //           <td>Sapiente!</td>
  //           <td>Natus.</td>
  //           <td>Soluta?</td>
  //         </tr>
  //         <tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr>
  //         <tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr><tr>
  //           <td>Voluptates?</td>
  //           <td>Voluptatum.</td>
  //           <td>Nihil.</td>
  //           <td>Totam?</td>
  //           <td>Quisquam!</td>
  //         </tr>
  //       </tbody>
  //       </TableApontamentos>
  //     </Container>
     
  // )
}
