import React from 'react';
import ToolsList from '../../util/toolsList';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './GlobalStylesComponent';
import EmptyColumnGeneratorComponent from './EmptyColumnGeneratorComponent';
import EmptyInnerColumnGeneratorComponent from './EmptyInnerColumnGeneratorComponent';
import { generatePreviewPageStyledComponent } from '../../util/PreviewPageUtil';
import PESectionEdit from '../../resources/PageEditor-Section-Edit';
import PESectionSettings from '../../resources/PageEditor-Section-Settings';
import PESectionDelete from '../../resources/PageEditor-Section-Delete';

const deviceSize = {
    extraSmall: '',
    small: 'sm',
    medium: 'md',
    large: 'lg',
    extraLarge: 'xl',
};

const hidden: any = {
    display: 'none',
};

const LayoutEditButton = (props: any) => {
    const {
        buttonText,
        sectionId,
        columnId,
        innerSectionId,
        innerColumnId,
        layoutName,
        layoutStyles,
        mainColumn,
        innerColumn,
        masterTemplatesSection,
        activeLayoutId,
    }: any = props;

    const layoutIds: any = {
        sectionId: sectionId,
        columnId: columnId,
        innerSectionId: innerSectionId,
        innerColumnId: innerColumnId,
        masterTemplatesSection: masterTemplatesSection,
    };

    return (
        <div className="page--section--edit">
            <span className="badge">{buttonText}</span>
            <span
                className="section--settings"
                onClick={(event) => {
                    props.onChangeSettings &&
                        props.onChangeSettings(
                            layoutName,
                            activeLayoutId,
                            layoutStyles,
                            masterTemplatesSection
                        );
                }}
            >
                <PESectionSettings width="20px" height="20px" />
            </span>
            {layoutName === 'innerColumn' && (
                <span
                    className="section--edit"
                    onClick={() => {
                        props.editLayout && props.editLayout(mainColumn, innerColumn);
                    }}
                >
                    <PESectionEdit width="20px" height="20px" />
                </span>
            )}
            {(layoutName === 'section' || layoutName === 'innerSection') && (
                <span
                    className="section--edit"
                    onClick={() => {
                        props.editLayout && props.editLayout(layoutName, activeLayoutId);
                    }}
                >
                    <PESectionEdit width="20px" height="20px" />
                </span>
            )}
            {layoutName !== 'column' && (
                <span
                    className="section--delete"
                    onClick={() => {
                        props.deleteLayout && props.deleteLayout(layoutIds, layoutName);
                    }}
                >
                    <PESectionDelete width="20px" height="20px" />
                </span>
            )}
        </div>
    );
};

const EmptyColumnItem = (props) => {
    const { mainColumn, equalColumns, device, editMode, layoutIndexes } = props;
    const { mainColumnIndex, mainSectionIndex } = layoutIndexes;

    if (equalColumns) {
        if (editMode) {
            const { columnId } = mainColumn;
            const colClass = `col-${deviceSize[device]}`;

            return (
                <EmptyColumnGeneratorComponent
                    key={`emptyEqualColumn${mainColumnIndex}${mainSectionIndex}`}
                    activeColumn={mainColumn}
                    colClass={colClass}
                    onComponentClick={props.openComponentList}
                    openInnerSectionsList={props.openInnerSectionsList}
                />
            );
        } else {
            return (
                <div
                    className={`col-${deviceSize[device]}`}
                    key={`emptyEqualDiv${mainColumnIndex}${mainSectionIndex}`}
                ></div>
            );
        }
    } else {
        const { columnSize, columnId } = mainColumn;

        if (editMode) {
            const { columnSize, columnId } = mainColumn;
            const colClass = `col-${deviceSize[device]}-${columnSize}`;

            return (
                <EmptyColumnGeneratorComponent
                    key={`emptyColumn${mainColumnIndex}${mainSectionIndex}`}
                    activeColumn={mainColumn}
                    colClass={colClass}
                    onComponentClick={props.openComponentList}
                    openInnerSectionsList={props.openInnerSectionsList}
                />
            );
        } else {
            return (
                <div
                    className={`col-${deviceSize[device]}-${columnSize}`}
                    key={`emptyDiv${mainColumnIndex}${mainSectionIndex}`}
                ></div>
            );
        }
    }
};

