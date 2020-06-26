export class Duty {
  /**
  * 是否参与值班 0表示不参与值班， 1表示参与值班
  */
  public state: 0 | 1 = 0;
  /**
  * 值班星期的集合
  */
  public week: number[] = [];
  /**
  * 值班课节的集合
  */
  public class: number[] = [];
  /**
  * 本周值班记录集合
  */
  public dutydate: string[] = [];
  constructor(options?: { state: 0 | 1, week: number[], class: number[], dutydate?: string[] }) {
    if (options) {
      const { state, week, dutydate } = options
      this.state = state
      this.week = week
      this.class = options.class
      if (dutydate) {
        this.dutydate = dutydate
      }
    }
  }
}

export type DutyInfo = {
  stuid: string | number;
  name: string;
  week: number[];
  class: number[];
  dutydate: string[];
  head: string[];
  duty?: {
    week: number;
    class: number;
  }[]
}

export default Duty;
