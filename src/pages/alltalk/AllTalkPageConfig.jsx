import TemplateList from './TemplateList';
import SendResult from './SendResult';
import GroupInfo from './GroupInfo';
import AlimTalk from './AlimTalk';
import Template from './Template';

export const AllTalkPageConfig = {
  routes: [
    {
      path: '/pages/template',
      exact: true,
      component: TemplateList,
    },
    {
      path: '/pages/template/detail',
      exact: true,
      component: Template,
    },
    {
      path: '/pages/alimTalk',
      exact: true,
      component: AlimTalk,
    },
    {
      path: '/pages/send',
      exact: true,
      component: SendResult,
    },
    {
      path: '/pages/groupInfo',
      exact: true,
      component: GroupInfo,
    },
  ],
};