const EmptyInnerSectionItem = (props: any) => {
    const { mainColumn, innerSection } = props;
    const { equalColumns, device, sectionId } = innerSection;

    return <React.Fragment></React.Fragment>;
};

const EmptyInnerColumnItem = (props: any) => {
    const { innerColumn, equalColumns, device, mainColumn, editMode, innerColumnIndexes } = props;
    const { innerColumnIndex, innerSectionIndex, mainSectionIndex, mainColumnIndex } =
        innerColumnIndexes;

    const innerColumnCombineIndex = `${mainSectionIndex}${mainColumnIndex}${innerSectionIndex}${innerColumnIndex}`;

    if (equalColumns) {
        const { columnId } = innerColumn;
        const colClass = `col-${deviceSize[device]}`;

        if (editMode) {
            return (
                <EmptyInnerColumnGeneratorComponent
                    key={`equalEmptyInnerColumn${innerColumnCombineIndex}`}
                    activeInnerColumn={innerColumn}
                    activeColumn={mainColumn}
                    colClass={colClass}
                    onComponentClick={props.openComponentList}
                />
            );
        } else {
            return (
                <div
                    className={colClass}
                    key={`equalEmptyInnerDiv${innerColumnCombineIndex}`}
                ></div>
            );
        }
    } else {
        const { columnSize, columnId } = innerColumn;
        const colClass = `col-${deviceSize[device]}-${columnSize}`;

        if (editMode) {
            return (
                <EmptyInnerColumnGeneratorComponent
                    key={`emptyInnerColumn${innerColumnCombineIndex}`}
                    activeInnerColumn={innerColumn}
                    activeColumn={mainColumn}
                    colClass={colClass}
                    onComponentClick={props.openComponentList}
                />
            );
        } else {
            return <div className={colClass} key={`emptyInnerDiv${innerColumnCombineIndex}`}></div>;
        }
    }
};

const PreviewComponentItem = (props: any) => {
    const {
        mainSection,
        mainColumn,
        innerSection,
        innerColumn,
        columnId,
        ThemeProvider,
        PreviewComponent,
        previewComponentdata,
        columnStyles,
        editMode,
        theme,
        dbName,
        selectedLanguage,
        commonConfigs,
        componentIndex,
        masterTemplatesSection,
    } = props;

    return (
        <>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <PreviewComponent
                    data={previewComponentdata}
                    dbName={dbName}
                    editMode={editMode}
                    lang={selectedLanguage}
                    commonConfigs={commonConfigs}
                    componentIndex={componentIndex}
                />
            </ThemeProvider>
            {editMode && (
                <LayoutEditButton
                    onChangeSettings={props.openLayoutStylesList}
                    buttonText="Inner Column"
                    layoutName="innerColumn"
                    sectionId={mainSection?.sectionId}
                    columnId={mainColumn?.columnId}
                    innerSectionId={innerSection?.sectionId}
                    innerColumnId={innerColumn?.columnId}
                    layoutStyles={columnStyles}
                    deleteLayout={props.confirmeLayoutDelete}
                    editLayout={props.openComponentEditer}
                    mainColumn={mainColumn}
                    innerColumn={innerColumn}
                    activeLayoutId={innerColumn?.columnId}
                    masterTemplatesSection={masterTemplatesSection}
                />
            )}
        </>
    );
};

