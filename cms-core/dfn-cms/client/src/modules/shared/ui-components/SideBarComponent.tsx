import React from 'react';
import WebsiteDropdown from '../../websites/WebsiteDropdownComponent';

interface SideBarComponentModel {
    children?: any;
}

function SideBarComponent(props: SideBarComponentModel) {
    return (
        <>

            <div
                className="sidebar__component"
            >
                <div className="logo">
                    <span className="logo__text">DFN CMS </span>v0.1
                </div>
                <WebsiteDropdown />

                <div className="sidebar__accordion__container scrollbar scrollbar__thm__03">
                    {props.children!}
                </div>


            </div>
        </>
    );
}

export default SideBarComponent;
