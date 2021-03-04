<template>
  <el-dialog width="690px" title="选择配送区域" :visible.sync="isShow" :before-close="handleClose">
    <div v-for="(region, key) in areaData['00']" :key="key" class="region-container">
      <div v-if="region.isVisible" class="region">
        <el-checkbox
          :indeterminate="region.selectedLength < region.totalLength && region.selectedLength > 0"
          v-model="region.isCheck"
          >{{ region.value }}</el-checkbox
        >
      </div>
      <div v-if="region.isVisible" class="province-container">
        <div
          class="province"
          v-for="(province, provinceKey) in areaData[region.dataCode]"
          :key="provinceKey"
        >
          <div class="province-box">
            <el-checkbox
              :indeterminate="
                province.selectedLength < province.totalLength && province.selectedLength > 0
              "
              v-model="province.isCheck"
            >
              <span
                :ref="`region-${province.dataCode}`"
                @mouseenter="handleMouseenterProvince(province.dataCode)"
                @mouseleave.stop="handleMouseleaveProvince"
              >
                {{ province.value }} <i class="el-icon-arrow-down"></i
              ></span>
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>

    <!-- 全选 -->
    <div class="all-check">
      <el-checkbox
        :indeterminate="totalSelectedLength === totalLength && totalSelectedLength > 0"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >
        <span>
          全选<span>{{ totalLength }}</span>
        </span>
      </el-checkbox>
      <el-button>提交</el-button>
    </div>

    <!-- 市 -->
    <el-popover
      transition=""
      :ref="provincePopoverId"
      placement="bottom"
      popper-class="vue-expressage-poppver-template"
    >
      <div
        class="limit-height"
        @mouseenter.stop="hanleEnterPopver"
        @mouseleave.stop="handleMouseleaveProvince"
      >
        <div class="city-container">
          <div
            v-for="(city, cityKey) in areaData[`${provincePopoverId.split('-')[1]}`]"
            :key="cityKey"
            class="city"
          >
            <div
              class="city-box"
              @mouseover.stop="handleMouseenterCity(city.dataCode)"
              @mouseleave.stop="handleMouseleaveCity"
            >
              <el-checkbox
                :indeterminate="city.selectedLength < city.totalLength && city.selectedLength > 0"
                v-model="city.isCheck"
              >
                <span
                  v-if="areaData[city.dataCode]"
                  v-popover="`popover-${city.dataCode}`"
                  :ref="`region-${city.dataCode}`"
                >
                  {{ city.value }} <i class="el-icon-arrow-right"></i
                ></span>
                <span v-else :ref="`region-${city.dataCode}`"> {{ city.value }} </span>
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
    <!-- 区 -->
    <el-popover
      transition=""
      :ref="cityPopoverId"
      popper-class="vue-expressage-poppver-template"
      placement="right"
    >
      <div
        class="limit-height"
        @mouseover.stop="handleMouseEnterArea"
        @mouseleave.stop="handleMouseleaveProvince"
      >
        <div class="city-container">
          <div
            v-for="(area, areaKey) in areaData[`${cityPopoverId.split('-')[1]}`]"
            :key="areaKey"
            class="city"
          >
            <div class="city-box">
              <el-checkbox
                :indeterminate="area.selectedLength < area.totalLength && area.selectedLength > 0"
                v-model="area.isCheck"
              >
                <span :ref="`region-${area.dataCode}`"> {{ area.value }}</span>
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </el-dialog>
</template>

<script>
const DELAY = 200
import areaData from '../../assets/data.json'

