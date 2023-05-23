import React, { useState, useEffect } from 'react';
import FieldComponetModel from '../../models/FieldComponentModel';

function EditorSocialMediaLinkComponent(props: FieldComponetModel) {
    const [isFacebookChecked, setIsFacebookChecked] = useState(false);
    const [isTwitterChecked, setIsTwitterChecked] = useState(false);
    const [isYoutubeChecked, setIsYoutubeChecked] = useState(false);

    useEffect(() => {
        if (props.initialValue) {
            props.onValueChange(
                { [props.dataKey]: props.initialValue[props.language.langKey] },
                props.language.langKey
            );
        }
    }, []);

    const handleValueChange = (event: any) => {
        props.onValueChange({ [props.dataKey]: event.target.value }, props.language.langKey);
    };

    function getComponentID() {
        return 'socialMediaLinkComponent' + props.componentKey;
    }

    return (
        <div className="form-group">
            {/*Facebook*/}
            <label htmlFor={getComponentID()}>
                <input
                    type="checkbox"
                    onChange={(event) => setIsFacebookChecked(event.currentTarget.checked)}
                    checked={isFacebookChecked}
                />{' '}
                Facebook
            </label>
            <input
                key={getComponentID()}
                name={props.dataKey}
                defaultValue={props.initialValue ? props.initialValue[props.language.langKey] : ''}
                onChange={handleValueChange}
                className="form-control"
                id={getComponentID()}
                disabled={!isFacebookChecked}
            />

            {/*Twitter*/}
            <label htmlFor={getComponentID()}>
                <input
                    type="checkbox"
                    onChange={(event) => setIsTwitterChecked(event.currentTarget.checked)}
                    checked={isTwitterChecked}
                />{' '}
                Twitter
            </label>
            <input
                key={getComponentID()}
                name={props.dataKey}
                defaultValue={props.initialValue ? props.initialValue[props.language.langKey] : ''}
                onChange={handleValueChange}
                className="form-control"
                id={getComponentID()}
                disabled={!isTwitterChecked}
            />

            {/*Youtube*/}
            <label htmlFor={getComponentID()}>
                <input
                    type="checkbox"
                    onChange={(event) => setIsYoutubeChecked(event.currentTarget.checked)}
                    checked={isYoutubeChecked}
                />{' '}
                Youtube
            </label>
            <input
                key={getComponentID()}
                name={props.dataKey}
                defaultValue={props.initialValue ? props.initialValue[props.language.langKey] : ''}
                onChange={handleValueChange}
                className="form-control"
                id={getComponentID()}
                disabled={!isYoutubeChecked}
            />
        </div>
    );
}

export default EditorSocialMediaLinkComponent;
