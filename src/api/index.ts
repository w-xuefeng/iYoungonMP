import { YGURL } from './url'
import { Req, getCode, HttpRequestOption, ReqAnyData } from './req'

/**
 * @function 绑定微信账号
 * */
export const bindAccount = ({
  stuid,
  password,
  wxid
}:{
  stuid: string,
  password: string,
  wxid: string
}) => {
  const opt: HttpRequestOption = {
    url: YGURL.patch_wxid,
    data: { stuid, password, wxid },
    method: 'POST'
  }
  return  Req(opt)
}

/**
 * @function 注册账号
 * */
export const regAccount = ({
  stuid,
  password,
  name,
  email,
  utype,
  wxid
}: {
  stuid: string | number,
  password: string,
  name: string,
  email: string,
  utype: string | number,
  wxid: string
}) => {
  const opt: HttpRequestOption = {
    url: YGURL.post_users,
    data: { stuid, password, name, email, utype, wxid },
    method: 'POST'
  }
  return  Req(opt)
}

/**
 * @function 获取注册码
 * */
export const getRegisterCode = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_rcode,
    method: 'GET'
  }
  return Req(opt)
}

/**
 * @function 获取用户信息
 * */
export const getUserInfo = () => {
  return getCode().then(rs => {
    const opt: HttpRequestOption = {
      url: YGURL.get_users,
      data: { code: rs.code },
      method: 'GET'
    }
    return Req(opt)
  })
}

/**
 * @function 获取最新公告
 * */
export const getLastNotice = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_last_notices,
    method: 'GET'
  }
  return ReqAnyData(opt)
}

/**
 * @function 获取当前在站成员信息
 * */
export const getCurrentOnline = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_current_online,
    method: 'GET'
  }
  return Req(opt)
}

/**
 * @function 获取携带钥匙站员信息
 * */
export const getHaskey = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_has_key,
    method: 'GET'
  }
  return Req(opt)
}

/**
 * @function 获取本周签到记录
 * */
export const getThisWeekSR = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_sign_record_this_week,
    method: 'GET'
  }
  return ReqAnyData(opt)
}

/**
 * @function 获取上周签到记录
 * */
export const getLastWeekSR = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_sign_record_last_week,
    method: 'GET'
  }
  return ReqAnyData(opt);
}

/**
 * @function 经纬度转地址
 * */
export const getLocation = ({ latitude, longitude }: { latitude: number, longitude: number }) => {
  const opt: HttpRequestOption = {
    url: `${YGURL.get_location}/?latitude=${latitude}&longitude=${longitude}&wxmp=1`,
    method: 'GET'
  };
  return ReqAnyData(opt);
}

/**
 * @function 通过学号和管理员token获取用户信息
 * */
export const getUserByToken = (stuid:string | number, token: string) => {
  const opt: HttpRequestOption = {
    url: `${YGURL.get_user_by_stuid_and_admin_token}/?stuid=${stuid}&adminToken=${token}`,
    method: 'GET'
  };
  return Req(opt);
}

/**
 * @function 获取允许签到的wifi信息
 * */
export const getAllowWifi = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_allow_wifi,
    method: 'GET'
  };
  return ReqAnyData(opt);
}

/**
 * @function 设置允许签到的wifi信息
 * */
export const setAllowWifi = (wifi: { wifi: string[]}) => {
  const opt: HttpRequestOption = {
    url: YGURL.set_allow_wifi,
    method: 'PUT',
    data: { wifi: JSON.stringify(wifi) }
  };
  return Req(opt);
}

/**
 * @function 获取允许签到的经纬度信息
 * */
export const getAllowLocation = () => {
  const opt: HttpRequestOption = {
    url: YGURL.get_allow_longlat,
    method: 'GET'
  };
  return ReqAnyData(opt);
}

/**
 * @function 设置允许签到的经纬度信息
 * */
export const setAlloLocation = (latlong: {
  lat: string | number;
  long: string | number;
  range: string | number;
}) => {
  const opt: HttpRequestOption = {
    url: YGURL.get_allow_longlat,
    method: 'PUT',
    data: { latlong: JSON.stringify(latlong) }
  };
  return Req(opt);
};

/**
 * @function 获取某一时间的签到记录
 * */
export const getSignRecordByTime = ({
  time,
  page,
  count
}: {
  time: string;
  page: number;
  count: number;
}) => {
  const opt: HttpRequestOption = {
    url: `${YGURL.get_sign_record_by_time}/?time=${time}&page=${page}&count=${count}`,
    method: 'GET'
  };
  return Req(opt);
};

/**
 * @function 签到
 * */
export const signInRequest = (stuid: number | string, reason: string) => {
  const opt: HttpRequestOption = {
    url: YGURL.post_sign_in,
    method: 'POST',
    data: { stuid, reason }
  };
  return Req(opt);
};

/**
 * @function 签退
 * */
export const signOutRequest = (stuid: number | string, ifkey: number) => {
  const opt: HttpRequestOption = {
    url: YGURL.post_sign_out,
    method: 'POST',
    data: { stuid, ifkey }
  };
  return Req(opt);
};

/**
 * @function 添加值班记录
 * */
export const addDuty = (stuid: number | string, dutydate: string) => {
  const opt: HttpRequestOption = {
    url: YGURL.post_update_duty,
    method: 'POST',
    data: { stuid, dutydate }
  };
  return Req(opt);
};
