import MasterRepository from '../repository/MasterRepository';

export function getAuthorizationHeader(headerParameters) {
    const jwt = localStorage.getItem('jwt-token');
    let httpHeaders = {
        headers: {
            Authorization: jwt,
        },
        params: {
            websiteName: MasterRepository.getCurrentDBName(),
            dbName: MasterRepository.getCurrentDBName(), //TODO : this one need to remove changes are in Web router
            sessionId: MasterRepository.getCurrentSessionId(),
            ...headerParameters,
        },
    };

    return httpHeaders;
}

export function getAuthorizationHeaderForDelete(headerParameters) {
    const jwt = localStorage.getItem('jwt-token');
    let httpHeaders = {
        headers: {
            Authorization: jwt,
        },
        data: {
            websiteName: MasterRepository.getCurrentDBName(),
            dbName: MasterRepository.getCurrentDBName(), //TODO : this one need to remove changes are in Web router
            sessionId: MasterRepository.getCurrentSessionId(),
            ...headerParameters,
        },
    };
    return httpHeaders;
}

export function isEnable(url) {
    let dbName = MasterRepository.getCurrentDBName()!;
    let websites = MasterRepository.getAccessibleWebsites();
    let permissions = MasterRepository.getRolePermissions();
    let enable;
    if (websites && permissions) {
        enable = !(websites.indexOf(dbName) !== -1 && permissions.indexOf(url) !== -1);
    } else {
        enable = true;
    }
    return enable;
}
