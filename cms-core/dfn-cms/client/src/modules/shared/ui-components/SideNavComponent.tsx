import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { MenusConfigurations } from 'ui-components';
import { connect } from 'react-redux';
import NavItemComponent from './NavItemComponent';

const Section = styled.div`
    position: absolute;
    top: 10%;
    padding: 10% 0%;
    height: 80%;
`;

const InnerDiv = styled.div`
    height: 100vh;
    background: transparent
        linear-gradient(0deg, #2b3c55 0%, #33435d 22%, #4a5876 58%, #6e789b 100%) 0% 0% no-repeat
        padding-box;
    width: 60px;
    position: fixed;
    left: 0;
    top: 0;
`;

const HeaderSection = styled.ul`
    position: absolute;
    // top: 5%;
    list-style-type: none;
    height: 10%;
    padding-inline-start: 0px;
    line-height: 200%;
`;

const MiddleSection = styled.ul`
    position: absolute;
    list-style-type: none;
    line-height: 200%;
    top: calc(40% - 100px);
    // height: 80%;
    padding-inline-start: 0px;
`;

const FooterSection = styled.ul`
    // height: 10%;
    list-style-type: none;
    position: absolute;
    bottom: 0%;
    padding-inline-start: 0px;
    line-height: 200%;
`;

const Sidenav = styled.div`
    background-color: red;
    width: 100px;
`;

function SideNavComponent(props) {
    let menus = MenusConfigurations;

    return (
        <>
            <InnerDiv>
                <HeaderSection>
                    {menus.headerMenuItems.map((item: any, index) => {
                        let active = index === 0 ? ' active' : '';
                        return <NavItemComponent item={item} active={active} key={index} />;
                    })}
                </HeaderSection>

                <MiddleSection>
                    {menus.middleMenuItems.map((item: any, index) => {
                        let active = index === 0 ? ' active' : '';

                        return <NavItemComponent item={item} active={active} key={index} />;
                    })}
                </MiddleSection>

                <FooterSection>
                    {menus.footerMenuItems.map((item: any, index) => {
                        let active = index === 0 ? ' active' : '';

                        return <NavItemComponent item={item} active={active} key={index} />;
                    })}
                </FooterSection>
            </InnerDiv>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(SideNavComponent);
