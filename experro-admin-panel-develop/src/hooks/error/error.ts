import { useEffect } from 'react';
import { UseMutationResult } from 'react-query';
import { IAPIError } from '../../types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { openNotificationWithIcon } from '../../utills';

const useError = ({
  mutation,
  entity,
  dependentEntities,
  cb,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<any, IAPIError, any, any>;
  entity?: string;
  dependentEntities?: string;
  cb?: () => void;
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (mutation.isError) {
      const errorCode = mutation.error.response?.Error?.code;
      if (errorCode === 'EX-00001' || errorCode === 'EX-00006') {
        history.push('/login');
      } else if (errorCode === 'EX-00002') {
        openNotificationWithIcon(
          'error',
          t('common.messages.validation_failed')
        );
      } else if (errorCode === 'EX-00003') {
        openNotificationWithIcon(
          'error',
          t('common.messages.entity_not_found', { entity: dependentEntities })
        );
      } else if (errorCode === 'EX-00004') {
        openNotificationWithIcon(
          'error',
          t('common.messages.entity_already_exists', { entity: entity })
        );
      } else if (errorCode === 'EX-0005') {
        openNotificationWithIcon('error', t('common.messages.unknown_error'));
      } else if (errorCode === 'EX-00022') {
        openNotificationWithIcon(
          'error',
          t('common.messages.password_mismatch')
        );
      } else if (errorCode === 'EX-00023') {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_does_not_exists')
        );
      } else if (errorCode === 'EX-00031') {
        openNotificationWithIcon(
          'error',
          t('common.messages.parent_folder_does_not_exists')
        );
      } else if (errorCode === 'EX-00032') {
        openNotificationWithIcon(
          'error',
          t('common.messages.folder_does_not_exists')
        );
      } else if (errorCode === 'EX-00033') {
        openNotificationWithIcon(
          'error',
          t('common.messages.file_does_not_exists')
        );
      } else if (errorCode === 'EX-00035') {
        openNotificationWithIcon(
          'error',
          t('common.messages.target_folder_does_not_exists')
        );
      } else if (errorCode === 'EX-00036') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_delete_all_media_folder')
        );
      } else if (errorCode === 'EX-00037') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_delete_folder', { entity: entity })
        );
      } else if (errorCode === 'EX-00038') {
        openNotificationWithIcon(
          'error',
          t('common.messages.provide_one_file')
        );
      } else if (errorCode === 'EX-00039') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_type_not_valid')
        );
      } else if (errorCode === 'EX-00040') {
        openNotificationWithIcon('error', t('common.messages.url_not_valid'));
      } else if (errorCode === 'EX-00041') {
        openNotificationWithIcon(
          'error',
          t('common.messages.folder_already_exists', { entity: entity })
        );
      } else if (errorCode === 'EX-00042') {
        openNotificationWithIcon(
          'error',
          t('common.messages.file_not_supported')
        );
      } else if (errorCode === 'EX-00043') {
        openNotificationWithIcon(
          'error',
          t('common.messages.gcp_upload_file_extension')
        );
      } else if (errorCode === 'EX-00044') {
        openNotificationWithIcon(
          'error',
          t('common.messages.gcp_delete_file_extension')
        );
      } else if (errorCode === 'EX-00045') {
        openNotificationWithIcon(
          'error',
          t('common.messages.component_already_in_use')
        );
      } else if (errorCode === 'EX-00046') {
        openNotificationWithIcon(
          'error',
          t('common.messages.store_already_exist')
        );
      } else if (errorCode === 'EX-00047') {
        openNotificationWithIcon(
          'error',
          t('common.messages.store_does_not_exists')
        );
      } else if (errorCode === 'EX-00048') {
        openNotificationWithIcon(
          'error',
          t('common.messages.enter_valid_field_name')
        );
      } else if (errorCode === 'EX-00049') {
        openNotificationWithIcon(
          'error',
          t('common.messages.component_field_name_already_exists')
        );
      } else if (errorCode === 'EX-00050') {
        openNotificationWithIcon(
          'error',
          t('common.messages.component_field_does_not_exist')
        );
      } else if (errorCode === 'EX-00051') {
        openNotificationWithIcon(
          'error',
          t('common.messages.component_not_exist')
        );
      } else if (errorCode === 'EX-00052') {
        openNotificationWithIcon('error', t('common.messages.group_not_exist'));
      } else if (errorCode === 'EX-00053') {
        openNotificationWithIcon(
          'error',
          t('common.messages.group_name_already_exist')
        );
      } else if (errorCode === 'EX-00054') {
        openNotificationWithIcon(
          'error',
          t('common.messages.component_name_already_exist')
        );
      } else if (errorCode === 'EX-00055') {
        openNotificationWithIcon(
          'error',
          t('common.messages.theme_template_not_exist')
        );
      } else if (errorCode === 'EX-00056') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_name_already_exist')
        );
      } else if (errorCode === 'EX-00057') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_modal_does_not_exists')
        );
      } else if (errorCode === 'EX-00058') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_modal_required')
        );
      } else if (errorCode === 'EX-00059') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_field_name_already_exist')
        );
      } else if (errorCode === 'EX-00060') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_modal_field_not_exist')
        );
      } else if (errorCode === 'EX-00061') {
        openNotificationWithIcon(
          'error',
          t('common.messages.destination_content_modal_field_not_exist')
        );
      } else if (errorCode === 'EX-00062') {
        openNotificationWithIcon(
          'error',
          t('common.messages.component_required')
        );
      } else if (errorCode === 'EX-00063') {
        openNotificationWithIcon(
          'error',
          t('common.messages.required_default')
        );
      } else if (errorCode === 'EX-00064') {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_not_exist')
        );
      } else if (errorCode === 'EX-00065') {
        openNotificationWithIcon(
          'error',
          t('common.messages.api_token_name_already_exist')
        );
      } else if (errorCode === 'EX-00205') {
        openNotificationWithIcon(
          'error',
          t('common.messages.cli_token_name_already_exist')
        );
      } else if (errorCode === 'EX-00066') {
        openNotificationWithIcon(
          'error',
          t('common.messages.api_token_not_exist')
        );
      } else if (errorCode === 'EX-00067') {
        openNotificationWithIcon(
          'error',
          t('common.messages.api_token_expired')
        );
      } else if (errorCode === 'EX-00068') {
        openNotificationWithIcon(
          'error',
          t('common.messages.api_token_type_not_valid')
        );
      } else if (errorCode === 'EX-00069') {
        openNotificationWithIcon(
          'error',
          t('common.messages.past_date_not_allowed')
        );
      } else if (errorCode === 'EX-00070') {
        openNotificationWithIcon(
          'error',
          t('common.messages.component_internal_field_already_exist')
        );
      } else if (errorCode === 'EX-00071') {
        openNotificationWithIcon('error', t('common.messages.role_not_exist'));
      } else if (errorCode === 'EX-00072') {
        openNotificationWithIcon('error', t('common.messages.roles_not_exist'));
      } else if (errorCode === 'EX-00073') {
        openNotificationWithIcon('error', t('common.messages.role_name_exist'));
      } else if (errorCode === 'EX-00074') {
        openNotificationWithIcon(
          'error',
          t('common.messages.not_delete_role_assign_to_user')
        );
      } else if (errorCode === 'EX-00075') {
        openNotificationWithIcon(
          'error',
          t('common.messages.not_update_super_admin_role')
        );
      } else if (errorCode === 'EX-00076') {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_name_already_exist')
        );
      } else if (errorCode === 'EX-00077') {
        openNotificationWithIcon(
          'error',
          t('common.messages.one_workspace_mandatory_in_one_tenant')
        );
      } else if (errorCode === 'EX-00078') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_modal_group_not_exist')
        );
      } else if (errorCode === 'EX-00079') {
        openNotificationWithIcon('error', t('common.messages.user_not_exist'));
      } else if (errorCode === 'EX-00080') {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_already_exist')
        );
      } else if (errorCode === 'EX-00081') {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_not_exist')
        );
      } else if (errorCode === 'EX-00082') {
        openNotificationWithIcon(
          'error',
          t('common.messages.not_delete_default_workspace_language')
        );
      } else if (errorCode === 'EX-00083') {
        openNotificationWithIcon(
          'error',
          t('common.messages.language_not_exist')
        );
      } else if (errorCode === 'EX-00084') {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_language_already_exist')
        );
      } else if (errorCode === 'EX-00085') {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_language_not_exist')
        );
      } else if (errorCode === 'EX-00086') {
        openNotificationWithIcon(
          'error',
          t('common.messages.not_delete_role_assign_to_user')
        );
      } else if (errorCode === 'EX-00087') {
        openNotificationWithIcon(
          'error',
          t('common.messages.user_already_in_workspace')
        );
      } else if (errorCode === 'EX-00088') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_delete_your_self')
        );
      } else if (errorCode === 'EX-00089') {
        openNotificationWithIcon(
          'error',
          t('common.messages.not_exist_in_given_workspace')
        );
      } else if (errorCode === 'EX-00090') {
        openNotificationWithIcon(
          'error',
          t('common.messages.new_and_old_password_not_same')
        );
      } else if (errorCode === 'EX-00091') {
        openNotificationWithIcon(
          'error',
          t('common.messages.existing_password_not_match')
        );
      } else if (errorCode === 'EX-00092') {
        openNotificationWithIcon(
          'error',
          t('common.messages.one_super_admin_is_required')
        );
      } else if (errorCode === 'EX-00093') {
        openNotificationWithIcon(
          'error',
          t('common.messages.one_super_admin_should_be_active')
        );
      } else if (errorCode === 'EX-00094') {
        openNotificationWithIcon(
          'error',
          t('common.messages.mail_already_registered')
        );
      } else if (errorCode === 'EX-00095') {
        openNotificationWithIcon('error', t('common.messages.token_not_exist'));
      } else if (errorCode === 'EX-00096') {
        openNotificationWithIcon('error', t('common.messages.link_expired'));
      } else if (errorCode === 'EX-00097') {
        openNotificationWithIcon('error', t('common.messages.user_not_active'));
      } else if (errorCode === 'EX-00098') {
        openNotificationWithIcon(
          'error',
          t('common.messages.menu_name_already_exist')
        );
      } else if (errorCode === 'EX-00099') {
        openNotificationWithIcon('error', t('common.messages.menu_not_exist'));
      } else if (errorCode === 'EX-00100') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_client_id_and_secret')
        );
      } else if (errorCode === 'EX-00101') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_login_credentials')
        );
      } else if (errorCode === 'EX-00102') {
        openNotificationWithIcon(
          'error',
          t('common.messages.tenant_not_exist')
        );
      } else if (errorCode === 'EX-00103') {
        openNotificationWithIcon(
          'error',
          t('common.messages.access_token_expired')
        );
      } else if (errorCode === 'EX-00104') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_access_token')
        );
      } else if (errorCode === 'EX-00105') {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_role_not_exist')
        );
      } else if (errorCode === 'EX-00106') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_credentials')
        );
      } else if (errorCode === 'EX-00107') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_internal_name_already_exist')
        );
      } else if (errorCode === 'EX-00108') {
        openNotificationWithIcon(
          'error',
          t('common.messages.no_user_found_with_given_mail')
        );
      } else if (errorCode === 'EX-00109') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_field_already_exists')
        );
      } else if (errorCode === 'EX-00110') {
        openNotificationWithIcon(
          'error',
          t('common.messages.page_slug_already_exist')
        );
      } else if (errorCode === 'EX-00111') {
        openNotificationWithIcon(
          'error',
          t('common.messages.record_data_does_not_exist')
        );
      } else if (errorCode === 'EX-00112') {
        openNotificationWithIcon(
          'error',
          t('common.messages.version_does_not_exist')
        );
      } else if (errorCode === 'EX-00113') {
        openNotificationWithIcon(
          'error',
          t('common.messages.version_data_does_not_exist')
        );
      } else if (errorCode === 'EX-00114') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_modal_data_not_exist')
        );
      } else if (errorCode === 'EX-00115') {
        openNotificationWithIcon(
          'error',
          t('common.messages.field_data_not_exist')
        );
      } else if (errorCode === 'EX-00116') {
        openNotificationWithIcon(
          'error',
          t('common.messages.content_modal_record_not_exist')
        );
      } else if (errorCode === 'EX-00117') {
        openNotificationWithIcon(
          'error',
          t('common.messages.selected_version_must_be_scheduled')
        );
      } else if (errorCode === 'EX-00118') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_password')
        );
      } else if (errorCode === 'EX-00119') {
        openNotificationWithIcon(
          'error',
          t('common.messages.environment_not_exist')
        );
      } else if (errorCode === 'EX-00120') {
        openNotificationWithIcon('error', t('common.messages.store_exist'));
      } else if (errorCode === 'Ex-00121') {
        openNotificationWithIcon(
          'error',
          t('common.messages.cannot_create_workspace_name')
        );
      } else if (errorCode === 'EX-00122') {
        openNotificationWithIcon(
          'error',
          t('common.messages.sync_is_not_started_yet')
        );
      } else if (errorCode === 'EX-00123') {
        openNotificationWithIcon(
          'error',
          t('common.messages.facet_already_exist')
        );
      } else if (errorCode === 'EX-00124') {
        openNotificationWithIcon(
          'error',
          t('common.messages.facet_does_not_exist')
        );
      } else if (errorCode === 'EX-00125') {
        openNotificationWithIcon(
          'error',
          t('common.messages.no_such_theme_version')
        );
      } else if (errorCode === 'EX-00126') {
        openNotificationWithIcon(
          'error',
          t('common.messages.environment_name_already_exist')
        );
      } else if (errorCode === 'EX-00127') {
        openNotificationWithIcon(
          'error',
          t('common.messages.re_sync_can_not_initiated')
        );
      } else if (errorCode === 'EX-00128') {
        openNotificationWithIcon(
          'error',
          t('common.messages.sync_for_this_store_already_in_progress')
        );
      } else if (errorCode === 'EX-00129') {
        openNotificationWithIcon(
          'error',
          t('common.messages.default_category_can_not_be_deleted')
        );
      } else if (errorCode === 'EX-00130') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_delete_your_self')
        );
      } else if (errorCode === 'EX-00131') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_schedule')
        );
      } else if (errorCode === 'EX-00132') {
        openNotificationWithIcon(
          'error',
          t('common.messages.version_is_all_ready_publish')
        );
      } else if (errorCode === 'EX-00133') {
        openNotificationWithIcon(
          'error',
          t('common.messages.selected_version_already_in_environment')
        );
      } else if (errorCode === 'EX-00134') {
        openNotificationWithIcon(
          'error',
          t(
            'common.messages.selected_version_already_un_publish_in_environment'
          )
        );
      } else if (errorCode === 'EX-00135') {
        openNotificationWithIcon(
          'error',
          t('common.messages.version_is_un_published_so_you_can_not_schedule')
        );
      } else if (errorCode === 'EX-00136') {
        openNotificationWithIcon(
          'error',
          t('common.messages.widget_already_exist')
        );
      } else if (errorCode === 'EX-00140') {
        openNotificationWithIcon(
          'error',
          t('common.messages.error_contains_component')
        );
      } else if (errorCode === 'EX-00141') {
        openNotificationWithIcon(
          'error',
          t('common.messages.error_contains_model')
        );
      } else if (errorCode === 'EX-00142') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_delete_default_group')
        );
      } else if (errorCode === 'EX-00143') {
        openNotificationWithIcon(
          'error',
          t(
            'common.messages.can_not_delete_this_content_model_as_it_is_reserved'
          )
        );
      } else if (errorCode === 'EX-00144') {
        openNotificationWithIcon(
          'error',
          t(
            'common.messages.can_not_update_this_content_model_as_it_is_reserved'
          )
        );
      } else if (errorCode === 'EX-00145') {
        openNotificationWithIcon(
          'error',
          t('common.messages.un_supported_file_type_only_image')
        );
      } else if (errorCode === 'EX-00146') {
        openNotificationWithIcon(
          'error',
          t('common.messages.file_size_not_more_than_five_mb')
        );
      } else if (errorCode === 'EX-00147') {
        openNotificationWithIcon(
          'error',
          t('common.messages.environment_id_required')
        );
      } else if (errorCode === 'EX-00149') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_delete_custom_environment')
        );
      } else if (errorCode === 'EX-00150') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_add_channel_in_big_commerce_store')
        );
      } else if (errorCode === 'EX-00151') {
        openNotificationWithIcon('error', t('common.messages.store_not_found'));
      } else if (errorCode === 'EX-00152') {
        openNotificationWithIcon(
          'error',
          t('common.messages.default_master_theme_not_exist')
        );
      } else if (errorCode === 'EX-00153') {
        openNotificationWithIcon(
          'error',
          t('common.messages.environment_required')
        );
      } else if (errorCode === 'EX-00154') {
        openNotificationWithIcon(
          'error',
          t('common.messages.master_algorithm_not_found')
        );
      } else if (errorCode === 'EX-00155') {
        openNotificationWithIcon(
          'error',
          t('common.messages.master_widget_not_found')
        );
      } else if (errorCode === 'EX-00156') {
        openNotificationWithIcon(
          'error',
          t('common.messages.widget_not_exist')
        );
      } else if (errorCode === 'EX-00157') {
        openNotificationWithIcon(
          'error',
          t('common.messages.api_access_type_not_valid')
        );
      } else if (errorCode === 'EX-00158') {
        openNotificationWithIcon(
          'error',
          t('common.messages.big_commerce_store_already_exist_in_workspace')
        );
      } else if (errorCode === 'EX-00159') {
        openNotificationWithIcon(
          'error',
          t('common.messages.duplicate_store_name_not_use')
        );
      } else if (errorCode === 'EX-00160') {
        openNotificationWithIcon(
          'error',
          t('common.messages.store_disconnected')
        );
      } else if (errorCode === 'EX-00161') {
        openNotificationWithIcon('error', t('common.messages.invalid_otp'));
      } else if (errorCode === 'EX-00162') {
        openNotificationWithIcon('error', t('common.messages.otp_expired'));
      } else if (errorCode === 'EX-00163') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_recovery_code')
        );
      } else if (errorCode === 'EX-00164') {
        openNotificationWithIcon(
          'error',
          t('common.messages.error_while_getting_qr')
        );
      } else if (errorCode === 'EX-00165') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_password')
        );
      } else if (errorCode === 'EX-00166') {
        openNotificationWithIcon('error', t('common.messages.invalid_captcha'));
      } else if (errorCode === 'EX-00167') {
        openNotificationWithIcon(
          'error',
          t('common.messages.new_url_can_not_be_same_as_old_url')
        );
      } else if (errorCode === 'EX-00168') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_redirect_url')
        );
      } else if (errorCode === 'EX-00169') {
        openNotificationWithIcon(
          'error',
          t('common.messages.redirect_data_not_exist')
        );
      } else if (errorCode === 'EX-00170') {
        openNotificationWithIcon(
          'error',
          t('common.messages.redirect_old_url_already_exist')
        );
      } else if (errorCode === 'EX-00171') {
        openNotificationWithIcon(
          'error',
          t('common.messages.redirect_new_url_already_exist')
        );
      } else if (errorCode === 'EX-00172') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_file_type_to_import_url')
        );
      } else if (errorCode === 'EX-00173') {
        openNotificationWithIcon('error', t('common.messages.user_is_blocked'));
      } else if (errorCode === 'EX-00174') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_csv_file_msg')
        );
      } else if (errorCode === 'EX-00175') {
        openNotificationWithIcon(
          'error',
          t('common.messages.file_size_exceeds_5mb')
        );
      } else if (errorCode === 'EX-00176') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_csv_file_msg')
        );
      } else if (errorCode === 'EX-00177') {
        openNotificationWithIcon(
          'error',
          t('common.messages.smtp_config_already_exist')
        );
      } else if (errorCode === 'EX-00178') {
        openNotificationWithIcon(
          'error',
          t('common.messages.smtp_config_does_not_exist')
        );
      } else if (errorCode === 'EX-00179') {
        openNotificationWithIcon(
          'error',
          t('common.messages.phrase_config_not_exist')
        );
      } else if (errorCode === 'EX-00180') {
        openNotificationWithIcon(
          'error',
          t('common.messages.phrase_name_already_exist')
        );
      } else if (errorCode === 'EX-00181') {
        openNotificationWithIcon(
          'error',
          t('common.messages.email_template_name_already_exist')
        );
      } else if (errorCode === 'EX-00182') {
        openNotificationWithIcon(
          'error',
          t('common.messages.email_template_does_not_exist')
        );
      } else if (errorCode === 'EX-00183') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_delete_default_template')
        );
      } else if (errorCode === 'EX-00184') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_update_content_modal_edge_caching')
        );
      } else if (errorCode === 'EX-00185') {
        openNotificationWithIcon(
          'error',
          t(
            'common.messages.you_can_not_update_content_modal_edge_caching_as_it_disable'
          )
        );
      } else if (errorCode === 'EX-00186') {
        openNotificationWithIcon(
          'error',
          t('common.messages.master_template_data_not_found')
        );
      } else if (errorCode === 'EX-00187') {
        openNotificationWithIcon(
          'error',
          t('common.messages.edge_caching_data_not_exist')
        );
      } else if (errorCode === 'EX-00189') {
        openNotificationWithIcon(
          'error',
          t('common.messages.shopify_store_already_exist_in_this_workspace')
        );
      } else if (errorCode === 'EX-00190') {
        openNotificationWithIcon(
          'error',
          t('common.messages.store_already_in_that_environment')
        );
      } else if (errorCode === 'EX-00191') {
        openNotificationWithIcon(
          'error',
          t('common.messages.duplicate_store_name_can_not_use')
        );
      } else if (errorCode === 'EX-00192') {
        openNotificationWithIcon(
          'error',
          t('common.messages.spell_check_does_not_exist')
        );
      } else if (errorCode === 'EX-00193') {
        openNotificationWithIcon(
          'error',
          t('common.messages.phrases_does_not_exist')
        );
      } else if (errorCode === 'EX-00194') {
        openNotificationWithIcon(
          'error',
          t('common.messages.entity_already_exists', { entity: entity })
        );
      } else if (errorCode === 'EX-00195') {
        openNotificationWithIcon(
          'error',
          t('common.messages.stop_words_does_not_exist')
        );
      } else if (errorCode === 'EX-00196') {
        openNotificationWithIcon(
          'error',
          t('common.messages.synonyms_does_not_exist')
        );
      } else if (errorCode === 'EX-00197') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_file_type_to_import_spell_check_data')
        );
      } else if (errorCode === 'EX-00198') {
        openNotificationWithIcon(
          'error',
          t('common.messages.spell_check_data_not_exist')
        );
      } else if (errorCode === 'EX-00199') {
        openNotificationWithIcon(
          'error',
          t('common.messages.phrases_data_not_exist')
        );
      } else if (errorCode === 'EX-00200') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_file_type_to_import_phrases_data')
        );
      } else if (errorCode === 'EX-00201') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_auth_code')
        );
      } else if (errorCode === 'EX-00202') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_file_type_to_import_stop_words')
        );
      } else if (errorCode === 'EX-00203') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_file_type_to_import_synonyms')
        );
      } else if (errorCode === 'EX-00204') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_update_default_email_template')
        );
      } else if (errorCode === 'EX-00222') {
        openNotificationWithIcon(
          'error',
          t('common.messages.blocked_user_by_admin_message')
        );
      } else if (errorCode === 'EX-00223') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_remove_your_self')
        );
      } else if (errorCode === 'EX-00225') {
        openNotificationWithIcon(
          'error',
          t('common.messages.email_validation_error_message')
        );
      } else if (errorCode === 'EX-00226') {
        openNotificationWithIcon(
          'error',
          t('common.messages.auto_complete_already_exist')
        );
      }

      cb && cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependentEntities, entity, history, mutation.error, mutation.isError, t]);
};

export default useError;