const InnerColumnItem = (props: any) => {
    const {
        mainSection,
        mainColumn,
        innerSection,
        innerColumn,
        equalColumns,
        device,
        themes,
        data,
        editMode,
        dbName,
        selectedLanguage,
        commonConfigs,
        innerColumnIndexes,
        masterTemplatesSection,
        isPreviewMode,
    } = props;

    const { mainSectionIndex, mainColumnIndex, innerSectionIndex, innerColumnIndex } =
        innerColumnIndexes;

    const componentCombineIndex = `${mainSectionIndex + 1}${mainColumnIndex + 1}${
        innerSectionIndex + 1
    }${innerColumnIndex + 1}`;

    const Div: any = generatePreviewPageStyledComponent('div', isPreviewMode);

    const styles = {
        border: '1px dashed #d5dadf',
        //margin: '5px',
        paddingTop: '35px',
        borderRadius: '4px',
        content: '01',
    };

    if (themes) {
        // default theme set to light theme
        const theme = themes[0];
        let PreviewComponent = ToolsList[innerColumn.compType];

        if (PreviewComponent) {
            let componentData = {};
            let previewComponentdata: any = undefined;

            for (let index = 0; index < data.length; index++) {
                const element: any = data[index];

                if (element.id == innerColumn.data) {
                    componentData = element;
                    break;
                }
            }

            if (componentData) {
                previewComponentdata = {
                    data: componentData,
                    styles: innerColumn.uiProperties,
                    settings: innerColumn.settings,
                };
            }

            if (equalColumns) {
                const { columnId, columnStyles } = innerColumn;
                const cssClass = columnStyles?.cssClass
                    ? columnStyles.cssClass.replace(/\r?\n|\r/g, ' ').replace(/,/g, ' ')
                    : '';

                return (
                    <Div
                        className={`${cssClass}`}
                        key={`equalPreview${componentCombineIndex}`}
                        style={editMode ? styles : {}}
                        styleProps={editMode ? {} : { ...columnStyles }}
                    >
                        <PreviewComponentItem
                            key={`preview-component-${columnId}-${innerColumnIndex}`}
                            mainSection={mainSection}
                            mainColumn={mainColumn}
                            innerSection={innerSection}
                            innerColumn={innerColumn}
                            columnId={columnId}
                            ThemeProvider={ThemeProvider}
                            PreviewComponent={PreviewComponent}
                            previewComponentdata={previewComponentdata}
                            columnStyles={columnStyles}
                            editMode={editMode}
                            theme={theme}
                            dbName={dbName}
                            masterTemplatesSection={masterTemplatesSection}
                            componentIndex={componentCombineIndex}
                            selectedLanguage={selectedLanguage}
                            commonConfigs={commonConfigs}
                            confirmeLayoutDelete={props.confirmeLayoutDelete}
                            openComponentList={props.openComponentList}
                            openLayoutStylesList={props.openLayoutStylesList}
                            openComponentEditer={props.openComponentEditer}
                        />
                        {/* {editMode && (
                            <LayoutEditButton
                                onChangeSettings={props.openLayoutStylesList}
                                buttonText="Inner Column"
                                layoutName="innerColumn"
                                sectionId={mainSection?.sectionId}
                                masterTemplatesSection={masterTemplatesSection}
                                layoutStyles={columnStyles}
                                activeLayoutId={columnId}
                                deleteLayout={props.confirmeLayoutDelete}
                            />
                        )} */}
                    </Div>
                );
            } else {
                const { columnSize, columnId, columnStyles } = innerColumn;
                const cssClass = columnStyles?.cssClass
                    ? columnStyles.cssClass.replace(/\r?\n|\r/g, ' ').replace(/,/g, ' ')
                    : '';

                return (
                    <Div
                        className={`${cssClass}`}
                        key={`preview${componentCombineIndex}`}
                        style={editMode ? styles : {}}
                        styleProps={editMode ? {} : { ...columnStyles }}
                    >
                        <PreviewComponentItem
                            key={`preview-component-${columnId}-${innerColumnIndex}`}
                            mainSection={mainSection}
                            mainColumn={mainColumn}
                            innerSection={innerSection}
                            innerColumn={innerColumn}
                            columnId={columnId}
                            ThemeProvider={ThemeProvider}
                            PreviewComponent={PreviewComponent}
                            previewComponentdata={previewComponentdata}
                            columnStyles={columnStyles}
                            editMode={editMode}
                            theme={theme}
                            dbName={dbName}
                            masterTemplatesSection={masterTemplatesSection}
                            componentIndex={componentCombineIndex}
                            selectedLanguage={selectedLanguage}
                            commonConfigs={commonConfigs}
                            confirmeLayoutDelete={props.confirmeLayoutDelete}
                            openComponentList={props.openComponentList}
                            openLayoutStylesList={props.openLayoutStylesList}
                            openComponentEditer={props.openComponentEditer}
                        />
                        {/* {editMode && (
                            <LayoutEditButton
                                onChangeSettings={props.openLayoutStylesList}
                                buttonText="Inner Column"
                                layoutName="innerColumn"
                                sectionId={mainSection?.sectionId}
                                masterTemplatesSection={masterTemplatesSection}
                                layoutStyles={columnStyles}
                                activeLayoutId={columnId}
                                deleteLayout={props.confirmeLayoutDelete}
                            />
                        )} */}
                    </Div>
                );
            }
        } else {
            return <React.Fragment key={`fragment-1-${componentCombineIndex}`}></React.Fragment>;
        }
    } else {
        return <React.Fragment key={`fragment-2-${componentCombineIndex}`}></React.Fragment>;
    }
};

