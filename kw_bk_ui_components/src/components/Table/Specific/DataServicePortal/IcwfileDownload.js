import React, {useState, useRef} from 'react';
import { TableUiComponent } from '../../TableComponent';
import styled from 'styled-components';
import Axios from "axios";

const FormWrapper = styled.div`
    padding: 10px;
    display: table;
`;

const Section = styled.div`
    display: table-cell;
    padding: 0 5px;
`;

const Label = styled.div`
    display: block;
    padding: 5px 0;
`;

const download = (response) => {
    return (
        <div style={{ display: 'none' }}>
            {/* <iframe src='http://localhost:4500/icwFile' /> */}
            <iframe src='/icwFile' />
        </div>
    )
 };

export const IcwFileDownloader = () => {
    let selectedDate = '';
    let date = useRef(null);

    let onClickDownload = () => {
        if (date.current.value !== '') {
            Axios.get('/icwFile', {}).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `ICW_data_${date.current.value}.txt`);
                document.body.appendChild(link);
                link.click();
            }).catch(() => {
                console.log('fail');
            });
        }
    };

    return (
        <div>
            <FormWrapper>
                <Section>
                    <Label for="cars">Trade Date</Label>
                    <input type="date" ref={date}></input>
                </Section>

                <Section style={{verticalAlign: "bottom"}}>
                    <button onClick={onClickDownload}>Downlaod</button>
                </Section>
            </FormWrapper>
        </div>
    );
};
