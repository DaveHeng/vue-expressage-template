const data = require('../../assets/data.json')

const hash = {}

const map = new Map()

const area = {
  东北: {
    key: '01',
    value: ['210000', '220000', '230000']
  },
  华东: {
    key: '02',
    value: ['310000', '320000', '330000', '340000', '360000']
  },

  华中: {
    key: '03',
    value: ['410000', '420000', '430000']
  },
  华北: {
    key: '04',
    value: ['110000', '120000', '130000', '140000', '150000', '370000']
  },
  华南: {
    key: '05',
    value: ['440000', '450000', '460000', '350000']
  },
  西北: {
    key: '06',
    value: ['610000', '620000', '630000', '640000', '650000']
  },
  西南: {
    key: '07',
    value: ['500000', '510000', '520000', '530000', '540000']
  },
  港澳台: {
    key: '08',
    value: ['710000', '810000', '820000']
  }
}

for (let key in area) {
  const mapKey = area[key].value
  const mapValue = area[key].key

  console.log(mapKey, mapValue)
  map.set(mapKey, mapValue)

  if (!hash['00']) {
    hash['00'] = {}
  }

  hash['00'][mapValue] = key
}

for (let key in data['86']) {
  for (let k of map) {
    if (k[0].includes(key)) {
      if (!hash[k[1]]) {
        hash[k[1]] = {}
      }

      hash[k[1]][key] = data['86'][key]
    }
  }
}

delete data['86']

const areaData = Object.assign({}, data, hash)

for (let key in areaData) {
  for (let subKey in areaData[key]) {
    const value = areaData[key][subKey]
    areaData[key][subKey] = {
      parentCode: key,
      value,
      isVisible: true,
      dataCode: subKey,
      selectedLength: 0,
      isCheck: false
    }
  }
}
const temp = {} // dataCode : parentCode
function resetLen(obj) {
  for (let key in obj) {
    // 重置为0

    if (typeof obj[key] === 'object') {
      for (let subKey in obj[key]) {
        temp[subKey] = key
      }
    }
  }
}

function calcTotal1(obj) {
  let totalNum = 0 // 所有
  for (let key in obj) {
    let total = 0
    const len = Object.keys(obj[key]).length

    if (temp[key]) {
      const parentCode = temp[key]
      obj[parentCode][key].length = len
      obj[parentCode][key].totalLength = 0
    }
    if (typeof obj[key] === 'object') {
      for (let subKey in obj[key]) {
        if (!obj[subKey]) {
          obj[key][subKey].length = 0
          obj[key][subKey].totalLength = 1
          total += 1
        }
      }
    }
    setLen2(key, obj, total)
  }

  // 计算最外层总数
  for (let key in obj) {
    let total = 0
    const parentCode = temp[key]
    if (parentCode === '00') {
      for (let subkey in obj[key]) {
        total += obj[key][subkey].totalLength
      }

      obj[parentCode][key].totalLength = total

      totalNum += total
    } else {
      continue
    }
  }

  console.log(totalNum)
}

function setLen2(key, obj, total) {
  const parentCode = temp[key]

  if (parentCode && parentCode !== '00') {
    obj[parentCode][key].totalLength += total

    setLen2(parentCode, obj, obj[parentCode][key].totalLength)
  }
}

resetLen(areaData)

calcTotal1(areaData)

console.log(JSON.stringify(areaData))
