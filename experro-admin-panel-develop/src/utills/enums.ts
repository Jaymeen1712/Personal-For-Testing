export const APIS_ROUTES = {
  PROFILE: '/user-service/v1/profile',
  PROFILE_IMAGE: '/user-service/v1/profile-image',
  PERMISSIONS: '/user-service/v1/permissions',
  LINKS: '/auth-service/v1/auth/links',
  TOKEN: '/auth-service/v1/auth/token',
  LOGOUT: '/auth-service/v1/logout',
  GROUP: '/setting-service/v1/groups',
  LANGUAGES: '/setting-service/v1/languages',
  WORKSPACE_LANGUAGES: '/setting-service/v1/workspaces',
  USERS: '/user-service/v1/users',
  USER: '/user-service/v1/user',
  USERS_ALL: '/user-service/v1/users-all',
  WORKSPACE_ROLE: '/setting-service/v1/workspace',
  ROLES: '/setting-service/v1/roles',
  WORKSPACES: '/setting-service/v1/workspaces',
  AUDIENCE_USERS: '/analytics-service/v1/users/search',
  TOKENS: '/setting-service/v1/workspaces',
  SETTING_FILTER: '/setting-service/v1/roles/filter',
  GROUP_FILTER: '/setting-service/v1/groups/search',
  USER_FILTER: '/setting-service/v1/users/filter',
  FORGOT_PASSWORD: '/user-service/v1/forgot-password',
  SET_PASSWORD: '/user-service/v1/set-password',
  USER_WORKSPACES: '/setting-service/v1/user-workspaces',
  TIME_ZONE: '/user-service/v1/time-zone',
  CURRENCY: '/user-service/v1/currency',
  VERIFY_USER: '/user-service/v1/verify-user',
  CHANGE_PASSWORD: '/user-service/v1/change-password',
  CONTENTS: '/contents',
  PUBLIC_CONTENTS: '/public-contents',
  PUBLIC_CONTENT_MODELS: '/public-content-models',
  CONTENT_FIELDS: '/content-fields',
  PUBLIC_CONTENT_FIELDS: '/public-content-fields',
  COMPONENT_FIELDS: '/component-fields',
  PAGE_TEMPLATE: '/theme-version-templates',
  PARENT_GROUP: '/groups',
  MEDIA_MANAGER: '/media-manager-service/v1/workspaces',
  CONTENT_MODEL_WORKSPACE: '/content-model-service/v1/workspace',
  COMPONENTS: '/components',
  THUMBNAIL: '/media-manager-service/v1',
  PROFILE_IMAGE_THUMBNAIL: '/media-manager-service/public/v1',
  CONTENT_SERVICE: '/content-manager-service/v1/workspaces',
  SWITCH_WORKSPACE: '/setting-service/v1/workspaces/switch',
  CONTENT_LIBRARY_SERVICE: '/content-manager-service/v1/workspaces',
  CONTENT_MODAL_DATA: 'content-model-data',
  USER_ALL_WORKSPACES: '/setting-service/v1/all-workspaces',
  BIGCOMMERCE: '/bigcommerce/v1/workspaces',
  THEME_SERVICE: '/theme-service/v1/workspaces',
  USER_PREFERENCE: '/user-service/v1/users/workspaces',
  NAVIGATION: '/menu-service/v1/workspaces',
  MERCHANDISING_SERVICE: '/merchandising-service/v1/workspaces',
  ENVIRONMENT_SERVICE: '/environment-service/v1/workspaces',
  ECOMMERCE_SERVICE: '/ecommerce-service/v1/workspaces',
  WORKSPACE_ALL_USERS: '/setting-service/v1/workspaces',
  DASHBOARD_COUNT: '/analytics-service/v1/session-summary',
  TOTAL_SEARCHES: '/analytics-service/v1/event-summary',
  TOP_ZERO_SEARCH_AND_SEARCH_RECORDS:
    '/analytics-service/v1/event-summary-segment-wise',
  SEARCH_SUMMARY:
    '/analytics-service/v1/event-summary-date-wise-break-by-segment',
  GET_ALL_PRODUCTS: '/apis/ecommerce-service/public/v1/search',
  ENABLE_DISABLE_TWO_FACTOR_AUTHENTICATION: '/user-service/v1/mfa',
  VERIFY_PASSWORD_TWO_FACTOR_AUTHENTICATION:
    '/user-service/v1/verify/user-password',
  GENERATE_QR_CODE: '/user-service/v1/mfa/auth-app/qr',
  VERIFY_QR_CODE: '/user-service/v1/mfa/verify/auth-app-code',
  RECOVERY_CODE: '/user-service/v1/mfa/recovery-code',
  RESEND_TWO_FACTOR_AUTHENTICATION_CODE:
    '/auth-service/v1/mfa/resend/email-code',
  VERIFY_EMAIL_CODE: '/auth-service/v1/mfa/verify/email-code',
  VERIFY_APP_CODE: '/auth-service/v1/mfa/verify/auth-app-code',
  VERIFY_RECOVERY_KEY: '/auth-service/v1/mfa/verify/recovery-code',
  RESET_MFA: '/user-service/v1/reset-mfa',
  ANALYTICS_AUDIENCE: '/analytics-service/v1/users',
  GET_ALL_ECOMMERCE_PRODUCTS: '/ecommerce-service/public/v1/search',
  APP_INTEGRATION_ROUTE: '/integration-service/v1/workspaces',
  SHOPIFY_ROUTE: '/shopify-service/v1/workspaces',
  SEARCH_SERVICE: '/search-service/v1/workspaces',
  PERSONALIZATION_SERVICE: '/personalization-service/v1/workspaces',
  CONTENTFUL_ROUTE: '/contentful-service/v1/workspaces',
  SESSION_BY_TRAFFIC: '/analytics-service/v1/session-summary-segment-wise',
  EVENT_SUMMARY_WITH_USER_STATE:
    '/analytics-service/v1/event-summary-with-user-stats',
  TRENDING_UP_PRODUCTS: '/analytics-service/v1/get-trending-up-products',
  TOP_SELLING_PRODUCTS: '/analytics-service/v1/get-top-selling-products',
  HIGH_POTENTIAL_PRODUCTS: '/analytics-service/v1/get-high-potential-products',
  TO_IMPROVE: '/analytics-service/v1/get-products-to-improve',
  ABANDON_PRODUCTS: '/analytics-service/v1/get-frequently-abondoned-products',
  NOT_SELLING: '/analytics-service/v1/get-not-selling-products',
  CUSTOMER_SUMMARY: '/analytics-service/v1/get-customers-summary',
  AUDIENCE_SERVICE: '/audience-service/v1/workspaces',
  SEARCH_INDUSTRIES: '/search-service/v1/industries',
  AUDIT_LOG_SERVICE: '/audit-log-service/v1/audit-log',
  ENVIRONMENTS_SERVICE:
    '/environment-service/v1/get-all-environments-by-tenant',
};

export const API_QUERY_KEY = {
  GROUP_SEARCH: 'group-search',
  GROUP_DETAIL: 'group-detail',
  GROUP_LIST: 'group-list',
  GROUP_USERS: 'group-users',
  GROUP_USER_LIST: 'group-user-list',
  ROLE_USERS: 'role-users',
  WORKSPACE_ROLE_USERS: 'workspace-role-users',
  GRID_DATA: 'grid-data',
  LANGUAGES: 'languages',
  WORKSPACE: 'workspace',
  WORKSPACE_LANGUAGES: 'workspace-languages',
  WORKSPACE_USERS: 'workspace-users',
  PROFILE: 'profile',
  PERMISSIONS: 'permissions',
  ROLE_GROUP_LIST: 'role-group-list',
  USER_DETAILS: 'user-details',
  WORKSPACE_USER_DETAILS: 'workspace-user-details',
  ALL_ROLE_LIST: 'all-role-list',
  ROLE_LIST: 'role-list',
  WORKSPACE_ROLE_LIST: 'workspace-role-list',
  COLLECTION_LIST: 'collection-list',
  SINGLE_TYPE_LIST: 'single-type-list',
  INSIGHT_LIST: 'insight-list',
  USER_WORKSPACES: 'user-workspaces',
  TOKEN_DETAIL: 'token-detail',
  AUTO_COMPLETE_DETAIL: 'auto-complete-detail',
  TOKEN_LIST: 'token-list',
  TIME_ZONES: 'time-zones',
  CURRENCY: 'currency',
  CONTENTS: 'contents',
  ALL_CONTENTS: 'all-contents',
  NAVIGATION_CONTENTS: 'navigation-contents',
  NAVIGATION_RECORDS: 'navigation-records',
  NAVIGATION_EXTERNAL_LINK_CONTENT: 'navigation-external-link-content',
  COMPONENT: 'component',
  PAGE_TEMPLATE: 'page_template',
  CONTENT_DETAILS: 'content-details',
  CONTENT_FIELDS: 'content-fields',
  COMPONENT_FIELDS: 'component_fields',
  ALL_CONTENT_FIELDS: 'all-content-fields',
  PARENT_GROUP: 'parent-group',
  COMPONENT_DETAILS: 'component-details',
  FOLDER_LIST: 'folder-list',
  SUB_FOLDER_LIST: 'sub-folder-list',
  FILE_LIST: 'file-list',
  FILE_DETAILS: 'file-details',
  USERS_ALL: 'users-all',
  WORKSPACE_USER_ALL: 'workspace-users-all',
  GET_FIELD_BY_ID: 'get-by-field-id',
  GLOBAL_SEARCH: 'global-search',
  GLOBAL_FILE_LIST: 'global-file-list',
  GLOBAL_FOLDER_LIST: 'global-folder-list',
  GET_RECORD_LIST: 'get-record-list',
  GET_ALL_WORKSPACES: 'get-all-workspaces',
  LIST_301_REDIRECTS: 'list-301-redirects',
  LIST_AUDIENCE: 'list-audience',
  DETAILS_AUDIENCE: 'details-audience',
  EVENTS_AUDIENCE: 'events-audience',
  USER_EVENTS: 'user-events',
  BIGCOMMERCE_STORE_DETAILS: 'bigcommerce-store-details',
  BIGCOMMERCE_STORE_STATISTICS: 'bigcommerce-store-statistics',
  LIST_BIGCOMMERCE_STORE: 'list-bigcommerce-store',
  LIST_CONTENTFUL_STORE: 'list-contentful-store',
  BIGCOMMERCE_STORE_SYNC_LOG: 'bigcommerce-store-bigcommerce-sync-log',
  GET_VERSION_LIST: 'get-version-list',
  GET_USER_PREFERENCE: 'get-user-preferences',
  GET_RELATION_FIELD_LIST: 'get-relation-record-list',
  NAVIGATION_LIST: 'navigation-list',
  NAVIGATION_DETAILS: 'navigation-details',
  GET_CONTENT_MODEL_ID: 'content-model-id',
  RULES_DATA: 'rules-data',
  PRODUCT_FIELDS: 'product-field-fields',
  PRODUCT_LIST: 'product-field-list',
  RULE_LIST: 'list-rules',
  PRODUCT_FIELD_VALUE: 'product-field-field-value',
  MERCHANDISING_PRODUCT: 'merchandising-product',
  ENVIRONMENT_LIST: 'environments-list',
  ENVIRONMENTS_LIST: 'environments-list',
  ENVIRONMENT_DETAILS: 'environment-details',
  THEME_LIST: 'theme-list',
  FACET_LIST: 'facet-list',
  GET_THEME_STATUS: 'get-theme-status',
  MERCHANDISING_PRODUCT_CATEGORIES: 'merchandising-product-categories',
  FACET_LIST_BY_CATEGORY: 'facet-list-by-category',
  MASTER_FACET_LIST: 'master-facet-list',
  FACET_CATEGORY_LIST: 'facet-category-list',
  PUBLISH_QUEUE: 'publish-queue',
  WORKSPACE_ALL_USERS: 'workspace-all-users',
  VERSION_PUBLISH_QUEUE: 'version-publish-queue',
  RECORD_TABLE_LIST: 'record-table-list',
  MULTIPLE_PRODUCT_FIELDS_VALUE: 'multiple-product-field-values',
  GENERATE_URL: 'generate-url',
  CONTENT_MODEL_GROUP_LIST: 'content-model-group-list',
  COMPONENT_MODEL_GROUP_LIST: 'component-model-group-list',
  CONTENT_MODEL_LIST: 'content-model-list',
  COMPONENT_MODEL_LIST: 'component-model-list',
  CONTENT_MODEL_DETAILS_BY_ID: 'content-model-details-by-id',
  COMPONENT_MODEL_DETAILS_BY_ID: 'component-details-by-id',
  RECENTLY_ADDED_RECORDS_DASHBOARD: 'recently-added-records-dashboard',
  RECENTLY_MODIFIED_RECORDS_DASHBOARD: 'recently-modified-records-dashboard',
  RECENTLY_PUBLISHED_RECORDS_DASHBOARD: 'recently-published-records-dashboard',
  RECENTLY_SCHEDULED_RECORDS_DASHBOARD: 'recently-scheduled-records-dashboard',
  MEDIA_MANAGER_FILE_COUNTS: 'media-managed-file-counts',
  CONTENT_LIBRARY_PUBLISHED_RECORDS_AND_ALL_RECORDS_COUNT:
    'content-library-published-and-all-record-count',
  USER_WORKSPACE: 'user-workspaces',
  GET_USER_PREFERENCE_PUBLISH_QUEUE: 'get-user-preferences-publish-queue',
  LIST_PUBLISH_QUEUE: 'list-publish-queue',
  DASHBOARD_WEBSITE_TRAFFIC: 'dashboard-website-traffic',
  DASHBOARD_VISITORS_COUNT: 'dashboard-visitors-count',
  PIE_CHART_DASHBOARD: 'pie-chart-dashboard',
  FACET_VALUE_COUNT: 'facet-value-count',
  LOGOUT: 'logout',
  GET_SMTP_EMAILS: 'get-smtp-emails',
  GET_PHRASES_EMAILS: 'get-phrases-emails',
  EXPORT_301_REDIRECT: 'export-301-redirection',
  GET_CACHE_DETAILS: 'get-cache-details',
  LIST_MASTER_TEMPLATE: 'list-master-template',
  LIST_TEMPLATES: 'list-templates',
  GET_TEMPLATE: 'get-template',
  TOTAL_SEARCHES: 'total-searches',
  TOP_ZERO_SEARCH_RECORDS: 'top-zero-search-and-search-records',
  TOP_SEARCHES_CLICKS_CARTS_ORDERS_ANALYTICS:
    'top-searches-clicks-carts-orders',
  SEARCH_SUMMARY: 'search-summary',
  ANALYTICS_TOP_DEVICES: 'analytics-top-devices',
  AUDIENCE_ACTIVITY: 'audience-activity',
  GENERATE_QR: 'generate-qr',
  RESEND_CODE: 'resend-code',
  INTERNAL_RESEND_CODE: 'internal-resend-code',
  GRAPH_QL_ENVIRONMENT: 'graph-ql-environment',
  APP_LIST: 'app-list',
  APP_CATEGORY_LIST: 'app-category-list',
  GET_APP_BY_ID: 'get-app-by-id',
  DOWNLOAD_THEME: 'download_theme',
  GET_SHOPIFY_STORE_LIST: 'get-shopify-store-list',
  GET_SHOPIFY_STORE_BY_ID: 'get-shopify-store-by-id',
  WORKSPACE_DETAILS: 'workspace-details',
  SHOPIFY_STORE_STATISTICS: 'shopify-store-statistics',
  INDUSTRY_LIST: 'industry-list',
  LIST_STOP_WORDS: 'list-stop-words',
  LIST_SPELL_CHECK: 'list-spell-check',
  LIST_SYNONYMS: 'list-synonyms',
  LIST_PHRASES: 'list-phrases',
  LIST_AUTO_COMPLETE: 'list-auto-complete',
  DETAILS_SYNONYMS: 'details-synonyms',
  GET_USER_RE_RANKING_STRATEGY: 'get-user-re-ranking-strategy',
  GET_RE_RANKING_COST_PRICE_STATUS: 'get-re-ranking-cost-price-status',
  GET_STRATEGY_DETAILS: 'get-strategy-details',
  GET_SETTING_DETAILS: 'get-setting-details',
  CONTENT_LIBRARY_CONTENT_MODEL_LIST: 'content-library-content-model-list',
  PUBLISH_QUEUE_ALL_USERS: 'publish_queue_all_users',
  WIDGET_LIST: 'widget-list',
  ALGORITHM_LIST: 'algorithm-list',
  WIDGET_DETAILS: 'widget-details',
  WIDGET_RULE_LIST: 'widget-rule-list',
  WIDGET_RULE_DETAILS: 'widget-rule-details',
  SESSION_BY_TRAFFIC_SOURCES: 'session-by-traffic-sources',
  TOP_LANDING_PAGES: 'top-landing-pages',
  REVENUE_BUYER: 'revenue-buyer',
  PURCHASE_BY_CATEGORY: 'purchase-by-category',
  PURCHASE_BY_DEVICE: 'purchase-by-device',
  FROM_SESSION_START_TO_PURCHASE: 'from-session-start-to-purchase',
  ORDER_BY_LOCATION: 'order-by-location',
  UNIT_SOLD_BY_DEVICES: 'unit-sold-by-devices',
  UNIT_SOLD: 'unit-sold',
  TRENDING_UP_PRODUCTS: 'trending-up-products',
  TOP_SELLING: 'top-selling',
  HIGH_POTENTIAL: 'high-potential',
  TO_IMPROVE: 'to-improve',
  ABANDON_PRODUCT: 'abandon-products',
  NOT_SELLING: 'not-selling',
  CUSTOMERS: 'customers',
  TOP_CUSTOMER_BY_REVENUE: 'top-customer-by-revenue',
  CUSTOMER_BY_REGION: 'customer-by-region',
  TOP_NEW_CUSTOMER_BASED_ON_REVENUE: 'top-new-customers-based-on-revenue',
  GET_SEGMENTS_LIST: 'get-segments-list',
  list_PRODUCT_FIELDS_RE_RANKING: 'list-product-fields-re-ranking',
  LIST_USER: 'list-user',
  LIST_ROLE_GROUPS: 'list-role-groups',
  ALL_ROLES: 'all-roles',
  CONTENT_MODAL_LIST_PUBLIC_API: 'content-modal-list-public-api',
  CONTENT_LIBRARY_MODAL_LIST_PUBLIC_API:
    'content-library-modal-list-public-api',
  CONTENT_LIBRARY_RECORD_LIST_PUBLIC_API:
    'content-library-record-list-public-api',
  GET_ALL_ENVIRONMENTS: 'get-all-environments',
  ALL_WORKSPACES: 'all-workspaces',
  LIST_ALL_USERS: 'list-all-users',
};

