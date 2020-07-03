export class Resume {
  sex: string = '';
  name: string = '';
  work: { workurl: string; workdesc: string; }[] = [];
  email: string = '';
  phone: string = '';
  skill: string[] = [];
  stuid: string | number = '';
  demand: string = '';
  nation: string = '';
  college: string = '';
  birthday: string = '';
  softlang: string[] = []
  department: string = '';
  majorclass: string = '';
  nativeplace: string = '';
  selfcomment: string[] = []
  activityapply: {
    actdesc: string;
    actname: string;
    actrole: string;
    acttime: string;
  }[] = [];
  computermaster: 0 | 1 | 2 = 0;
  departmentreason: string = '';

  constructor(option?: Partial<Resume>) {
    if (option) {
      const keys = [
        'sex',
        'name',
        'work',
        'email',
        'phone',
        'skill',
        'stuid',
        'demand',
        'nation',
        'college',
        'birthday',
        'softlang',
        'department',
        'majorclass',
        'nativeplace',
        'selfcomment',
        'activityapply',
        'computermaster',
        'departmentreason'
      ];
      Object.keys(option).forEach(key => {
        if (keys.includes(key)) {
          this[key] = option[key];
        }
      })
    }
  }
}

export default Resume