export default {
  name: 'vue-expressage-template',
  components: {},
  props: {
    isShow: {
      type: Boolean,
      value: false
    }
  },
  data() {
    return {
      stockKey: {},
      areaData,
      provincePopoverId: 'provincePopover',
      cityPopoverId: 'cityPopover',
      checkAll: false,
      totalSelectedLength: 0, // 总选择个数
      totalLength: 0 // 总长度
    }
  },

  created() {
    this.initStockKey()
    this.calcTotalLength()
  },
  mounted() {},
  watch: {},
  methods: {
    handleClose() {
      this.$emit('update:isShow', false)
    },

    // 初始化指针
    initStockKey() {
      const stockKey = {}

      for (let key in areaData) {
        if (typeof areaData[key] === 'object') {
          for (let subKey in areaData[key]) {
            stockKey[subKey] = key
          }
        }
      }

      this.stockKey = stockKey

      console.log(areaData['00'])
    },

    // 鼠标移入省区域
    handleMouseenterProvince(code) {
      this.$refs[this.provincePopoverId].showPopper = false

      clearTimeout(this._timer)

      const provincePopoverId = `popover-${code}`

      this.$refs[this.provincePopoverId].doDestroy()

      this.provincePopoverId = provincePopoverId

      console.log(this.provincePopoverId)

      // this.isRenderPopver = true

      this.$nextTick(() => {
        this.$refs[this.cityPopoverId].showPopper = false
        this.$refs[this.provincePopoverId].referenceElm = this.$refs[`region-${code}`][0]
        this.$refs[this.provincePopoverId].doShow()
      })
    },

    // 鼠标移出省区域
    handleMouseleaveProvince() {
      clearTimeout(this._timer)

      this._timer = setTimeout(() => {
        this.$refs[this.provincePopoverId].showPopper = false
        this.$refs[this.cityPopoverId].showPopper = false
      }, DELAY)
    },

    // 鼠标移入城市弹窗
    hanleEnterPopver() {
      clearTimeout(this._timer)

      this.$refs[this.provincePopoverId].showPopper = true
    },

    // 鼠标移入城市dom
    handleMouseenterCity(code) {
      this.$refs[this.cityPopoverId].showPopper = false

      clearTimeout(this._timer)

      const cityPopoverId = `popover-${code}`

      this.$refs[this.cityPopoverId].doDestroy()

      this.cityPopoverId = cityPopoverId

      this.$nextTick(() => {
        this.$refs[this.cityPopoverId].referenceElm = this.$refs[`region-${code}`][0]
        this.$refs[this.cityPopoverId].doShow()
      })
    },

    // 鼠标移出城市dom
    handleMouseleaveCity() {
      clearTimeout(this._timer)

      this._timer = setTimeout(() => {
        this.$refs[this.cityPopoverId].showPopper = false
      }, DELAY)
    },

    // 鼠标移入地区弹窗
    handleMouseEnterArea() {
      clearTimeout(this._timer)
      this.$refs[this.provincePopoverId].showPopper = true
    },

    // 全选
    handleCheckAllChange(flag) {
      for (let key in areaData) {
        if (typeof areaData[key] === 'object') {
          for (let subKey in areaData[key]) {
            if (flag) {
              if (!areaData[key][subKey].isCheck && areaData[key][subKey].isVisible) {
                areaData[key][subKey].isCheck = true
              } else {
                continue
              }
            } else {
              if (areaData[key][subKey].isCheck && areaData[key][subKey].isVisible) {
                areaData[key][subKey].isCheck = false
              } else {
                continue
              }
            }
          }
        }
      }

      this.calcTotalLength()
    },

    // 计算全部已选
    calcAllSelectedLen() {},

    // 计算单个已选

    calcSingleSelectedLen() {},

    // 计算总长度
    calcTotalLength() {
      let total = 0

      for (let key in areaData['00']) {
        total += areaData['00'][key].totalLength
      }

      this.totalLength = total
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
  border-bottom: 1px solid #f0f0f0;
}

.region-container {
  display: flex;
  // align-items: center;
  margin-bottom: 10px;
  width: 100%;

  .region {
    width: 100px;
  }

  .province-container {
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: wrap;
    .province {
      width: 33.33%;
      padding-bottom: 10px;
      box-sizing: border-box;
    }
  }
}

.city-container {
  .city-box {
    margin-bottom: 10px;
  }
}

.limit-height {
  max-height: 200px;
  padding: 12px;
  box-sizing: border-box;
  overflow-y: scroll;
  min-width: 50px;
}
.all-check {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
<style>
.vue-expressage-poppver-template {
  padding: 0 !important;
}
</style>
