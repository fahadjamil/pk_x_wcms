import MasterRepository from '../repository/MasterRepository';

export function getUserName(userId: string) {
    if (userId) {
        const allUsers = MasterRepository.getallCmsUsers();

        if (allUsers) {
            const user = allUsers.find((user) => user.docId === userId);
            if (user) {
                return user.userName;
            }
        }
    }

    return '';
}
