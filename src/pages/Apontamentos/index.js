import React, { useState } from 'react';

import { Aba } from "./styles";
import Dashboard from "./Dashbord";
import Listagem from "./Listagem";
import Formulario from "./Formulario";

export default function Apontamentos() {
    const [aba, setAba] = useState(1);

    const trocaAba = (novaAba) => {
        if (aba !== novaAba) {
            setAba(novaAba);
        }
    };

    return (
        <div>
            <div>
                <nav>
                    <ul style={{display: 'flex'}}>
                        <Aba aberta={aba === 1}>
                            <span  onClick={() => trocaAba(1)}>DASHBOARD</span>
                        </Aba>
                        <Aba aberta={aba === 2}>
                            <span  onClick={() => trocaAba(2)}>LISTAGEM</span>
                        </Aba>
                        <Aba aberta={aba === 3} 
                            disabilitada={true} 
                            style={{opacity: "0.3", cursor: "not-allowed"}}
                            title="Em breve formulário para cadastro e edição">
                            <span /*onClick={() => trocaAba(3)}*/>FORMULÁRIO</span>
                        </Aba>
                    </ul>
                </nav>
            </div>
            <div>
                {aba === 1 && <Dashboard />}
                {aba === 2 && <Listagem />}
                {aba === 3 && <Formulario />}
            </div>
        </div>
    )
}
