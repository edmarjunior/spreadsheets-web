import { createGlobalStyle } from "styled-components";
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`

    * {
        margin: 0;
        padding: 0;
        outline: 0;

    }

    body {
        height: 100%;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    table {
        
        tr {
            line-height: 26px;
        }

        td, th {
            padding: 5px;
            margin: 0;
        }
    }
`;