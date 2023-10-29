import React, { createContext, ReactNode, useState } from 'react';
import { IListEnvironments, ContentModelList } from '../../../../types';

interface ContextProps {
  changeResponseValueObject: (val: {
    pageTitle?: string;
    pageSlug?: string;
    status?: string;
    template?: string;
    title?: string;
    versionId?: string;
    contentModalFieldDataId?: string;
  }) => void;

  responseValueObject: {
    pageSlug?: string;
    status?: string;
    template?: string;
    title?: string;
    versionId?: string;
    contentModalFieldDataId?: string;
  };
  titleAndSubtitle?: {
    title: string;
    subTitle?: string;
    publishAt?: string;
    unpublishAt?: string;
  };
  changeTitleAndSubtitle: (
    title: string,
    subTitle?: string,
    publishAt?: string,
    unpublishAt?: string
  ) => void;

  isHeaderButtonVisible: { type: string; position: string };
  changeHeaderButtonVisible: (str: { type: string; position: string }) => void;

  newRecordFieldDetails?: {
    contentModalId?: string;
    contentModalDataId?: string;
    contentModalDataFieldId?: string;
    versionId?: string;
    template?: string;
    language?: string;
  };
  changeNewRecordFieldDetails: (
    contentModalId?: string,
    contentModalDataId?: string,
    contentModalDataFieldId?: string,
    versionId?: string,
    template?: string,
    language?: string
  ) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeForm: any;

  fieldComponentLoader: boolean;
  changeFieldComponentLoader: (val: boolean) => void;

  isIFrameVisible: { isVisible: boolean; url?: string };
  changeIFrameVisible: (val: { isVisible: boolean; url?: string }) => void;

  isIFrameORMediaManagerVisible: boolean;
  ChangeIFrameORMediaManagerVisible: (val: boolean) => void;

  iframeMediaManagerValue?: string[];
  changeIFrameMediaManagerValue: (val: string[]) => void;

  isDeleteModalVisible: boolean;
  changeDeleteModalVisible: (val: boolean) => void;

  storeLink: string;
  changeStoreLink: (val: string) => void;

  subSidebarActiveItemKey:
    | {
        type?: string;
        id?: string;
      }
    | null
    | undefined;
  changeSubSidebarActiveKey: (
    val: {
      type?: string;
      id?: string;
    } | null
  ) => void;

  warningPopupVisible: {
    version: boolean;
    sidebar: boolean;
    relation: boolean;
    refresh: boolean;
    goBack: boolean;
  };
  changeWarningPopupVisible: (val: {
    version: boolean;
    sidebar: boolean;
    relation: boolean;
    refresh: boolean;
    goBack: boolean;
  }) => void;

  isFieldDirty: { [k: string]: string };
  ChangeIsFieldDirty: (val: { [k: string]: string }) => void;

  menuItemChange: {
    type: string;
    menu: { [k: string]: string };
    title: { [k: string]: string };
    contentModalId?: string;
    recordTitle?: string;
  };
  changeMenuItemChange: (val: {
    type: string;
    menu: { [k: string]: string };
    title: { [k: string]: string };
    contentModalId?: string;
    recordTitle?: string;
  }) => void;

  relationUrl: string;
  changeRelationUrl: (val: string) => void;

  environmentList: IListEnvironments[];
  changeEnvironmentList: (val: IListEnvironments[]) => void;

  contentModalData: { [k: string]: string };
  changeContentModalData: (val: { [k: string]: string }) => void;

  openSubSidebarMenuItems: string[];
  changeOpenSubSidebarMenuItems: (val: string[]) => void;

  recordFilterData: {
    environmentId: string;
    status: string;
  };
  changeRecordFilterData: (environmentId: string, status: string) => void;

  currentVersionStatusDetails?: {
    name: string;
    number: number;
    status: {
      id: string;
      name: string;
      status: string;
    }[];
  };
  changeCurrentVersionStatus: (
    name: string,
    number: number,
    status: {
      id: string;
      name: string;
      status: string;
    }[]
  ) => void;

  tempStatePageEditor: boolean;
  changeTempPageEditor: (val: boolean) => void;

  contentModelList: ContentModelList[];
  changeContentModelList: (val: ContentModelList[]) => void;

