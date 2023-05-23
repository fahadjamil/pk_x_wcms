import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { switchPage } from '../../../redux/action';
import ThemeConfigurationModel from '../models/ThemeConfigurationModel';
import PropertiesComponent from './PropertiesComponent';

interface ThemeEditorModel {
    selectedTheme: ThemeConfigurationModel;
}

function ThemeEditorComponent(props) {
    const [theme, setTheme] = useState(props.selectedTheme);
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted: Boolean = true;
        if (isMounted) {
            setTheme(props.selectedTheme);
            dispatch(switchPage(props.selectedTheme.displayName));
        }

        return () => {
            isMounted = false;
        };
    }, [props]);

    return (
        <Fragment key={theme._id}>
            {/* Main properties */}
            <PropertiesComponent
                {...theme}
                type="global"
                sectionName="Global"
                isAddPicker={false}
            />
            {/* Main properties */}
            <PropertiesComponent
                {...theme}
                type="properties"
                sectionName="Properties"
                isAddPicker={false}
            />
            {/* color properties */}
            <PropertiesComponent {...theme} type="colors" sectionName="Colors" isAddPicker={true} />
        </Fragment>
    );
}

export default ThemeEditorComponent;
