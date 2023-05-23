import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopShowCategories } from '../../config/path';
import styled from 'styled-components';
const CardDiv = styled.div`
    align-items: center;
    text-align: center;
    padding: 50px;
    background-color: #e3e4e8;
    min-height: 300px;
    border-radius: 5px;
`;

export const ApplicationCategory = (props) => {
    const { lang } = props;
    const [categoryData, setCategoryData] = useState('');
    useEffect(() => {
        Axios.get(
            eopShowCategories(), {}).then((res) => {
                console.log('--res--');
                console.log(res);
                let ary = [];
                if (res.data.user_data.showCategories) {
                    res.data.user_data.showCategories.forEach((row) => {
                        ary.push(row);
                    });
                    console.log('--ary--');
                    console.log(ary);
                    setCategoryData(ary);
                } else {
                    console.log('--empty--');
                    setCategoryData([]);
                }
            });
    }, []);

    let counter = 1;

    return (
        <div className='row'>
            {categoryData &&
                categoryData.map((category, index) => {
                    console.log('--categoryData--');
                    console.log(categoryData);
                    counter++;

                    return (
                        <div className="col-md-4 p-2" key={category._id}>
                            <div className='card shadow text-center' style={{ minHeight: '290px' }}>
                                <div className='card-body'>
                                    <h3 className='card-title'>{category.category_name}</h3>
                                    <p className='card-text'>{category.category_description}</p>
                                </div>
                                <div class="card-footer bg-transparent"><a className="btn btn-success p-2" href={'/' + lang.langKey + '/application-forms#' + category._id}>Apply Now</a></div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};
