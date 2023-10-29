import { CustomizeComponent } from 'rc-table/lib/interface';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import React, { ReactNode } from 'react';
import { RestHandler } from 'msw';
import { TFunction } from 'react-i18next';
import { FormItemProps } from './components/form-items/form-item';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { FormInstance } from 'antd/es/form';

export interface IMenuItem {
  key: string;
  label: string;
  icon?: JSX.Element;
  className?: string;
  popupClassName?: string;
  children?: {
    key: string;
    label: string | JSX.Element;
    icon?: JSX.Element;
    className?: string;
  }[];
}

export interface ISelectItem {
  id: string;
  name: string;
  email?: string;
}

export interface ITreeSelectItem {
  title: string;
  value: string;
  key?: string;
  children?: { title: string; value: string; key?: string }[];
}

export interface IGroup {
  name: string;
  description: string;
  roleIds: string[];
  userIds: string[];
}

export interface IGroupDelete {
  groupId: string;
  name: string;
  id: string;
  tenantId: string;
  userCount: string;
}

export interface IEditGroupRequest {
  groupName: string;
  groupDescription: string;
  roleIds: string[];
  userIds: string[];
  tenant_id: string;
}

export interface IGroupUser {
  firstname: string;
  lastname: string;
  email: string;
}

export interface IRoleUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IReorderDatatype {
  oldIndex: number;
  newIndex: number;
}

export interface ICurrencyResponse {
  label: string;
  value: string;
}

export interface ISelectItem {
  id: string;
  name: string;
}

export interface IContentFilterParams {
  id?: string;
  contentModelId: string;
  params: {
    fieldsToQuery?: string;
    search?: string;
    skip: number;
    limit?: number;
  };
}

export interface ISelectNavigation {
  createdBy: string;
  id: string;
  modifiedAt: string;
  modifiedBy: string;
  title: string;
}

export interface INavigationListResponse {
  items: ISelectNavigation[];
}

export interface INavigation {
  title?: string;
}

export interface ICreateNavigationResponse {
  contentModelDataId: string;
  contentModelFieldDataId: string;
  versionId: string;
}

export interface IListContentResponse {
  label: string;
  description?: string;
  actAsWebPage?: string;
  template?: string;
  id: string;
  name?: string;
  type?: string;
  internalName: string;
}

export interface IContentModelRecords {
  contentModelId: string;
  id: string;
  pageSlug: string;
  status: string;
  title: string;
  className?: string;
  linkTarget?: string;
  navigationTitle?: string;
  // navigationLabel?: string;
  displayExtended?: boolean;
  type?: string;
  name: string;
}

export interface IContentModelRecordsResponse {
  items: IContentModelRecords[];
  totalRecord: number;
}

export interface INavigationDetails {
  modifiedBy: string;
  modifiedAt: string;
  language: string;
  tenantId: string;
  workspaceId: string;
  contentModelId: string;
  contentModelDataId: string;
  versionId: string;
  contentEj: INavigationTreeItem[];
  id: string;
  createdAt: string;
  _version_: string;
  isLocalizationEnabled: boolean;
  menuTitleEs: string;
  menuDescriptionEt: string;
  contentModelTitle: string;

  // nextVersionNo: number;
  // contentModelData: {
  //   title: string;
  //   internalName: string;
  //   id: string;
  //   currentVersionId: string;
  //   pageSlug: string;
  // };
  // versionData: {
  //   id: string;
  // };
  // contentModelFieldData: {
  //   modifiedAt: string;
  //   tenantId: string;
  //   content: INavigationItem[];
  //   workspaceId: string;
  //   contentModelId: string;
  //   contentModelDataId: string;
  //   versionId: string;
  //   language: string;
  //   modifiedBy: string;
  //   id: string;
  //   createdAt: string;
  //   _version_: string;
  //   isLocalizationEnabled: boolean;
  // };
}

export interface INavigationContentModelAndRecordList {
  id: string;
  internalName: string;
  name: string;
  type: string;
  description: string;
  actAsWebPage: boolean;
  records: IContentModelRecords[];
  totalRecord?: number;
}

export interface INavigationItem {
  children?: INavigationItem[];
  className: string;
  contentModelId: string;
  id: string;
  linkTarget: string;
  navigationLabel: string;
  pageSlug: string;
  status: string;
  title: string;
  displayExtended: boolean;
}

export interface INavigationItemsNestable {
  item: {
    children: INavigationItem[];
    className: string;
    contentModelId: string;
    id: string;
    linkTarget: string;
    navigationLabel: string;
    navigationTitle: string;
    pageSlug: string;
    status: string;
    title: string;
    displayExtended: boolean;
    type?: string;
    menuTitleEs: string;
    nameEsi?: string;
    linkEs?: string;
    contentModelName?: string;
    recordTitle?: string;
  };
}

export interface INavigationTreeItem {
  children?: INavigationTreeItem[];
  className?: string;
  contentModelId?: string;
  id?: string;
  linkTarget?: string;
  navigationLabel?: string;
  pageSlug?: string;
  status?: string;
  title?: string;
  displayExtended?: boolean;
  navigationTitle?: string;
  type?: string;
  name?: string;
  link?: string;
}

export interface INavigationTree {
  items: INavigationTreeItem[];
  dragItem: Record<string, boolean>;
  targetPath: number[];
}

export interface IMenuNameResponse {
  id: string;
  name: string;
}

export interface IMenuFormItems {
  [key: string]: boolean;
}

export interface INestedMenuFormItems {
  [key: string]: {
    [key: string]: {
      className: string;
      displayExtended: boolean;
      linkTarget: string;
      navigationLabel: string;
      pageSlug: string;
      title: string;
      name?: string;
      link?: string;
    };
  };
}

export interface ISelectUser {
  firstName: string;
  id: string;
  lastName: string;
  email: string;
  title: string;
}

export interface ISelectUserResponse {
  items: ISelectUser[];
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  groups: string[];
}

export interface IWorkspaceUser {
  user?: string;
  userIds?: string[];
  roles: string[];
}

export interface IUserDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[];
  status?: string;
  isMfaEnable?: boolean;
  createdAt?: string;
  isMfa?: boolean;
  isMfaMail?: boolean;
  isMfaAuthApp?: boolean;
  isRecoveryKeyGenerated?: boolean;
  mfaPreference?: string;
  recoveryKey?: string;
  workspaces?: {
    id?: string;
    name: string;
    roles: { id: string; name: string }[];
  }[];
}

export interface IUserResponse {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  groups: string[];
}

export interface ILanguageInfo {
  Data: {
    code: string;
    message: string;
    items: {
      id: string;
      locale: string;
      displayName: string;
      index?: number;
    }[];
  };
  status: string;
}

export interface IGridData {
  id: string;
  tenantId: string;
  groupName: string;
  groupDescription: string;
  userCount: string;
}

export interface IListGroupResponse {
  items: IGridData[];
  code: string;
  message: string;
}

export interface IEditGroup {
  groupId: string;
  groupName: string;
  groupDescription: string;
  users: IGetGroupUserInfo[];
  roles: IGetGroupRoleInfo[];
}

export interface IEditGroupResponse {
  code: string;
  item: IEditGroup;
  message: string;
}

