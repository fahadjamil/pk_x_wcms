import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';
import React, { useEffect, useState } from 'react';
import SideBarComponent from '../shared/ui-components/SideBarComponent';
import { useDispatch, connect } from 'react-redux';
import { switchPage } from '../redux/action';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import UserProfileIcon from '../shared/resources/UserProfileIcon';
import BarChartComponent from './chart-components/bar-chart-component';
import PieChartComponent from './chart-components/pie-chart-component';
import LineChartComponent from './chart-components/line-chart-component';
import MeatBalls from '../shared/resources/MeatBalls';

import CmsPageIconDark from '../shared/resources/cmsPageIconDark';
import CmsContentIconDark from '../shared/resources/cmsContentIconDark';
import CmsMediaIconDark from '../shared/resources/cmsMediaIconDark';
import CmsTemplateIconDark from '../shared/resources/cmsTemplateIconDark';
import CmsDashboardIcon01 from '../shared/resources/cmsDashboardIcon01';
import CmsDashboardIcon02 from '../shared/resources/cmsDashboardIcon02';
import CmsDashboardIcon03 from '../shared/resources/cmsDashboardIcon03';
import CmsDashboardIcon04 from '../shared/resources/cmsDashboardIcon04';
import CmsDashboardMore from '../shared/resources/cmsDashboardMore';
import ActivityLogModel from '../settings/activity-logs/models/ActivityLogCommonModel';
import Axios from 'axios';
import moment from 'moment';
import WorkflowStateModel from '../shared/models/workflow-models/WorkflowStateModel';
import WorkflowBadgeComponent from '../workflows/WorkflowBadgeComponent';
import MasterRepository from '../shared/repository/MasterRepository';
import { getFormattedDateTimeString } from '../shared/utils/DateTimeUtil';
import { getUserName } from '../shared/utils/UserUtils';

const DashboardIconMapping: { [key: string]: any } = {
    Page: CmsPageIconDark,
    Documents: CmsContentIconDark,
    Posts: CmsContentIconDark,
    Forms: CmsContentIconDark,
    Banner: CmsMediaIconDark,
    Form: CmsMediaIconDark,
    Template: CmsTemplateIconDark,
};

