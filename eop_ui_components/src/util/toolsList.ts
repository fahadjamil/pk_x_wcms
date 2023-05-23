import { Categories } from '../components/Categories/Categories';
import { EditCategory } from '../components/Categories/EditCategory';
import { ShowCategory } from '../components/Categories/ShowCategory';
import { Login } from '../components/login/Login';
import { Registration } from '../components/login/Registration';
import { Steps } from '../components/Steps/Steps';
import { ShowSteps } from '../components/Steps/ShowSteps';
import { EditStep } from '../components/Steps/EditStep';
import { UserRole } from '../components/EopAdminUser/UserRole';
import { UserDesignation } from '../components/EopAdminUser/UserDesignation';
import { AddUser } from '../components/EopAdminUser/AddUser';
import { UserListing } from '../components/EopAdminUser/UserListing';
import { EditUserRole } from '../components/EopAdminUser/EditUserRole';
import { ApplicationCategory } from '../components/ApplicationFlow/ApplicationCategory';
import { ApplicationForms } from '../components/ApplicationFlow/ApplicationForms';
import { AdminLogin } from '../components/login/AdminLogin';
import { SubmitApplications } from '../components/ApplicationFlow/SubmitApplications';
import { AdminPortalDashboard } from '../components/Dashboard/AdminPortalDashboard';
import { SingleSubmitedApplication } from '../components/ApplicationFlow/SingleSubmitedApplication';
import { AdminLogout } from '../components/login/AdminLogout';
import { UserLogout } from '../components/login/UserLogout';
import { CSSPortalDashboard } from '../components/Dashboard/CSSPortalDashboard';
import { EditItem } from '../components/Steps/EditItem';
import { RoleListing } from '../components/RolePermissions/RoleListing';
import { RolePermission } from '../components/RolePermissions/RolePermission';
import { UserDepartment } from '../components/EopAdminUser/UserDepartment';
import { DepartmentListing } from '../components/EopAdminUser/DepartmentListing';
import { AdminNavbar } from '../components/Dashboard/AdminNavbar';
import { EditDepartment } from '../components/EopAdminUser/EditDepartment';
import { ApprovalWorkflowStep } from '../components/WorkflowConfiguration/ApprovalWorkflowStep';
import { DesignationListing } from '../components/EopAdminUser/DesignationListing';
import { EditDesignation } from '../components/EopAdminUser/EditDesignation';
import { ApplicationWorkflow } from '../components/ApplicationWorkflow/ApplicationWorkflow';
import { RegisterUserList } from '../components/RegisteredUser/RegisterUserList';
import { RegisterUserDetails } from '../components/RegisteredUser/RegisterUserDetails';
import { MyInbox } from '../components/Dashboard/MyInbox';
import { ChartTable } from '../components/Dashboard/ChartTable';
import { ApplicationsReport } from '../components/Reports/ApplicationsReport';
import { ApplicationStatus } from '../components/Reports/ApplicationStatus';
import { CategoryWiseApplications } from '../components/Reports/CategoryWiseApplications';
import { CSSTrackAndMonitor } from '../components/Reports/CSSTrackAndMonitor';

import { VouchersListing } from '../components/Payments/VouchersListing';
import { VoucherDetails } from '../components/Payments/VoucherDetails';

import { DeathNOCReport } from '../components/Reports/DeathNOCReport';
import { EditSubmitedApplication } from '../components/ApplicationFlow/EditSubmitedApplication';
import { ForgotPassword } from '../components/login/ForgotPassword';

export const ToolsList = {
    registration: Registration,
    login: Login,
    AdminLogin: AdminLogin,
    Categories: Categories,
    ShowCategory: ShowCategory,
    EditCategory: EditCategory,
    Steps: Steps,
    ShowSteps: ShowSteps,
    EditStep: EditStep,
    UserRole: UserRole,
    UserDesignation: UserDesignation,
    AddUser: AddUser,
    UserListing: UserListing,
    EditUserRole: EditUserRole,
    ApplicationCategory: ApplicationCategory,
    ApplicationForms: ApplicationForms,
    SubmitApplications: SubmitApplications,
    AdminPortalDashboard: AdminPortalDashboard,
    SingleSubmitedApplication: SingleSubmitedApplication,
    AdminLogout: AdminLogout,
    UserLogout: UserLogout,
    CSSPortalDashboard: CSSPortalDashboard,
    EditItem: EditItem,
    RoleListing: RoleListing,
    RolePermission: RolePermission,
    UserDepartment: UserDepartment,
    AdminNavbar: AdminNavbar,
    DepartmentListing: DepartmentListing,
    EditDepartment: EditDepartment,
    ApprovalWorkflowStep: ApprovalWorkflowStep,
    DesignationListing: DesignationListing,
    EditDesignation: EditDesignation,
    ApplicationWorkflow: ApplicationWorkflow,
    RegisterUserList: RegisterUserList,
    RegisterUserDetails: RegisterUserDetails,
    MyInbox: MyInbox,
    ChartTable: ChartTable,
    ApplicationsReport: ApplicationsReport,
    ApplicationStatus: ApplicationStatus,
    CategoryWiseApplications: CategoryWiseApplications,
    CSSTrackAndMonitor: CSSTrackAndMonitor,
    VouchersListing: VouchersListing,
    VoucherDetails: VoucherDetails,
    DeathNOCReport: DeathNOCReport,
    EditSubmitedApplication: EditSubmitedApplication,
    ForgotPassword:ForgotPassword,
};

// export ToolsList;
