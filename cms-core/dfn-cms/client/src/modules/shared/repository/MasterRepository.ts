import UserModel from '../models/UserModel';
import WorkflowModel from '../models/workflow-models/WorkflowModel';

class MasterRepository {
    private static instance: MasterRepository;

    private constructor() {}

    private currentLoggedUser: UserModel = { docId: '', userName: '' };
    private workFlowList: WorkflowModel[] | undefined = undefined;
    private allCmsUsers: UserModel[] | undefined = undefined;
    private currentDBName: string | undefined = undefined;
    private currentSessionId: string | undefined = undefined;
    private accessibleWebsites: string[] | undefined = undefined;
    private rolePermissions: string[] | undefined = undefined;

    public static getInstance(): MasterRepository {
        if (!MasterRepository.instance) {
            MasterRepository.instance = new MasterRepository();
        }

        return MasterRepository.instance;
    }

    public setCurrentUser(user: UserModel) {
        if (user) {
            this.currentLoggedUser = user;
        }
    }

    public getCurrentUser(): UserModel {
        return this.currentLoggedUser;
    }

    public setWorkFlowList(workflowConfigs: WorkflowModel[]) {
        this.workFlowList = workflowConfigs;
    }

    public getWorkFlowList(): WorkflowModel[] | undefined {
        return this.workFlowList;
    }

    public setallCmsUsers(cmsUsres: UserModel[]) {
        this.allCmsUsers = cmsUsres;
    }

    public getallCmsUsers(): UserModel[] | undefined {
        return this.allCmsUsers;
    }

    public setCurrentDBName(dbName: string) {
        if (dbName) {
            this.currentDBName = dbName;
        }
    }

    public getCurrentDBName(): string | undefined {
        return this.currentDBName;
    }

    public setCurrentSessionId(sessionId: string) {
        if (sessionId) {
            this.currentSessionId = sessionId;
        }
    }

    public getCurrentSessionId(): string | undefined {
        return this.currentSessionId;
    }

    public setAccessibleWebsites(websites: string[]) {
        if (websites) {
            this.accessibleWebsites = websites;
        }
    }

    public getAccessibleWebsites(): string[] | undefined {
        return this.accessibleWebsites;
    }

    public setRolePermissions(permissions: string[]) {
        if (permissions) {
            this.rolePermissions = permissions;
        }
    }

    public getRolePermissions(): String[] | undefined {
        return this.rolePermissions;
    }
}

const masterRepositoryInstance = MasterRepository.getInstance();
export default masterRepositoryInstance;
