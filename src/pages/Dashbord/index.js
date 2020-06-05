import React, { useState, useEffect } from 'react';
import { MdLabel } from "react-icons/md";
import { toast } from "react-toastify";

import api from "../../services/api";
import { sum } from '../../lib/helper';
import { ArrowDownward } from '../../components/Icons/styles';
import { compare } from '../../lib/helper';
import { Container, TableApontamentos, Scroll, TrTimes, Loading } from './styles';

export default function Dashboard() {

  const [loading, setLoading] = useState(true);
  const [analistas, setAnalistas] = useState([]);
  const [times, setTimes] = useState([]);
  const [total, setTotal] = useState({});
  const [mesAno, setMesAno] = useState(' Carregando Mes/Ano ...');
  const [checkAllTime, setCheckAllTime] = useState(true);
  const [order, setOrder] = useState({ coluna: 3, order: 'desc' });

  useEffect(() => {
    async function getDados() {
      setMesAno("Maio/2020");

      const responseAnalistas = await api.get('apontamentos-analistas');

      const analistas = responseAnalistas.data;

      setAnalistas(analistas.map(analista => ({
        ...analista,
        visible: true,
      })));

      setTotal({
        apontado: sum(analistas, 'horas_apontadas'),
        aprovado: sum(analistas, 'horas_aprovadas'),
        reprovado: sum(analistas, 'horas_reprovadas'),
        naoAnalisado: sum(analistas, 'horas_nao_analisadas')
      });

      const responseTimes = await api.get('apontamentos-times');

      setTimes(responseTimes.data.map(time => ({
        ...time,
        checked: true
      })));

      setLoading(false);
    };

    getDados();

  }, [])

  function handleCheckAllTimes() {
    const acaoAtual = !checkAllTime;
    setCheckAllTime(acaoAtual);

    setTimes(times.map(time => ({
      ...time,
      checked: acaoAtual
    })));

    setAnalistas(analistas.map(analista => ({
      ...analista,
      visible: acaoAtual
    })));

    setTotal({
      apontado: acaoAtual ? sum(analistas, 'horas_apontadas') : 0,
      aprovado: acaoAtual ? sum(analistas, 'horas_aprovadas') : 0,
      reprovado: acaoAtual ? sum(analistas, 'horas_reprovadas') : 0,
      naoAnalisado: acaoAtual ? sum(analistas, 'horas_nao_analisadas') : 0
    });

  }

  function handleCheckTimes(id) {
    if (loading) {
      toast.info("Aguarde o carregamento da planilha")
      return;
    }

    setTimes(times.map(time =>
      time.id === id ? { ...time, checked: !time.checked } : time
    ));

    const analistasAtualizado = analistas.map(analista =>
      analista.time.id === id ? { ...analista, visible: !analista.visible } : analista
    );

    setAnalistas(analistasAtualizado);

    const analistasVisible = analistasAtualizado.filter(analista => analista.visible);

    setTotal({
      apontado: sum(analistasVisible, 'horas_apontadas'),
      aprovado: sum(analistasVisible, 'horas_aprovadas'),
      reprovado: sum(analistasVisible, 'horas_reprovadas'),
      naoAnalisado: sum(analistasVisible, 'horas_nao_analisadas')
    });
  }

  function handleArrowDownward() {
    const ordernacao = order.order === 'desc' ? 'asc' : 'desc';
    setOrder({ coluna: order.coluna, order: ordernacao });

    orderAnalistas(order.coluna, ordernacao);
  }

  function handleOrder(codigoColuna) {
    if (order.coluna === codigoColuna) {
      return;
    }

    setOrder({ coluna: codigoColuna, order: 'desc' });

    orderAnalistas(codigoColuna, 'desc');
  }

  function orderAnalistas(coluna, ordenacao) {

    let campo;

    if (coluna === 2) {
      campo = 'horas_apontadas';
    }
    else if (coluna === 3) {
      campo = 'horas_aprovadas';
    }
    else if (coluna === 4) {
      campo = 'horas_reprovadas';
    }
    else
      campo = 'horas_nao_analisadas';

    setAnalistas(analistas.sort((a, b) => compare(a, b, campo, ordenacao)))
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
                <th onClick={() => handleOrder(2)}>
                  Horas Apontadas
                  <div>
                    <span>
                      {loading ? <Loading /> : (total.apontado)}
                    </span>
                    {!loading && order.coluna === 2 && <ArrowDownward onClick={handleArrowDownward} order={order.order} />}
                  </div>
                </th>
                <th onClick={() => handleOrder(3)}>
                  Horas Aprovadas
                  <div>
                    <span>
                      {loading ? <Loading /> : (total.aprovado)}
                    </span>
                    {!loading && order.coluna === 3 && <ArrowDownward onClick={handleArrowDownward} order={order.order} />}
                  </div>
                </th>
                <th onClick={() => handleOrder(4)}>
                  Horas Reprovadas
                  <div>
                    <span>
                      {loading ? <Loading /> : (total.reprovado)}
                    </span>
                    {!loading && order.coluna === 4 && <ArrowDownward onClick={handleArrowDownward} order={order.order} />}
                  </div>
                </th>
                <th onClick={() => handleOrder(5)}>
                  Horas Não analisadas
                  <div>
                    <span>
                      {loading ? <Loading /> : (total.naoAnalisado)}
                    </span>
                    {!loading && order.coluna === 5 && <ArrowDownward onClick={handleArrowDownward} order={order.order} />}
                  </div>
                </th>
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
                    <td><MdLabel color={analista.time.cor_hexa} />{analista.nome}</td>
                    <td className="acenter">{analista.horas_apontadas}</td>
                    <td className="acenter">{analista.horas_aprovadas}</td>
                    <td className="acenter">{analista.horas_reprovadas}</td>
                    <td className="acenter">{analista.horas_nao_analisadas}</td>
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
                <th><input type="checkbox" value={checkAllTime} onClick={handleCheckAllTimes} checked={checkAllTime} /></th>
                <th class="aleft">Time</th>
                <th>Apont.</th>
                <th>Aprov.</th>
                <th>Reprov.</th>
                <th>Ñ/analis.</th>
              </tr>
            </thead>
            <tbody>
              {times.map(time => (
                <TrTimes checked={time.checked} onClick={() => { handleCheckTimes(time.id) }}>
                  <td><MdLabel color={time.cor_hexa} /></td>
                  <td>{time.nome}</td>

                  {loading && (
                    <td className="acenter" colSpan="4"><Loading /></td>
                  )}

                  {!loading && (
                    <>
                      <td className="acenter">{time.horas_apontadas}</td>
                      <td className="acenter">{time.horas_aprovadas}</td>
                      <td className="acenter">{time.horas_reprovadas}</td>
                      <td className="acenter">{time.horas_nao_analisadas}</td>
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
