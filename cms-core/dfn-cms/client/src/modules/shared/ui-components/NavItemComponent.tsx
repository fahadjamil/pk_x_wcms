import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconResourcesMap } from 'ui-components';

export default function NavItemComponent(props) {
    let item = props.item;
    let IconComp: any = IconResourcesMap[item.icon];
    return (
        <li className="nav-item" key={item.name}>
            <NavLink
                className="nav-link"
                activeStyle={{
                    background: '#6d789a',
                    color: '#2DF',
                    // width: '60px',
                }}
                to={item.route}
            >
                {IconComp && <IconComp width="22" height="22" color="white" />}
                &nbsp;
            </NavLink>
        </li>
    );
}
