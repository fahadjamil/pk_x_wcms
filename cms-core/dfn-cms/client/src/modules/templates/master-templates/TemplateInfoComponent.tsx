import React, { forwardRef, useState, useImperativeHandle } from 'react';

interface TemplateInfoComponentModel {
    currentTemplate: any;
}

const TemplateInfoComponent = forwardRef((props: TemplateInfoComponentModel, ref) => {
    const initialTemplateState = {
        title: '',
    };
    const activeTemplateMasterInfo = initialTemplateState;
    activeTemplateMasterInfo.title = props?.currentTemplate?.template?.title;

    const [templateMetaInfo, setTemplateMetaInfo] = useState<any>(activeTemplateMasterInfo);

    useImperativeHandle(ref, () => ({
        handleTemplateInfoSubmit() {
            if (props.currentTemplate && props.currentTemplate.template) {
                return templateMetaInfo;
            }

            return undefined;
        },
    }));

    function handleTopLevelValueChanges(event) {
        event.preventDefault();
        const key: any = event.target.name;
        const value: any = event.target.value;

        setTemplateMetaInfo((preState) => {
            return { ...preState, [key]: value };
        });
    }

    return (
        <div className="col-md">
            <h3>Template Info</h3>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <div className="form-group">
                                <label htmlFor="templateTitle">Template Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="templateTitle"
                                    placeholder="Template Title"
                                    name="title"
                                    value={templateMetaInfo.title}
                                    onChange={(event) => {
                                        handleTopLevelValueChanges(event);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TemplateInfoComponent;