export interface IGroupToolTipData {
  userId: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IGroupUsersResponse {
  items: IGroupToolTipData[];
  code: string;
  message: string;
}

export interface IRoleUsersResponse {
  items: IRoleUser[];
  code: string;
  message: string;
}

export interface ICreateGroupRequest {
  user_ids: string[];
  tenant_id: string;
  role_ids: string[];
  group_name: string;
  group_description: string;
}

export interface ICreateGroupResponse {
  id: string;
  code: string;
  message: string;
}

export interface IEditGroupResponse {
  id: string;
  code: string;
  message: string;
}

export interface ISortableTable {
  dataSource?: { id: string; locale: string; name: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnsType<any>;
  DraggableContainer: CustomizeComponent;
  DraggableBodyRow: CustomizeComponent;
  canReorderEntity?: boolean;
}

export interface ISignIn {
  username: string;
  password: string;
  remember?: boolean;
}

export interface IResetPassword {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IGetGroupRoleInfo {
  roleId: string;
  tenantId: string;
  workspaceId: string;
  workspaceName: string;
  roleName: string;
}

export interface ISetPassword {
  password: string;
  confirmPassword: string;
}

export interface IGetGroupUserInfo {
  userId: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IDeleteResponse {
  statusCode: string;
  response: string;
}

export interface IAxiosResponse<T> {
  response: {
    Data: T;
    Status: string;
  };
}

export interface IAPIToken {
  id: string;
  name: string;
  description: string;
  type: string;
  validTill: string;
  token: string;
}

export interface ICmsToken {
  id: string;
  createdAt: string;
  createdBy: string;
  name: string;
  description: string;
  token: string;
  type: string;
  validTill: string | object;
  tokenType?: string;
}

export interface IGetEnvironment {
  title: string;
  workspaceDomain: string;
  customDomain: string;
  enableMaintenance: boolean;
  enablePasswordProtect: boolean;
  passwordHash: string;
  httpRobots: string;
  type: string;
  pointYourDomain: boolean;
  siteMapUrl: string;
  cacheDomain: string;
}

export interface IListEnvironments {
  id: string;
  createdBy: string;
  createdAt: string;
  customDomain: string;
  enableMaintenance: boolean;
  enablePasswordProtect: boolean;
  enableSiteCrawler: boolean;
  envHash: string;
  isSystemCreated: boolean;
  modifiedAt: string;
  modifiedBy: string;
  passwordHash: string;
  siteMapUrl: string;
  suffix: string;
  tenantId: string;
  title: string;
  type: string;
  workspaceDomain: string;
  workspaceId: string;
  httpRobots: string;
  pointYourDomain: boolean;
  isDisable?: boolean;
  name?: string;
  publishAt?: string;
  cacheDomain?: string;
  isDefault: boolean;
}

export interface IEditEnvironment {
  title: string;
  customDomain: string;
  enablePasswordProtect: boolean;
  enableMaintenance: boolean;
  passwordHash: string;
  enableSiteCrawler: boolean;
  pointYourDomain: boolean;
  httpRobots?: string;
  workspaceDomain?: string;
  domain?: string;
}

export interface IEditEnvironmentResponse {
  message: string;
}

export interface IUpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  languageId: string;
}

export interface IGetProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  timezone: string;
  hasGlobalRole: boolean;
  workspaceId?: string;
  profileUrl?: string;
  isProfileImage?: boolean;
  tenantId?: string;
  isMfaEnable?: boolean;
  languageId?: string;
  createdAt?: string;
  workspace_id?: string;
  isMfa?: boolean;
  isMfaMail?: boolean;
  isMfaAuthApp?: boolean;
  mfaPreference?: string;
  recoveryKey?: string;
  isRecoveryKeyGenerated?: boolean;
}

export interface IFilter {
  label: string;
  key: string;
}

export interface IWorkspaceResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt?: string;
  users: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    isProfileImage: boolean;
  }[];
}

export interface IWorkspace {
  id?: string;
  name?: string;
  description?: string;
  storeLink?: string;
  timezone?: string;
  currency?: string;
}

export interface ILanguage {
  id: string;
  name: string;
  locale: string;
  index?: number;
}

export interface IRole {
  title?: string;
  value?: string;
  children?: {
    label?: string;
    displayTitle: string;
    value?: string;
  }[];
  id?: string;
  name?: string;
  label?: string;
  permissions?: object;
  workspaceName?: string;
  roleId?: string;
  workspaceId?: string;
  isGlobalAdmin?: boolean;
  isWorkspaceAdmin?: boolean;
  item?: {
    permissions?: {
      workspace?: string;
      global?: {
        permission?: Record<string, boolean>;
      };
    };
    workspaceId: string;
    name?: string;
    description?: string;
  };
}

export interface ISubmitRoleValuesType {
  is_global_admin: boolean;
  is_workspace_admin: boolean;
  role_description: string;
  permissions: Record<string, boolean>;
  role_name: string;
  role_type: number;
  workspace_id: string;
  contentLibrary: Record<string, boolean>;
  contentModel: Record<string, boolean>;
  insights: Record<string, boolean>;
  settings: Record<string, boolean>;
  personalization: Record<string, boolean>;
  merchandising: Record<string, boolean>;
  audience: Record<string, boolean>;
  workspace: string;
  roleName: string;
  roleDescription: string;
  canManageWorkspace: boolean | undefined;
  canManageUserAndSecurity: boolean | undefined;
}

export interface ISubmitRoleObjectType {
  permissions: {
    contentLibrary: Record<string, boolean>;
    contentModel: Record<string, boolean>;
    insights: Record<string, boolean>;
    settings: Record<string, boolean>;
    personalization: Record<string, boolean>;
    merchandising: Record<string, boolean>;
    audience: Record<string, boolean>;
  };
  isWorkspaceAdmin: boolean;
  name: string;
  description: string;
  workspaceName: string;
}

export interface ISubmitRoleGlobalObjectType {
  permissions: {
    global: {
      canManageWorkspace: boolean | undefined;
      canManageUserAndSecurity: boolean | undefined;
    };
  };
  name: string;
  description: string;
}

export interface IRoleListType {
  workspaceId?: string;
  workspaceName?: string;
  roles: Record<string, unknown>[];
}

export interface InsightType {
  label: string;
  value: string;
}

export interface IInsights {
  items: {
    insights: InsightType[];
  };
}

export interface IRuleTypeData {
  data: InsightType[];
}

export interface RoleFormObjectType {
  [key: string]: {
    [key: string]: {
      create: string;
      read: string;
      update: string;
      delete: string;
      publish: string;
    };
  };
}

export interface FormValueChangeType {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        [key: string]: {
          [key: string]: boolean;
        };
      };
    };
  };
}

export interface ContentLibraryIndeterminateState {
  [key: string]: {
    [key: string]: boolean;
  };
}

export interface ContentModelIndeterminateState {
  [key: string]: boolean;
}

export interface IFormParams {
  [key: string]: string;
}

export interface IRoleResponse {
  code: string;
  item: IRole;
  Status: string;
}

export interface IRoleListResponse {
  code: string;
  items: IRole[];
  Status: string;
}

export interface ICreateRoleResponse {
  id: string;
  code: string;
}

// export interface RoleAPIElementType {
//   actAsWebPage: boolean
//   description:string
//   id: string
//   internalName:string
//   name:string
//   type:string
// }

export interface IBigcommerceStoreStatistics {
  itemsCount: {
    brand: number;
    category: number;
    currency: number;
    customer: number;
    order: number;
    product: number;
  };
  lastSyncedAt: string;
  syncStatus?: {
    status: string;
    syncingItems: {
      brands: {
        syncedCount: string;
        priority: string;
        totalCount: string;
      };
      categories: {
        syncedCount: string;
        priority: string;
        totalCount: string;
      };
      currencies: {
        syncedCount: string;
        priority: string;
        totalCount: string;
      };
      products: {
        syncedCount: string;
        priority: string;
        totalCount: string;
      };
      orders: {
        syncedCount: string;
        priority: string;
        totalCount: string;
      };
      customers: {
        syncedCount: string;
        priority: string;
        totalCount: string;
      };
    };
  };
}

export interface IBigcommerceStore {
  tenantId: string;
  workspaceId: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  storeHash: string;
  storeId?: string;
  createdBy: string;
  modifiedBy: string;
  id: string;
  createdAt: string;
  modifiedAt: string;
  _version_: string;
  store?: IBigcommerceStore;
  length?: number;
  storeName: string;
  environmentIds: string[];
  status: string;
  message: string;
  itemsCount: {
    brand: number;
    category: number;
    currency: number;
    customer: number;
    order: number;
    product: number;
  };
  lastSyncedAt: string;
  channelStatus: { [key: string]: boolean };
}

export interface ICreateBigcommerceStore {
  storeDetails: {
    environmentIds: string[];
    storeName: string;
    storeHash: string;
    accessToken: string;
    clientId: string;
    clientSecret: string;
  };
  ecommerceProvider: string;
}

export interface IBigcommerceStoreSyncLog {
  message: string;
  timestamp: string;
  // syncId: string;
  type?: string;
  logType?: string;
}

export interface ICreateBigcommerceStoreResponse {
  status: string;
  Data: {
    item: string;
  };
}

export interface DeleteStoreParameter {
  workspaceId: string;
  storeId?: string;
}

