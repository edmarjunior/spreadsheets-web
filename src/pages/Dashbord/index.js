import React, { useState, useEffect } from 'react';
import Tabletop from 'tabletop';
import { MdLabel } from "react-icons/md";
import { toast } from "react-toastify";

import { Container, TableApontamentos, Scroll, TrTimes, Loading } from './styles';
import { compare, convertToHour, sum, getTimes } from '../../lib/helper';

export default function Dashboard() {

    const [loading, setLoading] = useState(true);
    const [analistas, setAnalistas] = useState([]);
    const [times, setTimes] = useState(getTimes());
    const [total, setTotal] = useState({});
    const [mesAno, setMesAno] = useState(' Carregando Mes/Ano ...');
   
    useEffect(() => {
        Tabletop.init({
          key: process.env.REACT_APP_APONTAMENTOS_KEY,
          callback: (googleData, config) => {
            let analistas = [];
            
            setMesAno(config.foundSheetNames[0]);

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
                    minutosNaoAnalisados: 0,
                    visible: true,
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
              x.horasApontadas =  convertToHour(x.minutosApontados);
              x.horasAprovadas =  convertToHour(x.minutosAprovados);
              x.horasReprovadas = convertToHour(x.minutosReprovados);
              x.horasNaoAnalisadas = convertToHour(x.minutosNaoAnalisados);

              let time = times.find(t => t.analistas.indexOf(x.nome) > -1);
              
              if (!time) {
                // atribuindo ao time '6 - outros'
                time = times.find(t => t.codigo === 6);
                time.analistas.push(x.nome);
              }

              x.time = time;
            })
            
            const timesAtalizados = times.map(time => {
              const analistasDoTime = analistas.filter(x => x.time.codigo === time.codigo);
              return {
                ...time,
                horasApontadas: sum(analistasDoTime, 'horasApontadas'),
                horasAprovadas: sum(analistasDoTime, 'horasAprovadas'),
                horasReprovadas: sum(analistasDoTime, 'horasReprovadas'),
                horasNaoAnalisadas: sum(analistasDoTime, 'horasNaoAnalisadas'),
              };
            });

            setTimes(timesAtalizados.sort((a, b) => compare(a, b, 'horasAprovadas')));

            setAnalistas(analistas.sort((a, b) => compare(a, b, 'minutosAprovados')));

            setTotal({
              apontado: sum(analistas, 'horasApontadas'),
              aprovado: sum(analistas, 'horasAprovadas'),
              reprovado: sum(analistas, 'horasReprovadas'),
              naoAnalisado: sum(analistas, 'horasNaoAnalisadas')
            });

            setLoading(false);
          },
          simpleSheet: true
        })
    }, [])

    function handleCheckTimes(codigo) {
      
      if (loading) {
        toast.info("Aguarde o carregamento da planilha")
        return;
      }

      setTimes(times.map(time => 
        time.codigo === codigo ? { ...time, checked: !time.checked } : time
      ));

      const analistasAtualizado = analistas.map(analista => 
        analista.time.codigo === codigo ? { ...analista, visible: !analista.visible } : analista
      );

      setAnalistas(analistasAtualizado);

      const analistasVisible = analistasAtualizado.filter(analista => analista.visible);

      setTotal({
        apontado: sum(analistasVisible, 'horasApontadas'),
        aprovado: sum(analistasVisible, 'horasAprovadas'),
        reprovado: sum(analistasVisible, 'horasReprovadas'),
        naoAnalisado: sum(analistasVisible, 'horasNaoAnalisadas')
      });
    }

    return (
      <Container >
        <aside>
          <header>
            <h1>Apontamentos de: {loading ? <Loading /> : mesAno}</h1>
          </header>
          <Scroll>
            <TableApontamentos>
              <thead>
                <tr>
                  <th>Análista</th>
                  <th>Horas Apontadas {loading ? <Loading /> : (total.apontado)}</th>
                  <th>Horas Aprovadas {loading ? <Loading /> : (total.aprovado)}</th>
                  <th>Horas Reprovadas {loading ? <Loading /> : (total.reprovado)}</th>
                  <th>Horas Não analisadas {loading ? <Loading /> : (total.naoAnalisado)}</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="acenter"><Loading /></td>
                  </tr>
                )}
                {!loading && (
                  !Boolean(analistas.length) && (
                    <tr>
                      <td colSpan="5" className="acenter">Nenhum registro encontrado na planilha</td>
                    </tr>
                  )
                  ||
                  Boolean(analistas.length) && !analistas.find(x => x.visible) && (
                    <tr>
                      <td colSpan="5" className="acenter">Selecione algum time para ver os apontamentos</td>
                    </tr>
                  )
                  ||
                  Boolean(analistas.length) && 
                  analistas.find(x => x.visible) && 
                  analistas.filter(x => x.visible).map(analista => (
                    <tr key={analista.nome}>
                      <td><MdLabel color={analista.time.cor}/>{analista.nome}</td>
                      <td className="acenter">{analista.horasApontadas}</td>
                      <td className="acenter">{analista.horasAprovadas}</td>
                      <td className="acenter">{analista.horasReprovadas}</td>
                      <td className="acenter">{analista.horasNaoAnalisadas}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </TableApontamentos>
          </Scroll>
        </aside>
        <aside>
          <header>
            <h1>Times</h1>
          </header>
          <div>
            <table>
              <thead>
                <tr>
                  <th class="aleft" colSpan="2">Time</th>
                  <th>Apont.</th>
                  <th>Aprov.</th>
                  <th>Reprov.</th>
                  <th>Ñ/analis.</th>
                </tr>
              </thead>
              <tbody>
                {times.map(time => (
                  <TrTimes checked={time.checked} onClick={() => { handleCheckTimes(time.codigo) }}>
                    <td><MdLabel color={time.cor} /></td>
                    <td>{time.nome}</td>

                    {loading && (
                      <td className="acenter" colSpan="4"><Loading /></td>
                    )}
                   
                    {!loading && (
                      <>
                      <td className="acenter">{time.horasApontadas}</td>
                      <td className="acenter">{time.horasAprovadas}</td>
                      <td className="acenter">{time.horasReprovadas}</td>
                      <td className="acenter">{time.horasNaoAnalisadas}</td>
                      </>
                    )}
                  </TrTimes>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </Container>
    )
}
