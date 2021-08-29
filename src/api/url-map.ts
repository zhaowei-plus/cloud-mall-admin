export default {
  // 用户登录和修改密码
  login: {
    loginIn: '/ygw/api/dispatch/csm/admin/login', // 用户登录
    loginOut: '/ygw/api/dispatch/csm/admin/loginOut', // 用户登出
    smsCode: '/ygw/api/dispatch/csm/admin/sendSmsCode', // 获取校验码
    changePswd: '/ygw/api/dispatch/csm/admin/updatePwd', // 修改密码

    // 扫码登陆接口
    scanQrCode: {
      zj: {
        generate: '/access/IMLogin/getTwoDimensionCodeToken',
        aace: '/access/SC/scanCodeLogin',
      },
      cq: {
        generate: '/power/qr/api/generate.do',
        aace: '/aace',
        qrlogin: '/power/user/api/qrlogin.do', // 重庆需要调用第三个接口
      },
    },
  },

  platform: {
    menu: '/ygw/api/dispatch/csm/admin/getMenu', // 菜单信息
    btnAuthority: '/ygw/api/dispatch/csm/admin/getButton', // 操作按钮
    region: '/ygw/api/dispatch/cmms-market/channel/getRegionCode', // 查询地市
    province: '/ygw/api/dispatch/csm/admin/getDeployArea', // 渝企信省份
    contract: '/ygw/api/dispatch/cmmc-market/activity/order/contract', // 查看协议
  },

  /****************************************************用户管理*************************************************************/
  // 用户信息
  user: {
    list: '/ygw/api/dispatch/csm/admin/user/list',
    accountTypes: '/ygw/api/dispatch/csm/admin/accountType/selectList',
    supplies: '/ygw/api/dispatch/csm/admin/supply/selectList',
    isAccountManager: '/ygw/api/dispatch/csm/admin/user/isAccountManager',

    detail: '/ygw/api/dispatch/csm/admin/getUserInfo', // 详情
    update: '/ygw/api/dispatch/csm/admin/updateUser', // 修改
    userOn: '/ygw/api/dispatch/csm/admin/userOn', //启用
    userOff: '/ygw/api/dispatch/csm/admin/userOff', //停用
    resetPwd: '/ygw/api/dispatch/csm/admin/resetPwd', // 密码重置

    add: '/ygw/api/dispatch/csm/admin/addUser', // 新增用户
    roleList: '/ygw/api/dispatch/csm/admin/role/selectList',
  },
  // 角色信息
  role: {
    list: '/ygw/api/dispatch/csm/admin/role/list',

    update: '/ygw/api/dispatch/csm/admin/updateRole', // 修改
    roleOn: '/ygw/api/dispatch/csm/admin/roleOn', // 启用
    roleOff: '/ygw/api/dispatch/csm/admin/roleOff', // 停用
    roleMenu: '/ygw/api/dispatch/csm/admin/getRoleMenu', // 菜单权限
    saveRoleMenu: 'ygw/api/dispatch/csm/admin/submitMenuRoleConfig', // 保存菜单权限
    add: '/ygw/api/dispatch/csm/admin/addRole', // 新增
    region: '/ygw/api/dispatch/cmmc-market/region/role', // 用户地区编码
  },
  // 收款方信息
  supplier: {
    list: '/ygw/api/dispatch/csm/admin/supply/list',

    detail: '/ygw/api/dispatch/admin/supplier/get', // 详情
    update: '/ygw/api/dispatch/admin/supplier/update', // 修改
    add: '/ygw/api/dispatch/admin/supplier/add', // 新增
    enable: '/ygw/api/dispatch/admin/supplier/updateStatus/enable', // 启用
    disable: '/ygw/api/dispatch/admin/supplier/updateStatus/disable', // 启用

    status: '/ygw/api/dispatch/admin/supplier/updateStatus', // 启用/停用
    // list: '/ygw/api/dispatch/csm/admin/getSupplyList', // 收款方列表
  },

  /****************************************************商品管理*************************************************************/
  commodity: {
    list: '/ygw/api/dispatch/csm/admin/item/list',

    detail: '/ygw/api/dispatch/csm/admin/item/detail', // 详情
    update: '/ygw/api/dispatch/csm/admin/item/update', // 修改
    add: '/ygw/api/dispatch/csm/admin/item/create', // 新增
    status: '/ygw/api/dispatch/csm/admin/item/updateStatus', // 上架/下架

    online: '/ygw/api/dispatch/csm/admin/item/updateStatus/online', // 上架
    offline: '/ygw/api/dispatch/csm/admin/item/updateStatus/offline', // 下架

    saveDraft: '/ygw/api/dispatch/csm/admin/item/saveItemDraft', // 草稿保存
    getDraft: '/ygw/api/dispatch/csm/admin/item/getItemDraft', // 查询草稿
    province: '/ygw/api/dispatch/csm/admin/getDeployArea', // 渝企信省份

    checkBuyType: '/ygw/api/dispatch/csm/admin/item/checkBuyType', // 商品切换购买方式校验
    decList: '/ygw/api/dispatch/csm/admin/getItemDecsList',
    itemCode: '/ygw/api/dispatch/csm/admin/getItemCode',
    check: '/ygw/api/dispatch/item/check/select', // 校验精选页内的商品
  },

  category: {
    list: '/ygw/api/dispatch/csm/admin/category/list',
    update: '/ygw/api/dispatch/csm/admin/category/edit', // 修改
    add: '/ygw/api/dispatch/csm/admin/category/create', // 添加
    delete: '/ygw/api/dispatch/csm/admin/category/delete',
  },

  featured: {
    get: '/ygw/api/dispatch/item/select/get',
    save: '/ygw/api/dispatch/item/select/insertOrUpdate', // 提交
  },

  /****************************************************收款账户*************************************************************/
  account: {
    list: '/ygw/api/dispatch/csm/admin/beneficiary/list',
  },

  /****************************************************库存管理*************************************************************/
  stock: {
    list: '/ygw/api/dispatch/csm/admin/stock/list',
    edit: '/ygw/api/dispatch/csm/admin/item/editStock',
  },

  /****************************************************订单管理*************************************************************/
  trade: {
    list: '/ygw/api/dispatch/csm/admin/order/listOrders',
    export: '/csm-admin/order/exportOrders',
  },
  reservation: {
    list: '/ygw/api/dispatch/csm/admin/order/listReserves',
    export: '/csm-admin/order/exportReserves',
    detail: '/ygw/api/dispatch/csm/admin/order/getOrderDetail',
    handle: '/ygw/api/dispatch/csm/admin/order/handleReserve',
    close: '/ygw/api/dispatch/csm/admin/order/closeReserve',
  },

  upload: {
    file: '/ygw/api/upload/csm/ifs/uploadFile', // 文件上传
  },

  /****************************************************营销管理*************************************************************/
  material: {
    list: '/ygw/api/dispatch/cmms-market/material/list',
    status: '/ygw/api/dispatch/cmms-market/material/updateStatus',
    delete: '/ygw/api/dispatch/cmms-market/material/delete',
    save: '/ygw/api/dispatch/cmms-market/material/save',
    update: '/ygw/api/dispatch/cmms-market/material/update',
    saveDraft: '/ygw/api/dispatch/cmms-market/material/draft',
    getDraft: '/ygw/api/dispatch/cmms-market/material/getDraft',
    detail: '/ygw/api/dispatch/cmms-market/material/detail',
    tags: '/ygw/api/dispatch/cmmc-market/cust/tag/list',
    customerList: '/ygw/api/dispatch/cmmc-market/aims/customer/select/list',
    customerCount: '/ygw/api/dispatch/cmmc-market/resign/friend/count',
    regionCode: '/ygw/api/dispatch/cmms-market/channel/getReginCode',
    listForPush: '/ygw/api/dispatch/cmmc-market/material/listForPush',
    materialCmTarget:
      '/ygw/api/dispatch/cmcc-push/pubRecord/getMaterialCmTarget',
  },
  push: {
    list: '/ygw/api/dispatch/cmcc-push/pubRecord/listRecords',
    detail: '/ygw/api/dispatch/cmcc-push/pubRecord/getPubDetail',
    save: '/ygw/api/dispatch/cmcc-push/pubRecord/savePubRecord',
    export: '/csm-admin/pubRecord/exportRecords',
    filterOrgs: '/ygw/api/dispatch/cmcc-push/pubRecord/filterOrgIds',
    importOrgs: '/ygw/api/dispatch/cmcc-push/pubRecord/importOrgs',
    targetMembers: '/ygw/api/dispatch/cmcc-push/pubRecord/targetMembers',
    orgTargetMembers: '/ygw/api/dispatch/cmcc-push/pubRecord/orgTargetMembers',
  },
  // 目标客户
  targetCustomer: {
    list: '/ygw/api/dispatch/cmmc-market/market/user/query',
    selectList: '/ygw/api/dispatch/cmmc-market/aims/customer/selectList',
    delete: '/ygw/api/dispatch/cmmc-market/market/user/delete',
    appendList: '/ygw/api/dispatch/cmmc-market/aims/customer/append/query',
  },
  // 黑名单
  blackList: {
    list: '/ygw/api/dispatch/cmmc-market/forbid/customer/query',
    delete: '/ygw/api/dispatch/cmmc-market/forbid/customer/delete',
  },
  // 客户经理负责企业
  managerCompany: {
    list: '/ygw/api/dispatch/csm/admin/customer/manager/org/query',
  },
  // 友好客户维护
  friendMaintain: {
    list: '/ygw/api/dispatch/cmmc-market/friend/customer/org/query',
    add: '/ygw/api/dispatch/cmmc-market/friend/customer/org/add',
    update: '/ygw/api/dispatch/cmmc-market/friend/customer/org/update',
    getInfo: '/ygw/api/dispatch/cmmc-market/friend/customer/org/info',
    leaveConut: '/ygw/api/dispatch/cmmc-market/resign/friend/count',
  },
  groupTargetCustomer: {
    orgList: '/ygw/api/dispatch/cmmc-market/aims/org/query',
    userList: '/ygw/api/dispatch/cmmc-market/aims/user/query',
    orgDelete: '/ygw/api/dispatch/cmmc-market/aims/org/delete',
    userDelete: '/ygw/api/dispatch/cmmc-market/aims/user/delete',
    appendList: '/ygw/api/dispatch/cmmc-market/aims/customer/append/query',
    recordList:
      '/ygw/api/dispatch/cmmc-market/aims/customer/append/record/query',
    append: '/ygw/api/dispatch/cmmc-market/aims/customer/batch/append',
    getOrgInfoByOrgId: '/ygw/api/dispatch/cmmc-market/getOrgInfoByOrgId',
    getUserInfoByMobile: '/ygw/api/dispatch/cmmc-market/getUserInfoByMobile',
  },

  // 分公司
  channel: {
    list: '/ygw/api/dispatch/cmms-market/channel/list',
    update: '/ygw/api/dispatch/cmms-market/channel/createOrUpdate',
    currentChannel: '/ygw/api/dispatch/cmms-market/channel/get',
    saveChannel: '/ygw/api/dispatch/cmms-market/channel/set',
  },

  /****************************************************活动订单*************************************************************/
  activityOrder: {
    // 订购订单
    trade: {
      list: '/ygw/api/dispatch/csm/admin/activity/handle/order/list',
    },
    // 预约订单
    reservation: {
      list: '/ygw/api/dispatch/csm/admin/activity/reserve/order/list',
      detail: '/ygw/api/dispatch/csm/admin/activity/reserve/oder/look',
    },
    // 彩豆发放
    beanDeliver: {
      list: '/ygw/api/dispatch/cmms-market/bean/list',
    },
  },
  /****************************************************推送活动统计*************************************************************/
  paStatistics: {
    group: {
      list: '/ygw/api/dispatch/cmcc-push/pubRecord/listOrgPushStatics',
      detail: '/ygw/api/dispatch/cmcc-push/pubRecord/listOrgPushDetails',
    },
    market: {
      list: '/ygw/api/dispatch/cmcc-push/pubRecord/listMarketPushStatics',
    },
  },

  /****************************************************佣金结算*************************************************************/
  beSettlement: {
    beDeliver: {
      list: '/ygw/api/dispatch/cmms-market/settlement/list',
      detail: '/ygw/api/dispatch/cmms-market/settlement/detail',
      sendBean: '/ygw/api/dispatch/cmms-market/settlement/sendBean',
      enableBeans: '/ygw/api/dispatch/cmms-market/settlement/balance',
    },
    orderCheck: {
      list: '/ygw/api/dispatch/cmms-market/orderAudit/list',
      detail: '/ygw/api/dispatch/cmms-market/orderAudit/detail',
      beanCheck: '/ygw/api/dispatch/cmms-market/orderAudit/check/sendBean',
      sendBean: '/ygw/api/dispatch/cmms-market/orderAudit/sendBean',
      checkedMonth: '/ygw/api/dispatch/cmms-market/orderAudit/month',
      add: '/ygw/api/dispatch/cmms-market/orderAudit/audit',
    },
  },

  /****************************************************二次确认管理*************************************************************/
  confirmationManagement: {
    businessConfig: {
      list: '/ygw/api/dispatch/cmmc-market/bizConfig/listByPage',
      add: '/ygw/api/dispatch/cmmc-market/bizConfig/create',
      update: '/ygw/api/dispatch/cmmc-market/bizConfig/update',
      delete: '/ygw/api/dispatch/cmmc-market/bizConfig/delete',
    },
    pushDelivery: {
      list: '/ygw/api/dispatch/cmmc-market/confirm/listByPage',
      detailList: '/ygw/api/dispatch/cmmc-market/confirm/detail',
      push: '/ygw/api/dispatch/cmmc-market/confirm/push',
      detail: '/ygw/api/dispatch/cmmc-market/confirm/get',
      configList: '/ygw/api/dispatch/cmmc-market/confirm/bizConfig/list',
      add: '/ygw/api/dispatch/cmmc-market/confirm/create',
      update: '/ygw/api/dispatch/cmmc-market/confirm/update',
    },
  },
  /****************************************************数据中心*************************************************************/
  dataCenter: {
    verifyCode: '/ygw/api/dispatch/report-ops/sendCaptcha',
    checkVerifyCode: '/ygw/api/dispatch/report-ops/export/data/checkCaptcha',
    member: {
      statistics: '/cmmc-report/report-ops/cmmc/member/stat/survey',
      categories: '/cmmc-report/report-ops/cmmc/member/stat/trend_measure_list',
      info: '/cmmc-report/report-ops/cmmc/member/stat/trend',
      list: '/cmmc-report/report-ops/cmmc//member/stat/trend_detail',
    },
    group: {
      statistics: '/cmmc-report/report-ops/cmmc/org/stat/survey',
      categories: '/cmmc-report/report-ops/cmmc/org/stat/trend_measure_list',
      info: '/cmmc-report/report-ops/cmmc/org/stat/trend',
      list: '/cmmc-report/report-ops/cmmc/org/stat/trend_detail',
    },
    detail: {
      cumulative: {
        list: '/cmmc-report/report-ops/cmmc/org/stat/org_list',
      },
    },
    activity: {
      cards: '/ygw/api/dispatch/report-ops/setMealStatList',
      list: '/ygw/api/dispatch/report-ops/setMealDetailList',
    },
  },

  /****************************************************数据权限*************************************************************/
  dataPerm: {
    list: '/ygw/api/dispatch/csm/admin/dataCenter/getTabAuthList',
    edit: '/ygw/api/dispatch/csm/admin/dataCenter/setTabAuth',
    sort: '/ygw/api/dispatch/csm/admin/dataCenter/tabSort',
  },
}
