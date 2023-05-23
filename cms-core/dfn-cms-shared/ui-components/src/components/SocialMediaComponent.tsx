import React from 'react';

export const SocialMediaComponent = (params) => {
    const { data, styles } = params.data;

    return (
        <React.Fragment>
            <span>
                <span>
                    <a href="https://www.instagram.com/boursakw" rel="noreferrer" target="_blank">
                        <img
                            src="/bk-icons/social-instagram.svg"
                            height="12"
                            className="mr-2"
                            alt="Instagram"
                        />
                    </a>
                </span>
                <span>
                    <a href="https://twitter.com/BoursaKW" rel="noreferrer" target="_blank">
                        <img
                            src="/bk-icons/social-twitter.svg"
                            height="12"
                            className="mr-2"
                            alt="Twitter"
                        />
                    </a>
                </span>
                <span>
                    <a
                        href="https://www.linkedin.com/company/10108082/"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <img
                            src="/bk-icons/social-linkedin.svg"
                            height="12"
                            className="mr-2"
                            alt="Linkedin"
                        />
                    </a>
                </span>
            </span>
        </React.Fragment>
    );
};
