import React from 'react';

function EmptyColumnGeneratorComponent(props: any) {
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
                    <div
                        className="btn-group-vertical btn-group-sm"
                        role="group"
                        aria-label="Basic example"
                    >
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                                props.onComponentClick(props.activeColumn, {});
                            }}
                        >
                            Add New Component
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => {
                                const innerSectionIndex = props.activeColumn.section.length;
                                props.openInnerSectionsList(props.activeColumn, innerSectionIndex);
                            }}
                        >
                            Add New Section
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmptyColumnGeneratorComponent;
