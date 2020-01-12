export class User {
  id: number;
  name: string;
  stuid: string;
  token: string;
  duty: string;
  email: string;
  utype: number;
  utypeName?: string;
  birthday?: string;
  college?: string;
  department?: string;
  fullhead?: string;
  head?: string;
  ifkey?: number;
  loginip?: string;
  majorclass?: string;
  online?: number;
  phone?: string;
  photo?: null | string;
  position?: number;
  positionName?: string;
  qq?: string;
  registerdate?: string;
  sex?: string;
  sexName?: string;
  signcount?: number;
  ulevel?: number;
  wxid?: null | string;
  xgtoken?: null | string;
  constructor() {}
}

export default User
