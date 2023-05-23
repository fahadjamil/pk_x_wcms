import React from 'react';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';

export const CSSPortalDashboard = (props) => {
    const { lang } = props;
    return (
        <div>
            <div>
                <div className="row">
                    <div className="col-md-7">
                        <BarChart />
                    </div>
                    <div className="col-md-5">
                        <PieChart />
                    </div>
                </div>
            </div>
        </div>
    );
};
