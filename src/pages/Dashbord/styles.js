import styled from 'styled-components';
import PerfectScrollBar from 'react-perfect-scrollbar';
import { MdRefresh } from "react-icons/md";

export const Container = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
    
    aside {
        max-width: 50%;
        padding: 15px;
        margin: 5px; 
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        height: fit-content;

        header {
            margin-bottom: 10px;
        }
    }
`;

export const TableApontamentos = styled.table`
    th {
        background: white;
        position: sticky;
        top: 0;
        box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
        background-color: #f2fcfe;
        cursor: pointer;
        div {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
        }
    }

    th:first-child {
        min-width: 265px;
    }

    th + th {
        width: 100px;
    }

    td, th {
        border: 1px solid #ddd;
    }

    svg {
        margin-right: 4px;
    }
`;

export const Scroll = styled(PerfectScrollBar)`
    max-height: 700px;
    border: 1px solid #ddd;
    border-radius: 3px;
`;

export const TrTimes = styled.tr`
    opacity: ${(props) => (props.checked ? 1 : 0.4)};
    font-size: ${(props) => (props.checked ? "16px" : "14px")};
    background: ${props => props.checked ? "rgba(0,204,255, 0.05)" : "#fff"};
    cursor: pointer;
    :hover {
        opacity: 1;
    }
`;

export const Loading = styled(MdRefresh).attrs(props => ({
    size: 25,
    color: '#07ADF5'
}))`
    animation: rotating 0.6s linear infinite;
    @keyframes rotating {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

`;