export interface ICreateContentfulStore {
  space_id: string;
  access_token: string;
  integration_environment_id: string;
}

export interface IContentfulStore {
  id: string;
  tenantId: string;
  workspaceId: string;
  integrationEnvironmentId: string;
  spaceId: string;
  accessToken: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ICreateContentfulStoreResponse {
  status: string;
  Data: {
    item: {
      id: string;
    };
  };
}

export interface ICreate301RedirectResponse {
  status: string;
  Data: {
    item: boolean;
  };
}

export interface Import301RedirectResponse {
  status: string;
  Data: {
    item: { id: string }[];
  };
}

export interface I301Redirect {
  id?: string;
  oldUrl?: string;
  newUrl?: string;
  createdBy?: string;
  modifiedAt?: string;
}

export interface I301RedirectDeleteObject {
  id: string;
  oldUrl: string;
  newUrl: string;
  createdBy: string;
  modifiedAt: string;
}

export interface IAPIError {
  response: {
    Status: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    Error?: {
      message: string;
      name: string;
      code?: string;
      errorCode?: string;
    };
  };
  status: number;
}

export interface IChangePassword {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
}

export interface FormFieldValues {
  fieldName?: string;
  selectValues?: string;
  helpText?: string;
  defaultValue?: string;
  regExPatten?: string;
  textRadioButton?: string;
  mediaRadioButton?: string;
  attachedField?: string;
  booleanDefaultValue?: boolean | null;
  validation?: string[];
  numberFormatSelect?: string;
  dateTypeSelect?: string;
  maximumLengthValue?: string;
  minimumLengthValue?: string;
  firstBaseFieldName?: string;
  relationSelect?: string;
  secondBaseFieldName?: string;
  selectComponents?: string;
  singleAndRepeatableComponents?: string;
  isSearchable?: boolean;
  destinationRelationFieldId?: string;
  destinationFieldName?: string;
  id?: string;
  selectDefaultValue?: string;
  multiSelectDefaultValue?: string[];
  contentModelDataId?: string;
  contentModelFieldDataId?: string;
  contentModalId?: string;
  versionId?: string;
  template?: string;
  placeholder?: string;
  versionName?: string;
  versionNo?: string;
  isEditable?: boolean;
  isRemovable?: boolean;
  environmentId?: string;

  selectModels?: string[];
}

export interface IField {
  fieldName?: string;
  title?: string;
  type?: string;
  fieldProperties?: FormFieldValues;
  destinationRelationFieldId?: string;
  destinationFieldName?: string;
  destinationField?: {
    title?: string;
    relationType?: string;
  };
  relationType?: string;
  destinationContentModelId?: string;
  isRequired?: boolean;
  isSearchable?: boolean;
  id?: string;
  selectDefaultValue?: string;
  componentId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DebouncedFunc<T extends (...args: any[]) => any> {
  /**
   * Call the original function, but applying the debounce rules.
   *
   * If the debounced function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invocation, or undefined if the debounced
   * function was not invoked yet.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /**
   * Throw away any pending invocation of the debounced function.
   */
  cancel(): void;

  /**
   * If there is a pending invocation of the debounced function, invoke it immediately and return
   * its return value.
   *
   * Otherwise, return the value from the last invocation, or undefined if the debounced function
   * was never invoked.
   */
  flush(): ReturnType<T> | undefined;
}

export interface IAxiosResponse<T> {
  response: {
    Data: T;
    Status: string;
  };
}

export interface RowRecord {
  [key: string]: string;
}

export interface ColumnRendererPropType {
  getText?: (record: RowRecord) => string | undefined;
  getColor?: (record: RowRecord) => string;
  getClassName?: (record: RowRecord) => string;
  isRemovable?: (record: RowRecord) => void;
  isEditable?: (record: RowRecord) => void;
  className?: string;
  showPopover?: (record: RowRecord) => boolean;
  key?: string;
  menuList?: {
    key: string;
    onClick: (id: string, row?: RowRecord) => void;
    label: string;
    getLabel?: (row: RowRecord) => string;
    className?: string;
  }[];
  popoverContent?: ReactNode;
  onPopoverButtonClick?: (id: string) => void;
  getLink?: (record: RowRecord) => string;
  getIcon?: (record: RowRecord) => JSX.Element | undefined | string;
  onEdit?: (record: RowRecord) => void;
  onDelete?: (record: RowRecord) => void;
  canSort?: (record: RowRecord) => boolean;
}

export interface setSelectedContent {
  id: string;
  type: string;
}

export interface IContentModalBreadcrumb {
  key: string;
  label: string;
  children?: {
    key: string;
    label: string;
  }[];
}

export interface GridColumnType extends ColumnType<object> {
  rendererType?: string;
  rendererProps?: ColumnRendererPropType;
}

export interface OptionType {
  label: string;
  value?: string | number | null;
  key?: string;
  children?: string;
}

export interface HandlerType {
  [key: string]: RestHandler;
}

export interface GridParams {
  [key: string]: string | number;
}

export interface IWorkspaceParams {
  workspaceId: string;
}

export interface IDashboardParams {
  workspaceId: string;
  dashboardType: string;
}

export interface INavigationParams {
  menuId: string;
}

export interface IContentRecordParams {
  fieldsToQuery?: string;
  search?: string;
  skip: number;
  limit: number;
  fieldsDataToQuery: string;
  isCallFromMenu?: boolean;
}

export interface IRuleListParams {
  workspaceId: string;
  contentModelId: string;
  subMenu?: string;
}

export interface IDetailAudienceuser {
  id: string;
  device_id: string;
  name: string;
  username: string;
  email: string;
  organization: string;
  phone: string;
  gender: string;
  byear: number;
  custom_properties: string;
  device_name: string;
  device_type: string;
  device_vendor: string;
  device_version: string;
  device_category: string;
  device_resolution: string;
  device_density: string;
  os_name: string;
  os_version: string;
  country: string;
  region: string;
  city: string;
  lat: number;
  long: number;
  locale: string;
  continent: string;
  postal_code: string;
  ip: string;
  first_session_start: Date;
  last_session_start: Date;
  last_seen_at: Date;
  last_purchase_date: Date;
  last_purchase_count: number;
  last_purchase_amount: number;
  total_session_count: number;
  last_session_duration: number;
  total_duration: number;
  last_session_view_count: number;
  last_view: string;
  last_session_id: string;
  last_view_id: string;
  last_view_url: string;
  consents: string;
  tenant_id: string;
  workspace_id: string;
  environment_id: string;
}

export interface IContent {
  name: string;
  type: string;
  id: string;
  internalName: string;
  created_at?: string;
  description?: string;
  actAsWebPage?: string;
  template?: string;
}

export interface IRecord {
  title: string;
  status: string;
  id: string;
  created_at?: string;
  description?: string;
  actAsWebPage?: string;
  template?: string;
}

export interface FormFileProps {
  selectedField?: {
    key: string;
    icon: ReactNode;
    title: string;
    subTitle: string;
    fields: {
      default?: string[];
      validation?: string[];
      more?: string[];
      advanced_setting?: string[];
      base_setting?: string[];
    };
  };
  maximumInputVisible?: boolean;
  minimumInputVisible?: boolean;
  isCreateNewComponent?: boolean;
  isComponentFieldModalOpen?: boolean;
  defaultSelectValue?: string[];
  internalFieldName?: string;
  minimumInputValue?: number;
  maximumInputValue?: number;
  onBlur?: () => void;
  editContentFieldStatus?: boolean;
  internalFieldNameChange?: (e: string) => void;
  editInternalFieldName?: string;
  extensionName?: string;
  initialSelectedModals?: string[];
}

export interface IFolder {
  id: string;
  name: string;
  parentFolderId?: string;
  isAllMedia?: boolean;
  type?: string;
  size?: number;
}

export interface ContentField {
  id: string;
  type: string;
  title: string;
  fields?: ContentField[];
  fieldName: string;
  contentModelId: string;
}

export interface ListFieldResponse {
  id: string;
  type: string;
  title: string;
  fieldName: string;
  contentModelId: string;
}

export interface ITreeFolder {
  key: string;
  label: JSX.Element;
  parentFolderId?: string;
  icon: JSX.Element;
  children?: {
    key: string;
    label: JSX.Element;
    parentFolderId?: string;
    icon: JSX.Element;
  }[];
}

export interface ISubFolder {
  id: string;
  name: string;
  count?: number;
  createdBy?: string;
  owner?: string;
  parentFolderId?: string;
  type?: string;
  foldersCount?: number;
  filesCount?: number;
}

export interface IFile {
  createdBy?: string;
  folderId?: string;
  id: string;
  name: string;
  size?: number;
  sizeWithType?: string;
  type?: string;
  url?: string;
  owner?: string;
  totalFiles?: number;
  publicUrl?: string;
}

export type BreadcrumbItemType = 'file' | 'folder' | 'ellipsis';

export interface IFolderBreadcrumb {
  key: string;
  label: string;
  type: BreadcrumbItemType;
}

export interface IFolderBreadcrumbItem {
  id: string;
  title: string;
  type: BreadcrumbItemType;
  isClickable: boolean;
  menu?: { key: string; label: string }[];
}

export interface IMedia {
  id: string;
  name: string;
  count: number;
  createdBy: string;
  owner?: string;
  folderId?: string;
  size: number;
  sizeWithType?: string;
  type: string;
  url?: string;
  foldersCount?: number;
  filesCount?: number;
}

export interface IFileDetails {
  id: string;
  caption: string;
  altText: string;
  contentType: string;
  type: string;
  size: number;
  sizeWithFormat: string;
  name: string;
  url: string;
  createdBy: string;
  createdByUser?: string;
  createdAt: string;
  modifiedAt: string;
  publicUrl: string;
}

export interface IMediaList {
  id: string;
  name: string;
  type?: string;
  count?: number | undefined;
  createdBy?: string | undefined;
  owner?: string | undefined;
  parentFolderId?: string | undefined;
}

export interface IDeleteFile {
  id: string;
  extension: string | undefined;
}

export interface IGlobalSearch {
  isLoading: boolean;
  files: {
    id: string;
    name: string;
    type: string;
    size: number;
  }[];
  folders: {
    id: string;
    name: string;
    parentFolderId: string;
  }[];
  fileCount: number;
}

export interface ISearchFiles {
  id: string;
  name: string;
  type: string;
  size: number;
  createdBy: string;
  modifiedAt: string;
  sizeWithType: string;
  createdAt?: string;
  folderId?: string;
}

export interface IGlobalSearchFiles {
  items: {
    files: ISearchFiles[];
    fileCount: number;
  };
}

export interface IGlobalSearchFolders {
  items: {
    folders: {
      id: string;
      name: string;
      parentFolderId: string;
      createdBy: string;
      count?: number;
      filesCount?: number;
    }[];
  };
}

export interface IContentLibraryFieldPops {
  name?: string;
  pageSlug?: string;
  pageTitle?: string;
  status?: string;
  template?: string;