export const API_MUTATION_KEY = {
  PUBLISH_THEME: 'publish-theme',
  CREATE_GROUP: 'create-group',
  DELETE_GROUP: 'delete-group',
  UPDATE_GROUP: 'update-group',
  ADD_WORKSPACE_LANGUAGES: 'add-workspace-language',
  REORDER_WORKSPACE_LANGUAGES: 'reorder-workspace-languages',
  DELETE_WORKSPACE_LANGUAGES: 'delete-workspace-language',
  ADD_WORKSPACE: 'add-workspace',
  UPDATE_WORKSPACE: 'update_workspace',
  LINKS: 'links',
  TOKEN: 'token',
  CREATE_USER: 'create-user',
  UPDATE_USER: 'update-user',
  DELETE_USER: 'delete-user',
  GET_GLOBAL_ROLE: 'get-global-role',
  GET_WORKSPACE_ROLE: 'get-workspace-role',
  GLOBAL_ROLE_DETAILS: 'global-role-details',
  WORKSPACE_ROLE_DETAILS_GLOBAL: 'workspace-role-details-global',
  CREATE_GLOBAL_ROLE: 'create-global-role',
  CREATE_GLOBAL_ROLE_CLONE: 'create-global-role-clone',
  CREATE_WORKSPACE_ROLE: 'create-workspace-role',
  CREATE_WORKSPACE_ROLE_GLOBAL_CLONE: 'create-workspace-role-global-clone',
  CREATE_WORKSPACE_ROLE_CLONE: 'create-workspace-role-clone',
  UPDATE_GLOBAL_ROLE: 'update-global-role',
  UPDATE_WORKSPACE_ROLE: 'update-workspace-role',
  DELETE_GLOBAL_ROLE: 'delete-global-role',
  DELETE_WORKSPACE_ROLE: 'delete-workspace-role',
  CREATE_TOKEN: 'create-token',
  UPDATE_TOKEN: 'update-token',
  DELETE_TOKEN: 'delete-token',
  DELETE_WORKSPACE: 'delete-workspace',
  FORGOT_PASSWORD: 'forgot-password',
  SET_PASSWORD: 'set-password',
  UPDATE_PROFILE: 'update-profile',
  VERIFY_USER: 'verify-user',
  CHANGE_PASSWORD: 'change-password',
  RESET_PASSWORD: 'reset-password',
  USER_RESET_PASSWORD: 'user-reset-password',
  CREATE_CONTENT: 'create-content',
  UPDATE_CONTENT: 'update-content',
  REORDER_CONTENT: 're-order-content',
  DELETE_CONTENT: 'delete-content',
  DELETE_COMPONENT: 'delete-component',
  RESEND_INVITATION: 'resend-invitation',
  WORKSPACE_RESEND_INVITATION: 'workspace-resend-invitation',
  CREATE_COMPONENT: 'create-component',
  UPDATE_COMPONENT: 'update-component',
  CREATE_MODAL_FIELD: 'create-modal-field',
  CREATE_FOLDER: 'create-folder',
  UPDATE_FOLDER: 'update-folder',
  DELETE_FOLDER: 'delete-folder',
  MOVE_FILE: 'move-file',
  DELETE_FILE: 'delete-file',
  CREATE_CONTENT_FIELD: 'create-content-field',
  UPDATE_CONTENT_FIELD: 'update-content-field',
  UPDATE_COMPONENT_FIELD: 'update-component-field',
  SWITCH_WORKSPACE_KEY: 'switch-workspace',
  CREATE_TITLE: 'create-title',
  CREATE_NEW_RECORD: 'create-new-record',
  CREATE_301_REDIRECT: 'create-301-redirect',
  UPDATE_301_REDIRECT: 'update-301-redirect',
  DELETE_301_REDIRECT: 'delete-301-redirect',
  IMPORT_301_REDIRECT: 'import-301-redirect',
  IMPORT_AUTO_COMPLETE: 'import-auto-complete',
  CREATE_BIGCOMMERCE_STORE: 'create-bigcommerce-store',
  DELETE_BIGCOMMERCE_STORE: 'delete-bigcommerce-store',
  UPDATE_BIGCOMMERCE_STORE: 'update-bigcommerce-store',
  RESYNC_BIGCOMMERCE_STORE: 'resync-bigcommerce-store',
  CREATE_CONTENTFUL_STORE: 'create-bigcommerce-store',
  DELETE_CONTENTFUL_STORE: 'delete-bigcommerce-store',
  UPDATE_CONTENTFUL_STORE: 'update-bigcommerce-store',
  CONTENT_MODEL_RECORD_DELETE: 'content-model-record-delete',
  CONTENT_MODEL_RECORD_UPDATE: 'content-model-record-update',
  PUBLISH_VERSION: 'publish-version',
  UNPUBLISH_VERSION: 'unpublish-version',
  CLONE_VERSION: 'clone-version',
  UPDATE_CURRENT_VERSION: 'update-current-version',
  SAVE_AS_NEW_VERSION: 'save-as-new-version',
  MOVE_TO_DRAFT: 'move-to-draft',
  SCHEDULE_VERSION_PUBLISH: 'schedule-version-publish',
  SCHEDULE_VERSION_UNPUBLISH: 'schedule-version-unpublish',
  UPDATE_USER_PREFERENCE: 'update-user-preferences',
  UPDATE_VERSION_NAME: 'update-version-name',
  CREATE_NAVIGATION: 'create-navigation',
  UPDATE_NAVIGATION: 'update-navigation',
  DELETE_NAVIGATION: 'delete-navigation',
  UPDATE_NAVIGATION_ITEM: 'update-navigation-item',
  UPDATE_MERCHANDISING_RULE: 'update-merchandising-rule',
  CREATE_RULE: 'create-rule',
  UPDATE_RULE: 'update-rule',
  PATCH_RULE: 'patch-rule',
  DELETE_RULE: 'delete-rule',
  UPDATE_ENVIRONMENT: 'update-environment',
  CREATE_FACET: 'create-facet',
  DELETE_FACET: 'delete-facet',
  RULE_LIST_PRODUCT: 'rule-list-product',
  FIELD_REORDER: 'field-reorder',
  COMPONENT_FIELDS_REORDER: 'component-field-reorder',
  CONTENT_MODEL_CREATE_GROUP: 'content-model-create-group',
  CONTENT_MODEL_CREATE_MODEL: 'content-model-create-model',
  CONTENT_MODEL_UPDATE_MODEL: 'content-model-update-model',
  CONTENT_MODEL_UPDATE_GROUP: 'content-model-update-group',
  COMPONENT_CREATE_GROUP: 'component-create-group',
  COMPONENT_MODEL_CREATE_MODEL: 'component-model-create-model',
  COMPONENT_MODEL_UPDATE_GROUP: 'component-model-update-group',
  COMPONENT_MODEL_UPDATE_MODEL: 'component-model-update-model',
  SAVE_AND_PUBLISH: 'save-and-publish',
  CONTENT_MODEL_DELETE_GROUP: 'content-model-delete-group',
  COMPONENT_DELETE_GROUP: 'component-delete-group',
  REORDER_MODEL: 'reorder-components',
  REORDER_FOLDER: 'reorder-folder',
  REORDER_COMPONENT: 'reorder-component',
  REORDER_COMPONENT_FOLDER: 'reorder-component-folder',
  DELETE_PROFILE_IMAGE: 'delete-profile-image',
  BIGCOMMERCE_SYNC: 'bigcommerce-sync',
  LINKS_ORGANIZATION: 'links-organization',
  TOKEN_ORGANIZATION: 'token-organization',
  UNBLOCK_USER: 'unblock-user',
  BLOCK_USER: 'block-user',
  CREATE_SMTP_EMAIL: 'create-smtp-email',
  UPDATE_SMTP_EMAIL: 'update-smtp-email',
  UPDATE_CACHE: 'update-cache',
  CONTENT_MODEL_UPDATE_CACHE: 'content-model-update-cache',
  CONTENT_MODEL_DELETE_CACHE: 'content-model-delete-cache',
  CONTENT_MODEL_ALL_DELETE_CACHE: 'content-model-all-delete-cache',
  NAVIGATION_ALL_CACHE_DELETE: 'navigation-all-cache-delete',
  CREATE_PHRASES_EMAIL: 'create-phrases-email',
  DELETE_PHRASES_EMAIL: 'delete-phrases-email',
  UPDATE_PHRASES_EMAIL: 'update-phrases-email',
  DELETE_TEMPLATES_EMAIL: 'delete-template-email',
  SEND_TEST_EMAIL: 'send-test-email',
  CLONE_TEMPLATE: 'clone-template',
  UPDATE_TEMPLATE_EMAIL: 'update-template-emails',
  PATCH_TEMPLATE_EMAIL: 'patch-template-emails',
  ENABLE_DISABLE_TWO_FACTOR_AUTHENTICATION:
    'enable-disable-two-factor-authentication',
  VERIFY_PASSWORD: 'verify-password',
  VERIFY_CODE: 'verify-code',
  GENERATE_RECOVERY_KEY: 'generate-recover-key',
  VALIDATE_EMAIL_CODE: 'validate-email-code',
  VALIDATE_INTERNAL_EMAIL_CODE: 'validate-internal-email-code',
  VALIDATE_AUTH_APP_CODE: 'validate_auth_app_code',
  VALIDATE_RECOVERY_KEY: 'validate_recovery_key',
  VALIDATE_INTERNAL_RECOVERY_KEY: 'validate-internal-recovery-key',
  RESET_USER_AUTHENTICATION: 'reset-user-athentication',
  UNINSTALL_APP: 'uninstall-app',
  APP_INSTALL: 'app-install',
  CONFIGURE_APP: 'update-app-configuration',
  ADD_UPDATE_SHOPIFY_STORE: 'add-update-shopify-store',
  UPDATE_SHOPIFY_STORE: 'update-shopify-store',
  DELETE_SHOPIFY_STORE: 'delete-shopify-store',
  SHOPIFY_RESYNC_STORE: 'shopify-resync-store',
  CREATE_SPELL_CHECK: 'create-spell-check',
  CREATE_STOP_WORDS: 'create-stop-words',
  CREATE_SYNONYMS: 'create-synonyms',
  CREATE_PHRASES: 'create-phrases',
  CREATE_AUTO_COMPLETE: 'create-auto-complete',
  UPDATE_SPELL_CHECK: 'update-spellcheck',
  UPDATE_STOP_WORDS: 'update-stop-words',
  UPDATE_SYNONYMS: 'update-synonyms',
  UPDATE_PHRASES: 'update-phrases',
  UPDATE_AUTO_COMPLETE: 'update-auto-complete',
  DELETE_SPELL_CHECK: 'delete-spell-check',
  DELETE_STOP_WORDS: 'delete-stop-words',
  DELETE_SYNONYMS: 'delete-synonyms',
  DELETE_PHRASES: 'delete-phrases',
  DELETE_AUTO_COMPLETE: 'delete-auto-complete',
  PATCH_SPELL_CHECK_STATUS: 'patch-spell-check-status',
  PATCH_SYNONYMS_STATUS: 'patch-synonyms-status',
  PATCH_PHRASES_STATUS: 'patch-phrases-status',
  PATCH_AUTO_COMPLETE_STATUS: 'patch-auto-complete-status',
  UPDATE_SETTING: 'update-setting',
  UPDATE_USER_RE_RANKING_STRATEGY: 'update-user-re-ranking-strategy',
  PERSONALIZATION_SERVICE: '/personalization-service/v1/workspaces',
  UPDATE_WIDGET: 'update-widget',
  DELETE_WIDGET: 'delete-widget',
  CREATE_WIDGET: 'create-widget',
  UPDATE_WIDGET_RULE: 'update-widget-rule',
  PATCH_WIDGET_RULE: 'patch-widget-rule',
  PATCH_WIDGET_RULE_STATUS: 'patch-widget-rule-status',
  DELETE_WIDGET_RULE: 'delete-widget-rule',
  CREATE_WIDGET_RULE: 'create-widget-rule',
  WIDGET_RULE_LIST_PRODUCT: 'widget-rule-list-product',
  UPDATE_USER_STRATEGY: 'update-user-strategy',
  PREVIEW_PRODUCT_LIST: 'preview-product-list',
  PREVIEW_PRODUCT_COUNT: 'preview-product-count',
  GET_SEGMENT_DETAILS_BY_QUERY: 'get-segment-details-by-query',
  CREATE_SEGMENT: 'create-segment',
  DELETE_SEGMENT: 'delete-segment',
  UPDATE_SEGMENT: 'update-segment',
  SET_DEFAULT_ENVIRONMENT: 'set-default-environment',
  ADD_INDUSTRY: 'add-industry',
  SEARCH_AUTOCOMPLETE: 'search-autocomplete',
  GET_AUDIT_LOG: 'get-audit-log',
};

export const GRID_RENDERER_TYPE = {
  MENU: 'menu',
  TAG: 'tag',
  POPOVER: 'popover',
  ACTION: 'action',
  SORTABLE: 'sortable',
  CUSTOM: 'custom',
  REDIRECT: 'redirect',
};

export const USER_ACCESS_KEY = {
  TOKEN: 'accessToken',
  TENANT_ID: 'tenantId',
  STORE_LINK: 'storeLink',
};

export const ROUTES = {
  USER_LIST: '/users',
  ROLE_LIST: '/roles',
  TOKEN_LIST: '/cms-tokens',
  GROUP_LIST: '/groups',
  AUDIT_LOGS_LIST: '/audit-logs',
  WORKSPACES: '/workspaces',
};

export const SIDEBAR_KEYS = {
  GLOBAL: {
    WORKSPACE: 'global.workspace',
    SETTINGS: 'global.settings',
  },
  WORKSPACE: {
    DASHBOARD: 'workspace.dashboard',
    CONTENT_LIBRARY: 'workspace.content_library',
    CONTENT_MODEL: 'workspace.content_model',
    MEDIA_MANAGER: 'workspace.media_manager',
    PERSONALIZATION: 'workspace.personalization',
    MERCHANDISING: 'workspace.merchandising',
    AUDIENCE: 'workspace.audience',
    SETTINGS: 'workspace.settings',
    PUBLISH_QUEUE: 'workspace.publishQueue',
  },
  USER: {
    WORKSPACE: 'user.workspaces',
    ALL_WORKSPACE: 'user.all_workspace',
    NOTIFICATION: 'user.notification',
    USER: 'user.user',
    ADMIN: 'user.admin',
    ACCOUNT: 'user.account',
    LOGOUT: 'user.logout',
    TENANT: 'user.tenant',
  },
};

export const SUB_SIDEBAR_KEYS = {
  GLOBAL: {
    SETTINGS: {
      GENERAL: {
        KEY: 'general',
        USERS: 'users',
        ROLES: 'roles',
        GROUPS: 'groups',
        AUDIT_LOGS: 'audit_logs',
      },
      SECURITY: {
        KEY: 'security',
        SSO: 'sso',
      },
    },
  },
  WORKSPACE: {
    SETTINGS: {
      GENERAL: {
        KEY: 'workspace.settings.general',
        WORKSPACE: 'workspace.settings.general.workspace',
        CMS_TOKENS: 'workspace.settings.general.cms_tokens',
        INTERNATIONALIZATION: 'workspace.settings.general.internationalization',
        DNS_MANAGEMENT: 'workspace.settings.general.dns_management',
        ENVIRONMENTS: 'workspace.settings.general.environment',
        PUBLISH_QUEUE: 'workspace.settings.general.publish_queue',
        REDIRECTS: 'workspace.settings.general.301_redirects',
        EMAILS: 'workspace.settings.general.emails',
        EDGE_CACHING: 'workspace.settings.general.edge_caching',
      },
      ADMINISTRATION: {
        KEY: 'workspace.settings.administration',
        USERS: 'workspace.settings.administration.users',
        ROLES: 'workspace.settings.administration.roles',
      },
      ECOMMERCE_PLUGINS: {
        KEY: 'workspace.settings.ecommerce_plugins',
        BIGCOMMERCE: 'workspace.settings.ecommerce_plugins.bigcommerce',
      },
      APPEARANCE: {
        KEY: 'workspace.settings.appearance',
        THEME: 'workspace.settings.appearance.theme',
        VISUAL_BUILDER: 'workspace.settings.appearance.visual_builder',
        RAW_CODE_EDITOR: 'workspace.settings.appearance.raw_code_editor',
        NAVIGATION: 'workspace.settings.appearance.navigation',
      },
      INTEGRATIONS: {
        KEY: 'workspace.settings.integrations',
        APPS: 'workspace.settings.integrations.apps',
        PLATFORMS: 'workspace.settings.integrations.platforms',
      },
    },
  },
  USER: {
    ACCOUNT: {
      PROFILE: 'user.account.profile',
      SECURITY: 'user.account.security',
      NOTIFICATION_PREFERENCE: 'notification_preference',
    },
  },
};

