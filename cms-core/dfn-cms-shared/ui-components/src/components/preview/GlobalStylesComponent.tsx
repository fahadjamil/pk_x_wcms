import React from 'react';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

    body,
    body.theme2,
    body.theme2 *{
        font-family: 'Tajawal', sans-serif !important;
    }

    #___gatsby {
    width: 100%;
    overflow-x: hidden;
    }

    .footer__container{
            margin-bottom: -50px !important;
            color: #FFF;
            background: #3a4347;
            &.jumbotron{
                margin:0;
                background: #435058;
                a{
                    text-decoration: none;
                    color: #FFF !important;
                    font-size: 0.8rem;
                    line-height: 1.5rem;
                }
                h6.title{
                    color: #c6974b;
                }
            }
            > .container > .row > .col-lg > ul {
            max-height: 18rem;
            overflow: hidden;
            transition: all 0.5s;
                &::-webkit-scrollbar-track
                {
                  border-radius: 4px;
                  background-color: #505d65;
                }

                &::-webkit-scrollbar
                {
                  width: 4px;
                  background-color: #c6974b;
                }

                &::-webkit-scrollbar-thumb
                {
                  border-radius: 4px;
                  background-color: #c6974b;
                }
            }

            > .container > .row > .col-lg > ul:hover {
                overflow: auto;
            }
            > .footer__nav{
                width: 100%;
                background: rgb(0 0 0 / 15%);
                height: 4rem;
                position: relative;
                bottom: -4rem;
                line-height: 4rem;
                color: rgba(255,255,255,0.75);
                font-size: 1rem;
            }
    }

    .menu__dropdown ul {
        margin-bottom: 0.5rem;
        padding-bottom: 0rem !important;
    }

    .footer_container_edit_mode{
        margin-bottom: 10px !important;
    }

    .navbar_edit_mode{
        margin-bottom: 35px !important;
    }

    .navbar{
        padding: 0.5rem;
        .navbar-nav{

            .nav-item{
                font-size: 0.9rem;
            }
        }

        .navbar-brand{
            z-index: 99;
            padding: 0px;
            display: flex;
            > img{
                position: relative;
                height:104px;
                }
            }
        }
        .navbar-brand{
            > .primary-logo{
            display:block ;
            }
        }
        .navbar-brand{
            > .secondary-logo{
            display:none;
            padding: 0.5rem;
            }
        }
    }

    .home__nav{
        .navbar{
            .navbar-brand{
                > .primary-logo{
                height:104px;
                }
            }
        }
    }

    .otc-page{
        .navbar{
            .navbar-brand{
                > .secondary-logo{
                display:block;
                }
            }
        }
    }

    #mainMenuNavBarToggle{
        position: relative;
        width: 100%;
        padding: 0.5rem 0;
        > .navbar-nav{
            > .nav-item{
                > a{
                    font-weight:500;
                    font-size:1rem;
                }
            }
            > .nav-item.dropdown.has-megamenu.show > a{
                color: #c6974b !important;
            }
        }
    }

    .market-watch-header #mainMenuNavBarToggle .navbar-nav{
        display: none;
    }


    .row .col-md-8 section .row .col-md .container .tab-content a{
        background: #888;
    }


    *:focus {
        outline: none;
    }

    section figure.table,
    section table.table{
        border-radius: 5px;
        overflow: hidden;
        width: 100% !important;
    }

    section figure.table th,
    section table.table th {
        color: white !important;
        background-color: #c4954a !important;
        border: none;
    }

    .data-table table td {
        padding: 0.375rem !important;
    }

    .data-table table th {
        padding: 0.375rem !important;
    }

    td.sum {
        background: #e5e6e6 !important;
        font-weight: 600;
    }

    section figure.table tr:nth-child(odd) td{background-color: #FFF;}
    section table.table tr:nth-child(odd) td{background-color: #FFF;}
    section figure.table tr:nth-child(even) td{background-color: #f2f2f2;}
    section table.table tr:nth-child(even) td{background-color: #f2f2f2;}

    section table.table  tr.lastRowColored td{
        background-color: #c5964a;
        color: white;
        font-weight: 700;
    }

    section figure.table td, .table th,
    section table.table td, .table th {
        padding: .75rem;
        vertical-align: top;
        border: none;
    }

    section figure.table td,
    section table.table td{
        > span{
            background: transparent;
            background-color: transparent;
        }
    }
    .navbar{ padding-top: 0; padding-bottom: 0; }
    .navbar .has-megamenu{position:static;}
    .navbar .megamenu{
        left:0; right:0; top:50px; width:100%; padding:2rem;
        max-width: 1140px;
        margin: auto;
        background: #f2f2f2;
        }
    .navbar .nav-link{ padding-top:1rem; padding-bottom:1rem;  }


    figure.image {
        text-align: center;
    }

    table{
        width:100%;
    }

    h1 {
        color: #4B4C4D;
        font-size: 2.25rem;
        font-weight: 600;
        margin-top: 0;

    }

    h2 {
        color: ${({ theme }: any) => theme.properties.h2[0].value};

        > span{
            font-weight: 600;
            font-size: 1.25rem;
            color: #4b4c4d !important; /* [rmv] Remove after theme config fix */
        }
        > span:after{
            content: '';
            width: 2rem;
            height: 0.25rem;
            background: #d6a34a;
            display: block;
            border-radius: 1rem;

        }
    }

    #mainMenuNavBarToggle{
        > .navbar-nav{
            float:left;
            > .nav-item{
                >   .megamenu > .row > .col-md:last-child:not(:only-child):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)):not(:nth-child(9)) {
                    margin: -2rem -1rem;
                    padding: 2rem;
                    background: #435058;
                    color: #fff;
                }

            }
            > .nav-item:last-child{
                >   .nav-link{
                    background: #133a5b;
                    padding: 0.407rem 1rem;
                    top: 11px;
                    position: relative;
                    color: #fff !important;
                    font-size: 0.9rem;
                    border-radius: 0.25rem;
                    font-weight: 400;
                }
                >   .megamenu > .row > .col-md:last-child:not(:only-child):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)):not(:nth-child(9)) {
                    background: #133a5b;
                }
            }
        }
    }

    h3 {
        color: ${({ theme }: any) => theme.properties.h3[0].value};
        font-size: ${({ theme }: any) => theme.properties.h3[1].value};
    }

    h4 {

        > span{
            font-weight: 600;
            font-size: 1.25rem;
            color: #4b4c4d !important; /* [rmv] Remove after theme config fix */
        }
    }

    p {
        color: ${({ theme }: any) => theme.properties.paragraph[0].value};
        font-size:${({ theme }: any) => theme.properties.paragraph[1].value}px ;
    }
        child(2n)
    a {
        color: ${({ theme }: any) => theme.properties.link[0].value};
    }



    .scrollbar__thm__01::-webkit-scrollbar-track
    {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
      background-color: #F5F5F5;
    }

    .scrollbar__thm__01::-webkit-scrollbar
    {
      width: 12px;
      background-color: #F5F5F5;
    }

    .scrollbar__thm__01::-webkit-scrollbar-thumb
    {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: #555;
    }

    .scrollbar__thm__02::-webkit-scrollbar-track
    {
      border-radius: 10px;
      background-color: #F5F5F5;
    }

    .scrollbar__thm__02::-webkit-scrollbar
    {
      width: 12px;
      background-color: #F5F5F5;
    }

    .scrollbar__thm__02::-webkit-scrollbar-thumb
    {
      border-radius: 10px;
      background-color: #D62929;
    }

    .scrollbar__thm__03::-webkit-scrollbar-track
    {
      background-color: #6e789b;
    }

    .scrollbar__thm__03::-webkit-scrollbar
    {
      width: 6px;
      background-color: #7a849b;
    }

    .scrollbar__thm__03::-webkit-scrollbar-thumb
    {
      background-color: #8390bb;
    }

    .dropdown-toggle:after{
        opacity: 0;
        transition: opacity 0.5s;
    }

    .dropdown-toggle:hover:after{
        opacity: 0.5;
    }
    .rtl #mainMenuNavBarToggle, [dir=rtl] #mainMenuNavBarToggle{ padding-right: 2rem};

    .nav-item:hover .dropdown-menu{
        display:block;
    }

    .dropdown-menu.megamenu a{
        transition: color 0.2s;
    }

    .dropdown-menu.megamenu a:hover {
        color: #c5944b !important;
    }

    .mainMenuDropDownStyle {
        background: #eee;
        padding: 2rem;
        color: #4b4c4d;
        border: none;
        background-color: white;

        > .row {
            > .col-md {
                min-width: 25%;
                margin-bottom: 1rem;
                &:nth-child(5),
                &:nth-child(6),
                &:nth-child(7),
                &:nth-child(8),
                &:nth-child(9),
                &:nth-child(10) {
                    max-width: 25%;
                }

                > h6 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    &:after {
                        width: 1.5rem;
                        height: 0.2rem;
                        position: relative;
                        content: '';
                        display: block;
                        background: #c7954a;
                        z-index: 0;
                        border-radius: 1px;
                    }
                }

                > ul {
                    padding-bottom: 0.5rem;
                    > li {
                        > a {
                            color: #4b4c4d;
                        }
                    }
                }

                &:last-child:not(:only-child):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)):not(:nth-child(9)) {
                    margin: -2rem -1rem;
                    padding: 2rem;
                    background: #435058;
                    color: #fff;
                    > ul {
                        > li {
                            > a {
                                color: #ffffffa3;
                            }
                        }
                    }
                }
            }
        }
    }

    .page__contet__parent .home__hero{
        margin-top: -4.1rem;
    }

    .page__contet__parent{
        padding-top: 4rem;
    }

    .otc-page h1 {
        color: #133a5b !important;
    }

    .otc-page section figure.table th,
    .otc-page section table.table th {
        background-color: #133a5b !important;
    }

    a {
        color: #4B4C4D
    }
    a:hover {
        color: #C6974B
    }

    section figure.table {
        overflow-x: auto !important;
    }

    section figure.image img {
        max-width: 100% !important;
        height: auto !important;
    }

    .nav-tabs .nav-item.show .nav-link,
    .nav-tabs .nav-link.active {
        color: #c6974b !important;
        font-weight: 600 !important;
    }

    .otc-logo-container{
        position: absolute;
        z-index: 1;
        right: 0;
        top: 5.5rem;
        display: none;
    }

    .otc-page .otc-logo-container{
        display: block !important;
    }


    .otc-logo-container .secondary-logo{
        height: 80px;
    }
     .nav-float {
        width: 100%;
        position: relative;
     }

     .nav-float .navbar-nav{
        width: 100%;
        height: 3.5rem;
     }

     .header__utility, .nav-float {
        margin-top: -36px;
     }

    .gray-bg{
        background: #f5f5f5 !important;
    }

    .table .section-sum td {
        background-color: #F9F3E9 !important;
    }

    .table .section-sum td u{
        text-decoration: none;
        font-weight: 600
    }

    .table .section-title td {
        background-color: #FFF !important;
        padding-top: 2rem !important;
    }

    .table .section-title td strong{
        color:#c6974b;
    }

    .table td.sector-sum{
        background-color: #8e8e8e !important;
    }
    .table td.market-sum{
        background-color: #757171 !important;
    }
    .table td.status-sum{
        background-color: #333f4f !important;
    }
    .table .dash {
        color: transparent;
    }

`;
