import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getAuthorizationHeader, isEnable } from '../../shared/utils/AuthorizationUtils';
import BannerDataModel from '../models/BannerDataModel';
import MasterRepository from '../../shared/repository/MasterRepository';
import { getInitialWorkflowState } from '../../shared/utils/WorkflowUtils';
import validator from '../../shared/utils/Validator';
import ValidationMessageComponent from '../../shared/ui-components/validation/ValidationMessageComponent';
interface AddBannerComponentModel {
    dbName: string;
    onSubmitSuccess: any;
    onCancel: any;
}

const bannerTitleValidatorKey = 'bannerTitleValidator';

const schema = {
    $$root: true,
    type: 'string',
    min: 2,
    messages: {
        string: 'Banner title must be string',
        stringMin: 'Banner title must be greater than or equal to 2 characters long',
    },
};

function AddBannerComponent(props: AddBannerComponentModel) {
    const [bannerTitle, setbannerTitle] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<any>([]);

    useEffect(() => {
        validator.setValidatorSchema(bannerTitleValidatorKey, schema);
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        const [isValid, error] = validator.validateData(bannerTitleValidatorKey, bannerTitle);

        if (isValid) {
            createBanner();
        } else {
            setValidationErrors(error);
        }
    }

    function createBanner() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        // const jwt = localStorage.getItem('jwt-token');
        const banner: BannerDataModel = {
            title: bannerTitle,
            bannerData: {},
            createdBy: MasterRepository.getCurrentUser().docId,
            workflowState: getInitialWorkflowState('banners', bannerTitle, 'Banner'),
            version: 0,
        };

        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post(
            '/api/banners/create',
            {
                bannerData: banner,
                dbName: props.dbName,
            },
            httpHeaders
        )
            .then((response) => {
                if (props.onSubmitSuccess) {
                    props.onSubmitSuccess();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="row">
            <div
                style={{
                    width: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '50px',
                }}
            >
                <h2>Create new banner</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Banner">Add Banner title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Banner"
                            placeholder="Enter Banner Title"
                            value={bannerTitle}
                            disabled={isEnable('/api/banners/create')}
                            onChange={(e) => setbannerTitle(e.target.value)}
                        />
                        <ValidationMessageComponent validationErrors={validationErrors} />
                    </div>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            props.onCancel();
                        }}
                    >
                        Back
                    </button>
                    &nbsp;
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddBannerComponent;
