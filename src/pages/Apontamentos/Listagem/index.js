import React, { useState, useEffect } from 'react';
import { Button, Table } from "react-bootstrap";

import api from "../../../services/api";
import { Form, Pill} from './styles';

export default function Listagem() {

    const [times, setTimes] = useState([]);
    const [analistas, setAnalistas] = useState([]);
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
                                <Button onClick={() => selecionarFiltros(true)} variant="light">Selecionar todos</Button>
                                <Button onClick={() => selecionarFiltros(false)} variant="light" className="ml-1">Limpar filtros</Button>
                                <Button type="submit" style={{width: '200px'}} className="ml-1">Buscar</Button>
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
                            <tr>
                                <td>#</td>
                                <td>11/06/2020</td>
                                <td>Marcos</td>
                                <td>11/06/2020</td>
                                <td>11/06/2020</td>
                                <td>Atividades Gerais</td>
                                <td>
                                    - Análise do feedback e finalização do ticket2351 ENC: 12.DO.13 - Cancelamento de Alvará
                                    - Análise e e envio de feedback ao usuário ticket 2458 Correção dos casos rescindidos enviados para a carteira 915
                                    - Cancelamento do chamado 2482 ENC: Ninho Verde I Eco Residence- Erro em baixa de parcelas
                                    -  Análise e finalização ticke 1565  Resolvido: 08-IS-18 - Taxa de conservação.
                                </td>
                                <td>Aprovado</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}
