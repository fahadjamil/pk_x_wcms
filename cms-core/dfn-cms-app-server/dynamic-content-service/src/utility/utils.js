function createUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}
function generateWebContactUsEmailBody(name, feedbackType, mobileNumber, email, message) {
    let body = `<div>
    Hi Administrator,
    <br><br>
    ${name} has submitted a ${feedbackType} on Boursa Kuwait website as below:
    <br><br>
    <b>Name</b>: ${name}
    <br>
    <b>Mobile</b>: ${mobileNumber}
    <br>
    <b>Email</b>: ${email}
    <br><br>
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

module.exports = {
    createUUID: createUUID,
    generateWebContactUsEmailBody : generateWebContactUsEmailBody,
    generateMobileContactUsEmailBody: generateMobileContactUsEmailBody,
};
