import styled, { css } from "styled-components";

export const Aba = styled.li`
    list-style: none;
    margin: 20px 0;

    &::after {
        content: '';
        display: block;
        border-bottom: solid 1.5px #4C0E95;
        transform: ${props => props.aberta ? "scaleX(1)" : "scaleX(0)" } ;
        transition: transform 250ms ease-in-out;
        margin-top: 5px;
    }

    span {
        margin: 0 20px;

        ${props => !props.disabilitada && css`
            :hover {
                cursor: ${props => props.aberta ? "default" : "pointer"};
                opacity: ${props => props.aberta ? "1" : "0.6"};
            }
        `}
    }
`
