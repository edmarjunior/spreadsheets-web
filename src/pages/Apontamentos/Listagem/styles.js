import styled, { css } from "styled-components";
import { Badge } from "react-bootstrap";

export const Form = styled.form`
    > div {
        margin-bottom: 10px;
    }
`;

export const Pill = styled(Badge).attrs({
    pill: 'pill',
})`
    margin: 5px;
    opacity: ${props => props.selecionado ? "1": "0.3"};
    background-color: ${props => props.color};
    color: #fff;
    
    ${props => props.selecionado && css`
        box-shadow: 0 0 0 0.2rem rgba(38,143,255,.5);
    `}

    :hover {
        cursor: pointer;
    }
`
