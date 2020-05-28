import React from 'react';
import { Link } from "react-router-dom";
import { MdMenu } from 'react-icons/md';

import { Container, Content, LinkTitulo, Menu } from './styles';

export default function Header() {
    return (
        <Container>
            <Content>
                <nav>
                    <LinkTitulo to="/apontamentos">Planilhas</LinkTitulo>
                </nav>
                <nav>
                    <Menu>
                        {/* <li>
                            <Link to="/">Inicio</Link>
                        </li> */}
                        <li>
                            <Link to="/apontamentos">Apontamentos</Link>  
                        </li>
                        
                        {/* <li>
                            <Link to="/">Sobre</Link>
                        </li> */}
                    </Menu>
                </nav>
            </Content>
            
        </Container>
    )
}
