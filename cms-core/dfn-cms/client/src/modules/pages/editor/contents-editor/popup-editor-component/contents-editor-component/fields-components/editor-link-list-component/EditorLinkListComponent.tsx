import React, { useEffect, useState } from 'react';
import FieldComponetModel from '../../models/FieldComponentModel';

function EditorLinkListComponent(props: FieldComponetModel) {
    const [linkList, setLinkList] = useState([{}]);
    const [linkCount, setLinkCount] = useState(0);
    const [sectionUpdated, setSectionUpdated] = useState(false);

    // const dropSections = sections.slice(1);

    useEffect(() => {
        if (props.initialValue) {
            props.onValueChange(
                { [props.dataKey]: props.initialValue[props.language.langKey] },
                props.language.langKey
            );

            if (props.initialValue[props.language.langKey]) {
                setLinkList(props.initialValue[props.language.langKey]);
            } else if (!sectionUpdated) {
                setLinkList([{}]);
            }
        }
    }, [props.initialValue]);

    useEffect(() => {
        setSectionUpdated(false);
    }, [sectionUpdated]);

    const handleValueChange = (event: any, index: number, parameter: string) => {
        // console.log('tabs array handleValue' + JSON.stringify(tabs));
        linkList[index][parameter] = event.target.value;
        setLinkList(linkList);
        props.onValueChange({ [props.dataKey]: linkList }, props.language.langKey);
    };

    function handleNewLink() {
        let listItemNo = linkList.length + 1;
        let newObject = { caption: 'New Link - ' + listItemNo, link: '' };
        // console.log('tabs array in add new tab' + JSON.stringify(tabs));
        linkList.push(newObject);
        setLinkList(linkList);
        setLinkCount(linkList.length);
    }

    function deleteLinkSection(index: number) {
        linkList.splice(index, 1);
        setLinkList(linkList);
        props.onValueChange({ [props.dataKey]: linkList }, props.language.langKey);
        setLinkCount(linkList.length);
    }

    function getComponentID() {
        return 'linkListComponent' + props.language.langKey + props.componentKey;
    }

    return (
        <>
            <div className="form-group">
                <label htmlFor={getComponentID()}>Link List - {props.language.language}</label>
                {linkList &&
                    linkList.map((item: any, index) => {
                        let active = index === 0 ? ' active' : '';
                        return (
                            <React.Fragment key={props.dataKey + '-' + index}>
                                {' '}
                                <div className="row">
                                    <div className="col-6">
                                        Link Name :{' '}
                                        <input
                                            key={getComponentID() + '-' + item.caption}
                                            name={props.dataKey}
                                            defaultValue={item.caption}
                                            onChange={(e) => handleValueChange(e, index, 'caption')}
                                            className="form-control"
                                            id={getComponentID() + '-' + item.caption}
                                        />
                                    </div>
                                    <div className="col-5">
                                        <div className="form-group">
                                            <label htmlFor="inputState">Link : </label>
                                            <input
                                                key={getComponentID() + '-' + item.link}
                                                name={props.dataKey}
                                                defaultValue={item.link}
                                                onChange={(e) =>
                                                    handleValueChange(e, index, 'link')
                                                }
                                                className="form-control"
                                                id={getComponentID() + '-' + item.link}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-1">
                                        <label htmlFor="hiddenButton"></label>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteLinkSection(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <br />
                            </React.Fragment>
                        );
                    })}
                <br />
                <button className="btn btn-primary" onClick={handleNewLink}>
                    Add Link Item
                </button>
            </div>
        </>
    );
}

export default EditorLinkListComponent;
