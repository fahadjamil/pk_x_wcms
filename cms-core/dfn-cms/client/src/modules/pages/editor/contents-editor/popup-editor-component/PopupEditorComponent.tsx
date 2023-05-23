import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import LanguageModel from '../../../../shared/models/LanguageModel';
import SectionModel from '../../../../shared/models/page-data-models/SectionModel';
import BaseComponentModel from '../models/BaseComponentModel';
import EditorComponent from './contents-editor-component';
import EditorSettingsComponent from './settings-editor-component';
import EditorStyleComponent from './styles-editor-component';

interface PopupComponentModel {
    dbName: string;
    baseComponentData: BaseComponentModel;
    siteLanguageData: LanguageModel[];
    onClosePopup: any;
    onSubmitHandle: any;
    show: boolean;
    sections: SectionModel[];
    theme: any;
}

function PopupEditorComponent(props: PopupComponentModel) {
    const editorComponentRef: any = useRef();
    const styleEditorComponentRef: any = useRef();
    const settingsEditorComponentRef: any = useRef();

    // TODO - Define initial data model for componentSettings
    const [componentSettings, setComponentSettings] = useState<any>({});

    useEffect(() => {
        let isMounted: boolean = true;

        if (
            isMounted &&
            props.baseComponentData.initialSettingConfigKey &&
            props.baseComponentData.compFields &&
            props.baseComponentData.compFields.length !== 0
        ) {
            setComponentSettings(props.baseComponentData.compFields[0].initialSettingConfigs);
        }

        return () => {
            isMounted = false;
            setComponentSettings({});
        };
    }, [props.baseComponentData, props.dbName]);

    const getData = () => {
        const editorStyleData =
            styleEditorComponentRef?.current?.onSubmitClicked &&
            styleEditorComponentRef?.current?.onSubmitClicked();
        const editorContentData =
            editorComponentRef?.current?.onSubmitClicked &&
            editorComponentRef?.current?.onSubmitClicked();

        let editorSettingsData = undefined;
        // Get editor settings if settings configurations view not avilable
        if (
            settingsEditorComponentRef &&
            props.baseComponentData.settings &&
            props.baseComponentData.settings.length > 0
        ) {
            editorSettingsData =
                settingsEditorComponentRef?.current?.onSubmitClicked &&
                settingsEditorComponentRef?.current?.onSubmitClicked();
        } else {
            editorSettingsData = componentSettings;
        }

        const finalData = {
            editorContentData,
            editorStyleData,
            editorSettingsData,
        };

        return finalData;
    };

    return (
        <>
            <Modal
                show={props.show}
                onHide={props.onClosePopup}
                size="xl"
                autoFocus={false}
                enforceFocus={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Page Content Editor</Modal.Title>
                </Modal.Header>
                {((props.baseComponentData && props.baseComponentData.compFields?.length > 0) ||
                    (props.baseComponentData && props.baseComponentData.settings?.length > 0)) && (
                    <Modal.Body>
                        <ul className="nav nav-tabs" id="pageEditorTab" role="tablist">
                            {props.baseComponentData.compFields?.length > 0 && (
                                <li className="nav-item">
                                    <a
                                        className={
                                            'nav-link' +
                                            (props.baseComponentData.compFields?.length > 0
                                                ? ' active'
                                                : '')
                                        }
                                        id="content-tab"
                                        data-toggle="tab"
                                        href="#content"
                                        role="tab"
                                        aria-controls="content"
                                        aria-selected="true"
                                    >
                                        Content
                                    </a>
                                </li>
                            )}
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    id="styles-tab"
                                    data-toggle="tab"
                                    href="#styles"
                                    role="tab"
                                    aria-controls="styles"
                                    aria-selected="false"
                                >
                                    Styles
                                </a>
                            </li>
                            {props.baseComponentData.settings?.length > 0 && (
                                <li className="nav-item">
                                    <a
                                        className={
                                            'nav-link' +
                                            (props.baseComponentData.compFields?.length === 0 &&
                                            props.baseComponentData.settings?.length > 0
                                                ? ' active'
                                                : '')
                                        }
                                        id="settings-tab"
                                        data-toggle="tab"
                                        href="#settings"
                                        role="tab"
                                        aria-controls="settings"
                                        aria-selected="false"
                                    >
                                        Settings
                                    </a>
                                </li>
                            )}
                        </ul>

                        <div className="tab-content" id="pageEditorTabContent">
                            {props.baseComponentData.compFields?.length > 0 && (
                                <div
                                    className={
                                        'tab-pane fade' +
                                        (props.baseComponentData.compFields?.length > 0
                                            ? ' show active'
                                            : '')
                                    }
                                    id="content"
                                    role="tabpanel"
                                    aria-labelledby="content-tab"
                                >
                                    <EditorComponent
                                        ref={editorComponentRef}
                                        baseComponentData={props.baseComponentData}
                                        dbName={props.dbName}
                                        languageData={props.siteLanguageData}
                                        componentSettings={componentSettings}
                                        setComponentSettings={setComponentSettings}
                                        sections={props.sections}
                                    />
                                </div>
                            )}
                            <div
                                className="tab-pane fade"
                                id="styles"
                                role="tabpanel"
                                aria-labelledby="styles-tab"
                            >
                                <EditorStyleComponent
                                    ref={styleEditorComponentRef}
                                    theme={props.theme}
                                    baseComponentData={props.baseComponentData}
                                />
                            </div>
                            {props.baseComponentData.settings?.length > 0 && (
                                <div
                                    className={
                                        'tab-pane fade' +
                                        (props.baseComponentData.compFields?.length === 0 &&
                                        props.baseComponentData.settings?.length > 0
                                            ? ' show active'
                                            : '')
                                    }
                                    id="settings"
                                    role="tabpanel"
                                    aria-labelledby="settings-tab"
                                >
                                    <EditorSettingsComponent
                                        ref={settingsEditorComponentRef}
                                        baseComponentData={props.baseComponentData}
                                        dbName={props.dbName}
                                        componentSettings={componentSettings}
                                        setComponentSettings={setComponentSettings}
                                        theme={props.theme}
                                    />
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                )}
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            props.onClosePopup && props.onClosePopup();
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            props.onSubmitHandle && props.onSubmitHandle(getData());
                        }}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PopupEditorComponent;
