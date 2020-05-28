import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.header`
  background: linear-gradient(-90deg, #1d242e, #4C0E95);
  padding: 0 30px;
`;

export const Content = styled.div`
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
`;

export const LinkTitulo = styled(Link)`
  color: #fff;
  text-decoration: none;
  opacity: 0.6;

  :hover {
    opacity: 1;
  }
`;

export const Menu = styled.ul`
  
  list-style: none;
  display: flex;

  li {

    padding: 0 30px;

    &::after {
      content: '';
      display: block;
      border-bottom: solid 3px #1DAAE7;
      transform: scaleX(0);
      transition: transform 250ms ease-in-out;
      margin-top: 5px;
    }

    &:hover {
      cursor: pointer;

      &::after {
        transform: scaleX(1);
      }

      > a {
        opacity: 1;
      }
    }
   
    a {
      color: #fff;
      text-decoration: none;
      font-size: 16px;
      opacity: 0.7;
    }
  }

`;
