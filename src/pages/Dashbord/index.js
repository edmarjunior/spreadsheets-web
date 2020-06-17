import React, { useState, useEffect } from 'react';
import { MdLabel } from "react-icons/md";
import { toast } from "react-toastify";
import { MdSync } from "react-icons/md";

import api from "../../services/api";
import { sum } from '../../lib/helper';
import { ArrowDownward } from '../../components/Icons/styles';
import { compare } from '../../lib/helper';
import { Container, TableApontamentos, Scroll, ThTime, TrTimes, Loading, ButtonSync } from './styles';

export default function Dashboard() {
  const [periodos, setPeriodos] = useState([
    {
      value: '6/2020',
      nome: 'Junho/2020',
      selected: true,
    },
    {
      value: '5/2020',
      nome: 'Maio/2020',
      selected: false,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [analistas, setAnalistas] = useState([]);
  const [times, setTimes] = useState([]);
  const [total, setTotal] = useState({});
  const [checkAllTime, setCheckAllTime] = useState(true);
  const [order, setOrder] = useState({ campo: 'horas_aprovadas', direcao: 'desc' });
  const [orderTime, setOrderTime] = useState({ campo: 'horas_aprovadas', direcao: 'desc' });
  const [loadingSync, setLoadingSync] = useState(false);
  
  useEffect(() => {
    const [mes, ano] = periodos.find(x => x.selected).value.split('/');
    getDados(mes, ano);
  }, [periodos])

  async function getDados(mes, ano) {
    setLoading(true);

    const responseAnalistas = await api.get('apontamentos-analistas', {
      params: {
        mes,
        ano
      }
    });

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

    const responseTimes = await api.get('apontamentos-times', {
      params: {
        mes,
        ano
      }
    });

    setTimes(responseTimes.data.map(time => ({
      ...time,
      checked: true
    })));

    setCheckAllTime(true);

    setLoading(false);
  };

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

    const timesAtualizados = times.map(time =>
      time.id === id ? { ...time, checked: !time.checked } : time
    );

    setTimes(timesAtualizados);

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

    if (timesAtualizados.filter(time => !time.checked).length && checkAllTime) {
      setCheckAllTime(false);
    }
    else if (timesAtualizados.every(time => time.checked) && !checkAllTime) {
      setCheckAllTime(true);
    }
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

  function handlePeriodo(event) {
    setPeriodos(periodos.map(periodo => ({
      ...periodo,
      selected: periodo.value === event.target.value
    })))
  }

  async function handleSincronizacao() {

    if (loadingSync) {
      toast.warning('Aguarde! estamos realizando a sincronização');
      return;
    }

    setLoadingSync(true);
    const periodoSelecionado = periodos.find(x => x.selected);
    const [mes, ano] = periodoSelecionado.value.split('/');

    const response = await api.get('apontamentos-planilha-sincronizar', {
      params: {
        mes,
        ano,
      }
    });

    const options = {autoClose: 25000 };

    toast.info(`Sucesso! Base de dados sincronizada com a planilha de ${periodoSelecionado.nome}`, options);
    toast.info("Ultima linha lida da planilha: " + response.data.ultima_linha_lida, options);
    toast.info("Quantidade apontamentos antes: " + response.data.qtd_apontamentos_antes, options);
    toast.info("Quantidade apontamentos atual: " + response.data.qtd_apontamentos_atual, options);

    setLoadingSync(false);

    getDados(mes, ano);
  }

  return (
    <Container >
      <aside>
        <header>
          <h1>Times</h1>
          <select onChange={handlePeriodo}>
            {periodos.map(periodo => (
              <option key={periodo.value} value={periodo.value}>{periodo.nome}</option>
            ))}
          </select>
        </header>
        <div>
          <table style={{width: '100%'}}>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" value={checkAllTime} onClick={handleCheckAllTimes} checked={checkAllTime} />
                </th>
                <th className="aleft">Time</th>
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
              {!Boolean(times.length) && (
                  <tr>
                    <td colSpan="6" className="acenter">Nenhum time teve apontamento</td>
                  </tr>
                )
              }
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
      <aside>
        <header>
          <h1>Analistas</h1>
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
      <ButtonSync loading={loadingSync} onClick={handleSincronizacao}>
        <MdSync size={40} color="#fff"/>
      </ButtonSync>
    </Container>
  )
}