export const FORMFIELD = {
  DEFAULT: {
    FIELD_NAME: 'field_name',
    VALUES: 'values',
    NUMBER_FORMAT: 'number_format',
    TYPE: 'type',
    SHORT_TEXT: 'short_text',
    LONG_TEXT: 'long_text',
    SINGLE_MEDIA: 'single_media',
    MULTIPLE_MEDIA: 'multiple_media',
    SEARCHABLE: 'is_searchable',
    CURRENCY: 'currency',
    SCRIPT_POSITION: 'script_position',
    ENABLE_SSR: 'enable_ssr',
    CONTENT_MODEL_LIST: 'content_model_list',
    RICH_TEXT_INLINE: 'rich_text_inline',
  },
  VALIDATION: {
    REGEXP_PATTERN: 'regexp_pattern',
    REQUIRED_FIELD: 'required_field',
    ENABLE_LOCALIZATION: 'enable_localization',
    UNIQUE_FIELD: 'unique_field',
    PRIVATE_FIELD: 'private_field',
    MINIMUM_LENGTH: 'minimum_length',
    MAXIMUM_LENGTH: 'maximum_length',
    ATTACHED_FIELD: 'attached_field',
    DEFAULT_VALUE: 'default_value',
    SELECT_DEFAULT_VALUE: 'select_default_value',
    MULTIPLE_RECORDS_SELECT: 'multiple_records_select',
  },
  MORE: {
    DEFAULT_VALUE: 'default_Value',
    HELP_TEXT: 'help_text',
    PLACEHOLDER: 'placeholder',
    MIN_HEIGHT: 'min_height',
    MAX_HEIGHT: 'max_width',
  },
  BASE_SETTING: {
    RELATION: {
      FIRST_TITLE: 'fist_title',
      FIRST_FIELD_NAME: 'first_field_name',
      SECOND_TITLE: 'second_title',
      SECOND_FIELD_NAME: 'second_field_name',
    },
    COMPONENT: {
      CREATE_NEW_COMPONENTS: 'create_new_components',
      USE_EXISTING_COMPONENTS: 'use_existing_components',
    },
  },
};

export const PERMISSIONS = {
  // Global
  'GLOBAL.CAN_MANAGE_USER_AND_SECURITY': 'global.can_manage_user_and_security',
  'GLOBAL.CAN_MANAGE_WORKSPACE': 'global.can_manage_workspace',

  // Internationalization
  'SETTINGS.INTERNATIONALIZATION.READ': 'settings.internationalization.read',
  'SETTINGS.INTERNATIONALIZATION.CREATE':
    'settings.internationalization.create',
  'SETTINGS.INTERNATIONALIZATION.DELETE':
    'settings.internationalization.delete',
  'SETTINGS.INTERNATIONALIZATION.UPDATE':
    'settings.internationalization.update',

  // Workspace
  'SETTINGS.WORKSPACE.READ': 'settings.workspace.read',
  'SETTINGS.WORKSPACE.CREATE': 'settings.workspace.create',
  'SETTINGS.WORKSPACE.UPDATE': 'settings.workspace.update',
  'SETTINGS.WORKSPACE.DELETE': 'settings.workspace.delete',

  // User and Roles - Role
  'SETTINGS.USERS_AND_ROLES.ROLES.READ': 'settings.users_and_roles.roles.read',
  'SETTINGS.USERS_AND_ROLES.ROLES.CREATE':
    'settings.users_and_roles.roles.create',
  'SETTINGS.USERS_AND_ROLES.ROLES.UPDATE':
    'settings.users_and_roles.roles.update',
  'SETTINGS.USERS_AND_ROLES.ROLES.DELETE':
    'settings.users_and_roles.roles.delete',

  // User and Roles - User
  'SETTINGS.USERS_AND_ROLES.USERS.READ': 'settings.users_and_roles.users.read',
  'SETTINGS.USERS_AND_ROLES.USERS.CREATE':
    'settings.users_and_roles.users.create',
  'SETTINGS.USERS_AND_ROLES.USERS.UPDATE':
    'settings.users_and_roles.users.update',
  'SETTINGS.USERS_AND_ROLES.USERS.DELETE':
    'settings.users_and_roles.users.delete',

  // CMS Token
  'SETTINGS.GENERAL.CMS_TOKENS.PERMISSIONS.READ':
    'settings.cms_tokens.permissions.read',

  // API Token
  'SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.READ':
    'settings.cms_tokens.api_tokens.read',
  'SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.CREATE':
    'settings.cms_tokens.api_tokens.create',
  'SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.UPDATE':
    'settings.cms_tokens.api_tokens.update',
  'SETTINGS.GENERAL.CMS_TOKENS.API_TOKEN.DELETE':
    'settings.cms_tokens.api_tokens.delete',

  // CLI Token
  'SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.READ':
    'settings.cms_tokens.cli_tokens.read',
  'SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.CREATE':
    'settings.cms_tokens.cli_tokens.create',
  'SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.UPDATE':
    'settings.cms_tokens.cli_tokens.update',
  'SETTINGS.GENERAL.CMS_TOKENS.CLI_TOKEN.DELETE':
    'settings.cms_tokens.cli_tokens.delete',

  // Ecommerce Store
  'SETTINGS.ECOMMERCE.CREATE': 'settings.ecommerce.create',
  'SETTINGS.ECOMMERCE.READ': 'settings.ecommerce.read',
  'SETTINGS.ECOMMERCE.UPDATE': 'settings.ecommerce.update',
  'SETTINGS.ECOMMERCE.DELETE': 'settings.ecommerce.delete',

  // Media Manager
  'SETTINGS.MEDIA_LIBRARY.VIEW': 'settings.media_library.view',
  'SETTINGS.MEDIA_LIBRARY.ADD': 'settings.media_library.add',
  'SETTINGS.MEDIA_LIBRARY.UPDATE': 'settings.media_library.update',
  'SETTINGS.MEDIA_LIBRARY.DELETE': 'settings.media_library.delete',

  // Content Modal
  'SETTINGS.CONTENT_MODEL.ACCESS': 'settings.content_model.access',

  // 301 Redirects
  'SETTINGS.GENERAL.REDIRECT_301.CREATE': 'settings.redirect_301.create',
  'SETTINGS.GENERAL.REDIRECT_301.READ': 'settings.redirect_301.read',
  'SETTINGS.GENERAL.REDIRECT_301.UPDATE': 'settings.redirect_301.update',
  'SETTINGS.GENERAL.REDIRECT_301.DELETE': 'settings.redirect_301.delete',

  //EMAIL TEMPLATE
  'SETTINGS.GENERAL.EMAIL_TEMPLATES.PERMISSIONS.READ':
    'settings.email_templates.permissions.read',

  // EMAIL TEMPLATE TEMPLATES
  'SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.READ':
    'settings.email_templates.email_template.read',
  'SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.CREATE':
    'settings.email_templates.email_template.create',
  'SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.UPDATE':
    'settings.email_templates.email_template.update',
  'SETTINGS.GENERAL.EMAIL_TEMPLATES.EMAIL_TEMPLATE.DELETE':
    'settings.email_templates.email_template.delete',

  // EMAIL TEMPLATE SMTP
  'SETTINGS.GENERAL.EMAIL_TEMPLATES.SMTP.READ':
    'settings.email_templates.smtp.read',
  'SETTINGS.GENERAL.EMAIL_TEMPLATES.SMTP.UPDATE':
    'settings.email_templates.smtp.update',

  // Cache
  'SETTINGS.GENERAL.CACHE.CREATE': 'settings.edge_caching.create',
  'SETTINGS.GENERAL.CACHE.UPDATE': 'settings.edge_caching.update',
  'SETTINGS.GENERAL.CACHE.DELETE': 'settings.edge_caching.delete',
  'SETTINGS.GENERAL.CACHE.READ': 'settings.edge_caching.read',

  // Themes
  'SETTINGS.APPEARANCE.THEME.PUBLISH': 'settings.themes.publish',

  // AUdience
  'AUDIENCE.READ': 'audience.segments.read',
  'AUDIENCE.CREATE': 'audience.segments.create',
  'AUDIENCE.UPDATE': 'audience.segments.update',
  'AUDIENCE.DELETE': 'audience.segments.delete',
};

