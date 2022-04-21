import React from 'react';

import { NavLink } from 'react-router-dom';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <div>
            <nav>
                <NavLink to="/">All lists</NavLink>
                <NavLink to="/completed">Completed items</NavLink>
                <NavLink to="/deleted">Deleted items</NavLink>
            </nav>
            {children}
        </div>
    );
};

export default Layout;
