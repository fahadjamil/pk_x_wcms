import React, { useEffect, useState, memo } from 'react';
import Axios from 'axios';
import LinkComponent from './LinkComponent';
import styled from 'styled-components';
// import { genarateComponentLevelStyleConfigurations } from '../../util/UiComponentsUtil';

export const LinkListComponent = memo(({ horizontalLine, bullets, icon, path, lang, listData }) => {

    const LinkList = styled.div``;

    const List = styled.ul`
        ${bullets ? '' : 'list-style-type: none;'}
    `;

    return (
        <LinkList>
            <List>
                {listData && listData
                    ? listData.map((Link, Index) => {
                          return (
                              <li key={Index}>
                                  {horizontalLine ? <hr /> : ''}
                                  <LinkComponent
                                      icon={icon}
                                      text={Link.fieldData.title}
                                      link={Link.fieldData.document ? Link.fieldData.document : Link.fieldData.report}
                                      path={path}
                                  />
                              </li>
                          );
                      })
                    : ''}
            </List>
        </LinkList>
    );
});