  isSubsideBarIsVisible: boolean;
  changeSubsideBarVisibility: (val: boolean) => void;
}

interface ContextProviderProps {
  children?: ReactNode;
}

export const ContentLibraryContext = createContext<ContextProps | undefined>(
  undefined
);

export const ContentLibraryContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [responseValueObject, setResponseValueObject] = useState({});

  const [titleAndSubtitle, setTitleAndSubtitle] = useState<
    | {
        title: string;
        subTitle?: string;
        publishAt?: string;
        unpublishAt?: string;
      }
    | undefined
  >();

  const [isHeaderButtonVisible, setIsHeaderButtonVisible] = useState({
    type: 'collection-type',
    position: 'list',
  });

  const [newRecordFieldDetails, setNewRecordFieldDetails] = useState<
    | {
        contentModalId?: string;
        contentModalDataId?: string;
        contentModalDataFieldId?: string;
        versionId?: string;
        template?: string;
        language?: string;
      }
    | undefined
  >();

  const [form, setForm] = useState();

  const [fieldComponentLoader, setFieldComponentLoader] = useState(false);

  const [isIFrameVisible, setIsIFrameVisible] = useState<{
    isVisible: boolean;
    url?: string;
  }>({
    isVisible: false,
    url: '',
  });

  const [isIFrameORMediaManagerVisible, setIsIFrameORMediaManagerVisible] =
    useState(false);

  const [iframeMediaManagerValue, setIFrameMediaManagerValue] = useState<
    string[] | undefined
  >([]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [storeLink, setStoreLink] = useState('');

  const [subSidebarActiveItemKey, setSubSidebarActiveItemKey] = useState<{
    type?: string;
    id?: string;
  } | null>();

  const [warningPopupVisible, setWarningPopupVisible] = useState({
    version: false,
    sidebar: false,
    relation: false,
    refresh: false,
    goBack: false,
  });

  const [isFieldDirty, setIsFieldDirty] = useState({});

  const [menuItemChange, setMenuItemChange] = useState<{
    type: string;
    menu: { [k: string]: string };
    title: { [k: string]: string };
    contentModalId?: string;
    recordTitle?: string;
  }>({
    type: '',
    menu: {},
    title: {},
    contentModalId: '',
    recordTitle: '',
  });

  const [relationUrl, setRelationUrl] = useState('');

  const [environmentList, setEnvironmentList] = useState<IListEnvironments[]>(
    []
  );

  const [contentModalData, setContentModalData] = useState<{
    [k: string]: string;
  }>({});

  const [openSubSidebarMenuItems, setOpenSubSidebarMenuItems] = useState(['']);

  const [recordFilterData, setRecordFilterData] = useState({
    environmentId: '',
    status: '',
  });

  const [currentVersionStatusDetails, setCurrentVersionStatusDetails] =
    useState<{
      name: string;
      number: number;
      status: {
        id: string;
        name: string;
        status: string;
      }[];
    }>();

  const [tempStatePageEditor, setTempStatePageEditor] = useState(true);

  const [contentModelList, setContentModelList] = useState<ContentModelList[]>(
    []
  );

  const [isSubsideBarIsVisible, setSubsideBarIsVisible] = useState(false);

  const changeResponseValueObject = (value: {
    versionId?: string;
    template?: string;
    contentModalFieldDataId?: string;
  }) => {
    setResponseValueObject(value);
  };

  const changeTitleAndSubtitle = (
    title: string,
    subTitle?: string,
    publishAt?: string,
    unpublishAt?: string
  ) => {
    setTitleAndSubtitle({
      title,
      subTitle,
      publishAt,
      unpublishAt,
    });
  };

  const changeHeaderButtonVisible = (val: {
    type: string;
    position: string;
  }) => {
    setIsHeaderButtonVisible({ type: val.type, position: val.position });
  };

  const changeNewRecordFieldDetails = (
    contentModalId?: string,
    contentModalDataId?: string,
    contentModalDataFieldId?: string,
    versionId?: string,
    template?: string,
    language?: string
  ) => {
    setNewRecordFieldDetails({
      contentModalId,
      contentModalDataId,
      contentModalDataFieldId,
      versionId,
      template,
      language,
    });
  };

  // @ts-ignore
  const changeForm = (val) => {
    setForm(val);
  };

  const changeFieldComponentLoader = (value: boolean) => {
    setFieldComponentLoader(value);
  };
  const changeIFrameVisible = (val: { isVisible: boolean; url?: string }) => {
    setIsIFrameVisible(val);
  };

  const ChangeIFrameORMediaManagerVisible = (val: boolean) => {
    setIsIFrameORMediaManagerVisible(val);
  };

  const changeIFrameMediaManagerValue = (val: string[]) => {
    setIFrameMediaManagerValue(val);
  };

  const changeDeleteModalVisible = (val: boolean) => {
    setIsDeleteModalVisible(val);
  };

  const changeStoreLink = (val: string) => {
    setStoreLink(val);
  };

  const changeWarningPopupVisible = (val: {
    version: boolean;
    sidebar: boolean;
    relation: boolean;
    refresh: boolean;
    goBack: boolean;
  }) => {
    setWarningPopupVisible(val);
  };

  const changeSubSidebarActiveKey = (
    val: {
      type?: string;
      id?: string;
    } | null
  ) => {
    setSubSidebarActiveItemKey(val);
  };

  const ChangeIsFieldDirty = (val: { [k: string]: string }) => {
    setIsFieldDirty(val);
  };

  const changeMenuItemChange = (val: {
    type: string;
    menu: { [k: string]: string };
    title: { [k: string]: string };
    ContentModalId?: string;
    recordTitle?: string;
  }) => {
    setMenuItemChange(val);
  };

  const changeRelationUrl = (val: string) => {
    setRelationUrl(val);
  };

  const changeEnvironmentList = (val: IListEnvironments[]) => {
    setEnvironmentList(val);
  };

  const changeContentModalData = (val: { [k: string]: string }) => {
    setContentModalData(val);
  };

  const changeOpenSubSidebarMenuItems = (val: string[]) => {
    setOpenSubSidebarMenuItems(val);
  };

  const changeRecordFilterData = (environmentId: string, status: string) => {
    setRecordFilterData({
      environmentId: environmentId,
      status: status,
    });
  };

  const changeCurrentVersionStatus = (
    name: string,
    number: number,
    status: {
      id: string;
      name: string;
      status: string;
    }[]
  ) => {
    setCurrentVersionStatusDetails({
      name: name,
      number: number,
      status: status,
    });
  };

  const changeTempPageEditor = (val: boolean) => {
    setTempStatePageEditor(val);
  };

  const changeContentModelList = (val: ContentModelList[]) => {
    setContentModelList(val);
  };

  const changeSubsideBarVisibility = (val: boolean) => {
    setSubsideBarIsVisible(val);
  };

  return (
    <ContentLibraryContext.Provider
      value={{
        responseValueObject,
        changeResponseValueObject,
        titleAndSubtitle,
        changeTitleAndSubtitle,
        isHeaderButtonVisible,
        changeHeaderButtonVisible,
        newRecordFieldDetails,
        changeNewRecordFieldDetails,
        form,
        changeForm,
        fieldComponentLoader,
        changeFieldComponentLoader,
        isIFrameVisible,
        changeIFrameVisible,
        isIFrameORMediaManagerVisible,
        ChangeIFrameORMediaManagerVisible,
        changeIFrameMediaManagerValue,
        iframeMediaManagerValue,
        isDeleteModalVisible,
        changeDeleteModalVisible,
        storeLink,
        changeStoreLink,
        subSidebarActiveItemKey,
        changeSubSidebarActiveKey,
        warningPopupVisible,
        changeWarningPopupVisible,
        isFieldDirty,
        ChangeIsFieldDirty,
        menuItemChange,
        changeMenuItemChange,
        relationUrl,
        changeRelationUrl,
        environmentList,
        changeEnvironmentList,
        contentModalData,
        changeContentModalData,
        openSubSidebarMenuItems,
        changeOpenSubSidebarMenuItems,
        recordFilterData,
        changeRecordFilterData,
        currentVersionStatusDetails,
        changeCurrentVersionStatus,
        tempStatePageEditor,
        changeTempPageEditor,
        contentModelList,
        changeContentModelList,
        isSubsideBarIsVisible,
        changeSubsideBarVisibility,
      }}>
      {children}
    </ContentLibraryContext.Provider>
  );
};
