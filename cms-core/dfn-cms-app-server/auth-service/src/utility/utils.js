function createUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}

// TODO : Remove this function
function generateMobileContactUsEmailBody(email, message) {
    let body = `<div>
    Hi Administrator,
    <br><br>
    ${email} has submitted a feedback on Boursa Kuwait mobile as below:
    <br><br>
    <b>Email</b>: ${email}
    <br>
    <b>Message</b>: ${message}
    <br><br>
    Best Regards,
    <br>
    <p style="display:inline;color:#C8964B;">
    [Boursa Kuwait]
    </p>
    </div>`;

    return body;
}

function generateResetPasswordEmailBody(otp) {
    let body = `<div>
    Hi User,
    <br><br>
    You have requested to reset your password.
    <br><br>
    Your OTP Code is [${otp}]
    <br><br>
    Best Regards,
    <br>
    <p style="display:inline;color:#C8964B;">
    [Boursa Kuwait]
    </p>
    </div>`;

    return body;
}

function generateAccountActivationEmailBody(name, activationUrl) {
    let body = `<div>
    Hi ${name},
    <br><br>
    Thank you for registering with Boursa Kuwait. Please click the link below to activate your account:
    <br><br>
    <a href="${activationUrl}">${activationUrl}</a>
    <br><br>
    Best Regards,
    <br>
    <p style="display:inline;color:#C8964B;">
    [Boursa Kuwait]
    </p>
    </div>`;

    return body;
}

module.exports = {
    createUUID: createUUID,
    generateMobileContactUsEmailBody: generateMobileContactUsEmailBody,
    generateResetPasswordEmailBody: generateResetPasswordEmailBody,
    generateAccountActivationEmailBody: generateAccountActivationEmailBody,
};
