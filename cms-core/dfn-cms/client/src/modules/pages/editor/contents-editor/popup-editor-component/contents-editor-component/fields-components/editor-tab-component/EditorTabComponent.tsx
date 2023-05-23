import React, { useEffect, useState } from 'react';
import FieldComponetModel from '../../models/FieldComponentModel';

function EditorTabComponent(props: FieldComponetModel) {
    const [tabs, setTabs] = useState([{}]);
    const [tabCount, setTabCount] = useState(0);
    const [sectionUpdated, setSectionUpdated] = useState(false);

    const sections: any = props.sections;
    const allSections: any = [];

    for (let i = 0; i < sections.length; i++) {
        let sectionObj = { column: '', name: 'Section', id: sections[i].sectionId, index: i + 1 };
        allSections.push(sectionObj);
        for (let j = 0; j < sections[i].columns.length; j++) {
            for (let k = 0; k < sections[i].columns[j].section.length; k++) {
                if (sections[i].columns[j].section[k]) {
                    let colIndex = j + 1;
                    let sectionObj = {
                        column: 'Column - ' + colIndex + ' - ',
                        name: 'Inner Section',
                        id: sections[i].columns[j].section[k]?.sectionId,
                        index: k + 1,
                    };
                    allSections.push(sectionObj);
                }
            }
        }
    }

    // const dropSections = sections.slice(1);

    useEffect(() => {
        if (props.initialValue) {
            props.onValueChange(
                { [props.dataKey]: props.initialValue[props.language.langKey] },
                props.language.langKey
            );

            if (props.initialValue[props.language.langKey]) {
                setTabs(props.initialValue[props.language.langKey]);
            } else if (!sectionUpdated) {
                setTabs([{}]);
            }
        }
    }, [props.initialValue]);

    useEffect(() => {
        setSectionUpdated(false);
    }, [sectionUpdated]);

    const handleValueChange = (event: any, index: number, parameter: string) => {
        tabs[index][parameter] = event.target.value;
        setTabs(tabs);
        props.onValueChange({ [props.dataKey]: tabs }, props.language.langKey);
    };

    function handleNewTab() {
        let tabNo = tabs.length + 1;
        let newObject = { caption: 'New Tab - ' + tabNo, sectionId: '' };
        // console.log('tabs array in add new tab' + JSON.stringify(tabs));
        tabs.push(newObject);
        setTabs(tabs);
        setTabCount(tabs.length);
    }

    function deleteTabSection(index: number) {
        tabs.splice(index, 1);
        setTabs(tabs);
        props.onValueChange({ [props.dataKey]: tabs }, props.language.langKey);
        setTabCount(tabs.length);
    }

    function getComponentID() {
        return 'tabComponent' + props.language.langKey + props.componentKey;
    }
    return (
        <>
            <div className="form-group">
                <label htmlFor={getComponentID()}>Tab - {props.language.language}</label>
                {tabs &&
                    tabs.map((item: any, index) => {
                        let active = index === 0 ? ' active' : '';
                        return (
                            <React.Fragment key={props.dataKey + '-' + index}>
                                {' '}
                                <div className="row">
                                    <div className="col-6">
                                        Tab Name :{' '}
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
                                            <label htmlFor="inputState">Section : </label>

                                            <select
                                                key={item.caption}
                                                id="inputState"
                                                className="form-control"
                                                value={item.sectionId}
                                                onChange={(e) => {
                                                    handleValueChange(e, index, 'sectionId');
                                                    setSectionUpdated(true);
                                                }}
                                            >
                                                <option value="-" key={0}>
                                                    -
                                                </option>
                                                {allSections.map((section: any, index) => {
                                                    return (
                                                        <option
                                                            value={section.id}
                                                            key={
                                                                section.id +
                                                                '-' +
                                                                section.name +
                                                                '-' +
                                                                section.index
                                                            }
                                                        >
                                                            {' '}
                                                            {section.column +
                                                                section.name +
                                                                ' - ' +
                                                                section.index}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-1">
                                        <label htmlFor="hiddenButton"></label>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteTabSection(index)}
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
                <button className="btn btn-primary" onClick={handleNewTab}>
                    Add Tab Item
                </button>
            </div>
        </>
    );
}

export default EditorTabComponent;
