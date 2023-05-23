import React from 'react';

function EmptyInnerColumnGeneratorComponent(props: any) {
    return (
        <>
            <div className={props.colClass}>
                <div
                    style={{
                        border: '2px dashed #d5dadf',
                        backgroundColor: 'hsla(0,0%,100%,.5)',
                        textAlign: 'center',
                        margin: '10px 0',
                        padding: '10px 0',
                        flexGrow: 1,
                        boxSizing: 'border-box',
                        position: 'relative',
                    }}
                >
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                            props.onComponentClick(props.activeColumn, props.activeInnerColumn);
                        }}
                    >
                        Add New Component
                    </button>
                </div>
            </div>
        </>
    );
}

export default EmptyInnerColumnGeneratorComponent;
