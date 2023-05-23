import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import {
    IconResourcesMap,
    ComponentsConfiguration as ComponenetModels,
    BkSpecificComponentsConfiguration,
    EOPComponentsConfiguration,
} from 'ui-components';

import BaseComponentModel from '../../models/BaseComponentModel';

interface EditorSelectorComponentModel {
    onComponentClicked: any;
    selectorType: String;
}

function EditorSelectorComponent(props: EditorSelectorComponentModel) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredComponents, setFilteredComponents] = useState(ComponenetModels.components);
    const [filteredBKComponents, setFilteredBKComponents] = useState(
        BkSpecificComponentsConfiguration.components
    );
    const [filteredEOPComponents, setFilteredEOPComponents] = useState(
        EOPComponentsConfiguration.components
    );
    const selectorType = props.selectorType;
    console.log('--BkSpecificComponentsConfiguration.components--');
    console.log(BkSpecificComponentsConfiguration.components);
    console.log('--EOPComponentsConfiguration.components--');
    console.log(EOPComponentsConfiguration.components);
    useEffect(() => {
        let filteredList;
        console.log('--selectorType--');
        console.log(selectorType);
        if (selectorType === 'bk') {
            filteredList = BkSpecificComponentsConfiguration.components.filter(
                (component) => component.displayNameTag.toLowerCase().indexOf(searchQuery) > -1
            );
            setFilteredBKComponents(filteredList);
        } else if (selectorType === 'eop') {
            filteredList = EOPComponentsConfiguration.components.filter(
                (component) => component.displayNameTag.toLowerCase().indexOf(searchQuery) > -1
            );
            setFilteredEOPComponents(filteredList);
        } else {
            filteredList = ComponenetModels.components.filter(
                (component) => component.displayNameTag.toLowerCase().indexOf(searchQuery) > -1
            );
            setFilteredComponents(filteredList);
        }
    }, [searchQuery]);

    const getComponent = (model: BaseComponentModel) => {
        const IconComp: any = IconResourcesMap[model.displayImage];

        return (
            <Grid item key={model.compId}>
                <Button
                    color="primary"
                    className="MuiButton-outlinedPrimary MuiButton-fullWidth"
                    onClick={() => {
                        props.onComponentClicked && props.onComponentClicked(model);
                    }}
                    style={{
                        width: '120px',
                    }}
                >
                    <Grid
                        container
                        spacing={3}
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid
                            item
                            style={{
                                paddingBottom: '3px',
                                paddingTop: '21px',
                            }}
                        >
                            {IconComp && <IconComp width="40" height="40" />}
                        </Grid>
                        <Grid
                            item
                            style={{
                                paddingBottom: '21px',
                                paddingTop: '3px',
                            }}
                        >
                            <label>{model.displayNameTag}</label>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
        );
    };

    return (
        <>
            <div
                style={{
                    width: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '30px',
                }}
            >
                {/* <label htmlFor="Banner">Component Search</label> */}
                <input
                    type="search"
                    className="form-control"
                    id="component-search"
                    placeholder="Search Component"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <br />
            </div>
            <Grid container spacing={2} justify="center" alignItems="center">
                {selectorType != 'bk' &&
                    selectorType != 'eop' &&
                    filteredComponents.map((model: BaseComponentModel) => {
                        return getComponent(model);
                    })}

                {selectorType === 'bk' &&
                    filteredBKComponents.map((model: BaseComponentModel) => {
                        return getComponent(model);
                    })}
                    
                {selectorType === 'eop' &&
                    filteredEOPComponents.map((model: BaseComponentModel) => {
                        return getComponent(model);
                    })}
            </Grid>
        </>
    );
}

export default EditorSelectorComponent;
