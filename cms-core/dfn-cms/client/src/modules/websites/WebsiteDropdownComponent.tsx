import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import { selectWebsite } from '../redux/action';
import masterRepositoryInstance from '../shared/repository/MasterRepository';
import AddSiteComponent from './AddSiteComponent';

function WebsiteDropdown(props) {
    const dispatch = useDispatch();
    const [websites, setWebsites] = useState([]);
    const [showModal, setShowModal] = useState('');
    const [displayModal, setDisplayModal] = useState({});
    const [selectedWebsite, setSelectedWebsite] = useState(props.website);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<any>(undefined);
    const [showPopUp, setShowPopUp] = useState(false);
    const [initial, setInitial] = useState('');
    const [currentUser, setCurrentUser] = useState(masterRepositoryInstance.getCurrentUser().docId);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getAllSites();
            setInitials();
        }

        return () => {
            isMounted = false;
        };
    }, [props.website]);

    function setInitials() {
        const web = props.website;
        if (web) {
            if (web.split('-').length == 2) {
                setInitial(
                    (web.split('-')[0].charAt(0) + '' + web.split('-')[1].charAt(0)).toUpperCase()
                );
            } else {
                setInitial(web.split('-')[0].charAt(0).toUpperCase());
            }
        }
    }

    function getAllSites() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.get('/api/websites', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setWebsites(result.data);
                if (props.website == undefined) {
                    if(result.data && result.data.length > 0){
                        dispatch(selectWebsite(result.data[0]));
                    }
                    
                    if(result.data && result.data.length > 0 && result.data[0].databaseName){
                        masterRepositoryInstance.setCurrentDBName(result.data[0].databaseName);
                    }
                }
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    const handleChange = (e) => {
        if (e.target.value === 'add') {
            setShowPopUp(true);
        } else {
            const websiteName = e.target.value;
            const selectedWeb = websites.find((web: any) => web.databaseName === websiteName);
            masterRepositoryInstance.setCurrentDBName(websiteName);
            setSelectedWebsite(websiteName);
            dispatch(selectWebsite(selectedWeb));
        }
    };

    function handleClose() {
        setShowPopUp(false);
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div></div>;
    } else {
        return (
            <>
                <div className="form-group sitename">
                    {websites && websites.length > 0 && (
                        <>
                            <span>
                                <select
                                    name="websites"
                                    id="websites"
                                    className="form-control sitename__selector"
                                    onChange={handleChange}
                                    value={props.website}
                                >
                                    {websites.map((website: any, index) => {
                                        let active = index === 0 ? ' active' : '';
                                        return (
                                            <option value={website.databaseName} key={index}>
                                                {' '}
                                                {website.name}
                                            </option>
                                        );
                                    })}
                                    {currentUser && <option value="add">Add Web Site</option>}
                                </select>
                            </span>
                            <span className="sitename__icon">
                                <span className="sitename__icon__text">{initial}</span>
                            </span>
                        </>
                    )}
                    {currentUser && websites && websites.length === 0 && (
                        <span>
                            Add Web Site{' '}
                            <button
                                className="btn btn-primary"
                                style={{ borderRadius: '50%' }}
                                onClick={() => setShowPopUp(true)}
                            >
                                +
                            </button>
                        </span>
                    )}
                </div>
                <Modal size="lg" show={showPopUp} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Web Site</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddSiteComponent onSubmit={handleClose} />
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        lang: state.websiteReducer.website?.languages,
    };
};

export default connect(mapStateToProps)(WebsiteDropdown);
