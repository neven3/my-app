import React, { ReactNode } from 'react';

import { NavLink } from 'react-router-dom';

import './Layout.scss';

interface ILayoutProps {
    children: ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => (
    <div className="layout">
        <header className="header">
            <h1 className="header__title">To do app</h1>
            <nav className="header__nav">
                <NavLink className="header__navlink" to="/">All lists</NavLink>
                <NavLink className="header__navlink" to="/completed">Completed items</NavLink>
                <NavLink className="header__navlink" to="/deleted">Deleted items</NavLink>
            </nav>
        </header>
        <main className="main">
            {children}
        </main>
    </div>
);

export default Layout;
