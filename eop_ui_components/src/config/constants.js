import Cookies from 'universal-cookie/es6';

//  === eop_user cookie names ===
export const EMAIL_COOKIE = 'eop_email';
export const LOGIN_ID_COOKIE = 'eop_login_id';
export const NAME_COOKIE = 'eop_name';
export const SESSION_COOKIE = 'eop_session';

//  === eop_admin_user cookie names ===
export const ADMIN_EMAIL_COOKIE = 'eop_admin_email';
export const ADMIN_LOGIN_ID_COOKIE = 'eop_admin_login_id';
export const ADMIN_NAME_COOKIE = 'eop_admin_name';
export const ADMIN_SESSION_COOKIE = 'eop_admin_session';

export const ADMIN_FUNCTION_ALLOWED = () => {
    let cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    console.log(login_cookie);
    return login_cookie ? true : false;
};

export const USER_FUNCTION_ALLOWED = () => {
    let cookies = new Cookies();
    let login_cookie = cookies.get(LOGIN_ID_COOKIE);
    return login_cookie ? true : false;
};

export const USER_FUNCTION_LOGOUT = (props) => {
    const { lang } = props;
    console.log("user logout Function");
    // debugger;
    let cookies = new Cookies();
    cookies.remove(EMAIL_COOKIE,{ path: '/' });
    cookies.remove(LOGIN_ID_COOKIE,{ path: '/' });
    cookies.remove(NAME_COOKIE,{ path: '/' });
    cookies.remove(SESSION_COOKIE,{ path: '/' }); 
    if(typeof window !== "undefined"){
        window.location = `/${lang.langKey}/login`;
    }
    

};
export const ADMIN_FUNCTION_LOGOUT = (props) => {
    const { lang } = props;
    console.log("Admin logout Function");
    // debugger;
    let cookies = new Cookies();
    cookies.remove(ADMIN_EMAIL_COOKIE,{ path: '/' });
    cookies.remove(ADMIN_LOGIN_ID_COOKIE,{ path: '/' });
    cookies.remove(ADMIN_NAME_COOKIE,{ path: '/' });
    cookies.remove(ADMIN_SESSION_COOKIE,{ path: '/' }); 
    if(typeof window !== "undefined"){
        window.location = `/${lang.langKey}/admin`;
    }
};
