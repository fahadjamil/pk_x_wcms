import React from 'react';
import ButtonComponent from './ButtonComponent';

interface ButtonContainerPropType {
    labelName: string;
    firstParam?: number;
    handleClick: any;
}

function ButtonContainerComponent(props: ButtonContainerPropType) {
    const { labelName, firstParam } = props;
    const paramsList: any[] = [];
    paramsList.push(firstParam);

    const handleClick = () => {
        // Dynamically apply function parameters
        props.handleClick.apply(null, paramsList);
    };

    return (
        <>
            <div className="form-group">
                <ButtonComponent text={labelName} handleClick={handleClick} />
            </div>
        </>
    );
}

export default ButtonContainerComponent;
