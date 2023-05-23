import React from 'react'

interface ButtonPropTypeModel {
    text: string;
    handleClick: any;
}

function ButtonComponent(props: ButtonPropTypeModel) {
    const { text } = props;

    const handleClick = () => {
        props.handleClick();
    }

    return (
        <>
            <button className="btn btn-block btn-sm btn-outline-success" onClick={handleClick}>{text}</button>
        </>
    )
}

export default ButtonComponent