  internalName?: string;

  relationType?: string;
  versionId?: string;
  title?: string;
  type?: string;
  contentModalFieldDataId?: string;
  isRequired?: boolean;
  fieldProperties: FormFieldValues;
  editValue?: string | string[];
  componentName?: string;
  values?: IContentLibraryFieldPops[];
  js_object?: { [key: string]: string };
  singleAndRepeatableComponents?: boolean;
  temp: [];
  RepeatableComponent?: boolean;
  rComponent?: [IContentLibraryFieldPops];
  isEditable?: boolean;
  isDataEditable?: boolean;
  isSystemField?: boolean;
}

export interface ISelectedFiles {
  id: string;
  absolutePath: string;
  createdAt: string;
  createdBy: string;
  description: string;
  folderId: string;
  modifiedAt: string;
  name: string;
  publicUrl: string;
  size: string;
  sizeWithType: string;
  totalFiles: number;
  type: string;
  url: string;
  parentFolderId?: string;
  isAllMedia?: boolean;
  owner?: string;
  createdByUser?: string;
  sizeWithFormat?: string;
}

export interface ICreateTitle {
  key: string;
  label: string;
  description?: string;
  actAsWebPage?: string;
  template?: string;
  contentModelDataId: string;
  versionId: string;
  contentModalId?: string;
}

export interface ListRecordResponse {
  id: string;
  title?: string;
  languages?: string;
  createdBy?: string;
  Status?: string;

