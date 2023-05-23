import React from 'react';
import Cookies from 'universal-cookie/es6';
import Axios from 'axios';

export const LoggedUserComponent = (props) => {
    const { lang } = props;

    const cookies = new Cookies();

    const EMAIL_COOKIE = 'bk_email';
    const SESSION_COOKIE = 'bk_session';
    const SUBSCRIPTIONS_COOKIE = 'bk_subscriptions';
    const LOGIN_ID_COOKIE = 'bk_login_id';
    const NAME_COOKIE = 'bk_name';

    let loggedUser = cookies.get(NAME_COOKIE) ? cookies.get(NAME_COOKIE) : undefined;

    const urlLang = () => (lang.langKey == 'AR' ? '/ar' : '/en');

    const dropDownContent = [
        {
            text: lang.langKey == 'AR' ? 'تغيير كلمة السر' : 'Change Password',
            url: '/change-default-password',
        },
        // *** add dropdown items here ***
    ];

    const handleLogout = () => {
        let email = cookies.get(EMAIL_COOKIE);
        let session = cookies.get(SESSION_COOKIE);
        // get prodID from a config file
        let prodID = 42;

        // get the path from a settings file
        Axios.get('/api/web/auth/logout', {
            params: {
                email: email,
                sessionId: session,
                prodId: prodID,
            },
        });

        //  *** remove cookies on browser ***
        cookies.remove(SESSION_COOKIE, { path: '/' });
        cookies.remove(EMAIL_COOKIE, { path: '/' });
        cookies.remove(SUBSCRIPTIONS_COOKIE, { path: '/' });
        cookies.remove(LOGIN_ID_COOKIE, { path: '/' });
        cookies.remove(NAME_COOKIE, { path: '/' });

        setTimeout(() => window.location.reload(), 1500);
    };

    return loggedUser ? (
        <div className="loggedUserContainer">
            <button
                data-toggle="dropdown"
                className="user-menu-trigger btn btn-light dropdown-toggle"
                type="button"
                aria-expanded="false"
            >
                <span>{loggedUser}</span>
            </button>
            <ul className="dropdown-menu">
                {dropDownContent.map((content) => (
                    <li>
                        <a href={`${urlLang()}${content.url}`} className="dropdown-item">
                            {content.text}
                        </a>
                    </li>
                ))}
                <li>
                    <a href="#" className="dropdown-item" onClick={() => handleLogout()}>
                        {lang.langKey == 'AR' ? 'تسجيل الخروج' : 'Logout'}
                    </a>
                </li>
            </ul>
        </div>
    ) : (
        <React.Fragment></React.Fragment>
    );
};
