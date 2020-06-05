import styled from 'styled-components';
import { MdArrowDownward } from "react-icons/md";

export const ArrowDownward = styled(MdArrowDownward).attrs(props => ({
    size: 20,
    color: '#07ADF5',
    className: 'ico-arrow-down',
    title: props.order === 'asc' ? 'Ordenado do Menor para o Maior' : 'Ordenado do Maior para o Menor',
}))`
    cursor: pointer;
    opacity: 0.5;
    border: 1px solid #ddd;
    background-color: #fff;
    border-radius: 50%;
    &:hover {
        opacity: 1;
    }

    transition: transform 250ms ease;
    transform: ${props => props.order === 'asc' ? 'rotate(-180deg)' : 'rotate(-360deg)'} ;
`;