const InnerSectionItem = (props: any) => {
    const {
        mainSection,
        mainColumn,
        innerSection,
        editMode,
        themes,
        data,
        dbName,
        selectedLanguage,
        commonConfigs,
        innerLayoutIndexes,
        masterTemplatesSection,
        isPreviewMode,
        tabSections,
    } = props;

    const { equalColumns, device, sectionId, sectionStyles } = innerSection;
    const Section: any = generatePreviewPageStyledComponent('section', isPreviewMode);
    const { innerSectionIndex, mainSectionIndex, mainColumnIndex } = innerLayoutIndexes;
    const cssClass = sectionStyles?.cssClass
        ? sectionStyles.cssClass.replace(/\r?\n|\r/g, ' ').replace(/,/g, ' ')
        : '';

    const styles: any = {
        border: '1px dashed #d5dadf',
        //margin: '5px',
        paddingTop: '25px',
        paddingLeft: '15px',
        paddingRight: '15px',
        position: 'relative',
        borderRadius: '4px',
        content: '02',
    };

    let isTabSection: Boolean = false;

    for (let i = 0; i < tabSections?.length; i++) {
        // console.log(' innerSection?.sectionId****** ', innerSection?.sectionId);

        if (tabSections[i] == innerSection?.sectionId) {
            isTabSection = true;
            const index = tabSections.indexOf(innerSection?.sectionId);
            if (index > -1) {
                tabSections.splice(index, 1);
            }
        }
    }

    return (
        <Section
            id={innerSection?.sectionId}
            className={cssClass}
            style={editMode ? styles : isTabSection ? hidden : {}}
            styleProps={editMode ? {} : { ...sectionStyles }}
        >
            <div className="row">
                {innerSection.columns &&
                    innerSection.columns.map((innerColumn, innerColumnIndex) => {
                        const innerColumnIndexes: any = {
                            ...innerLayoutIndexes,
                            innerColumnIndex: innerColumnIndex,
                        };

                        if (innerColumn.data == '') {
                            return (
                                <EmptyInnerColumnItem
                                    key={`empty-inner-column-${innerColumn?.columnId}-${innerColumnIndex}`}
                                    innerColumn={innerColumn}
                                    equalColumns={equalColumns}
                                    device={device}
                                    mainColumn={mainColumn}
                                    editMode={editMode}
                                    openComponentList={props.openComponentList}
                                    innerColumnIndexes={innerColumnIndexes}
                                />
                            );
                        } else {
                            return (
                                <InnerColumnItem
                                    key={`inner-column-${innerColumn?.columnId}-${innerColumnIndex}`}
                                    mainSection={mainSection}
                                    mainColumn={mainColumn}
                                    innerSection={innerSection}
                                    innerColumn={innerColumn}
                                    equalColumns={equalColumns}
                                    device={device}
                                    editMode={editMode}
                                    themes={themes}
                                    data={data}
                                    dbName={dbName}
                                    masterTemplatesSection={masterTemplatesSection}
                                    innerColumnIndexes={innerColumnIndexes}
                                    selectedLanguage={selectedLanguage}
                                    commonConfigs={commonConfigs}
                                    isPreviewMode={isPreviewMode}
                                    confirmeLayoutDelete={props.confirmeLayoutDelete}
                                    openComponentList={props.openComponentList}
                                    openLayoutStylesList={props.openLayoutStylesList}
                                    openComponentEditer={props.openComponentEditer}
                                />
                            );
                        }
                    })}
            </div>
            {editMode && (
                <>
                    <div
                        className="row justify-content-center mb-3"
                        key={`inner-section-btn${mainSectionIndex}${mainColumnIndex}${innerSectionIndex}`}
                    >
                        <div
                            className="btn-group-vertical btn-group-sm row justify-content-center mb-3"
                            role="group"
                            aria-label="Basic example"
                            key={`inner-section-btn${mainSectionIndex}${mainColumnIndex}${innerSectionIndex}`}
                        >
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                    const paramsType = {
                                        type: 'addNewInnerSection',
                                        innerSectionIndex: innerSectionIndex + 1,
                                    };
                                    props.openComponentList(mainColumn, {}, paramsType);
                                }}
                            >
                                Add New Component
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                onClick={() => {
                                    props.openInnerSectionsList(mainColumn, innerSectionIndex + 1);
                                }}
                            >
                                Add New Inner Section
                            </button>
                        </div>
                    </div>
                    <LayoutEditButton
                        onChangeSettings={props.openLayoutStylesList}
                        buttonText="Inner Section"
                        layoutName="innerSection"
                        sectionId={mainSection?.sectionId}
                        columnId={mainColumn.columnId}
                        innerSectionId={sectionId}
                        masterTemplatesSection={masterTemplatesSection}
                        layoutStyles={sectionStyles}
                        activeLayoutId={sectionId}
                        deleteLayout={props.confirmeLayoutDelete}
                        editLayout={props.changeCurrentLayout}
                    />
                </>
            )}
        </Section>
    );
};

