import React, { useState, useEffect } from 'react';
import { Button, Table, Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";

import api from "../../../services/api";
import { Form, Pill} from './styles';

export default function Listagem() {
    const [periodos, setPeriodos] = useState([]);

    const [times, setTimes] = useState([]);
    const [analistas, setAnalistas] = useState([]);
    const [apontamentos, setApontamentos] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const [situacoes, setSituacoes] = useState([
        {
            id: 1,
            nome: 'Aprovado',
            cor_hexa: '#28a745',
            selecionado: true,
        },
        {
            id: 2,
            nome: 'Reprovado',
            cor_hexa: '#dc3545',
            selecionado: true,
        },
        {
            id: 3,
            nome: 'Não Analisado',
            cor_hexa: '#007bff',
            selecionado: true,
        },
    ]);

    useEffect(() => {
        const carregaDados = async () => {
            const { data: timesCadastrados } = await api.get('/times');
            setTimes(timesCadastrados.map(time => ({
                ...time, 
                selecionado: true
            })));

            const { data: analistasCadastrados } = await api.get('/usuarios');
            setAnalistas(analistasCadastrados.map(analista => ({
                ...analista, 
                selecionado: true
            })));

            const { data: periodosDisponiveis } = await api.get('apontamento-periodos');

            setPeriodos(periodosDisponiveis.map(periodo => ({
                ...periodo,
                selecionado: periodo.id === 1,
            })));
        }

        carregaDados();
    }, [])

    const selecionaPeriodo = (id) => {
        setPeriodos(periodos.map(periodo => ({
            ...periodo,
            selecionado: periodo.id === id,
        })))
    }

    const selecionaTime = (id) => {
        const selecionado = times.find(time => time.id === id).selecionado;

        setTimes(times.map(time => ({
            ...time,
            selecionado: time.id === id ? !selecionado : time.selecionado,
        })));

        setAnalistas(analistas.map(analista => ({
            ...analista,
            selecionado: analista.time.id === id ? !selecionado : analista.selecionado,
        })));
    }

    const selecionaAnalista = (id) => {

        const analistasAtualizados = analistas.map(analista => ({
            ...analista,
            selecionado: analista.id === id ? !analista.selecionado : analista.selecionado,
        }));

        setAnalistas(analistasAtualizados);

        const idTime = analistas.find(analista => analista.id === id).time.id;

        const selecionaTime = analistasAtualizados
            .filter(analista => analista.time.id === idTime)
            .every(analista => analista.selecionado);

        setTimes(times.map(time => ({
            ...time,
            selecionado: time.id === idTime ? selecionaTime : time.selecionado,
        })));
    }

    const selecionaSituacao = (id) => {
        setSituacoes(situacoes.map(situacao => ({
            ...situacao,
            selecionado: situacao.id === id ? !situacao.selecionado : situacao.selecionado,
        })));
    }
    
    const selecionarFiltros = (selecionado) => {
        setTimes(times.map(time => ({
            ...time,
            selecionado,
        })));
        
        setAnalistas(analistas.map(analista => ({
            ...analista,
            selecionado,
        })));

        setSituacoes(situacoes.map(situacao => ({
            ...situacao,
            selecionado,
        })));

        setPeriodos(periodos.map(periodo => ({
            ...periodo,
            selecionado: periodo.atual,
        })));
    }

    const buscarApontamentos = async (event) => {
        event.preventDefault();

        let rangeAnalistas;

        const analistasSelecionado = analistas.filter(analista => analista.selecionado);

        if (analistas.length === analistasSelecionado.length) {
            rangeAnalistas = 'todos'
        } else {
            rangeAnalistas = analistasSelecionado.map(analista => analista.id).join(',');
        }

        let rangeSituacoes;

        const situacoesSelecionado = situacoes.filter(situacao => situacao.selecionado);

        if (situacoes.length === situacoesSelecionado.length) {
            rangeSituacoes = 'todos'
        } else {
            rangeSituacoes = situacoesSelecionado.map(situacao => situacao.id).join(',');
        }

        if (!analistasSelecionado.length || !situacoesSelecionado.length) {
            if (!analistasSelecionado.length) {
                toast.error("Favor informar algum analista", { position: 'bottom-left'});
            }

            if (!situacoesSelecionado.length) {
                toast.error("Favor informar algum status", { position: 'bottom-left'});
            }

            return true;
        }

        try {
            setLoading(true);

            const [mes, ano] = periodos.find(x => x.selecionado).value.split('/');
            
            const { data: apontamentosEncontrados } = await api.get("/apontamentos", {
                params: {
                    analistas: rangeAnalistas,
                    situacoes: rangeSituacoes,
                    mes,
                    ano,
                }
            });
    
            setApontamentos(apontamentosEncontrados);
        } catch (error) {
            toast.error(error.response.data.message, { position: 'bottom-left'});
        } finally {
            setLoading(false);
        }
       
    }

    return (
        <>
            <div className="card">
                <div className="card-header">
                    Filtros de busca
                </div>
                <div className="card-body">
                    <Form>
                        <div className="row">
                            <div className="col-1">
                                <label>Periodo:</label>
                            </div>
                            <div className="col">
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">
                                        {periodos.find(periodo => periodo.selecionado).nome}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {periodos.map(periodo => (
                                            <Dropdown.Item key={periodo.id} onClick={() => selecionaPeriodo(periodo.id)}>
                                                {periodo.nome}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label>Times:</label>
                            </div>

                            <div className="col-11">
                                {times.map(time => (
                                    <Pill key={time.id} selecionado={time.selecionado} onClick={() => selecionaTime(time.id)} color={time.cor_hexa}>{time.nome}</Pill>
                                ))}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label>Análistas:</label>
                            </div>

                            <div className="col-11">
                                {analistas.map(analista => (
                                    <Pill key={analista.id} selecionado={analista.selecionado} onClick={() => selecionaAnalista(analista.id)} color={analista.time.cor_hexa}>{analista.nome}</Pill>
                                ))}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label>Status:</label>
                            </div>

                            <div className="col-11">
                                {situacoes.map(situacao => (
                                    <Pill key={situacao.id} selecionado={situacao.selecionado} 
                                        onClick={() => selecionaSituacao(situacao.id)} 
                                        color={situacao.cor_hexa}>{situacao.nome}
                                    </Pill>
                                ))}
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-center">
                            <div>
                                <Button onClick={() => selecionarFiltros(true)} variant="light"
                                    disabled={isLoading}>
                                    Selecionar todos
                                </Button>
                                <Button onClick={() => selecionarFiltros(false)} variant="light" className="ml-1"
                                    disabled={isLoading}>
                                    Limpar filtros
                                </Button>
                                <Button type="submit" style={{width: '200px'}} className="ml-1"
                                    onClick={!isLoading ? buscarApontamentos : null}
                                    disabled={isLoading}>
                                    {isLoading ? 'Carregando...' : 'Buscar'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>       
            </div>
            <div className="card">
                <div className="card-header">
                    Apontamentos encontratos
                </div>
                <div className="card-body">
                    <Table striped bordered hover size="sm" style={{maxWidth: '100%'}}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Data da Solicitação</th>
                                <th>Análista</th>
                                <th>Tipo Atendimento</th>
                                <th>Solicitante</th>
                                <th>Área</th>
                                <th>Início</th>
                                <th>Término</th>
                                <th>Assunto</th>
                                <th>Descrição</th>
                                <th>Tempo Gasto</th>
                                <th>Aprovado?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!apontamentos.length && (
                                <tr>
                                    <td colSpan="12" className="text-center">Nenhum registro encontrado</td>
                                </tr>
                            )}
                            {!!apontamentos.length && (
                                apontamentos.map(apontamento => (
                                    <tr key={apontamento.id}>
                                        <td>{apontamento.contador}</td>
                                        <td>{apontamento.data_solicitacao}</td>
                                        <td>{apontamento.range_analistas}</td>
                                        <td>{apontamento.tipo_tendimento}</td>
                                        <td>{apontamento.solicitante}</td>
                                        <td>{apontamento.area}</td>
                                        <td>{apontamento.inicio}</td>
                                        <td>{apontamento.termino}</td>
                                        <td>{apontamento.assunto}</td>
                                        <td>{apontamento.descricao}</td>
                                        <td>{apontamento.minutos_apontados}</td>
                                        <td>{apontamento.indicador_aprovacao}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}
