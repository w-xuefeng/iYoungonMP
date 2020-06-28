export default class Apply {
  /**
  * 申请 id
  */
  public aid: number;
  /**
  * 申请者学号
  */
  public applicantstuid: number;
  /**
  * 申请者姓名
  */
  public applicantname: string;
  /**
  * 申请者头像
  */
  public applicanthead: string;
  /**
  * 申请日期
  */
  public appdate: string;
  /**
  * 申请理由
  */
  public appreason: string;
  /**
  * 要申请的时间
  */
  public apptime: string;
  /**
  * 要申请的课节
  */
  public appclass: number;
  /**
  * 补值班时间
  */
  public appfixtime: string;
  /**
  * 补值班课节
  */
  public appfixclass: number;
  /**
  * 申请状态 0代表未处理 1代表同意 2代表拒绝
  */
  public state: 0 | 1;
  /**
  * 处理日期
  */
  public redate: string | null;
  /**
  * 处理人学号
  */
  public handlerstuid: string | null;
  /**
  * 处理人姓名
  */
  public handlername: string | null;

  constructor() {
  }
}
