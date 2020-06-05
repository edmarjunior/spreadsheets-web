import React, { useState, useEffect } from 'react';
import { MdLabel } from "react-icons/md";
import { toast } from "react-toastify";

import api from "../../services/api";
import { sum } from '../../lib/helper';
import { ArrowDownward } from '../../components/Icons/styles';
import { compare } from '../../lib/helper';
import { Container, TableApontamentos, Scroll, ThTime, TrTimes, Loading } from './styles';

export default function Dashboard() {

  const [loading, setLoading] = useState(true);
  const [analistas, setAnalistas] = useState([]);
  const [times, setTimes] = useState([]);
  const [total, setTotal] = useState({});
  const [mesAno, setMesAno] = useState(' Carregando Mes/Ano ...');
  const [checkAllTime, setCheckAllTime] = useState(true);
  const [order, setOrder] = useState({ campo: 'horas_aprovadas', direcao: 'desc' });
  const [orderTime, setOrderTime] = useState({ campo: 'horas_aprovadas', direcao: 'desc' });

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

  // analistas - ordenação

  function handleOrdenacaoAnalista() {
    const direcao = order.direcao === 'desc' ? 'asc' : 'desc';

    setOrder({ campo: order.campo, direcao });
    setAnalistas(analistas.sort((a, b) => compare(a, b, order.campo, direcao)));
  }

  function handleOrdenacaoTrocaCampoAnalista(campo) {
    if (order.campo === campo) {
      return;
    }

    setOrder({ campo, direcao: 'desc' });
    setAnalistas(analistas.sort((a, b) => compare(a, b, campo, 'desc')))
  }

  // times - checkbox's

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

  // times - ordenação
  function handleOrdenacaoTime() {
    const direcao = orderTime.direcao === 'desc' ? 'asc' : 'desc';

    setOrderTime({ campo: orderTime.campo, direcao });
    setTimes(times.sort((a, b) => compare(a, b, orderTime.campo, direcao)))
  }

  function handleOrdenacaoTrocaCampoTime(campo) {
    if (orderTime.campo === campo) {
      return;
    }

    setOrderTime({ campo, direcao: 'desc' });
    setTimes(times.sort((a, b) => compare(a, b, campo, 'desc')))
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
                <th onClick={() => handleOrdenacaoTrocaCampoAnalista('horas_apontadas')}>
                  Horas Apontadas
                  <div>
                    <span>
                      {loading ? <Loading /> : (total.apontado)}
                    </span>
                    {!loading && order.campo === 'horas_apontadas' && <ArrowDownward onClick={handleOrdenacaoAnalista} order={order.direcao} />}
                  </div>
                </th>
                <th onClick={() => handleOrdenacaoTrocaCampoAnalista('horas_aprovadas')}>
                  Horas Aprovadas
                  <div>
                    <span>
                      {loading ? <Loading /> : (total.aprovado)}
                    </span>
                    {!loading && order.campo === 'horas_aprovadas' && <ArrowDownward onClick={handleOrdenacaoAnalista} order={order.direcao} />}
                  </div>
                </th>
                <th onClick={() => handleOrdenacaoTrocaCampoAnalista('horas_reprovadas')}>
                  Horas Reprovadas
                  <div>
                    <span>
                      {loading ? <Loading /> : (total.reprovado)}
                    </span>
                    {!loading && order.campo === 'horas_reprovadas' && <ArrowDownward onClick={handleOrdenacaoAnalista} order={order.direcao} />}
                  </div>
                </th>
                <th onClick={() => handleOrdenacaoTrocaCampoAnalista('horas_nao_analisadas')}>
                  Horas Não analisadas
                  <div>
                    <span>
                      {loading ? <Loading /> : (total.naoAnalisado)}
                    </span>
                    {!loading && order.campo === 'horas_nao_analisadas' && <ArrowDownward onClick={handleOrdenacaoAnalista} order={order.direcao} />}
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
                <th>
                  <input type="checkbox" value={checkAllTime} onClick={handleCheckAllTimes} checked={checkAllTime} />
                </th>
                <th class="aleft">Time</th>
                <ThTime onClick={() => handleOrdenacaoTrocaCampoTime('horas_apontadas')}>
                  Apont.
                  {orderTime.campo === 'horas_apontadas' && <ArrowDownward onClick={() => handleOrdenacaoTime()} order={orderTime.direcao} />}
                </ThTime>
                <ThTime onClick={() => handleOrdenacaoTrocaCampoTime('horas_aprovadas')}>
                  Aprov.
                  {orderTime.campo === 'horas_aprovadas' && <ArrowDownward onClick={() => handleOrdenacaoTime()} order={orderTime.direcao} />}
                </ThTime>
                <ThTime onClick={() => handleOrdenacaoTrocaCampoTime('horas_reprovadas')}>
                  Reprov.
                  {orderTime.campo === 'horas_reprovadas' && <ArrowDownward onClick={() => handleOrdenacaoTime()} order={orderTime.direcao} />}
                </ThTime>
                <ThTime onClick={() => handleOrdenacaoTrocaCampoTime('horas_nao_analisadas')}>
                  Ñ/analis.
                  {orderTime.campo === 'horas_nao_analisadas' && <ArrowDownward onClick={() => handleOrdenacaoTime()} order={orderTime.direcao} />}
                </ThTime>
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
