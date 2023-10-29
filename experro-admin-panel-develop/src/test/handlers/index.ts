import { RestHandler } from 'msw';

import buildUserHandlers from './user';
import buildInternationalizationHandler from './internationalization';
import buildGroupHandlers from './group';
import buildUserFilterHandlers from './user_filter';
import buildRoleFilterHandlers from './role_filter';
import buildAPITokenHandlers from './apiToken';
import buildContentModalHandlers from './content-modal';
import buildWorkspaceUserHandlers from './workspace-user';
import buildWorkspaceEmailsTemplateHandlers from './workspace-emails-template';
import buildWorkspaceHandlers from './workspace';
import buildWorkspaceEmailsMasterTemplateHandlers from './workspace-emails-master-template';
import buildWorkspaceEmailsPhraseHandlers from './workspace-emails-phrase';
import buildWorkspaceEmailsSendEmailHandlers from './workspace-emails-send-email';
import buildWorkspaceEmailsSmtpHandlers from './workspace-emails-smtp';

export const getHandlers = (apiUrl: string): RestHandler[] => {
  return Object.entries({
    users: buildUserHandlers,
    internationalization: buildInternationalizationHandler,
    group: buildGroupHandlers,
    userFilter: buildUserFilterHandlers,
    roleFilter: buildRoleFilterHandlers,
    apiToken: buildAPITokenHandlers,
    contentModal: buildContentModalHandlers,
    workspaceUsers: buildWorkspaceUserHandlers,
    workspaceEmailsTemplate: buildWorkspaceEmailsTemplateHandlers,
    workspaceEmailsPhrase: buildWorkspaceEmailsPhraseHandlers,
    workspaceEmailsSmtp: buildWorkspaceEmailsSmtpHandlers,
    workspaceEmailsMasterTemplate: buildWorkspaceEmailsMasterTemplateHandlers,
    workspaceEmailsSendEmail: buildWorkspaceEmailsSendEmailHandlers,
    workspace: buildWorkspaceHandlers,
  }).flatMap<RestHandler>(([groupKey, buildHandlers]) =>
    Object.entries(buildHandlers(apiUrl)).reduce<RestHandler[]>(
      (acc, [requestKey, handler]) => {
        acc.push(handler);
        return acc;
      },
      []
    )
  );
};
