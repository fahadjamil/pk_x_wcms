import React from 'react';
import styled from 'styled-components';
import LightboxCloseIcon from '../../../resources/LightboxCloseIcon';
import LightboxLeftArrow from '../../../resources/LightboxLeftArrow';
import LightboxRightArrow from '../../../resources/LightboxRightArrow';

const Container = styled.div`
    -webkit-box-align: center;
    -webkit-box-pack: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    box-sizing: border-box;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 2001;
    background: rgba(0, 0, 0, 0.8);
`;

const Content = styled.div`
    position: relative !important;
    box-sizing: border-box;
    margin-bottom: 0px;
    max-width: 1024px;
`;
const Header = styled.div`
    -webkit-box-pack: justify;
    display: flex;
    justify-content: space-between;
    height: 40px;
    box-sizing: border-box;
`;

const Close = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    position: relative;
    top: 0px;
    vertical-align: bottom;
    z-index: 1;
    height: 40px;
    margin-right: -10px;
    padding: 10px;
    width: 40px;
    fill: white;
`;

const Footer = styled.div`
    -moz-box-sizing: border-box;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    -webkit-box-pack: justify;
    box-sizing: border-box;
    color: white;
    cursor: auto;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    left: 0px;
    line-height: 1.3;
    padding-bottom: 5px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 5px;
    height: 40px;
`;

const Figcaption = styled.figcaption`
    -webkit-flex: 1 1 0;
    -ms-flex: 1 1 0;
    flex: 1 1 0;
    display: block;
`;
const FooterCount = styled.div`
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.85em;
    padding-left: 1em;
    box-sizing: border-box;
`;

const PreviousItem = styled.button`
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    padding: 10px;
    position: absolute;
    top: 50%;
    user-select: none;
    fill: white;
    height: 120px;
    left: 10px;
    margin-top: -60px;
    width: 40px;
    cursor: pointer;
`;
const NextItem = styled.button`
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    padding: 10px;
    position: absolute;
    top: 50%;
    user-select: none;
    fill: white;
    height: 120px;
    right: 10px;
    margin-top: -60px;
    width: 40px;
    cursor: pointer;
`;

function LightBoxModal(props) {
    const {
        children,
        figCaption,
        footerCounter,
        isFirstItem,
        isLastItem,
        loadNextItem,
        loadPreviousItem,
    } = props;

    return (
        <div>
            <div>
                <Container id="lightboxBackdrop">
                    <div>
                        <Content>
                            <Header>
                                <span></span>
                                <Close
                                    type="button"
                                    title="Close (Esc)"
                                    onClick={props.handleClose}
                                >
                                    <span>
                                        <LightboxCloseIcon />
                                    </span>
                                </Close>
                            </Header>
                            {children}
                            <Footer>
                                <Figcaption>{figCaption}</Figcaption>
                                <FooterCount>{footerCounter}</FooterCount>
                            </Footer>
                        </Content>
                        {!isFirstItem && (
                            <PreviousItem
                                type="button"
                                title="Previous (Left arrow key)"
                                onClick={loadPreviousItem}
                            >
                                <span>
                                    <LightboxLeftArrow />
                                </span>
                            </PreviousItem>
                        )}
                        {!isLastItem && (
                            <NextItem
                                type="button"
                                title="Next (Right arrow key)"
                                onClick={loadNextItem}
                            >
                                <span>
                                    <LightboxRightArrow />
                                </span>
                            </NextItem>
                        )}
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default LightBoxModal;