function DashboardPageComponent(props) {
    const dispatch = useDispatch();

    const [allUnlinkedPages, setAllUnlinkedPages] = useState<any>([]);
    const [allLinkedPages, setAllLinkedPages] = useState<any>([]);
    const [allPages, setAllPages] = useState<any>([]);
    const [recentContents, setRecentContents] = useState<any>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const [activityLogs, setActivityLogs] = useState<ActivityLogModel[]>([]);
    const [collectionPosts, setCollectionPosts] = useState<any>([]);
    const [collectionDocuments, setCollectionDocuments] = useState<any>([]);
    const [collectionForms, setCollectionForms] = useState<any>([]);
    const [allBanners, setAllBanners] = useState<any>([]);
    const [workflowDocuments, setWorkflowDocuments] = useState<WorkflowStateModel[]>([]);
    const [userSpecificworkflowDocuments, setUserSpecificWorkflowDocuments] = useState<
        WorkflowStateModel[]
    >([]);

    const database = props.website;
    const labelColors = ['green', 'red', 'blue', 'yellow', 'grey'];

    const firstBararChartData = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],

                borderWidth: 2,
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    display: false,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    display: false,
                                },
                            },
                        ],
                    },
                    aspectRatio: 4,
                },
            },
        ],
    };

    const firstBarChartOptions = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    const secondBararChartData = {
        labels: ['Orange', 'Purple', 'Green', 'Yellow', 'Blue', 'Red'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 2,
                options: {
                    responsive: true,
                    aspectRatio: 4,
                },
            },
        ],
    };

    const DoughnutChartData = {
        datasets: [
            {
                data: [10, 20, 30],
            },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ['Red', 'Yellow', 'Blue'],
    };

    const secondBarChartOptions = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    useEffect(() => {
        dispatch(switchPage('Dashboard'));
        getAllPages();
        getAllActivityLogs();
        getAllCollectionPosts();
        getAllCollectionDocuments();
        getAllCollectionForms();
        getAllBanners();
        getWorkflowsByStatus(['initial', 'pendingapproval']);
        getUserSpecifcWorkflowStatus();
    }, [database]);

    function getAllPages() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/pages', httpHeaders)
            .then((result) => {
                setAllPages(result.data);
            })
            .then(() => {
                return Axios.get('/api/pages/unlink-pages', httpHeaders)
                    .then((result) => {
                        setAllUnlinkedPages(result.data);
                    })
                    .catch((err) => {
                        setIsLoaded(false);
                        setError(err);
                        console.log(err);
                    });
            })
            .then(() => {
                return Axios.get('/api/menus', httpHeaders)
                    .then((result) => {
                        setAllLinkedPages(result.data);
                    })
                    .catch((err) => {
                        setIsLoaded(false);
                        setError(err);
                        console.log(err);
                    });
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function getAllActivityLogs() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        let logSearch = {
            searchQ: getSearchQuery(),
            dbName: database,
        };

        Axios.post('/api/activity-logs', logSearch, httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setActivityLogs(result.data);
                    getUnique(result.data, 'pageId');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getSearchQuery() {
        return {
            ...{ title: '' },
            ...{ comment: '' },
        };
    }

    function getUnique(arr, index) {
        try {
            const unique = arr
                .map((e) => e[index])

                // store the keys of the unique objects
                .map((e, i, final) => final.indexOf(e) === i && i)

                // eliminate the dead keys & store unique objects
                .filter((e) => arr[e])
                .map((e) => arr[e]);

            setRecentContents(unique);
        } catch (err) {
            console.log(err);
        }
    }

    function getAllCollectionPosts() {
        const headerParameter = { collection: 'custome-types', searchQuery: 'Posts' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                setCollectionPosts(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getAllCollectionDocuments() {
        const headerParameter = { collection: 'custome-types', searchQuery: 'Documents' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                setCollectionDocuments(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getAllCollectionForms() {
        const headerParameter = { collection: 'custome-types', searchQuery: 'Forms' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/custom-collections/types', httpHeaders)
            .then((response) => {
                setCollectionForms(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getAllBanners() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/banners', httpHeaders)
            .then((result) => {
                setAllBanners(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getWorkflowsByStatus(workflowId: string[]) {
        const headerParameter = {
            query: JSON.stringify({ state: { $in: [workflowId[0], workflowId[1]] } }),
            // { $in: ["text", "here"] }
            sorter: JSON.stringify({ modifiedDate: -1, createdDate: -1 }),
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/workflow/filter', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setWorkflowDocuments(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getUserSpecifcWorkflowStatus() {
        const headerParameter = {
            query: JSON.stringify({
                $or: [
                    { createdBy: MasterRepository.getCurrentUser().docId },
                    { modifiedBy: MasterRepository.getCurrentUser().docId },
                ],
            }),
            sorter: JSON.stringify({ modifiedDate: -1, createdDate: -1 }),
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/workflow/filter', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setUserSpecificWorkflowDocuments(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="dashboard">
                <div className="container-fluid">
                    <SideBarComponent></SideBarComponent>
                    <div className="row">
                        <div className="col-xl-9 col-lg-12 mb-4">
                            <div className="row mb-4">
                                <div className="col-7">
                                    <div className="row">
                                        <div className="col-6 mb-4">
                                            <div className="card__item stat__card">
                                                <div className="card__title">
                                                    YOUR PENDING ACTIONS
                                                    <span className="float-right">
                                                        <CmsDashboardIcon01
                                                            width="3rem"
                                                            height="3rem"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="card__stat">
                                                    {
                                                        userSpecificworkflowDocuments.filter(
                                                            (doc) =>
                                                                doc.state === 'initial' ||
                                                                doc.state === 'pendingapproval'
                                                        ).length
                                                    }
                                                </div>
                                                <div className="card__ledgend">
                                                    <span className="highlight">
                                                        {
                                                            userSpecificworkflowDocuments.filter(
                                                                (doc) =>
                                                                    (doc.state === 'initial' ||
                                                                        doc.state ===
                                                                            'pendingapproval') &&
                                                                    moment(
                                                                        getFormattedDateTimeString(
                                                                            doc.modifiedDate
                                                                        )
                                                                    ).format('DD-MM-YY') ===
                                                                        moment(new Date()).format(
                                                                            'DD-MM-YY'
                                                                        )
                                                            ).length
                                                        }
                                                    </span>{' '}
                                                    Actions Today
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 mb-4">
                                            <div className="card__item stat__card">
                                                <div className="card__title">
                                                    YOUR PENDING SUBMISSIONS
                                                    <span className="float-right">
                                                        <CmsDashboardIcon02
                                                            width="3rem"
                                                            height="3rem"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="card__stat">
                                                    {
                                                        userSpecificworkflowDocuments.filter(
                                                            (doc) => doc.state === 'initial'
                                                        ).length
                                                    }
                                                </div>
                                                <div className="card__ledgend">
                                                    <span className="highlight">
                                                        {
                                                            userSpecificworkflowDocuments.filter(
                                                                (doc) =>
                                                                    doc.state === 'initial' &&
                                                                    moment(
                                                                        getFormattedDateTimeString(
                                                                            doc.modifiedDate
                                                                        )
                                                                    ).format('DD-MM-YY') ===
                                                                        moment(new Date()).format(
                                                                            'DD-MM-YY'
                                                                        )
                                                            ).length
                                                        }
                                                    </span>{' '}
                                                    Actions Today
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="card__item stat__card">
                                                <div className="card__title">
                                                    WORKFLOW UPDATES TODAY
                                                    <span className="float-right">
                                                        <CmsDashboardIcon03
                                                            width="3rem"
                                                            height="3rem"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="card__stat">
                                                    {
                                                        userSpecificworkflowDocuments.filter(
                                                            (doc) =>
                                                                doc.state != 'initial' &&
                                                                moment(
                                                                    getFormattedDateTimeString(
                                                                        doc.modifiedDate
                                                                    )
                                                                ).format('DD-MM-YY') ===
                                                                    moment(new Date()).format(
                                                                        'DD-MM-YY'
                                                                    )
                                                        ).length
                                                    }
                                                </div>
                                                <div className="card__ledgend">
                                                    <span className="highlight">
                                                        {
                                                            userSpecificworkflowDocuments.filter(
                                                                (doc) =>
                                                                    doc.state != 'initial' &&
                                                                    moment(
                                                                        getFormattedDateTimeString(
                                                                            doc.modifiedDate
                                                                        )
                                                                    ).format('DD-MM-YY') ===
                                                                        moment(new Date()).format(
                                                                            'DD-MM-YY'
                                                                        )
                                                            ).length
                                                        }
                                                    </span>{' '}
                                                    Actions Today
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="card__item stat__card">
                                                <div className="card__title">
                                                    UNLINKED PAGES
                                                    <span className="float-right">
                                                        <CmsDashboardIcon04
                                                            width="3rem"
                                                            height="3rem"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="card__stat">
                                                    {allUnlinkedPages.length}
                                                </div>
                                                <div className="card__ledgend">
                                                    <span className="highlight">0</span> Actions
                                                    Today
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="card__item">
                                        <div className="card__title">
                                            WORKFLOW UPDATES TODAY
                                            <span className="float-right">
                                                <CmsDashboardMore
                                                    className="mr-2"
                                                    width="1rem"
                                                    height="1rem"
                                                />
                                            </span>
                                        </div>
                                        <div>
                                            <LineChartComponent
                                                data={firstBararChartData}
                                                options={firstBarChartOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-7">
                                    <div className="row">
                                        <div className="col-12 mb-4">
                                            <div className="card__item">
                                                <div className="card__title">
                                                    HEALTH CHECKS
                                                    <span className="float-right">
                                                        <CmsDashboardMore
                                                            className="mr-2"
                                                            width="1rem"
                                                            height="1rem"
                                                        />
                                                    </span>
                                                </div>
                                                <ul className="card__data mb-0">
                                                    <li className="data__item mb-0">
                                                        <div className="row">
                                                            <div className="col">
                                                                <div className="icon status-icon green"></div>
                                                                <div className="title">
                                                                    No broken links
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="icon status-icon green"></div>
                                                                <div className="title">
                                                                    No broken components
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="card__item">
                                                <div className="card__title">
                                                    PENDING ACTIONS
                                                    <span className="float-right">
                                                        <CmsDashboardMore
                                                            className="mr-2"
                                                            width="1rem"
                                                            height="1rem"
                                                        />
                                                    </span>
                                                </div>
                                                <ul className="card__data">
                                                    {workflowDocuments &&
                                                        workflowDocuments
                                                            .slice(0, 5)
                                                            .map((item, index) => {
                                                                let DashboardIconComp =
                                                                    DashboardIconMapping[
                                                                        item.fileType
                                                                    ];
                                                                return (
                                                                    <li
                                                                        key={index}
                                                                        className="data__item"
                                                                    >
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <div className="icon">
                                                                                    {DashboardIconComp && (
                                                                                        <DashboardIconComp
                                                                                            width="1.25rem"
                                                                                            height="1.25rem"
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                                <div className="title">
                                                                                    {item.fileTitle}
                                                                                </div>
                                                                                <div className="subtitle">
                                                                                    <span className="tag">
                                                                                        <WorkflowBadgeComponent
                                                                                            currentworkflowId={
                                                                                                item?.state
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                                <div className="time">
                                                                                    {moment(
                                                                                        getFormattedDateTimeString(
                                                                                            item.modifiedDate
                                                                                        )
                                                                                    ).fromNow()}
                                                                                </div>
                                                                            </div>
                                                                            <div className="col">
                                                                                <div className="comment">
                                                                                    {item.comment}
                                                                                </div>
                                                                            </div>
                                                                            <div className="col">
                                                                                <div className="user">
                                                                                    {item.modifiedBy
                                                                                        ? getUserName(
                                                                                              item.modifiedBy
                                                                                          )
                                                                                        : getUserName(
                                                                                              item.createdBy
                                                                                          )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="card__item">
                                        <div className="card__title">
                                            CONTENT STATS
                                            <span className="float-right">
                                                <CmsDashboardMore
                                                    className="mr-2"
                                                    width="1rem"
                                                    height="1rem"
                                                />
                                            </span>
                                        </div>
                                        <div>
                                            <PieChartComponent
                                                data={secondBararChartData}
                                                options={secondBarChartOptions}
                                            />
                                        </div>
                                        <ul className="card__data mt-5">
                                            <li className="data__item">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="icon">
                                                            <CmsPageIconDark
                                                                width="1.25rem"
                                                                height="1.25rem"
                                                            />
                                                        </div>
                                                        <div className="title">Pages</div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="comment">
                                                            {allPages.length}
                                                        </div>
                                                    </div>
                                                    <div className="col text-right">
                                                        <div className="stat">
                                                            <span>12</span> Published{' '}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="data__item">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="icon">
                                                            <CmsContentIconDark
                                                                width="1.25rem"
                                                                height="1.25rem"
                                                            />
                                                        </div>
                                                        <div className="title">Documents</div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="comment">
                                                            {collectionDocuments.length}
                                                        </div>
                                                    </div>
                                                    <div className="col text-right">
                                                        <div className="stat">
                                                            <span>72</span> Published{' '}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="data__item">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="icon">
                                                            <CmsContentIconDark
                                                                width="1.25rem"
                                                                height="1.25rem"
                                                            />
                                                        </div>
                                                        <div className="title">Posts</div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="comment">
                                                            {collectionPosts.length}
                                                        </div>
                                                    </div>
                                                    <div className="col text-right">
                                                        <div className="stat">
                                                            <span>28</span> Published{' '}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="data__item">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="icon">
                                                            <CmsContentIconDark
                                                                width="1.25rem"
                                                                height="1.25rem"
                                                            />
                                                        </div>
                                                        <div className="title">Forms</div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="comment">
                                                            {collectionForms.length}
                                                        </div>
                                                    </div>
                                                    <div className="col text-right">
                                                        <div className="stat">
                                                            <span>28</span> Published{' '}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="data__item">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="icon">
                                                            <CmsMediaIconDark
                                                                width="1.25rem"
                                                                height="1.25rem"
                                                            />
                                                        </div>
                                                        <div className="title">Media</div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="comment">12</div>
                                                    </div>
                                                    <div className="col text-right">
                                                        <div className="stat">
                                                            {/* <span>12</span> Published{' '} */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="data__item">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="icon">
                                                            <CmsMediaIconDark
                                                                width="1.25rem"
                                                                height="1.25rem"
                                                            />
                                                        </div>
                                                        <div className="title">Banners</div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="comment">
                                                            {allBanners.length}
                                                        </div>
                                                    </div>
                                                    <div className="col text-right">
                                                        <div className="stat">
                                                            {/* <span>4</span> Published{' '} */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-12">
                            <div className="row">
                                <div className="col-xl-12 col-lg-6 mb-4">
                                    <div className="card__item card__03">
                                        <div className="card__title">
                                            RECENT ACTIVITIES
                                            <span className="float-right">
                                                <CmsDashboardMore
                                                    className="mr-2"
                                                    width="1rem"
                                                    height="1rem"
                                                />
                                            </span>
                                        </div>

                                        <ul className="card__data">
                                            {activityLogs &&
                                                activityLogs.slice(0, 5).map((item, index) => {
                                                    let colorIndex = index % 5;
                                                    return (
                                                        <li
                                                            className="data__item"
                                                            key={item.docId + '-' + index}
                                                        >
                                                            <div className="row">
                                                                <div className="col">
                                                                    <div
                                                                        className={
                                                                            'icon status-icon ' +
                                                                            labelColors[colorIndex]
                                                                        }
                                                                    ></div>
                                                                    <div className="title">
                                                                        {item.deleted
                                                                            ? item.deleted
                                                                                  .comment || ' '
                                                                            : item.restored
                                                                            ? item.restored.comment
                                                                            : item.comment || ' '}
                                                                    </div>
                                                                    <div className="subtitle">
                                                                        {item.title} &nbsp;
                                                                        <span className="tag">
                                                                            {item.type}
                                                                        </span>
                                                                    </div>
                                                                    <div className="time">
                                                                        {moment(
                                                                            getFormattedDateTimeString(
                                                                                item.modifiedDate
                                                                            )
                                                                        ).fromNow()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-xl-12 col-lg-6">
                                    <div className="card__item card__03">
                                        <div className="card__title">
                                            RECENT CONTENTS
                                            <span className="float-right">
                                                <CmsDashboardMore
                                                    className="mr-2"
                                                    width="1rem"
                                                    height="1rem"
                                                />
                                            </span>
                                        </div>
                                        <ul className="card__data">
                                            {recentContents &&
                                                recentContents.slice(0, 5).map((item, index) => {
                                                    let DashboardIconComp = item.type
                                                        ? DashboardIconMapping[item.type]
                                                        : '';
                                                    return (
                                                        <li key={index} className="data__item">
                                                            <div className="row">
                                                                <div className="col">
                                                                    <div className="icon">
                                                                        {' '}
                                                                        {item.type && DashboardIconComp && (
                                                                            <DashboardIconComp
                                                                                width="1.25rem"
                                                                                height="1.25rem"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div className="title">
                                                                        {item.title}
                                                                    </div>
                                                                    <div className="subtitle">
                                                                        <span className="tag">
                                                                            {item.type}
                                                                        </span>
                                                                    </div>
                                                                    <div className="time">
                                                                        {moment(
                                                                            getFormattedDateTimeString(
                                                                                item.modifiedDate
                                                                            )
                                                                        ).fromNow()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
        lang: state.websiteReducer.website?.languages,
    };
};

export default connect(mapStateToProps)(DashboardPageComponent);
