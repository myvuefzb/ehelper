<template>
  <div class="common-icon-right">
    <check-icon :value.sync="countCheckValue">{{trueValueText}}</check-icon>
    <check-icon :value.sync="revCheckValue">{{falseValueText}}</check-icon>
  </div>
</template>
<script>
  import {CheckIcon} from 'vux';
  export default {
    components: {
      CheckIcon
    },
    model: {
      prop: 'checkValue',
      event: 'changeValue'
    },
    props: {
      checkValue: {
        type: Boolean,
        default: false
      },
      trueValueText: {
        type: String,
        default: '是'
      },
      falseValueText: {
        type: String,
        default: '否'
      }
    },
    computed: {
      revCheckValue: {
        get() {
          return !this.checkValue
        },
        set(value) {
          this.$emit('changeValue', !value)
        }
      },
      countCheckValue: {
        get() {
          return this.checkValue
        },
        set(value) {
          this.$emit('changeValue', value)
        }
      }

    }

  }
</script>

<style>
  .common-icon-right {
    float: right;
    padding-right: 40px;
  }
</style>
