//@ts-nocheck

import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useContext, useEffect, useState } from 'react';
import { Form } from 'antd';
import _ from 'lodash';

import {
  useCloneVersion,
  useFieldList,
  useGetRecordListById,
  useGetVersionList,
  useUpdateCurrentVersion,
  useListWorkspaceLanguage,
} from '../../services';
import {
  ContentModelList,
  ILanguage,
  ListRecordResponse,
} from '../../../../../types';

import { versionHistoryMapping } from '../../utils';
import { ContentLibraryContext } from '../../context';
import useUser from '../../../../../hooks/user';
import {
  API_QUERY_KEY,
  onSubSidebarCollapse,
  openNotificationWithIcon,
} from '../../../../../utills';
import queryClient from '../../../../../query-client';
import usePermissionCheckForRecords from '../../utils/prermission-check-for-records';
import moment from 'moment/moment';

const useVersionHistoryModuleController = (
  selectedContentModalDetails: ContentModelList
) => {
  const { t } = useTranslation();
  const contentLibraryContext = useContext(ContentLibraryContext);
  const userDetails = useUser();
  const [form] = Form.useForm();
  const history = useHistory();
  const {
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    languageName,
    currentVersionId,
  } = useParams<{
    workspaceId: string;
    contentModalId: string;
    contentModalDataId: string;
    versionId: string;
    languageName: string;
    currentVersionId: string;
  }>();
  const { recordPermissionCheck } = usePermissionCheckForRecords(
    selectedContentModalDetails?.internalName
  );

  const [workspaceLanguageList, setWorkspaceLanguageList] = useState<
    ILanguage[]
  >([]);
  const [versionList, setVersionList] = useState<
    {
      id: string;
      versionName: string;
      versionNo: number;
    }[]
  >([]);

  const [firstVersionId, setFirstVersionId] = useState(currentVersionId);

  const [secondVersionId, setSecondVersionId] = useState('');

  const [firstVersionDetail, setFirstVersionDetail] = useState(
    {} as {
      versionNo: string;
      versionName: string;
      createdBy?: string;
      createdAt?: string;
      modifiedBy?: string;
      modifiedAt?: string;
      nextVersionNo: string;
    }
  );

  const [secondVersionDetail, setSecondVersionDetail] = useState(
    {} as {
      versionNo: string;
      versionName: string;
      createdBy?: string;
      createdAt?: string;
      modifiedBy?: string;
      modifiedAt?: string;
      nextVersionNo: string;
    }
  );

  const [firstVersionStatus, setFirstVersionStatus] = useState<
    { [k: string]: string }[]
  >([]);

  const [secondVersionStatus, setSecondVersionStatus] = useState<
    { [k: string]: string }[]
  >([]);

  const [recordLanguage, setRecordLanguage] = useState('en-us');

  const [isCloneVersionVisible, setIsCloneVersionVisible] = useState(false);

  const [selectedVersionId, setSelectedVersionId] = useState('');

  const [nextVersionNumber, setNextVersionNumber] = useState('');

  const [recordTitle, setRecordTitle] = useState('');

  const [isUpdateVersionNameModalVisible, setIsUpdateVersionNameModal] =
    useState(false);

  const [updateVersionDetail, setUpdateVersionDetail] = useState<{
    versionName: string;
    versionNo: string;
    versionId: string;
  }>();

  const [firstDataMappingObject, setFirstDataMappingObject] = useState([]);

  const [secondDataMappingObject, setSecondDataMappingObject] = useState([]);

  const [isDifferenceOnlyChecked, setDifferenceOnlyChecked] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const getVersionList = useGetVersionList(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId
  );

  const getWorkspaceLanguageList = useListWorkspaceLanguage(workspaceId);

  const getFieldList = useFieldList('collection', workspaceId, contentModalId);

  const getRecordBYId = useGetRecordListById(
    workspaceId,
    contentModalId,
    contentModalDataId,
    firstVersionId,
    recordLanguage,
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const getSecondRecordBYId = useGetRecordListById(
    workspaceId,
    contentModalId,
    contentModalDataId,
    secondVersionId,
    recordLanguage,
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const cloneVersion = useCloneVersion(
    workspaceId,
    contentModalId,
    contentModalDataId
  );

  const updateCurrentVersion = useUpdateCurrentVersion(
    workspaceId,
    contentModalId,
    contentModalDataId
  );

  const columns = [
    {
      title: '',
      dataIndex: 'firstFinalData',
      key: 'firstFinalData',
      width: '50%',
      render: (_, { firstFinalData }, index) =>
        (!isDifferenceOnlyChecked ||
          (isDifferenceOnlyChecked && firstFinalData.isFieldChange)) && (
          <div className="left-section">
            {firstFinalData.type !== 'component' ? (
              <div className={`version-row ${firstFinalData.status}`}>
                {firstFinalData.fieldType === 'media' ? (
                  <>
                    <p>
                      <i className="version-counter">
                        {index + 1}.{''}
                      </i>
                      {firstFinalData.title}
                    </p>
                    {firstFinalData.value ? (
                      firstFinalData.value.length > 0 &&
                      firstFinalData.value.map((item) => (
                        <span>{`${item.name ? item.name : item}`}</span>
                      ))
                    ) : (
                      <span>
                        <p className="version-empty-data">{`<empty>`}</p>
                      </span>
                    )}
                  </>
                ) : firstFinalData.fieldType === 'json' ||
                  firstFinalData.fieldType === 'multi-select' ? (
                  <>
                    <p>
                      <i className="version-counter">
                        {index + 1}.{''}
                      </i>
                      {firstFinalData.title}
                    </p>
                    <span>
                      {firstFinalData.value ? (
                        JSON.stringify(firstFinalData.value)
                      ) : (
                        <p className="version-empty-data">{`<empty>`}</p>
                      )}
                    </span>
                  </>
                ) : firstFinalData.fieldType === 'boolean' ? (
                  <>
                    <p>
                      <i className="version-counter">
                        {index + 1}.{''}
                      </i>
                      {firstFinalData.title}
                    </p>
                    <span>
                      {firstFinalData.value !== undefined ? (
                        JSON.stringify(firstFinalData.value)
                      ) : (
                        <p className="version-empty-data">{`<empty>`}</p>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <p>
                      <i className="version-counter">
                        {index + 1}.{''}
                      </i>
                      {firstFinalData.title}
                    </p>
                    <span>
                      {firstFinalData.value ? (
                        firstFinalData.value
                      ) : (
                        <p className="version-empty-data">{`<empty>`}</p>
                      )}
                    </span>
                  </>
                )}
              </div>
            ) : firstFinalData.isRepeatable ? (
              <div className={`version-row ${firstFinalData.status}`}>
                <p>
                  <i className="version-counter">{index + 1}.</i>
                  {firstFinalData.title}
                </p>
                {firstFinalData.value.map(
                  (data, secondIndex) =>
                    (!isDifferenceOnlyChecked ||
                      (isDifferenceOnlyChecked && data.isFieldChange)) && (
                      <div className={`version-row ${data?.status}`}>
                        <p>
                          <i className="version-counter">
                            {' '}
                            {index + 1}.{''} {secondIndex + 1}
                            {''}
                          </i>
                          Item {secondIndex + 1}
                        </p>
                        {data.value.map(
                          (repeatableData, thirdIndex) =>
                            (!isDifferenceOnlyChecked ||
                              (isDifferenceOnlyChecked &&
                                repeatableData.isFieldChange)) && (
                              <div
                                className={`version-row ${repeatableData?.status}`}>
                                {repeatableData.fieldType === 'media' ? (
                                  <>
                                    <p>
                                      <i className="version-counter">
                                        {' '}
                                        {index + 1}.{''} {secondIndex + 1}.{''}
                                        {thirdIndex + 1}
                                      </i>
                                      {repeatableData.title}
                                    </p>
                                    {repeatableData.value ? (
                                      repeatableData.value.length > 0 &&
                                      repeatableData.value.map((item) => (
                                        <span>{`${
                                          item.name ? item.name : item
                                        }`}</span>
                                      ))
                                    ) : (
                                      <span>
                                        {' '}
                                        <p className="version-empty-data">{`<empty>`}</p>
                                      </span>
                                    )}
                                  </>
                                ) : repeatableData.fieldType === 'json' ? (
                                  <>
                                    <p>
                                      <i className="version-counter">
                                        {' '}
                                        {index + 1}.{''} {secondIndex + 1}.{''}
                                        {thirdIndex + 1}
                                      </i>
                                      {repeatableData.title}
                                    </p>
                                    <span>
                                      {repeatableData.value ? (
                                        JSON.stringify(repeatableData.value)
                                      ) : (
                                        <p className="version-empty-data">{`<empty>`}</p>
                                      )}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <p>
                                      <i className="version-counter">
                                        {' '}
                                        {index + 1}.{''} {secondIndex + 1}.{''}
                                        {thirdIndex + 1}
                                      </i>
                                      {repeatableData.title}
                                    </p>
                                    <span>
                                      {repeatableData.value ? (
                                        repeatableData.value
                                      ) : (
                                        <p className="version-empty-data">{`<empty>`}</p>
                                      )}
                                    </span>
                                  </>
                                )}
                              </div>
                            )
                        )}
                      </div>
                    )
                )}
              </div>
            ) : (
              <div className={`version-row ${firstFinalData.status}`}>
                <p>
                  <i className="version-counter">{index + 1}.</i>
                  {firstFinalData.title}
                </p>
                {firstFinalData.value.map(
                  (data, secondIndex) =>
                    (!isDifferenceOnlyChecked ||
                      (isDifferenceOnlyChecked && data.isFieldChange)) && (
                      <div className={`version-row ${data.status}`}>
                        {data.fieldType === 'media' ? (
                          <>
                            <p>
                              <i className="version-counter">
                                {' '}
                                {index + 1}.{''} {secondIndex + 1}
                                {''}
                              </i>
                              {data.title}
                            </p>
                            {data.value ? (
                              data.value.length > 0 &&
                              data.value.map((item) => (
                                <span>{`${item.name ? item.name : item}`}</span>
                              ))
                            ) : (
                              <span>
                                {' '}
                                <p className="version-empty-data">{`<empty>`}</p>
                              </span>
                            )}
                          </>
                        ) : data.fieldType === 'json' ? (
                          <>
                            <p>
                              <i className="version-counter">
                                {' '}
                                {index + 1}.{''} {secondIndex + 1}
                                {''}
                              </i>
                              {data.title}
                            </p>
                            <span>
                              {data.value ? (
                                JSON.stringify(data.value)
                              ) : (
                                <p className="version-empty-data">{`<empty>`}</p>
                              )}
                            </span>
                          </>
                        ) : (
                          <>
                            {' '}
                            <p>
                              <i className="version-counter">
                                {' '}
                                {index + 1}.{''} {secondIndex + 1}
                                {''}
                              </i>
                              {data.title}
                            </p>
                            <span>
                              {data.value ? (
                                data.value
                              ) : (
                                <p className="version-empty-data">{`<empty>`}</p>
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        ),
    },
    {
      title: '',
      dataIndex: 'secondFinalData',
      key: 'secondFinalData',
      render: (_, { secondFinalData }, index) =>
        (!isDifferenceOnlyChecked ||
          (isDifferenceOnlyChecked && secondFinalData.isFieldChange)) && (
          <div className="right-section">
            {
              secondFinalData.type !== 'component' ? (
                <div className={`version-row ${secondFinalData.status}`}>
                  {secondFinalData.fieldType === 'media' ? (
                    <>
                      <p>
                        <i className="version-counter">
                          {index + 1}.{''}
                        </i>
                        {secondFinalData.title}
                      </p>
                      {secondFinalData.value ? (
                        secondFinalData.value.length > 0 &&
                        secondFinalData.value.map((item) => (
                          <span>{`${item.name ? item.name : item}`}</span>
                        ))
                      ) : (
                        <span>
                          <p className="version-empty-data">{`<empty>`}</p>
                        </span>
                      )}
                    </>
                  ) : secondFinalData.fieldType === 'json' ||
                    secondFinalData.fieldType === 'multi-select' ? (
                    <>
                      <p>
                        <i className="version-counter">
                          {index + 1}.{''}
                        </i>
                        {secondFinalData.title}
                      </p>
                      <span>
                        {secondFinalData.value ? (
                          JSON.stringify(secondFinalData.value)
                        ) : (
                          <p className="version-empty-data">{`<empty>`}</p>
                        )}
                      </span>
                    </>
                  ) : secondFinalData.fieldType === 'boolean' ? (
                    <>
                      <p>
                        <i className="version-counter">
                          {index + 1}.{''}
                        </i>
                        {secondFinalData.title}
                      </p>
                      <span>
                        {secondFinalData.value !== undefined ? (
                          JSON.stringify(secondFinalData.value)
                        ) : (
                          <p className="version-empty-data">{`<empty>`}</p>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <p>
                        <i className="version-counter">
                          {index + 1}.{''}
                        </i>
                        {secondFinalData.title}
                      </p>
                      <span>
                        {secondFinalData.value ? (
                          secondFinalData.value
                        ) : (
                          <p className="version-empty-data">{`<empty>`}</p>
                        )}
                      </span>
                    </>
                  )}
                </div>
              ) : secondFinalData.isRepeatable ? (
                <div className={`version-row ${secondFinalData.status}`}>
                  <p>
                    <i className="version-counter">{index + 1}.</i>
                    {secondFinalData.title}
                  </p>
                  {secondFinalData.value.map(
                    (data, secondIndex) =>
                      (!isDifferenceOnlyChecked ||
                        (isDifferenceOnlyChecked && data.isFieldChange)) && (
                        <div className={`version-row ${data?.status}`}>
                          <p>
                            <i className="version-counter">
                              {' '}
                              {index + 1}.{''} {secondIndex + 1}
                              {''}
                            </i>
                            Item {secondIndex + 1}
                          </p>
                          {data.value.map(
                            (repeatableData, thirdIndex) =>
                              (!isDifferenceOnlyChecked ||
                                (isDifferenceOnlyChecked &&
                                  repeatableData.isFieldChange)) && (
                                <div
                                  className={`version-row ${repeatableData?.status}`}>
                                  {repeatableData.fieldType === 'media' ? (
                                    <>
                                      <p>
                                        <i className="version-counter">
                                          {' '}
                                          {index + 1}.{''} {secondIndex + 1}.
                                          {''}
                                          {thirdIndex + 1}
                                        </i>
                                        {repeatableData.title}
                                      </p>
                                      {repeatableData.value ? (
                                        repeatableData.value.length > 0 &&
                                        repeatableData.value.map((item) => (
                                          <span>{`${
                                            item.name ? item.name : item
                                          }`}</span>
                                        ))
                                      ) : (
                                        <span>
                                          <p className="version-empty-data">{`<empty>`}</p>
                                        </span>
                                      )}
                                    </>
                                  ) : repeatableData.fieldType === 'json' ? (
                                    <>
                                      <p>
                                        <i className="version-counter">
                                          {' '}
                                          {index + 1}.{''} {secondIndex + 1}.
                                          {''}
                                          {thirdIndex + 1}
                                        </i>
                                        {repeatableData.title}
                                      </p>
                                      <span>
                                        {repeatableData.value ? (
                                          JSON.stringify(repeatableData.value)
                                        ) : (
                                          <p className="version-empty-data">{`<empty>`}</p>
                                        )}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <p>
                                        <i className="version-counter">
                                          {' '}
                                          {index + 1}.{''} {secondIndex + 1}.
                                          {''}
                                          {thirdIndex + 1}
                                        </i>
                                        {repeatableData.title}
                                      </p>
                                      <span>
                                        {repeatableData.value ? (
                                          repeatableData.value
                                        ) : (
                                          <p className="version-empty-data">{`<empty>`}</p>
                                        )}
                                      </span>
                                    </>
                                  )}
                                </div>
                              )
                          )}
                        </div>
                      )
                  )}
                </div>
              ) : (
                <div className={`version-row ${secondFinalData.status}`}>
                  <p>
                    <i className="version-counter">{index + 1}.</i>
                    {secondFinalData.title}
                  </p>
                  {secondFinalData.value.map(
                    (data, secondIndex) =>
                      (!isDifferenceOnlyChecked ||
                        (isDifferenceOnlyChecked && data.isFieldChange)) && (
                        <div className={`version-row ${data.status}`}>
                          {data.fieldType === 'media' ? (
                            <>
                              <p>
                                <i className="version-counter">
                                  {' '}
                                  {index + 1}.{''} {secondIndex + 1}
                                  {''}
                                </i>
                                {data.title}
                              </p>
                              {data.value ? (
                                data.value.length > 0 &&
                                data.value.map((item) => (
                                  <span>{`${
                                    item.name ? item.name : item
                                  }`}</span>
                                ))
                              ) : (
                                <span>
                                  <p className="version-empty-data">{`<empty>`}</p>
                                </span>
                              )}
                            </>
                          ) : data.fieldType === 'json' ? (
                            <>
                              <p>
                                <i className="version-counter">
                                  {' '}
                                  {index + 1}.{''} {secondIndex + 1}
                                  {''}
                                </i>
                                {data.title}
                              </p>
                              <span>
                                {data.value ? (
                                  JSON.stringify(data.value)
                                ) : (
                                  <p className="version-empty-data">{`<empty>`}</p>
                                )}
                              </span>
                            </>
                          ) : (
                            <>
                              {' '}
                              <p>
                                <i className="version-counter">
                                  {' '}
                                  {index + 1}.{''} {secondIndex + 1}
                                  {''}
                                </i>
                                {data.title}
                              </p>
                              <span>
                                {data.value ? (
                                  data.value
                                ) : (
                                  <p className="version-empty-data">{`<empty>`}</p>
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      )
                  )}
                </div>
              )
              // )
            }
          </div>
        ),
    },
  ];

  const onLanguageChange = (val: string) => {
    setRecordLanguage(val);
    openNotificationWithIcon(
      'success',
      t('common.messages.language_changed_successfully')
    );
  };

  const onFirstRecordIdChange = (val: string) => {
    setFirstVersionId(val);
  };

  const onSecondRecordIdChange = (val: string) => {
    setSecondVersionId(val);
  };

  const recordStatus = (recordData: ListRecordResponse) => {
    const environmentStatusList: { [k: string]: string }[] = [];

    contentLibraryContext?.environmentList?.map((item) => {
      if (
        //@ts-ignore
        recordData?.contentModelFieldData[
          `${item.id.replaceAll('-', '')}Status`
        ]
      ) {
        environmentStatusList.push({
          id: item.id,
          name: item.title,
          status:
            //@ts-ignore
            recordData?.contentModelFieldData[
              `${item.id.replaceAll('-', '')}Status`
            ],
        });
      } else {
        environmentStatusList.push({
          id: item.id,
          name: item.title,
          status: 'DRAFT',
        });
      }
      return '';
    });

    return environmentStatusList;
  };

  const onCloneButtonClick = (
    val: string,
    name: string,
    nextVersionNumber: string
  ) => {
    form.setFieldsValue({
      versionName: name,
    });
    setSelectedVersionId(val);
    setIsCloneVersionVisible(true);
    setNextVersionNumber(nextVersionNumber);
  };

  const changeCloneVersionModalVisibility = (val: boolean) => {
    setIsCloneVersionVisible(val);
  };

  const onSaveCloneModalData = async (val: {
    versionName: string;
    versionNo: number;
    versionId?: string;
  }) => {
    try {
      val['versionId'] = selectedVersionId;
      cloneVersion.mutate(val);
    } catch (err) {
      console.log(err);
    }
  };

  const changeUpdateVersionNameModalVisibility = (val: boolean) => {
    setIsUpdateVersionNameModal(val);
  };

  const onEditVersionDetailButtonClick = (
    versionId: string,
    versionName: string,
    versionNo: string
  ) => {
    setUpdateVersionDetail({
      versionId,
      versionName,
      versionNo,
    });
    setIsUpdateVersionNameModal(true);
  };

  const versionDetailUpdateSuccessfully = () => {
    getVersionList.remove();
    getRecordBYId.remove();
    getSecondRecordBYId.remove();
  };

  const changeDifferenceOnlyValue = (val: boolean) => {
    if (val) {
      setDifferenceOnlyChecked(true);
    } else {
      setDifferenceOnlyChecked(false);
    }
  };

  const checkIsFieldValueChange = (firstTempObject, secondTempObject) => {
    const findInFirstObject = firstTempObject.find(
      (item) => item.isFieldChange
    );
    const findInSecondObject = secondTempObject.find(
      (item) => item.isFieldChange
    );
    if (findInFirstObject || findInSecondObject) {
      return {
        firstFieldObject: {
          isFieldChange: true,
          value: firstTempObject,
        },
        secondFieldObject: {
          isFieldChange: true,
          value: secondTempObject,
        },
      };
    } else {
      return {
        firstFieldObject: {
          isFieldChange: false,
          value: firstTempObject,
        },
        secondFieldObject: {
          isFieldChange: false,
          value: secondTempObject,
        },
      };
    }
  };

  const versionHistoryDiffFunction = (
    firstDataMappingObject,
    secondDataMappingObject
  ) => {
    const firstTempObject = [...firstDataMappingObject];
    const secondTempObject = [...secondDataMappingObject];
    try {
      for (let i = 0; i < firstDataMappingObject.length; i++) {
        const result = firstDataMappingObject.findIndex(
          (item) => item.name === firstDataMappingObject[i].name
        );
        if (firstDataMappingObject[i].type !== 'component') {
          if (result !== -1) {
            if (
              !firstDataMappingObject[i].value &&
              !secondDataMappingObject[result].value
            ) {
              firstTempObject[i].status = '';
              secondTempObject[result].status = '';
              secondTempObject[result].isFieldChange = false;
              firstTempObject[i].isFieldChange = false;
            } else if (
              !firstDataMappingObject[i].value &&
              secondDataMappingObject[result].value
            ) {
              secondTempObject[result].status = 'version-success';
              secondTempObject[result].isFieldChange = true;
              firstTempObject[i].isFieldChange = true;
            } else if (
              firstDataMappingObject[i].value &&
              !secondDataMappingObject[result].value
            ) {
              firstTempObject[i].status = 'version-error';
              firstTempObject[i].isFieldChange = true;
              secondTempObject[result].isFieldChange = true;
            } else if (
              firstDataMappingObject[i].value &&
              secondDataMappingObject[result].value
            ) {
              if (
                firstDataMappingObject[i].fieldType === 'media' ||
                firstDataMappingObject[i].fieldType === 'multi-select'
              ) {
                if (
                  !_.isEqual(
                    firstDataMappingObject[i].value.sort(),
                    secondDataMappingObject[result].value.sort()
                  )
                ) {
                  firstTempObject[i].status = 'version-error';
                  secondTempObject[result].status = 'version-success';
                  secondTempObject[result].isFieldChange = true;
                  firstTempObject[i].isFieldChange = true;
                } else {
                  firstTempObject[i].status = '';
                  secondTempObject[result].status = '';
                  secondTempObject[result].isFieldChange = false;
                  firstTempObject[i].isFieldChange = false;
                }
              } else {
                if (
                  !_.isEqual(
                    firstDataMappingObject[i].value,
                    secondDataMappingObject[result].value
                  )
                ) {
                  firstTempObject[i].status = 'version-error';
                  secondTempObject[result].status = 'version-success';
                  secondTempObject[result].isFieldChange = true;
                  firstTempObject[i].isFieldChange = true;
                } else {
                  firstTempObject[i].status = '';
                  secondTempObject[result].status = '';
                  secondTempObject[result].isFieldChange = false;
                  firstTempObject[i].isFieldChange = false;
                }
              }
            }
          }
        } else {
          if (firstDataMappingObject[i].isRepeatable) {
            if (
              firstDataMappingObject[i].value.length >
              secondDataMappingObject[result].value.length
            ) {
              const firstTempArray = [];
              const secondTempArray = [];

              const resultData = getFieldList.data.find(
                (item) =>
                  item.fieldName === secondDataMappingObject[result].name
              );
              if (resultData) {
                const data = versionHistoryMapping(resultData.fields, {});
                const length = firstDataMappingObject[i].value.length;
                const secondObjectLength =
                  secondDataMappingObject[result].value.length;
                for (let j = 0; j < length; j++) {
                  if (j < secondObjectLength) {
                    const { firstTempObject, secondTempObject } =
                      versionHistoryDiffFunction(
                        firstDataMappingObject[i].value[j].value,
                        secondDataMappingObject[result].value[j].value
                      );
                    const { firstFieldObject, secondFieldObject } =
                      checkIsFieldValueChange(
                        firstTempObject,
                        secondTempObject
                      );
                    firstTempArray.push(firstFieldObject);
                    secondTempArray.push(secondFieldObject);
                  } else {
                    const { firstTempObject, secondTempObject } =
                      versionHistoryDiffFunction(
                        firstDataMappingObject[i].value[j].value,
                        data
                      );

                    const { firstFieldObject, secondFieldObject } =
                      checkIsFieldValueChange(
                        firstTempObject,
                        secondTempObject
                      );
                    firstTempArray.push(firstFieldObject);
                    secondTempArray.push(secondFieldObject);
                  }
                }
              }

              const findInFirstFinalObject = firstTempArray.find(
                (item) => item.isFieldChange
              );
              const findInSecondFinalObject = secondTempArray.find(
                (item) => item.isFieldChange
              );

              if (findInFirstFinalObject || findInSecondFinalObject) {
                firstDataMappingObject[i].isFieldChange = true;
                secondDataMappingObject[result].isFieldChange = true;
              } else {
                firstDataMappingObject[i].isFieldChange = false;
                secondDataMappingObject[result].isFieldChange = false;
              }
              firstDataMappingObject[i].value = firstTempArray;
              secondDataMappingObject[result].value = secondTempArray;
            } else if (
              firstDataMappingObject[i].value.length <
              secondDataMappingObject[result].value.length
            ) {
              const firstTempArray = [];
              const secondTempArray = [];

              const resultData = getFieldList.data.find(
                (item) => item.fieldName === firstDataMappingObject[result].name
              );
              if (resultData) {
                const data = versionHistoryMapping(resultData.fields, {});
                const length = secondDataMappingObject[i].value.length;
                const firstObjectLength =
                  firstDataMappingObject[result].value.length;

                for (let j = 0; j < length; j++) {
                  if (j < firstObjectLength) {
                    const { firstTempObject, secondTempObject } =
                      versionHistoryDiffFunction(
                        firstDataMappingObject[i].value[j].value,
                        secondDataMappingObject[result].value[j].value
                      );
                    const { firstFieldObject, secondFieldObject } =
                      checkIsFieldValueChange(
                        firstTempObject,
                        secondTempObject
                      );
                    firstTempArray.push(firstFieldObject);
                    secondTempArray.push(secondFieldObject);
                  } else {
                    const { firstTempObject, secondTempObject } =
                      versionHistoryDiffFunction(
                        data,
                        secondDataMappingObject[i].value[j].value
                      );
                    const { firstFieldObject, secondFieldObject } =
                      checkIsFieldValueChange(
                        firstTempObject,
                        secondTempObject
                      );
                    firstTempArray.push(firstFieldObject);
                    secondTempArray.push(secondFieldObject);
                  }
                }
              }
              const findInFirstFinalObject = firstTempArray.find(
                (item) => item.isFieldChange
              );
              const findInSecondFinalObject = secondTempArray.find(
                (item) => item.isFieldChange
              );

              if (findInFirstFinalObject || findInSecondFinalObject) {
                firstDataMappingObject[i].isFieldChange = true;
                secondDataMappingObject[result].isFieldChange = true;
              } else {
                firstDataMappingObject[i].isFieldChange = false;
                secondDataMappingObject[result].isFieldChange = false;
              }
              firstDataMappingObject[i].value = firstTempArray;
              secondDataMappingObject[result].value = secondTempArray;
            } else {
              const firstTempArray = [];
              const secondTempArray = [];
              const length = firstDataMappingObject[i].value.length;
              for (let j = 0; j < length; j++) {
                const { firstTempObject, secondTempObject } =
                  versionHistoryDiffFunction(
                    firstDataMappingObject[i].value[j].value,
                    secondDataMappingObject[result].value[j].value
                  );
                const { firstFieldObject, secondFieldObject } =
                  checkIsFieldValueChange(firstTempObject, secondTempObject);
                firstTempArray.push(firstFieldObject);
                secondTempArray.push(secondFieldObject);

                const findInFirstFinalObject = firstTempArray.find(
                  (item) => item.isFieldChange
                );
                const findInSecondFinalObject = secondTempArray.find(
                  (item) => item.isFieldChange
                );

                if (findInFirstFinalObject || findInSecondFinalObject) {
                  firstDataMappingObject[i].isFieldChange = true;
                  secondDataMappingObject[result].isFieldChange = true;
                } else {
                  firstDataMappingObject[i].isFieldChange = false;
                  secondDataMappingObject[result].isFieldChange = false;
                }
                firstDataMappingObject[i].value = firstTempArray;
                secondDataMappingObject[result].value = secondTempArray;
              }
            }
          } else {
            const { firstTempObject, secondTempObject } =
              versionHistoryDiffFunction(
                firstDataMappingObject[i].value,
                secondDataMappingObject[result].value
              );
            const findInFirstVersion = firstTempObject.find(
              (item) => item.isFieldChange
            );
            const secondInFirstVersion = secondTempObject.find(
              (item) => item.isFieldChange
            );
            firstDataMappingObject[i].value = firstTempObject;
            secondDataMappingObject[result].value = secondTempObject;

            if (findInFirstVersion) {
              firstDataMappingObject[i].isFieldChange = true;
            } else {
              firstDataMappingObject[i].isFieldChange = false;
            }
            if (secondInFirstVersion) {
              secondDataMappingObject[result].isFieldChange = true;
            } else {
              secondDataMappingObject[result].isFieldChange = false;
            }
          }
        }
      }
    } catch (err) {
      console.log('test', err);
    }

    return {
      firstTempObject,
      secondTempObject,
    };
  };

  const openInNewWindowClick = (versionId: string) => {
    if (currentVersionId === versionId) {
      window.open(
        `/workspaces/${workspaceId}/content-library/${selectedContentModalDetails?.type}-type/${contentModalId}/field/${contentModalDataId}/version/${versionId}/language/${languageName}`
      );
    } else {
      updateCurrentVersion.mutate(versionId);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      onSubSidebarCollapse(true);
    }, 0);

    contentLibraryContext?.changeSubsideBarVisibility(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    contentLibraryContext?.changeSubSidebarActiveKey({
      type: selectedContentModalDetails?.type,
      id: selectedContentModalDetails?.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContentModalDetails]);

  useEffect(() => {
    if (getVersionList.isSuccess) {
      setVersionList(getVersionList.data);
      const result = getVersionList.data.findIndex(
        (item) => item.id !== currentVersionId
      );
      if (!secondVersionId) {
        if (result !== -1) {
          setSecondVersionId(getVersionList.data[result].id);
        } else {
          setSecondVersionId(getVersionList.data[0].id);
        }
        getSecondRecordBYId.remove();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVersionList.isSuccess]);

  useEffect(() => {
    if (getWorkspaceLanguageList.isSuccess) {
      setWorkspaceLanguageList(getWorkspaceLanguageList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWorkspaceLanguageList.isSuccess]);

  useEffect(() => {
    if (getRecordBYId.isSuccess && getFieldList.isSuccess) {
      if (getFieldList.data && getRecordBYId.data) {
        const environmentStatusList = recordStatus(getRecordBYId.data);

        setFirstVersionStatus([...environmentStatusList]);

        setRecordTitle(getRecordBYId.data?.contentModelData.title);

        const data = versionHistoryMapping(
          getFieldList.data,
          getRecordBYId.data?.contentModelFieldData
        );
        setFirstDataMappingObject(data);

        setFirstVersionDetail({
          versionName: getRecordBYId.data?.contentModelFieldData.versionName,
          versionNo: getRecordBYId.data?.contentModelFieldData.versionNo,
          createdBy:
            //@ts-ignore
            userDetails?.listAllUser[
              getRecordBYId.data?.contentModelFieldData?.createdBy
                ? getRecordBYId.data?.contentModelFieldData?.createdBy
                : getRecordBYId.data?.contentModelFieldData?.modifiedBy
            ],
          createdAt: moment(
            getRecordBYId.data?.contentModelFieldData?.createdAt
          )
            .local()
            .format('DD MMM YYYY,LT'),
          modifiedBy:
            //@ts-ignore
            userDetails?.listAllUser[
              getRecordBYId.data?.contentModelFieldData?.modifiedBy
            ],
          modifiedAt: moment(
            getRecordBYId.data?.contentModelFieldData?.modifiedAt
          )
            .local()
            .format('DD MMM YYYY,LT'),
          nextVersionNo: getRecordBYId.data?.nextVersionNo,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getFieldList.isSuccess,
    getFieldList.data,
    getRecordBYId.isSuccess,
    getRecordBYId.data,
  ]);

  useEffect(() => {
    if (getSecondRecordBYId.isSuccess && getFieldList.isSuccess) {
      if (getFieldList.data && getSecondRecordBYId.data) {
        const environmentStatusList = recordStatus(getSecondRecordBYId.data);

        setSecondVersionStatus([...environmentStatusList]);

        const data = versionHistoryMapping(
          getFieldList.data,
          getSecondRecordBYId.data?.contentModelFieldData
        );
        setSecondDataMappingObject(data);

        setSecondVersionDetail({
          versionName:
            getSecondRecordBYId.data?.contentModelFieldData.versionName,
          versionNo: getSecondRecordBYId.data?.contentModelFieldData.versionNo,
          createdBy:
            //@ts-ignore
            userDetails?.listAllUser[
              getSecondRecordBYId.data?.contentModelFieldData?.createdBy
                ? getSecondRecordBYId.data?.contentModelFieldData?.createdBy
                : getSecondRecordBYId.data?.contentModelFieldData?.modifiedBy
            ],
          createdAt: moment(
            getSecondRecordBYId?.data?.contentModelFieldData?.createdAt
          )
            .local()
            .format('DD MMM YYYY,LT'),
          modifiedBy:
            //@ts-ignore
            userDetails?.listAllUser[
              getSecondRecordBYId.data?.contentModelFieldData?.modifiedBy
            ],
          modifiedAt: moment(
            getSecondRecordBYId?.data?.contentModelFieldData?.modifiedAt
          )
            .local()
            .format('DD MMM YYYY,LT'),
          nextVersionNo: getSecondRecordBYId.data?.nextVersionNo,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getFieldList.isSuccess,
    getFieldList.data,
    getSecondRecordBYId.isSuccess,
    getSecondRecordBYId.data,
  ]);

  useEffect(() => {
    if (cloneVersion.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.cloned_successfully')
      );

      localStorage.removeItem(`${versionId}/contentEpe`);
      localStorage.removeItem(`${versionId}/contentFieldData`);
      history.push(
        `/workspaces/${workspaceId}/content-library/${selectedContentModalDetails?.type}-type/${contentModalId}/field/${contentModalDataId}/version/${cloneVersion.data}/language/en-us`
      );

      contentLibraryContext?.ChangeIsFieldDirty({});
      form.resetFields();

      form.setFieldsValue({
        versionNo: nextVersionNumber + 1,
      });

      queryClient.refetchQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentModalId,
        contentModalDataId,
        languageName,
        cloneVersion.data,
      ]);

      queryClient.removeQueries([
        API_QUERY_KEY.GET_VERSION_LIST,
        contentModalDataId,
        'en-us',
        cloneVersion.data,
      ]);
    }
    setIsCloneVersionVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloneVersion.isSuccess]);

  useEffect(() => {
    if (cloneVersion.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.something_went_wrong')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, cloneVersion.isError]);

  useEffect(() => {
    if (
      Object.keys(firstDataMappingObject).length > 0 &&
      Object.keys(secondDataMappingObject).length > 0
    ) {
      const tempArray = [];
      const { firstTempObject, secondTempObject } = versionHistoryDiffFunction(
        firstDataMappingObject,
        secondDataMappingObject
      );

      for (let i = 0; i < firstTempObject.length; i++) {
        tempArray.push({
          firstFinalData: firstTempObject[i],
          secondFinalData: secondTempObject[i],
        });
      }
      setDataSource([...tempArray]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDataMappingObject, secondDataMappingObject]);

  useEffect(() => {
    if (updateCurrentVersion.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.version_updated_successfully')
      );
      window.open(
        `/workspaces/${workspaceId}/content-library/${selectedContentModalDetails?.type}-type/${contentModalId}/field/${contentModalDataId}/version/${updateCurrentVersion?.variables}/language/en-us`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCurrentVersion.isSuccess]);

  useEffect(() => {
    if (updateCurrentVersion.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_in_version_update')
      );
    }
  }, [updateCurrentVersion.isError, t]);

  return {
    t,
    workspaceLanguageList,
    versionList,
    onLanguageChange,
    firstVersionId,
    secondVersionId,
    onFirstRecordIdChange,
    onSecondRecordIdChange,
    currentVersionId,
    firstVersionDetail,
    secondVersionDetail,
    firstVersionStatus,
    secondVersionStatus,
    recordLanguage,
    onCloneButtonClick,
    changeCloneVersionModalVisibility,
    onSaveCloneModalData,
    isCloneVersionVisible,
    nextVersionNumber,
    recordTitle,
    isUpdateVersionNameModalVisible,
    changeUpdateVersionNameModalVisibility,
    updateVersionDetail,
    onEditVersionDetailButtonClick,
    versionDetailUpdateSuccessfully,
    canEditVersion: recordPermissionCheck('update'),
    cloneVersionLoading: cloneVersion.isLoading,
    changeDifferenceOnlyValue,
    openInNewWindowClick,
    columns,
    dataSource,
    isDifferenceOnlyChecked,
    isLoading: getRecordBYId.isLoading || getSecondRecordBYId.isLoading,
  };
};
export default useVersionHistoryModuleController;
