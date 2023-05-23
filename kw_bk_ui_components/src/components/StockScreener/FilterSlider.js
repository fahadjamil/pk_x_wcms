import React, { memo } from 'react';
import Slider from 'antd/es/slider';
import Switch from 'antd/es/switch';
import Tooltip from 'antd/es/tooltip';
import styled from 'styled-components';
import { useUserAgent } from '../../customHooks/useUserAgent';

const MainWrapper = styled.div`
    ${(props) =>
        props.isMobile ? '  width: 80%; margin: 10px 10%;' : 'width: 20%; margin: 10px 2.5%;'}
`;

const SliderWrapper = styled.div`
    text-align: center;
    width: 100%;
`;

const SwitchWrapper = styled.div`
    float: ${(props) => props.float};
`;
const StyledInput = styled.input`
    border-top-style: hidden;
    border-right-style: hidden;
    border-left-style: hidden;
    border-bottom-style: hidden;
    width: 80px;
    text-align: center;
    background-color: #ffffff;
`;

const InputWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    direction: ltr;
`;

const InfoSymbol = styled.span`
    color: #bfbfbf;
`;
export const FilterSlider = memo((props) => {
    const isMobile = useUserAgent();
    const name = props.name;
    const lang = props.lang;
    const tooltip = props.tooltip;
    const disable = !props.active;

    const min = props.rangeMin;
    const max = props.rangeMax;

    const filterID = props.filterID;
    const handleChange = props.handleChange;
    const selectedMin = props.selectedMin;
    const selectedMax = props.selectedMax;
    const setDisabled = props.setDisabled;

    const isWithinRange = (value) => value && value <= max && value >= min;
    const validateMin = (minValue) => isWithinRange(minValue) && minValue < selectedMax;
    const validateMax = (maxValue) => isWithinRange(maxValue) && maxValue > selectedMin;
    const updateMin = (newValue) =>
        newValue == '' || validateMin(newValue)
            ? handleChange(filterID, [newValue, selectedMax])
            : undefined;
    const updateMax = (newValue) =>
        newValue == '' || validateMax(newValue)
            ? handleChange(filterID, [selectedMin, newValue])
            : undefined;

    return (
        <MainWrapper isMobile={isMobile}>
            <Tooltip title={tooltip} placement="bottom">
                <span>
                    {name} <InfoSymbol>ⓘ</InfoSymbol>
                </span>
            </Tooltip>
            <SwitchWrapper float={lang.langKey == 'AR' ? 'left' : 'right'}>
                <Switch size="small" checked={!disable} onChange={() => setDisabled(filterID)} />
            </SwitchWrapper>
            <InputWrapper>
                <StyledInput
                    type="number"
                    placeholder={disable ? min : ''}
                    value={!disable ? selectedMin : ''}
                    onChange={(event) => updateMin(event.target.value)}
                    disabled={disable}
                ></StyledInput>
                <StyledInput
                    type="number"
                    placeholder={disable ? max : ''}
                    value={!disable ? selectedMax : ''}
                    onChange={(event) => updateMax(event.target.value)}
                    disabled={disable}
                ></StyledInput>
            </InputWrapper>
            <SliderWrapper>
                <Slider
                    range
                    value={[selectedMin || min, selectedMax || max]}
                    min={min}
                    max={max}
                    disabled={disable}
                    step={0.01}
                    onChange={(newVal) => handleChange(filterID, newVal)}
                />
            </SliderWrapper>
        </MainWrapper>
    );
});
