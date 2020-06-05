export class Online {
  entertime: string;
  head: string;
  name: string;
  reason: string;
  stuid: string;
  constructor() { }
}

export class SignRecord extends Online {
  id: number;
  outtertime: string;
  constructor() {
    super()
  }
}

export default Online
