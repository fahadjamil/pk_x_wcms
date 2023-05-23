import React from 'react';
import styled from 'styled-components';

function GoogleRecaptchaPlaceholderComponent() {
    return (
        <RcAnchorNormalLight id="rc-anchor-container">
            <RcAnchorContent>
                <RcInlineBlock>
                    <RcAnchorCenterContainer>
                        <RcAnchorCenterItemCheckboxHolder>
                            <RcCheckboxUnchecked tabindex="0" dir="ltr">
                                <RcCheckboxBorder></RcCheckboxBorder>
                            </RcCheckboxUnchecked>
                        </RcAnchorCenterItemCheckboxHolder>
                    </RcAnchorCenterContainer>
                </RcInlineBlock>
                <RcInlineBlock>
                    <RcAnchorCenterContainer>
                        <RcAnchorCheckLabel>
                            <span></span>
                            I'm not a robot
                        </RcAnchorCheckLabel>
                    </RcAnchorCenterContainer>
                </RcInlineBlock>
            </RcAnchorContent>
            <RcAnchorNormalFooter>
                <RcAnchorLogoPortrait>
                    <RcAnchorLogoImgPortrait></RcAnchorLogoImgPortrait>
                    <RcAnchorLogoText>reCAPTCHA</RcAnchorLogoText>
                </RcAnchorLogoPortrait>
                {/* <RcAnchorPt>
                    <RcAnchorPtLink>Privacy</RcAnchorPtLink>
                    <span> - </span>
                    <RcAnchorPtLink>Terms</RcAnchorPtLink>
                </RcAnchorPt> */}
            </RcAnchorNormalFooter>
        </RcAnchorNormalLight>
    );
}

export default GoogleRecaptchaPlaceholderComponent;

const RcAnchorNormalLight = styled.div`
    border: 1px solid #d3d3d3;
    background: #f9f9f9;
    color: #000;
    height: 85px;
    width: 300px;
    border-radius: 3px;
    -webkit-box-shadow: 0 0 4px 1px rgb(0 0 0 / 8%);
`;
const RcAnchorContent = styled.div`
    height: 85px;
    width: 206px;
    display: inline-block;
    position: relative;
`;
const RcInlineBlock = styled.div`
    display: inline-block;
    height: 100%;
`;
const RcAnchorCenterContainer = styled.div`
    display: table;
    height: 100%;
`;
const RcAnchorCenterItemCheckboxHolder = styled.div`
    display: table-cell;
    vertical-align: middle;
`;
const RcCheckboxUnchecked = styled.span`
    margin: 0 12px 2px 12px;
    border: none;
    font-size: 1px;
    height: 28px;
    width: 28px;
    overflow: visible;
    outline: 0;
    vertical-align: text-bottom;
    position: relative;
    display: -moz-inline-box;
    display: inline-block;
`;
const RcCheckboxBorder = styled.div`
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    background-color: #fff;
    border: 2px solid #c1c1c1;
    font-size: 1px;
    height: 24px;
    position: absolute;
    width: 24px;
    z-index: 1;
`;
const RcAnchorCheckLabel = styled.label`
    width: 152px;
    font-family: Roboto, helvetica, arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    display: table-cell;
    vertical-align: middle;
`;
const RcAnchorNormalFooter = styled.div`
    display: inline-block;
    height: 85px;
    vertical-align: top;
    width: 70px;
`;
const RcAnchorLogoPortrait = styled.div`
    margin: 10px 0 0 26px;
    width: 58px;
    -webkit-user-select: none;
`;
const RcAnchorLogoImgPortrait = styled.div`
    background-size: 32px;
    height: 48px;
    margin: 0 13px 0 5px;
    width: 48px;
    background: url(/recaptcha-logo.png);
    background-repeat: no-repeat;
`;
const RcAnchorLogoText = styled.div`
    color: #555;
    cursor: default;
    font-family: Roboto, helvetica, arial, sans-serif;
    font-size: 10px;
    font-weight: 400;
    line-height: 10px;
    margin-top: 5px;
    text-align: center;
`;
const RcAnchorPt = styled.div`
    margin: 2px 11px 0 0;
    padding-right: 2px;
    position: absolute;
    left: 20px;
    text-align: right;
    width: 276px;
    font-family: Roboto, helvetica, arial, sans-serif;
    font-size: 8px;
    font-weight: 400;
`;
const RcAnchorPtLink = styled.span`
    color: #555;
    display: inline;
    padding-left: 1px;
    padding-right: 1px;
    padding-top: 2px;
    padding-bottom: 2px;
    text-decoration: none;
`;
