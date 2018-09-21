const formatNumber = (n) => {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export const inArray = (needle, haystack, argStrict) => {
  var key = ''
  var strict = !!argStrict
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true
      }
    }
  }
  return false
}

export const REQ_URL = 'https://api.wangxuefeng.com.cn'

export const getLevelImg = (thisLevel) => {
  const MAX_LEVEL = 256
  const crownL = 64
  const sunL = 16
  const moonL = 4
  const starL = 1
  let crown = ''
  let sun = ''
  let moon = ''
  let star = ''
  let baseurl = 'https://api.wangxuefeng.com.cn/static/assets/default/ulevel/'
  var c, s, m, st, cy, sy, my
  if (thisLevel > MAX_LEVEL) {
    c = 4
    s = 0
    m = 0
    st = 0
  } else if (thisLevel >= crownL) {
    c = Math.floor(thisLevel / crownL)
    cy = thisLevel % crownL
    if (cy >= sunL) {
      s = Math.floor(cy / sunL)
      sy = cy % sunL
      if (sy >= moonL) {
        m = Math.floor(sy / moonL)
        my = sy % moonL
        if (my >= starL) {
          st = my
        } else {
          st = 0
        }
      } else {
        m = 0
        st = sy
      }
    } else {
      if (cy >= moonL) {
        m = Math.floor(cy / moonL)
        my = cy % moonL
        if (my >= starL) {
          st = my
        } else {
          st = 0
        }
      } else {
        m = 0
        st = cy
      }
    }
  } else if (thisLevel >= sunL) {
    c = 0
    s = Math.floor(thisLevel / sunL)
    sy = thisLevel % sunL
    if (sy >= moonL) {
      m = Math.floor(sy / moonL)
      my = sy % moonL
      if (my >= starL) {
        st = my
      } else {
        st = 0
      }
    } else {
      m = 0
      st = sy
    }
  } else if (thisLevel >= moonL) {
    c = 0
    s = 0
    m = Math.floor(thisLevel / moonL)
    my = thisLevel % moonL
    if (my >= starL) {
      st = my
    } else {
      st = 0
    }
  } else if (thisLevel >= starL) {
    c = 0
    s = 0
    m = 0
    st = thisLevel
  } else if (thisLevel === 0) {
    c = 0
    s = 0
    m = 0
    st = 0
  }
  for (let i = 0; i < c; i++) {
    crown += "<img src='" + baseurl + "crown.svg' class='ulevel'>"
  }
  for (let i = 0; i < s; i++) {
    sun += "<img src='" + baseurl + "sun.svg' class='ulevel'>"
  }
  for (let i = 0; i < m; i++) {
    moon += "<img src='" + baseurl + "moon.svg' class='ulevel'>"
  }
  for (let i = 0; i < st; i++) {
    star += "<img src='" + baseurl + "star.svg' class='ulevel'>"
  }
  return (crown + sun + moon + star)
}