  isSelected: boolean;
  contentModelData: {
    id: string;
    title: string;
    pageSlug: string;
    currentVersionId: string;
  };
  versionData: {
    id: string;
    template: string;
    versionName: string;
    versionNo: string;
    status: string;
    publishAt?: string;
    unpublishAt?: string;
  };
  contentModelFieldData: {
    id: string;
    language: string;
    contentModelId: string;
    isLocalizationEnabled: boolean;
    modifiedAt: string;
    modifiedBy: string;
    createdAt: string;
    createdBy: string;
  };
  nextVersionNo: string;
  storeHash: string;
}

export interface IPublishRecord {
  contentModalId: string;
  contentModelDataId: string;
  versionId: string;
  environmentId: string[];
}

export interface IPublishRecord {
  contentModalId: string;
  contentModelDataId: string;
  versionId: string;
}

export interface IMerchandisingAddRule {
  hideAddRule: () => void;
  onAddRule?: () => void;
  addParentRule: boolean;
  setAddParentRule: (addRule: boolean) => void;
  initialValue?: IRule;
  setInitialValue: (initialValue: IRule) => void;
  environment: string | null;
  setIsAddRuleButtonVisible: (isAddRuleButtonVisible: boolean) => void;
}

export interface IMerchandisingAddRuleController {
  hideAddRule: () => void;
}

export interface IRule {
  title?: string;
  description?: string;
  environmentsId?: string[] | string;
}

export interface ICreateRuleResponse {
  contentModelDataId: string;
  contentModelId: string;
  contentModelFieldDataId: string;
  versionId: string;
  environmentsId?: string;
}

export interface IUpdateRuleRequest {
  contentModelFieldDataId?: string;
  contentModelId?: string;
  contentModelDataId?: string;
  descriptionEt?: string;
  ruleTitleEti?: string;
  ruleTypeEsi?: string;
  versionId?: string;
  statusEsi?: string;
  enabledEbi?: boolean;
  startDateEdti?: string;
  endDateEdti?: string;
  audienceIdEsi?: string;
  searchTermsEslai?: string[];
  categoriesEslai?: string[];
  pinEj?: PinEj[];
  sortEj?: SortEj[];
  slotEj?: SlotEj[];
  rulesEj?: RulesEj[];
  globalTermsEslai?: string[] | string;
  categories?: string | string[];
  categoryId?: string | string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryIdEsai?: any;
  searchTerms?: string;
  Version_?: string;
  modifiedAt?: Date;
  isLocalizationEnabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  environmentsId?: any;
}

export interface SortCondition {
  fieldInternalName?: string;
  order?: string;
  fieldType?: string;
}

export interface SortEj {
  name?: string;
  id?: string;
  conditions?: SortCondition[];
}

export interface SlotCondition {
  fieldName?: string;
  fieldInternalName?: string;
  fieldType?: string;
  value?: string;
  action?: string;
}

export interface SlotEj {
  name?: string;
  id?: string;
  start?: number;
  end?: number;
  conditions?: SlotCondition[];
}

export interface RuleCondition {
  fieldName?: string;
  fieldInternalName?: string;
  fieldType?: string;
  value?: string;
  action?: string;
}

export interface RulesEj {
  name?: string;
  id?: string;
  operation?: string;
  strength?: number;
  conditions?: RuleCondition[];
}

export interface FixedProductCondition {
  id?: number;
  position?: number;
}

export interface FixedProductsEj {
  name?: string;
  id?: string;
  condition?: FixedProductCondition[];
}

export interface PinCondition {
  id?: string;
  image?: string;
  name?: string;
  position?: string | number | null | undefined;
  sku?: string;
}

export interface PinEj {
  name?: string;
  id?: string;
  conditions?: PinCondition[];
}

export interface DynamicFieldsData {
  enabledEbi?: boolean;
  startDateEdti?: string;
  endDateEdti?: string;
  ruleTypeEsi?: string;
  audienceIdEsi?: string;
  ruleTitleEti?: string;
  descriptionEt?: string;
  searchTermsEslai?: string[];
  categoriesEslai?: string[];
  pinEj?: PinEj[];
  sortEj?: SortEj[];
  slotEj?: SlotEj[];
  rulesEj?: RulesEj[];
  globalTermsEslai?: string[] | string;
  categories?: string | string[];
  categoryId?: string | string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryIdEsai?: any;
  searchTerms?: string;
  environmentsId?: string[];
  statusEsi?: string;
  Version_?: string;
  modifiedAt?: Date;
  isLocalizationEnabled?: boolean;
}

export interface IRuleData {
  versionId: string;
  language?: string;
  dynamicFieldsData: DynamicFieldsData;
}

export interface IListRuleProductDynamicFieldRequest {
  environmentsId: string;
  dynamicFieldsData: DynamicFieldsData;
}

export interface IListPreviewProductDynamicFieldRequest {
  environmentsId: string;
  dynamicFieldsData: DynamicFieldsData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listPreviewData?: any;
}

export interface IRuleResponse {
  id: string;
  title?: string;
  language?: string;
  createdBy: string;
  status?: string;
  currentVersionId?: string;
  contentModelData?: {
    id: string;
    title: string;
    pageSlug: string;
  };
  contentModelFieldData: DynamicFieldsData;
  modifiedBy?: string;
}

export interface ContentModelData {
  tenantId: string;
  workspaceId: string;
  contentModelId: string;
  title?: string;
  titleS: string;
  internalName: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  id: string;
  modifiedAt: Date;
  currentVersionId: string;
  language: string[];
  _version_: string;
}

export interface VersionData {
  tenantId: string;
  workspaceId: string;
  contentModelId: string;
  contentModelDataId: string;
  versionNo: number;
  versionName: string;
  status: string;
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  id: string;
  _version_: string;
}

export interface ContentModelFieldData {
  ruleTitleEti?: string;
  descriptionEt?: string;
  modifiedAt: Date;
  tenantId: string;
  workspaceId: string;
  contentModelId: string;
  contentModelDataId: string;
  versionId: string;
  language: string;
  modifiedBy: string;
  id: string;
  createdAt: Date;
  _version_: string;
  isLocalizationEnabled?: boolean;
  pinEj?: PinEj[];
  sortEj?: SortEj[];
  slotEj?: SlotEj[];
  rulesEj?: RulesEj[];
  startDateEdti?: string;
  endDateEdti?: string;
  statusEsi?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalTermsEslai?: any;
  categories?: string | string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryId?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryIdEsai?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchTermsEslai?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoriesEslai?: any;
  searchTerms?: string;
  environmentsId: string[];
  environmentId: string[];
}

export interface IRuleList {
  nextVersionNo: number;
  contentModelData: ContentModelData;
  versionData: VersionData;
  contentModelFieldData: ContentModelFieldData;
}

export interface createUpdateSiteRuleParams {
  workspaceId: string;
  versionId: string;
  contentModalId: string;
  contentModalDataId: string;
  environmentId: string;
  subMenu?: string;
}

export interface ICreateUpdateRule {
  t: TFunction<'translation', undefined>;
  subMenu?: string;
  onSave: (values: ICreateRuleRequest) => void;
  hideAddRule: () => void;
  initialValue?: IRule;
  workspaceId: string;
  selectedEnvironment?: string | null;
  buttonLoading?: boolean;
}

export interface IListRules {
  contentModelId: string;
  title: string;
  versionId: string;
  description: string;
  endDateEdti: string;
  startDateEdti: string;
  id: string;
  ruleTypeEsi: string;
  statusEsi: string;
  createdBy?: string;
  createdAt?: string;
  modifiedAt?: string;
  modifiedBy?: string;
}

export interface IMerchandisingRouteController {
  workspaceId: string;
  contentModalId?: string;
  contentModalDataId?: string;
  subMenu?: string;
  versionId?: string;
  hideAddRule: () => void;
  environmentId?: string;
}

export interface IListRule {
  hideAddRule: () => void;
  onAddRule?: () => void;
  addParentRule: boolean;
  onSave: (values: ICreateRuleRequest) => void;
  environment: string | null;
  buttonLoading: boolean;
  setIsAddRuleButtonVisible: (isAddRuleButtonVisible: boolean) => void;
  isAddRuleButtonVisible: boolean;
  onDuplicateRule: (rule: IRuleRowRecord) => void;
}

export interface ICreateUpdateRules {
  hideAddRule: () => void;
  addParentRule: boolean;
  setAddParentRule: (addRule: boolean) => void;
  initialValue?: IRule;
  setInitialValue: (initialValue: IRule) => void;
}

export interface RuleList {
  subMenuItem?: string;
  onAddRule?: () => void;
}

export interface IRuleName {
  title: string;
  description: string;
  id: string;
}

export interface IRuleRowRecord {
  contentModelId: string;
  createdBy?: string;
  currentVersionId: string;
  description: string;
  environmentId: string[];
  id: string;
  language: string[];
  ruleTitleEti: string;
  ruleTypeEsi: string;
  statusEsi: string;
  title: string;
  versionId: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pinEj?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortEj?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slotEj?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rulesEj?: any;
}

export interface IRuleCondition {
  fieldInternalName?: string;
  action?: string;
  value?: string;
}

export interface ISlotCondition {
  fieldInternalName: string;
  operation: string;
  value: string;
}

export type RuleType = 'rules' | 'sort' | 'slot' | 'pin';

export type SpecialFormItemProps = FormItemProps & {
  type:
    | 'input'
    | 'select'
    | 'tree-select'
    | 'textarea'
    | 'date'
    | 'password'
    | 'checkbox';
  label: string;
};

export interface IListProductResponse {
  id?: string;
  nameEti?: string;
  skuEsi?: string;
  imagesEj?: string;
  position?: number | null | string;
}

export interface IPinSubmit {
  name: string;
  productName: string;
}

export interface FacetList {
  id: string;
  category: string;
  facets: string[];
  environmentId: string;
  storeId: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface MasterFacetList {
  count: number;
  fieldName: string;
  fieldType: string;
  id: string;
  title: string;
  type: string;
}

export interface FacetByCategory {
  id: string;
  category: string;
  environmentId: string;
  facets: string;
  storeId: string;
  isEnabled: boolean;
  isExist: boolean;
}

export interface ICreateRuleRequest {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  environmentsId: any;
}

export interface IListProductItems {
  id?: string;
  nameEti?: string;
  skuEsi?: string;
  descriptionEti?: string;
  categoriesEtai: string;
  providerIdEsi: number | string;
  pin: boolean;
  urlThumbnail: string;
  isFeaturedEbi: string;
  calculatedPriceEfi: string;
  slot: boolean;
  brandEsi: string;
  pageSlugEsi?: string;
  productAppearedInSearchEii?: number | string;
  viewsEii?: number | string;
  ordersEii?: number | string;
  revenueEfi?: string;
  clickRateEfi?: string;
  conversionRateEfi?: string;
  profitPercentageEfi?: number | string;
}

export interface IListProductsResponseToOut {
  items: IListProductItems[];
}

export interface PublishQueue {
  id: string;
  environmentId: string;
  contentModelVersionName: string;
  contentModelVersionNumber: string;
  action: string;
  createdBy: string;
  CreatedAt: string;
  environmentTitle: string;
}

export interface ModelData {
  name: string;
  internalName: string;
  type: string;
  isLocalizationEnabled: boolean;
  actAsWebPage?: boolean;
  description?: string;
  template?: string;
  groupId?: string;
  id?: string;
  position?: number;
  contentModelId?: string;
}

export interface ContentModelList {
  id: string;
  name: string;
  description: string;
  groupId: string;
  template: string;
  internalName: string;
  type: string;
  isLocalizationEnabled: boolean;
  actAsWebPage: boolean;
  position: number;
  isVisible: boolean;
  environmentId: string[];
  isSystemCreated: boolean;
  edgeCaching: boolean;
  isVersionable: boolean;
}

export interface ModelGroupList {
  id: string;
  name: string;
  position: number;
}

export interface ICmsDashboard {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
}

export interface IMediaRecordCounts {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  startDate?: string;
  endDate?: string;
}

export interface ICategory {
  category: string;
  total: number;
  reverseColor: boolean;
  index: number;
}

export interface IData {
  name: string;
  data: number[];
}

export interface NewCount {
  categories: ICategory[];
  data: IData[];
}

export interface NewDuration {
  categories: ICategory[];
  data: IData[];
}

export interface NewSum {
  categories: ICategory[];
  data: IData[];
}

export interface NewUsers {
  categories: ICategory[];
  data: IData[];
}

export interface TotalCount {
  categories: ICategory[];
  data: IData[];
}

export interface TotalDuration {
  categories: ICategory[];
  data: IData[];
}

export interface TotalSum {
  categories: ICategory[];
  data: IData[];
}

export interface TotalUsers {
  categories: ICategory[];
  data: IData[];
}

export interface RootObject {
  response: {
    newCount: NewCount;
    newDuration: NewDuration;
    newSum: NewSum;
    newUsers: NewUsers;
    totalCount: TotalCount;
    totalDuration: TotalDuration;
    totalSum: TotalSum;
    totalUsers: TotalUsers;
  };
}

export interface IRecentlyAddedRecordsDashboardResponse {
  id: string;
  contentModelId: string;
  title: string;
  language: string;
  currentVersionId: string;
  createdBy: string;
  createdAt: string;
  contentModelName: string;
  contentModelFieldId: string;
  type: string;
}

export interface IRecentlyModifiedRecordsDashboardResponse {
  id: string;
  contentModelId: string;
  title: string;
  language: string;
  currentVersionId: string;
  modifiedAt: string;
  modifiedBy: string;
  contentModelName: string;
  contentModelFieldId: string;
  type: string;
}

export interface IRecentlyScheduledRecordsDashboardResponse {
  id: string;
  contentModelId: string;
  title: string;
  language: string;
  currentVersionId: string;
  createdAt: string;
  createdBy: string;
  contentModelName: string;
  contentModelFieldId: string;
  type: string;
}

export interface IPublishedRecordResponse {
  id: string;
  contentModelId: string;
  title: string;
  language: string;
  currentVersionId: string;
  publishedAt: string;
  publishedBy: string;
  contentModelName: string;
  contentModelFieldId: string;
  type: string;
}

export interface IGroupDetailsResponse {
  name: string;
  description: string;
  roles: string[];
  users: string[];
}

export interface ReorderObject {
  id: string;
  name: string;
  position: number;
}

export interface ICreateLanguageRequest {
  language_id: string;
}

export interface CreateLanguageRequest {
  languageId: string;
  workspaceId: string;
}

export interface ReOrderInternationalizationRequest {
  language: { workspaceLanguageId: string; position: number }[];
}

export interface IReOrderLanguageInfo {
  languages: { workspaceLanguageId: string; position: number }[];
  workspaceId: string;
}

export interface IDeleteWorkspaceLanguageRequest {
  workspaceId: string;
  languageId: string;
}

export interface IPinDataResponse {
  id?: string;
  nameEti?: string;
  skuEsi?: string;
  descriptionEti?: string;
  categoriesEtai: string[];
  imagesEj: string;
  providerIdEs: number;
}

export interface IListPublishQueueResponse {
  id?: string;
  title: string;
  languages?: string[];
  createdBy?: string;
  createdAt?: string;
  environments?: { [k: string]: string };
  contentModelVersionName?: string;
  action?: string;
  modalName?: string;
  contentModelId?: string;
  contentModelName?: string;
}

export interface ICreateWorkspaceResponse {
  id: string;
  storeLink: string;
}

export interface IListWorkspaceUserResponse {
  id: string;
  firstName: string;
  lastName: string;
}

export interface DetailsTableProps {
  rows: {
    label: string;
    value?: JSX.Element | string;
  }[];
}

export interface IFilterProps {
  onChange: (filter: string) => void;
  minSearchableLength?: number;
  searchText?: string;
  className?: string;
}

export interface PieChartData {
  title: { textAlign: string; verticalAlign: string; text: string };
  credits: { enabled: boolean };
  colors: string[];
  chart: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plotBackgroundColor?: any;
    plotBorderWidth: number;
    plotShadow: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events: any;
  };
  connectorPadding: number;
  tooltip: {
    headerFormat: string;
    pointFormat: string;
    style: { color: string };
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
    borderWidth: number;
    display: string;
  };
  plotOptions: {
    pie: {
      allowPointSelect: boolean;
      cursor: string;
      dataLabels: { enabled: boolean };
      showInLegend: boolean;
    };
  };
  series: {
    name: string;
    colorByPoint: boolean;
    innerSize: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[][];
  }[];
}

export interface IForgotPassword {
  email: string;
}

export interface listEnvironmentData {
  id: string;
  tenantId: string;
  workspaceId: string;
  title: string;
  type: string;
  customDomain: string;
  suffix: string;
  workspaceDomain: string;
  enablePasswordProtect: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passwordHash?: any;
  enableMaintenance: boolean;
  enableSiteCrawler: boolean;
  siteMapUrl: string;
  envHash: string;
  isSystemCreated: boolean;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  modifiedAt: string;
  httpRobots: string;
  pointYourDomain: boolean;
}

export interface listUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roles: any[];
}

export interface IListEnvironment {
  status: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
  data?: listEnvironmentData[];
  dataUpdatedAt: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  errorUpdatedAt: number;
  failureCount: number;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  isLoadingError: boolean;
  isPlaceholderData: boolean;
  isPreviousData: boolean;
  isRefetchError: boolean;
  isStale: boolean;
}

export interface IListUsers {
  status: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
  data?: listUserData[];
  dataUpdatedAt: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  errorUpdatedAt: number;
  failureCount: number;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  isLoadingError: boolean;
  isPlaceholderData: boolean;
  isPreviousData: boolean;
  isRefetchError: boolean;
  isStale: boolean;
}

export interface IListWorkspaceLanguagesPublishQueue {
  status: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
  data?: ILanguage[];
  dataUpdatedAt: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  errorUpdatedAt: number;
  failureCount: number;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  isLoadingError: boolean;
  isPlaceholderData: boolean;
  isPreviousData: boolean;
  isRefetchError: boolean;
  isStale: boolean;
}

export interface IModelListDataPublishQueue {
  status: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
  data?: ContentModelList[];
  dataUpdatedAt: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  errorUpdatedAt: number;
  failureCount: number;
  errorUpdateCount: number;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  isLoadingError: boolean;
  isPlaceholderData: boolean;
  isPreviousData: boolean;
  isRefetchError: boolean;
  isStale: boolean;
}

export interface IRecentRecords {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

export interface IPublishQueueHeader {
  onBackButtonClick: () => void;
  t: TFunction<'translation', undefined>;
}

export interface IPublishQueueDataType {
  id?: string;
  title?: string;
  languages?: string[];
  environments?: { [k: string]: string };
  key?: string;
  contentModelVersionName?: string;
  createdBy?: string;
  createdAt?: string;
  action?: string;
  modalName?: string;
  contentModelName?: string;
}

export interface IContentPublishQueue {
  userPreference: string[];
  onPreferenceChange: (checkedPublishQueueFields: CheckboxValueType[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listPublishQueue: any;
  columns: GridColumnType[];
  currentPageNumber: number;
  skipLimit: number;
  selectedUserIds: string[];
  selectedModelIds: string[];
  selectedStatus: string[];
  setSearchData: (searchData: string) => void;
  setCurrentPageNumber: (currentPageNumber: number) => void;
  setSkip: (skip: number) => void;
  setSkipLimit: (skipLimit: number) => void;
  setSelectedUserIds: (selectedUserIds: string[]) => void;
  setSelectedModelIds: (selectedModelIds: string[]) => void;
  setSelectedStatus: (selectedStatus: string[]) => void;
  isSuccess: boolean;
}

export interface ISortCondition {
  fieldInternalName?: string;
  order?: string;
}

export interface ILinkData {
  id: string;
  linkName: string;
  mfaTypes: string[];
  name: string;
}

export interface LinkResponse {
  items: ILinkData[];
}

export interface ISetPasswordRequest {
  password: string;
  captchaToken: string | null;
}

export interface IForgetPasswordRequest {
  email: string;
  captchaToken: string | null;
}

export interface ImportFormValues {
  importFileData: {
    file: Blob;
  };
}

export interface RedirectFormValues {
  oldURL: string;
  newURL: string;
}

export interface IGetSmtpEmailsResponse {
  id: string;
  isSmtpEnable: boolean;
  fromName: string;
  fromEmail: string;
  smtpHost: string;
  smtpPort: string;
  isAuthenticationEnable: boolean;
  encryptionType: string;
  smtpUsername?: string;
  smtpPassword?: string;
}

export interface IGetPhraseEmailsResponse {
  id: string;
  name: string;
  shortCode: string;
  value: string;
}

export interface IAddPhrasesEmailsRequest {
  name: string;
  value: string;
  shortCode: string;
}

export interface IAddPhrasesEmailsResponse {
  id: string;
}

export interface IListTemplateEmailsResponse {
  id: string;
  name: string;
  htmlContent: string;
  environmentIds: string[];
  environments?: string[];
  subject?: string;
  isActive: boolean;
  isDefault: boolean;
}

export interface ICloneTemplateEmailsRequest {
  templateId: string;
}

export interface ICloneTemplateEmailsResponse {
  id: string;
}

export interface ICreateUpdateTemplatesEmailsController {
  workspaceId: string;
  templateId: string;
  cloned: string;
  masterTemplateId: string;
}

export interface ICreateUpdateTemplatesEmailsUpdate {
  name: string;
  masterTemplateName: string;
  environmentIds: string[];
  masterTemplateId?: string;
  htmlContent?: string;
  subject?: string;
}

export interface IGetTemplateEmailResponse {
  id: string;
  htmlContent: string;
  environmentIds: string[];
  masterTemplateId: string;
  masterTemplateName: string;
  name: string;
  subject: string;
}

export interface IListMasterTemplateEmailsResponse {
  id: string;
  name: string;
}

export interface ILinkOrganizationData {
  id: string;
  name: string;
  linkName: string;
  mfaTypes: string[];
}

export interface ISwitchOrganization {
  isVisibleSwitchOrganizationModal: boolean;
  t: TFunction<'translation', undefined>;
  hideSwitchOrganizationModal: () => void;
  isSwitchButtonVisible: boolean;
  onSubmitOrganization: () => void;
  form: FormInstance;
  linksOrganization?: { items: ILinkOrganizationData[] };
  selectedOrganizationData?: ILinkData;
  onSwitchOrganization: (value: string) => void;
}

export interface IAppLIst {
  categoryId: string;
  description: string;
  id: string;
  integrationName: string;
  integrationInternalName: string;
  categoryInternalName: string;
  categoryName: string;
  spaceId: string;
  accessToken: string;
  isEnabled: boolean;
  configuration: string;
  isInstalled: boolean;
  integrationEnvironmentId: string;
  active?: boolean;
  sortOrder: number;
}

export interface IShopifyStoreResponse {
  id: string;
  environmentIds: string[];
  name: string;
  storeName: string;
  storefrontAccessToken: string;
  storefrontApiKey: string;
  storefrontSecretKey: string;
  adminAccessToken: string;
  adminApiKey: string;
  adminSecretKey: string;
  storeDomain: string;
  status: string;
  message: string;
  createdAt: string;
  lastSyncedAt: string;
  createdBy: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface IIndustry {
  categoryId: string;
  category: string;
}

export interface ICreateSpellCheck {
  canonicalForm: string;
  surfaceForm: string[];
  displayForm: string[];
  isApproved: boolean;
  isUserDefined?: boolean;
  environmentId: string[] | string;
}

export interface ICreateStopWords {
  canonicalForm: string;
  surfaceForm: string[];
  displayForm: string[];
  isApproved: boolean;
  isUserDefined: boolean;
  environmentId: string[] | string;
}

export interface IListSpellCheck {
  canonicalForm: string;
  surfaceForm: string[];
  environmentId: string[];
  confidence: number;
  frequency: number;
  source: string;
  suggestedAt: string;
  createdBy: string;
  createdAt: string;
  modifiedAt: string;
  publishedAt: string;
  publishedBy: string;
  id: string;
  modifiedBy: string;
  isActive?: boolean;
  status: string;
  isApproved: boolean;
  isUserDefined: boolean;
  isDeleted: boolean;
  type: string;
  _version_: string;
}

export interface IListPhrases {
  tenantId: string;
  workspaceId: string;
  canonicalForm: string;
  canonicalFormEsli: string;
  wordCount: number;
  isApproved: boolean;
  isUserDefined: boolean;
  isDeleted: boolean;
  type: string;
  suggestedAt: string;
  modifiedAt: string;
  modifiedBy: string;
  environmentId: string[] | string;
  isActive?: boolean;
  status: string;
  createdBy: string;
  createdAt: string;
  activeBy: string;
  activeAt: string;
  id: string;
  inActiveAt: string;
  inActiveBy: string;
  _version_: string;
  surfaceForm: string[];
  confidence: number;
  frequency: number;
  source: string;
}

export interface IPatchSpellCheck {
  // eslint-disable-next-line
  spellCheckIds: any;
  status: string;
}

export interface IRequestSpellCheck {
  canonicalForm: string;
  surfaceForm: string | string[];
  isApproved: boolean;
  isUserDefined: boolean;
  environmentId: string[] | string;
}

export interface IListStopWordsArray {
  // eslint-disable-next-line
  term: any;
  key: string;
  frequency: string;
  suggested_on: string;
  published_on: string;
  published_by: string;
  modified_on: string;
  modified_by: string;
}

export interface IListStopWords {
  id: string;
  canonicalForm: string;
  confidence: string;
  frequency: string;
  source: string;
  suggestedAt: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  isActive?: string;
  status: string;
  modifiedBy: string;
  isUserDefined?: boolean;
}

export interface IListSynonyms {
  id: string;
  canonicalForm: string;
  surfaceForm: string[];
  synonymsType: string;
  synonyms: string;
  confidence: string;
  frequency: string;
  source: string;
  suggestedAt: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  isActive?: string;
  status: string;
  modifiedBy: string;
  isUserDefined?: boolean;
}

export interface IPatchStopWords {
  stopWordsIds: React.Key[] | string[];
  status: string;
}

export interface IPatchSynonyms {
  synonymsIds: React.Key[] | string[];
  status: string;
}

export interface ISynonyms {
  canonicalForm: string;
  synonymsType: string;
  surfaceForm: string;
  displayForm: string[];
  isApproved: boolean;
  isUserDefined?: boolean;
  environmentId: string[] | string;
}

export interface IPatchPhrases {
  phrasesIds: React.Key[] | string[];
  status: string;
}

export interface IPhrases {
  canonicalForm: string;
  surfaceForm: string[];
  displayForm: string[];
  isApproved?: boolean;
  isUserDefined?: boolean;
  environmentId: string[] | string;
}

export interface IDetailSynonyms {
  Version_: string;
  activeAt: string;
  activeBy: string;
  canonicalForm: string;
  canonicalFormEsli: string;
  createdAt: string;
  createdBy: string;
  environmentId: string[] | string;
  id: string;
  inActiveAt: string;
  isActive: boolean;
  isApproved: boolean;
  isDeleted: boolean;
  isUserDefined: boolean;
  modifiedAt: string;
  modifiedBy: string;
  suggestedAt: string;
  surfaceForm: string[];
  synonymsType: string;
  tenantId: string;
  type: string;
  workspaceId: string;
}

export interface IThemeStatus {
  [key: string]: boolean;
}

export interface IListThemeResponse {
  id: string;
  tenantId: string;
  workspaceId: string;
  publishEnvironmentId: string;
  publishAt: string;
  versionHash: string;
  status: string;
  name: string;
  description: string;
  // eslint-disable-next-line
  images: any;
  // eslint-disable-next-line
  themeId: any;
  createdAt: string;
  modifiedAt: string;
  hasSourceCode: boolean;
  isPublishing: boolean;
  publishedBy: string;
  publishByToken: string;
}

export interface IReRankingStrategy {
  strategy: string;
  properties: null | {
    sortOrders: {
      level1: string;
      level2: string;
    };
    fieldsWeightage?: Array<{ title: string; percentage: number }>;
  };
}

export interface IReRankingStrategyDisplay {
  id: string;
  title: string;
  subTitle: string;
  isEnabled: boolean;
  products: {
    image: string;
    text?: string;
    value?: string;
    valueColor?: string;
  }[];
}

export interface IReRankingStrategyCostPrice {
  isRevenueEfi: boolean;
  isConversionRateEfi: boolean;
  isProfitPercentageEfi: boolean;
}

export interface ISearchSettingResponse {
  id: string;
  isEnabled: boolean;
  isSmartSuggestion: boolean;
  smartSuggestionProperty?: {
    isAutomate?: boolean;
    confidenceObject?: {
      pending?: number;
      publish?: number;
      reject?: number;
    };
  };
  type: string;
}

export interface IUpdateSetting {
  isEnabled?: boolean;
  isSmartSuggestion?: boolean;
  smartSuggestionProperty?: {
    isAutomate?: boolean;
    confidenceObject?: {
      pending?: number | null;
      publish?: number | null;
      reject?: number | null;
    };
  };
}

export interface IListAlgorithm {
  algorithmApiUrl: string;
  createdAt: string;
  createdBy: string;
  environmentsId: string[] | string;
  id: string;
  internalName: string;
  isSystemGenerated: string;
  modifiedAt: string;
  modifiedBy: string;
  name: string;
}

export interface ICreateWidgetRuleResponse {
  contentModelDataId: string;
  contentModelId: string;
  contentModelFieldDataId: string;
  versionId: string;
  environmentsId?: string | null | undefined | string[];
  id?: string;
}

export interface ICreateWidgetRule {
  title?: string;
  name?: string;
  description?: string;
  environmentsId?: string | string[];
  dynamicFieldsData: {
    environmentId: (string | null | undefined)[];
    ruleTitleEti: string;
    descriptionEti: string;
    widgetTitleEti?: string;
    widgetDescriptionEti?: string;
    widgetIdEsi?: string;
    widgetRuleApplicableOnEsi: string;
    statusEsi: string;
    isSystemGeneratedEbi?: boolean;
    algorithmInternalName?: string;
  };
}

export interface IWidgetContentModelFieldData {
  ruleTitleEti?: string;
  descriptionEt?: string;
  modifiedAt: Date;
  tenantId: string;
  workspaceId: string;
  contentModelId: string;
  contentModelDataId: string;
  versionId: string;
  language: string;
  modifiedBy: string;
  id: string;
  createdAt: Date;
  _version_: string;
  isLocalizationEnabled: boolean;
  pinEj?: PinEj[];
  sortEj?: SortEj[];
  slotEj?: SlotEj[];
  rulesEj?: RulesEj[];
  startDateEdti?: string;
  endDateEdti?: string;
  statusEsi?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalTermsEslai?: any;
  categories?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryId?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryIdEsai?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchTermsEslai?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoriesEslai?: any;
  searchTerms?: string;
  environmentsId: string[];
  environmentId: string[];
  descriptionEti?: string;
  widgetRuleApplicableOnEsi?: string;
  widgetTitleEti?: string;
  widgetDescriptionEti?: string;
  widgetIdEsi?: string;
  isSystemGeneratedEbi?: boolean;
  name?: string;
  algorithmInternalNameEsi?: string;
  // eslint-disable-next-line
  keywordEsai?: any;
  primaryAlgorithmEj?: {
    algorithmInternalNameEsi?: string;
    algorithmApiUrlEsi?: string;
    isMerchandisingEbi?: boolean;
    pinEj?: PinEj[];
    sortEj?: SortEj[];
    slotEj?: SlotEj[];
    rulesEj?: RulesEj[];
  };
  secondaryAlgorithmEj?: {
    algorithmInternalNameEsi?: string;
    algorithmApiUrlEsi?: string;
    isMerchandisingEbi?: boolean;
    isCustomRuleEbi?: boolean;
    pinEj?: PinEj[];
    sortEj?: SortEj[];
    slotEj?: SlotEj[];
    rulesEj?: RulesEj[];
  };
  // eslint-disable-next-line
  customPrimaryAlgorithmEj: any;
  isFallbackEbi?: boolean;
  isCustomRuleEbi?: boolean;
  pageUrlEsi?: string;
}

export interface IWidgetRuleList {
  nextVersionNo: number;
  contentModelData: ContentModelData;
  versionData: VersionData;
  contentModelFieldData: IWidgetContentModelFieldData;
}

export interface IListWidgetRules {
  contentModelId: string;
  title: string;
  versionId: string;
  description: string;
  endDateEdti: string;
  startDateEdti: string;
  id: string;
  ruleTypeEsi: string;
  statusEsi: string;
  createdBy: string;
  createdAt: string;
  modifiedAt: string;
  modifiedBy: string;
  name?: string;
  internalName?: string;
  widgetIdEsi?: string;
  widgetRuleApplicableOnEsi?: string;
  currentVersionId?: string;
  contentModelDataId?: string;
  environmentId?: string;
  keywordEsai?: string[];
  pageUrlEsi?: string;
  items: {
    contentModelId: string;
    title: string;
    versionId: string;
    description: string;
    endDateEdti: string;
    startDateEdti: string;
    id: string;
    ruleTypeEsi: string;
    statusEsi: string;
    name?: string;
  }[];
}

export interface IListWidget {
  id: string;
  description?: string;
  name: string;
  isSystemGenerated: boolean;
  key: string;
  label: string;
  algorithmInternalName: string;
}

export interface IWidget {
  title?: string;
  description?: string;
  environmentsId?: string[] | string;
}

export interface IUpdateWidget {
  name: string;
  description: string;
}

export interface IListWidgetRuleProductDynamicFieldRequest {
  environmentsId: string | null;
  dynamicFieldsData: DynamicFieldsData;
}

export interface IWidgetRuleRowRecord {
  contentModelId: string;
  createdBy: string;
  currentVersionId: string;
  description: string;
  environmentId: string[];
  id: string;
  language: string[];
  ruleTitleEti: string;
  ruleTypeEsi: string;
  statusEsi: string;
  title: string;
  versionId: string;
  contentModelDataId?: string;
}

export interface listWidgetRuleArray {
  rule_name: IListWidgetRules;
  duration: IListWidgetRules;
  applicable?: IListWidgetRules;
  status: string;
  created_at: string;
  created_by: string;
  modified_at: string;
  modified_by: string;
}

export interface IAudienceDetailsList {
  byear: number;
  city: string;
  consents: string;
  continent: string;
  country: string;
  created_at: string;
  custom_properties: string;
  device_category: string;
  device_density: string;
  device_id: string;
  device_name: string;
  device_resolution: string;
  device_type: string;
  device_vendor: string;
  device_version: string;
  email: string;
  environment_id: string;
  first_session_start: string;
  gender: string;
  id: string;
  ip: string;
  last_purchase_amount: number;
  last_purchase_count: number;
  last_session_duration: number;
  last_session_view_count: number;
  last_purchase_date: string;
  last_seen_at: string;
  last_session_id: string;
  last_session_start: string;
  last_view: string;
  last_view_id: string;
  last_view_url: string;
  locale: string;
  name: string;
  organization: string;
  os_name: string;
  os_version: string;
  phone: string;
  postal_code: string;
  region: string;
  lat: number;
  long: number;
  total_session_count: number;
  total_duration: number;
}

export interface ISegmentList {
  id: string;
  name: string;
  description: string;
  queryJson: object;
}

export interface IListGroup {
  id: string;
  name: string;
  tenantId: string;
  userCount: number;
}

export interface IListWorkspaceRole {
  description: string;
  id: string;
  isWorkspaceAdmin: boolean;
  name: string;
  userCount: number;
}

export interface ISortDataObject {
  sortBy: string;
  orderBy: string;
}

export interface IAddIndustry {
  categoryIds: string[];
  environmentId: string | null;
}

export interface ICreateAutoComplete {
  searchTerm: string;
}

export interface IListAutoComplete {
  id: string;
  searchTerm: string;
  type: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface IGetAuditLogRecordResponse {
  workspaceId: string;
  userId: string;
  moduleName: string;
  description: string;
  collection: string;
  createdAt: string;
  environmentIds: string;
}

export interface IGetAllEnvironmentsRecordResponse {
  id: string;
  title: string;
  workspaceId: string;
  type: string;
}

export interface IListAllUser {
  id: string;
  name: string;
}

export interface IAddUpdateStore {
  environmentIds: string[];
  adminAccessToken: string;
  storefrontAccessToken: string;
  apiKey: string;
  secretKey: string;
  storeName: string;
  storeDomain: string;
  name: string;
}