export const PAGE_SIZE = 20;
export const MAX_TAG_COUNT = 2;
export const MAX_TAG_COUNT_PUBLISH_QUEUE = 1;

export const IMAGE_EXTENSIONS = [
  'jpeg',
  'png',
  'webp',
  'svg',
  'jpg',
  'gif',
  'tiff',
  'psd',
  'ai',
  'bmp',
  'raw',
];

export const VIDEO_EXTENSIONS = [
  'mp4',
  'mkv',
  'mov',
  'avi',
  'flv',
  'wmv',
  'webm',
  'h264',
  'mpeg',
  '3gp',
];

export const TEXT_EXTENSIONS = [
  'doc',
  'docx',
  'odt',
  'txt',
  'rtf',
  'csv',
  'txt',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
];

export const AUDIO_EXTENSIONS = [
  'mp3',
  'wav',
  'm4a',
  'flac',
  'mp4',
  'wma',
  'aac',
  'ogg',
  'pcm',
];

export const APPLICATION_EXTENSIONS = [
  'json',
  'xls',
  'pdf',
  'zip',
  'xlsx',
  'xlsm',
  'ppt',
  'pptx',
  'pptm',
  'docx',
  'msi',
  'war',
  'doc',
  'docx',
  'docm',
  'odt',
  'ods',
];

