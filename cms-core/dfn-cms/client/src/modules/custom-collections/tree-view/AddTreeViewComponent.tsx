import React, { useState } from 'react';
import Axios from 'axios';
import { getAuthorizationHeader, isEnable } from '../../shared/utils/AuthorizationUtils';

interface AddTreeViewComponentModel {
    dbName: string;
    onSubmitSuccess: any;
}

function AddTreeViewComponent(props: AddTreeViewComponentModel) {
    const [treeTitle, setTreeTitle] = useState<string>('');
    function handleSubmit(event) {
        event.preventDefault();
        createNewTree();
    }

    function createNewTree(){
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.post(
            '/api/custom-collections/tree/create',
            {
                title: treeTitle,
                dbName: props.dbName,
            },
            httpHeaders
        )
            .then((response) => {
                if(props.onSubmitSuccess){
                    props.onSubmitSuccess();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="page__content__container">
            <div
                style={{
                    width: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '50px',
                }}
            >
                <h2>Create New Tree</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Banner">Add Tree Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Banner"
                            placeholder="Enter Tree Title"
                            value={treeTitle}
                            /* disabled={
                                isEnable('/api/banners/create')
                            } */
                            onChange={(e) => setTreeTitle(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddTreeViewComponent;
