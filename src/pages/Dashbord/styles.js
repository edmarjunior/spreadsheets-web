import styled from 'styled-components';
import PerfectScrollBar from 'react-perfect-scrollbar';

export const Container = styled.div`
    padding: 10px;
    aside {
        border: 1px solid rgba(0, 0, 0, 0.2);
        width: 50%;
        padding: 20px;
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
        border-radius: 3px;

        header {
            margin-bottom: 10px;
        }
    }
`;

export const Table = styled.div`
    tr {
        line-height: 26px;
    }

    th {
        background: white;
        position: sticky;
        top: 0;
        box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
    }

    td, th {
        border: 1px solid #ddd;
        width: 10%;
        padding: 5px;
    }

    td + td, .no-content {
        text-align: center;
    }
`;

export const Scroll = styled(PerfectScrollBar)`
    max-height: 700px;
    border: 1px solid #ddd;
    /* padding-right: 5px; */
    border-radius: 3px;
`;