export const TEXT_REGEX_PATTERN = new RegExp(/^[ A-Za-z0-9_&., -]*$/i);
export const DESCRIPTION_REGEX_PATTERN = new RegExp(
  /^[ A-Za-z0-9\n_&., '-]*$/i
);
export const EMAIL_REGEX_PATTERN = new RegExp(
  /^[a-zA-Z0-9._+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/i
);
export const NAME_REGEX_PATTERN = new RegExp(/^[ A-Za-z]*$/i);
export const NAME_REGEX_NOT_ALLOW_SPACE_CAPS_PATTERN = new RegExp(/^[a-z]+$/);
export const NUMBER_REGEX_PATTERN = new RegExp(/^[0-9]*$/i);
export const WHITE_SPACE_NOT_ALLOW = new RegExp(/^\S*$/);
export const DOMAIN_REGEX_PATTERN = new RegExp(
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/
);
export const TAG_REGEX_PATTERN = new RegExp(/^[ A-Za-z-#.]*$/i);
export const sampleTemplateRedirection = `https://storage.googleapis.com/experro/sample-data/sample-redirect-301.csv`;
export const sampleAutoComplete = `https://storage.googleapis.com/experro-dev/sample-data/sample-auto-suggester.csv`;

export const ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const PASSWORD_CIPHER_MESSAGE = 'EXPERRO_SECRET_KEY';

export const GOOGLE_CAPTCHA_KEY = '6LeNTQkkAAAAANbP9U3nvwhl4z9kgLZEMfkX7VO6';

export const NUMBER_FIELD_OPERATIONS = [
  {
    label: 'Equals to',
    value: 'equal_to',
  },
  {
    label: 'Not equals to',
    value: 'not_equal_to',
  },
  {
    label: 'Greater than',
    value: 'greater_than',
  },
  {
    label: 'Less than',
    value: 'less_than',
  },
  {
    label: 'Greater than or equal to',
    value: 'greater_than_or_equal_to',
  },
  {
    label: 'Less than or equal to',
    value: 'less_than_or_equal_to',
  },
];

export const TEXT_GENERAL_FIELD_OPERATIONS = [
  {
    label: 'Contains',
    value: 'contains',
  },
  {
    label: 'Does not contains',
    value: 'does_not_contains',
  },
];

export const STRING_FIELD_OPERATIONS = [
  {
    label: 'Equal to',
    value: 'equal_to',
  },
  {
    label: 'Not equal to',
    value: 'not_equal_to',
  },
];

export const BOOLEAN_FIELD_OPERATIONS = [
  {
    label: 'Equal to',
    value: 'equal_to',
  },
  {
    label: 'Not equal to',
    value: 'not_equal_to',
  },
];

export const ACTION_OPERATIONS = [
  {
    label: 'Boost/Bury',
    value: 'boost/bury',
  },
  {
    label: 'Include',
    value: 'include',
  },
  {
    label: 'Exclude',
    value: 'exclude',
  },
];

export const ACTION_OPERATIONS_ON_SORT_CONDITION = [
  {
    label: 'Include',
    value: 'include',
  },
  {
    label: 'Exclude',
    value: 'exclude',
  },
];

export const SORT_ORDER = [
  {
    label: 'Ascending (A-Z)',
    value: 'asc',
  },
  {
    label: 'Descending (Z-A)',
    value: 'desc',
  },
];

export const RULE_NUMBER_FIELD_OPERATIONS = [
  {
    label: 'Equals to',
    value: 'equal_to',
  },
  {
    label: 'Greater than',
    value: 'greater_than',
  },
  {
    label: 'Less than',
    value: 'less_than',
  },
  {
    label: 'Greater than or equal to',
    value: 'greater_than_or_equal_to',
  },
  {
    label: 'Less than or equal to',
    value: 'less_than_or_equal_to',
  },
];

export const RULE_TEXT_GENERAL_FIELD_OPERATIONS = [
  {
    label: 'Contains',
    value: 'contains',
  },
];

export const RULE_STRING_FIELD_OPERATIONS = [
  {
    label: 'Equal to',
    value: 'equal_to',
  },
];

export const RULE_BOOLEAN_FIELD_OPERATIONS = [
  {
    label: 'Equal to',
    value: 'equal_to',
  },
];

export const DAYS_DROPDOWN_VALUE_DASHBOARD = [
  { label: 'Today', value: 'Today' },
  { label: 'Yesterday', value: 'Yesterday' },
  { label: 'Last 7 Days', value: 'Last 7 Days' },
  { label: 'Last 14 Days', value: 'Last 14 Days' },
  { label: 'Last 30 Days', value: 'Last 30 Days' },
  { label: 'Last 6 Months', value: 'Last 6 Months' },
  { label: 'Last 12 Months', value: 'Last 12 Months' },
];

export const DAYS_DROPDOWN_VALUE = [
  { label: '30 Days', value: '30 Days' },
  { label: '10 Days', value: '10 Days' },
  { label: '5 Days', value: '5 Days' },
];

export const MERCHANDISING_DAYS_DROPDOWN_VALUE = [
  { label: 'Last 7 Days', value: 'Last 7 Days' },
  { label: 'Last 14 Days', value: 'Last 14 Days' },
  { label: 'Last 30 Days', value: 'Last 30 Days' },
  { label: 'Last 6 Months', value: 'Last 6 Months' },
  { label: 'Last 12 Months', value: 'Last 12 Months' },
];

export const MERCHANDISING_LIST_SORTING_OPTIONS = [
  { value: 'recently_created', label: 'Recently Created' },
  { value: 'oldest_created', label: 'Oldest Created' },
  { value: 'a_to_z', label: 'A To Z' },
  { value: 'z_to_a', label: 'Z To A' },
];

export const FACET_LIST_SORTING_OPTIONS = [
  { value: 'recently_updated', label: 'Recently Updated' },
  { value: 'oldest_updated', label: 'Oldest Updated' },
  { value: 'a_to_z', label: 'A to Z' },
  { value: 'z_to_a', label: 'Z to A' },
];

export const PUBLISH_QUEUE_STATUS = [
  { value: 'SCHEDULED_TO_PUBLISH', label: 'Scheduled To Publish' },
  { value: 'SCHEDULED_TO_UNPUBLISH', label: 'Scheduled To UnPublish' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'UNPUBLISHED', label: 'Draft' },
];

export const PUBLISH_QUEUE_FIELDS = [
  {
    label: 'Date',
    value: 'created_at',
  },
  {
    label: 'Version',
    value: 'content_model_version_name',
  },
  {
    label: 'Environment',
    value: 'environment',
  },
  {
    label: 'User',
    value: 'created_by',
  },
  {
    label: 'Status',
    value: 'action',
  },
  {
    label: 'ID',
    value: 'id',
  },
];

export const MERCHANDISING_FIELDS = [
  {
    label: 'Created By',
    value: 'created_by',
  },
  {
    label: 'Created At',
    value: 'created_at',
  },
  {
    label: 'Modified By',
    value: 'modified_by',
  },
  {
    label: 'Modified At',
    value: 'modified_at',
  },
];

export const DICTIONARIES_STOP_WORDS = [
  {
    label: 'Term',
    value: 'term',
    disabled: true,
  },
  {
    label: 'Frequency',
    value: 'frequency',
  },
  {
    label: 'Suggested on',
    value: 'suggested_on',
  },

  {
    label: 'Published on',
    value: 'published_on',
  },

  {
    label: 'Published by',
    value: 'published_by',
  },
  {
    label: 'Modified on',
    value: 'modified_on',
  },
  {
    label: 'Modified by',
    value: 'modified_by',
  },
];

export const ENRICH_AUTO_COMPLETE = [
  {
    label: 'Search Term',
    value: 'searchTerm',
    disabled: true,
  },
  {
    label: 'Created By',
    value: 'created_by',
    disabled: true,
  },
  {
    label: 'Created At',
    value: 'created_at',
  },
  {
    label: 'Modified By',
    value: 'modified_by',
  },
  {
    label: 'Modified At',
    value: 'modified_at',
  },
];

export const DICTIONARIES_SPELL_CHECK = [
  {
    label: 'Term',
    value: 'term',
    disabled: true,
  },
  {
    label: 'Suggested Correction',
    value: 'suggested_correction',
    disabled: true,
  },
  {
    label: 'Frequency',
    value: 'frequency',
  },
  {
    label: 'Suggested on',
    value: 'suggested_on',
  },

  {
    label: 'Published on',
    value: 'published_on',
  },

  {
    label: 'Published by',
    value: 'published_by',
  },
  {
    label: 'Modified on',
    value: 'modified_on',
  },
  {
    label: 'Modified by',
    value: 'modified_by',
  },
];

export const publishStatusOption = [
  {
    key: 'Publish',
    label: 'Publish',
  },
  {
    key: 'Unpublish',
    label: 'Unpublish',
  },
];

export const PERSONALIZATION_FIELDS = [
  {
    label: 'Created By',
    value: 'created_by',
  },
  {
    label: 'Created At',
    value: 'created_at',
  },
  {
    label: 'Modified By',
    value: 'modified_by',
  },
  {
    label: 'Modified At',
    value: 'modified_at',
  },
];

export const PREFERENCES = [
  {
    label: '2FA using Email',
    key: 'email',
  },
  {
    label: '2FA using Authenticator App',
    key: 'authenticator_app',
  },
];

export const BREAK_BY = [
  'device_category',
  'os_name',
  'device_name',
  'country',
];

export const FROM_SESSION_START_TO_PURCHASE = [
  '[CLY]_view',
  'category_viewed',
  'product_viewed',
  'product_added_to_cart',
  'checkout_initiated',
  'checkout_completed',
];

export const EVENTS = [
  'product_viewed',
  'product_added_to_cart',
  'product_purchased',
];

export const BLUE_COLOR_SHADES = [
  '#A5B4FC',
  '#818CF8',
  '#6366F1',
  '#4F46E5',
  '#4338CA',
];

export const BROWN_COLOR_SHADES = [
  '#FCD34D',
  '#FBBF24',
  '#F59E0B',
  '#D97706',
  '#B45309',
];

export const GREEN_COLOR_SHADES = [
  '#6EE7B7',
  '#34D399',
  '#00B679',
  '#059669',
  '#047857',
];

export const RED_COLOR_SHADES = [
  '#FCA5A5',
  '#F87171',
  '#EF4444',
  '#DC2626',
  '#B91C1C',
];

export const countryListWithCountryCode = {
  AF: 'Afghanistan',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas ',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BQ: 'Bonaire, Sint Eustatius and Saba',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory ',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  CV: 'Cabo Verde',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  KY: 'Cayman Islands ',
  CF: 'Central African Republic ',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands ',
  CO: 'Colombia',
  KM: 'Comoros ',
  CD: 'Congo (the Democratic Republic of the)',
  CG: 'Congo ',
  CK: 'Cook Islands ',
  CR: 'Costa Rica',
  HR: 'Croatia',
  CU: 'Cuba',
  CW: 'Curaçao',
  CY: 'Cyprus',
  CZ: 'Czechia',
  CI: "Côte d'Ivoire",
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic ',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  SZ: 'Eswatini',
  ET: 'Ethiopia',
  FK: 'Falkland Islands  [Malvinas]',
  FO: 'Faroe Islands ',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories ',
  GA: 'Gabon',
  GM: 'Gambia ',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island and McDonald Islands',
  VA: 'Holy See ',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: "Korea (the Democratic People's Republic of)",
  KR: 'Korea (the Republic of)',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: "Lao People's Democratic Republic ",
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands ',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands ',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger ',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands ',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestine, State of',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines ',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  MK: 'Republic of North Macedonia',
  RO: 'Romania',
  RU: 'Russian Federation ',
  RW: 'Rwanda',
  RE: 'Réunion',
  BL: 'Saint Barthélemy',
  SH: 'Saint Helena, Ascension and Tristan da Cunha',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  MF: 'Saint Martin (French part)',
  PM: 'Saint Pierre and Miquelon',
  VC: 'Saint Vincent and the Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SX: 'Sint Maarten (Dutch part)',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia and the South Sandwich Islands',
  SS: 'South Sudan',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan ',
  SR: 'Suriname',
  SJ: 'Svalbard and Jan Mayen',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania, United Republic of',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks and Caicos Islands ',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates ',
  GB: 'United Kingdom of Great Britain and Northern Ireland ',
  UM: 'United States Minor Outlying Islands ',
  US: 'USA',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela (Bolivarian Republic of)',
  VN: 'Viet Nam',
  VG: 'Virgin Islands (British)',
  VI: 'Virgin Islands (U.S.)',
  WF: 'Wallis and Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
  AX: 'Åland Islands',
};

export const ECOMMERCE_PROVIDERS = {
  SHOPIFY: 'SHOPIFY',
  BIGCOMMERCE: 'BIGCOMMERCE',
};
