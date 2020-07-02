export class Resume {
  sex: string;
  name: string;
  work: { workurl: string; workdesc: string; }[];
  email: string;
  phone: string;
  skill: string[];
  stuid: string | number;
  demand: string;
  nation: string;
  college: string;
  birthday: string;
  softlang: string[];
  department: string;
  majorclass: string;
  nativeplace: string;
  selfcomment: string[];
  activityapply: {
    actdesc: string;
    actname: string;
    actrole: string;
    acttime: string;
  }[];
  computermaster: 0 | 1 | 2;
  departmentreason: string;
  constructor() {}
}

export default Resume
