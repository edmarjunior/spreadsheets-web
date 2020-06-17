import React from 'react';
import { Link } from "react-router-dom";

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
                        <li>
                            <Link to="/apontamentos">Apontamentos</Link>  
                        </li>
                    </Menu>
                </nav>
            </Content>
        </Container>
    )
}
