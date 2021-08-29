import { formatMatchValue } from '@/assets/utils'
import { STATUS } from '@/pages/user-manage/user/constant'

export const getSchema = () => {
  return {
    name: {
      type: 'xm-string',
      title: '名称/编码',
    },
  }
}

export const getColumns = () => {
  return [
    {
      title: '企业编码',
      dataIndex: 'orgId',
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      width: 220,
    },
    {
      title: 'Boss编号',
      dataIndex: 'bossId',
    },
    {
      title: '区域',
      dataIndex: 'regionName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '昨日活跃率',
      dataIndex: 'uvRate',
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
    },
    {
      title: '异网成员数',
      dataIndex: 'noCmccMemberCount',
    },
    {
      title: '激活成员数',
      dataIndex: 'activeMemberCount',
    },
    // {
    //   title: '友好客户覆盖',
    //   dataIndex: 'isHaveFriendlyCustom',
    //   render: value => (value ? '是' : '否'),
    // },
    {
      title: '客户经理',
      dataIndex: 'customName',
    },
    {
      title: '企业管理员',
      dataIndex: 'adminName',
    },
  ]
}
