import Axios from 'axios';
import React, { useState } from 'react';
import MainMenuItemsComponent from './MainMenuItemsComponent';
import MenuSettingsComponent from './MenuSettingsComponent';
import MiddleMenuComponent from './MiddleMenuComponent';

export default function MenuComponent(params) {
    const [param, setParam] = useState([]);
    const [param2, setParam2] = useState([]);
    const [menus, setAllMenu] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    let section = [];
    let section2 = [];
    let data = {};
    let allMenu = [];

    function MainMenuItemsCallBackFunction(section, allMenu) {
        console.log('Call Back Method Call - Section Arr', section);
        console.log('Call Back Method Call - allMenu', allMenu);

        setParam(section);
        setAllMenu(allMenu);
    }

    function MiddleMenuItemsCallBackFunction(section2) {
        console.log('Call Back Method Call - Section222 Arr', section2);
        setParam2(section2);
    }

    function AllMenuItemsCallBackFunction(data) {
        console.log('333 Call Back Method Call - allMenu', menus);

        console.log('Update Call Back Method Call - Update', data);
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        // };

        Axios.post('/api/menus/data/save', menus, httpHeaders)
            .then((result) => {
               // setIsLoaded(true);

                //popup
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });

        //  setParam2(section2);
    }

    return (
        <>
            <div className="row">
                <div className="col-md-2">
                    <MainMenuItemsComponent
                        callback={(section, allMenu) =>
                            MainMenuItemsCallBackFunction(section, allMenu)
                        }
                    />
                    {/* <MainMenuCollapseButtonComponent /> */}

                    {/* <AddMenuItem callback={() => callBackFunction(section)} /> */}
                </div>
                <div className="col-md-6">
                    <MiddleMenuComponent
                        val1={param}
                        callbackMain={(section2) => MiddleMenuItemsCallBackFunction(section2)}
                    />
                </div>

                <MenuSettingsComponent
                    val2={param2}
                    callbackAll={(data) => AllMenuItemsCallBackFunction(data)}
                />
            </div>
        </>
    );
}
