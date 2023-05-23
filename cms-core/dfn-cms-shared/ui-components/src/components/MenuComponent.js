import Axios from 'axios';

Axios.get('/api/getPermissions', httpHeaders)
    .then((result) => {
        sessionStorage.setItem('permission', result.data);
    })
    .catch((err) => {
        console.log(err);
    });
