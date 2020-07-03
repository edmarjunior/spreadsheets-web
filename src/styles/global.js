import { createGlobalStyle } from "styled-components";
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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

    tr {
        line-height: 26px;
        
        :hover {
            background: rgba(0,204,255, 0.05)
        }
    }

    td, th {
        padding: 5px;
    }

    .aleft {
        text-align: left;
    }

    .acenter {
        text-align: center;
    }

    select {
        padding: 5px;

        option {
            font-size: 15px;
        }
    }

    /* .card {
        background-color: #fff;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
        word-wrap: break-word;

        @media(min-width: 700px) {
            width: 50%;
        }

        @media(max-width: 700px) {
            width: 100%;
        }
    } */
`;