const ColumnItem = (props: any) => {
    const {
        mainSection,
        mainColumn,
        equalColumns,
        device,
        editMode,
        themes,
        data,
        dbName,
        selectedLanguage,
        commonConfigs,
        layoutIndexes,
        masterTemplatesSection,
        tabSections,
        isPreviewMode,
    } = props;
    const { columnId, columnStyles } = mainColumn;
    const Div: any = generatePreviewPageStyledComponent('div', isPreviewMode);
    const cssClass = columnStyles?.cssClass
        ? columnStyles.cssClass.replace(/\r?\n|\r/g, ' ').replace(/,/g, ' ')
        : '';

    const { mainSectionIndex, mainColumnIndex } = layoutIndexes;

    if (equalColumns) {
        const styles = {
            border: '1px dashed #d5dadf',
            //margin: '5px',
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '25px',
            borderRadius: '4px',
            content: '03',
        };

        return (
            <Div
                className={`${cssClass}`}
                style={editMode ? styles : {}}
                styleProps={editMode ? {} : { ...columnStyles }}
            >
                {mainColumn.section &&
                    mainColumn.section.map((innerSection, innerSectionIndex) => {
                        const { columns } = innerSection;

                        const innerLayoutIndexes: any = {
                            ...layoutIndexes,
                            innerSectionIndex: innerSectionIndex,
                        };

                        if (columns.length !== 0) {
                            // Inner section has components
                            return (
                                <InnerSectionItem
                                    key={`inner-section-${innerSection?.sectionId}-${innerSectionIndex}`}
                                    mainSection={mainSection}
                                    mainColumn={mainColumn}
                                    innerSection={innerSection}
                                    editMode={editMode}
                                    themes={themes}
                                    data={data}
                                    dbName={dbName}
                                    masterTemplatesSection={masterTemplatesSection}
                                    innerLayoutIndexes={innerLayoutIndexes}
                                    selectedLanguage={selectedLanguage}
                                    commonConfigs={commonConfigs}
                                    isPreviewMode={isPreviewMode}
                                    confirmeLayoutDelete={props.confirmeLayoutDelete}
                                    openInnerSectionsList={props.openInnerSectionsList}
                                    openComponentList={props.openComponentList}
                                    openLayoutStylesList={props.openLayoutStylesList}
                                    openComponentEditer={props.openComponentEditer}
                                    changeCurrentLayout={props.changeCurrentLayout}
                                    tabSections={tabSections}
                                />
                            );
                        } else {
                            return (
                                <React.Fragment
                                    key={`empty-inner-section-${innerSection?.sectionId}-${innerSectionIndex}`}
                                >
                                    {editMode ? (
                                        <EmptyInnerSectionItem
                                            key={`empty-inner-section-edit-${innerSection?.sectionId}-${innerSectionIndex}`}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </React.Fragment>
                            );
                        }
                    })}
                {editMode && (
                    <LayoutEditButton
                        onChangeSettings={props.openLayoutStylesList}
                        buttonText="Column"
                        layoutName="column"
                        sectionId={mainSection?.sectionId}
                        masterTemplatesSection={masterTemplatesSection}
                        layoutStyles={columnStyles}
                        activeLayoutId={columnId}
                        deleteLayout={props.confirmeLayoutDelete}
                    />
                )}
            </Div>
        );
    } else {
        const { columnSize } = mainColumn;

        const styles = {
            border: '1px dashed #d5dadf',
            //margin: '5px',
            borderRadius: '4px',
            content: '04',
            paddingTop: '25px',
        };

        return (
            <Div
                className={`${cssClass}`}
                key={`inner-section-${mainSectionIndex}${mainColumnIndex}`}
                style={editMode ? styles : {}}
                styleProps={editMode ? {} : { ...columnStyles }}
            >
                {mainColumn.section &&
                    mainColumn.section.map((innerSection, innerSectionIndex) => {
                        const { columns } = innerSection;

                        const innerLayoutIndexes: any = {
                            ...layoutIndexes,
                            innerSectionIndex: innerSectionIndex,
                        };

                        if (columns.length !== 0) {
                            // Inner section has components
                            return (
                                <InnerSectionItem
                                    key={`inner-section-${innerSection?.sectionId}-${innerSectionIndex}`}
                                    mainSection={mainSection}
                                    mainColumn={mainColumn}
                                    innerSection={innerSection}
                                    editMode={editMode}
                                    themes={themes}
                                    data={data}
                                    dbName={dbName}
                                    masterTemplatesSection={masterTemplatesSection}
                                    innerLayoutIndexes={innerLayoutIndexes}
                                    selectedLanguage={selectedLanguage}
                                    commonConfigs={commonConfigs}
                                    isPreviewMode={isPreviewMode}
                                    confirmeLayoutDelete={props.confirmeLayoutDelete}
                                    openInnerSectionsList={props.openInnerSectionsList}
                                    openComponentList={props.openComponentList}
                                    openLayoutStylesList={props.openLayoutStylesList}
                                    openComponentEditer={props.openComponentEditer}
                                    changeCurrentLayout={props.changeCurrentLayout}
                                    tabSections={tabSections}
                                />
                            );
                        } else {
                            return (
                                <React.Fragment
                                    key={`empty-inner-section-${innerSection?.sectionId}-${innerSectionIndex}`}
                                >
                                    {editMode ? (
                                        // Inner section doesn't have components | inner section is empty
                                        <EmptyInnerSectionItem
                                            key={`empty-inner-section-edit-${innerSection?.sectionId}-${innerSectionIndex}`}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </React.Fragment>
                            );
                        }
                    })}
                {editMode && (
                    <LayoutEditButton
                        onChangeSettings={props.openLayoutStylesList}
                        buttonText="Column"
                        layoutName="column"
                        sectionId={mainSection?.sectionId}
                        masterTemplatesSection={masterTemplatesSection}
                        layoutStyles={columnStyles}
                        activeLayoutId={columnId}
                        deleteLayout={props.confirmeLayoutDelete}
                    />
                )}
            </Div>
        );
    }
};

const SectionItem = (props: any) => {
    const {
        mainSection,
        editMode,
        themes,
        data,
        dbName,
        selectedLanguage,
        commonConfigs,
        mainSectionIndex,
        masterTemplatesSection,
        tabSections,
        isPreviewMode,
    } = props;
    const { equalColumns, device, sectionId, sectionStyles } = mainSection;
    const cssClass = sectionStyles?.cssClass
        ? sectionStyles.cssClass.replace(/\r?\n|\r/g, ' ').replace(/,/g, ' ')
        : '';

    const Section: any = generatePreviewPageStyledComponent('section', isPreviewMode);
    let isTabSection: Boolean = false;

    for (let i = 0; i < tabSections?.length; i++) {
        if (tabSections[i] === sectionId) {
            isTabSection = true;
            const index = tabSections.indexOf(sectionId);
            if (index > -1) {
                tabSections.splice(index, 1);
            }
        }
    }

    const styles: any = {
        border: '1px dashed #d5dadf',
        //margin: '5px',
        marginBottom: '3rem',
        padding: '25px 15px 5px',
        position: 'relative',
        borderRadius: '4px',
        content: '05',
    };

    return (
        <Section
            id={sectionId}
            className={`${cssClass}`}
            style={editMode ? styles : isTabSection ? hidden : {}}
            styleProps={editMode ? {} : { ...sectionStyles }}
        >
            <div className="row">
                {mainSection.columns &&
                    mainSection.columns.length > 0 &&
                    mainSection.columns.map((column, columnIndex) => {
                        const { section } = column;

                        const layoutIndexes: any = {
                            mainSectionIndex: mainSectionIndex,
                            mainColumnIndex: columnIndex,
                        };

                        if (section.length !== 0) {
                            // If column has inner sections
                            return (
                                <ColumnItem
                                    key={`main-column-${column?.columnId}-${columnIndex}`}
                                    mainSection={mainSection}
                                    mainColumn={column}
                                    equalColumns={equalColumns}
                                    device={device}
                                    editMode={editMode}
                                    themes={themes}
                                    data={data}
                                    dbName={dbName}
                                    masterTemplatesSection={masterTemplatesSection}
                                    layoutIndexes={layoutIndexes}
                                    selectedLanguage={selectedLanguage}
                                    commonConfigs={commonConfigs}
                                    isPreviewMode={isPreviewMode}
                                    confirmeLayoutDelete={props.confirmeLayoutDelete}
                                    openInnerSectionsList={props.openInnerSectionsList}
                                    openComponentList={props.openComponentList}
                                    openLayoutStylesList={props.openLayoutStylesList}
                                    openComponentEditer={props.openComponentEditer}
                                    changeCurrentLayout={props.changeCurrentLayout}
                                    tabSections={tabSections}
                                />
                            );
                        } else {
                            // return generateEmptyColumns(column, equalColumns, device);
                            return (
                                <EmptyColumnItem
                                    key={`main-empty-column-${column?.columnId}-${columnIndex}`}
                                    mainColumn={column}
                                    equalColumns={equalColumns}
                                    device={device}
                                    editMode={editMode}
                                    openInnerSectionsList={props.openInnerSectionsList}
                                    openComponentList={props.openComponentList}
                                    layoutIndexes={layoutIndexes}
                                />
                            );
                        }
                    })}
            </div>
            {editMode && (
                <LayoutEditButton
                    onChangeSettings={props.openLayoutStylesList}
                    buttonText="Section"
                    layoutName="section"
                    sectionId={sectionId}
                    masterTemplatesSection={masterTemplatesSection}
                    layoutStyles={sectionStyles}
                    activeLayoutId={sectionId}
                    deleteLayout={props.confirmeLayoutDelete}
                    editLayout={props.changeCurrentLayout}
                />
            )}
        </Section>
    );
};

export function PreviewPageComponent(props: any) {
    let section = props.section;
    const pageData = props.page;
    const templateData = props.template;
    const dbName = props.dbName;
    const themes = props.themes;
    const editMode: boolean = props.editMode ? props.editMode : false;
    const isPreviewMode: boolean = props.isPreview ? props.isPreview : false;
    const selectedLanguage = props.selectedLanguage;
    const commonConfigs = { isEditMode: editMode, isPreview: isPreviewMode };
    const pageContentDirection = selectedLanguage.direction ? selectedLanguage.direction : 'ltr';
    const pageContentLanguage = selectedLanguage.langKey
        ? selectedLanguage.langKey.toLowerCase()
        : 'en';

    let data: any[] = [];
    let tabSections: any[] = [];

    if (props.contentData) {
        data = props.contentData.data;
    }

    for (let x = 0; x < data?.length; x++) {
        if (data[x]?.tab) {
            tabSections = [];
            for (let y = 0; y < data[x]?.tab?.length; y++) {
                tabSections.push(data[x]?.tab[y]?.sectionId);
            }
            // break;
        }
    }

    if (pageData && pageData.section) {
        return (
            <div dir={pageContentDirection} ua-lang={pageContentLanguage} id="ua-lang">
                {pageData.section.map((section, sectionIndex) => {
                    return (
                        <SectionItem
                            key={'page-main-section-' + section.sectionId}
                            mainSection={section}
                            editMode={editMode}
                            themes={themes}
                            data={data}
                            dbName={dbName}
                            mainSectionIndex={sectionIndex}
                            selectedLanguage={selectedLanguage}
                            commonConfigs={commonConfigs}
                            isPreviewMode={isPreviewMode}
                            confirmeLayoutDelete={props.confirmeLayoutDelete}
                            openInnerSectionsList={props.openInnerSectionsList}
                            openComponentList={props.openComponentList}
                            openLayoutStylesList={props.openLayoutStylesList}
                            openComponentEditer={props.openComponentEditer}
                            changeCurrentLayout={props.changeCurrentLayout}
                            tabSections={tabSections}
                        />
                    );
                })}
            </div>
        );
    } else if (
        templateData &&
        section == 'header' &&
        templateData.header &&
        templateData.header.section
    ) {
        return (
            <div dir={pageContentDirection}>
                {templateData.header.section.map((section, sectionIndex) => {
                    return (
                        // <SectionItem key={'main-section-' + section.sectionId} section={section} />
                        <SectionItem
                            key={'header-main-section-' + section.sectionId}
                            mainSection={section}
                            editMode={editMode}
                            themes={themes}
                            data={data}
                            dbName={dbName}
                            masterTemplatesSection="header"
                            mainSectionIndex={sectionIndex}
                            selectedLanguage={selectedLanguage}
                            commonConfigs={commonConfigs}
                            isPreviewMode={isPreviewMode}
                            confirmeLayoutDelete={props.confirmeLayoutDelete}
                            openInnerSectionsList={props.openInnerSectionsList}
                            openComponentList={props.openComponentList}
                            openLayoutStylesList={props.openLayoutStylesList}
                            openComponentEditer={props.openComponentEditer}
                            changeCurrentLayout={props.changeCurrentLayout}
                        />
                    );
                })}
            </div>
        );
    } else if (
        templateData &&
        section == 'footer' &&
        templateData.footer &&
        templateData.footer.section
    ) {
        return (
            <div dir={pageContentDirection}>
                {templateData.footer.section.map((section, sectionIndex) => {
                    return (
                        // <SectionItem key={'main-section-' + section.sectionId} section={section} />
                        <SectionItem
                            key={'footer-main-section-' + section.sectionId}
                            mainSection={section}
                            editMode={editMode}
                            themes={themes}
                            data={data}
                            dbName={dbName}
                            masterTemplatesSection="footer"
                            mainSectionIndex={sectionIndex}
                            selectedLanguage={selectedLanguage}
                            commonConfigs={commonConfigs}
                            isPreviewMode={isPreviewMode}
                            confirmeLayoutDelete={props.confirmeLayoutDelete}
                            openInnerSectionsList={props.openInnerSectionsList}
                            openComponentList={props.openComponentList}
                            openLayoutStylesList={props.openLayoutStylesList}
                            openComponentEditer={props.openComponentEditer}
                            changeCurrentLayout={props.changeCurrentLayout}
                        />
                    );
                })}
            </div>
        );
    } else {
        return <></>;
    }
}
