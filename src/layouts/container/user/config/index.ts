export const getSchema = () => {
  return {
    mobile: {
      type: 'verify-code',
      title: '手机号码',
      'x-props': {
        url: 'login/smsCode',
      },
    },
    cerifyCode: {
      type: 'string',
      title: '短信验证码',
      'x-props': {
        placeholder: '请输入验证码',
      },
    },
    newPassword: {
      type: 'xm-password',
      title: '新密码',
      description: '6-18位字符（可含数字、大小写字母）',
      'x-props': {
        placeholder: '请输入密码',
      },
      'x-component-props': {
        autoComplete: 'new-password',
      },
    },
    confirmPassword: {
      type: 'xm-password',
      title: '再次输入新密码',
      'x-props': {
        placeholder: '请再次输入密码',
      },
    },
  }
}
