import React, { useState, useEffect } from 'react';
import { Button, Table } from "react-bootstrap";

import api from "../../../services/api";
import { Form, Pill} from './styles';

export default function Listagem() {

    const [times, setTimes] = useState([]);
    const [analistas, setAnalistas] = useState([]);
    const [apontamentos, setApontamentos] = useState([]);
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
        }

        carregaDados();
    }, [])

    const selecionaTime = (id) => {
        setTimes(times.map(time => ({
            ...time,
            selecionado: time.id === id ? !time.selecionado : time.selecionado,
        })));
    }

    const selecionaAnalista = (id) => {
        setAnalistas(analistas.map(analista => ({
            ...analista,
            selecionado: analista.id === id ? !analista.selecionado : analista.selecionado,
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

        const { data: apontamentosEncontrados } = await api.get("/apontamentos", {
            params: {
                analistas: rangeAnalistas,
                situacoes: rangeSituacoes,
                mes: 6,
                ano: 2020,
            }
        });

        setApontamentos(apontamentosEncontrados);
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
                                <Button onClick={() => selecionarFiltros(true)} variant="light">
                                    Selecionar todos
                                </Button>
                                <Button onClick={() => selecionarFiltros(false)} variant="light" className="ml-1">
                                    Limpar filtros
                                </Button>
                                <Button type="submit" onClick={buscarApontamentos} style={{width: '200px'}} className="ml-1">
                                    Buscar
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
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Data da Solicitação</th>
                                <th>Análista</th>
                                <th>Início</th>
                                <th>Término</th>
                                <th>Assunto</th>
                                <th>Descrição</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!apontamentos.length && (
                                <tr>
                                    <td colSpan="8" className="text-center">Nenhum registro encontrado</td>
                                </tr>
                            )}
                            {!!apontamentos.length && (
                                apontamentos.map(apontamento => (
                                    <tr>
                                        <td>#</td>
                                        <td>11/06/2020</td>
                                        <td>{apontamento.range_analistas}</td>
                                        <td>11/06/2020</td>
                                        <td>11/06/2020</td>
                                        <td>{apontamento.assunto}</td>
                                        <td>{apontamento.descricao}</td>
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
