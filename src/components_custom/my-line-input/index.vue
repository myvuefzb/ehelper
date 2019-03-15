<template>
  <div class="common-part-item" v-if="halfLine">
    <span class="common-part-star"><i class="common-star-icon" v-if="isRequired">*</i></span>
    <span class="common-part-span" :style="spanWidth">{{itemName}}</span>
    <div class="common-part-right" :style="countRightWidth">
      <slot>
        <input :type="type" class="common-input" :style="countRightInputWidth" v-model="countInputValue"
               :placeholder="placeholder" :readonly="readOnly" :maxlength="maxlength"
               :disabled="disabled">
      </slot>
    </div>
  </div>
  <div class="common-part-item" v-else>
    <slot>
      <input :type="type" class="common-input-full" :style="countRightInputWidth" v-model="countInputValue"
             :placeholder="placeholder" :readonly="readOnly" :maxlength="maxlength"
             :disabled="disabled">
    </slot>
  </div>
</template>
<script>
  export default {
    name: "my-line-input",
    model: {
      prop: 'inputValue',
      event: 'change',
    },
    props: {
      itemName: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '请填写'
      },
      inputValue: {
        type: String | Number,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      disabled: { //表单disable
        type: Boolean,
        default: false
      },
      isRequired: { //是否必填
        type: Boolean,
        default: true
      },
      halfLine: {
        type: Boolean,
        default: true
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      leftTextWidth: {
        type: Number,
        default: 0
      },
      colRightWidth: {
        type: Number,
        default: 0
      },
      rightInputWidth: {
        type: Number,
        default: 0
      },
      maxlength:{
        type:String
      }
    },
    computed: {
      countInputValue: {
        get: function () {
          return this.inputValue;
        },
        set: function (value) {
          this.$emit('change', value)
        }
      },
      spanWidth() {
        let leftTextWidth = this.leftTextWidth;
        if (leftTextWidth) {
          return 'width:' + leftTextWidth + 'px;'
        }
      },
      countRightWidth() {
        let colRightWidth = this.colRightWidth;
        if (colRightWidth) {
          return 'width:' + colRightWidth + 'px;'
        }
      },
      countRightInputWidth() {
        let rightInputWidth = this.rightInputWidth;
        if (rightInputWidth) {
          return 'width:' + rightInputWidth + '%;'
        }
      }
    },
    methods: {}

  }
</script>

<style lang="less" scoped>
  @inputHeight: 104px;
  @spanFontSize: 28px;
  @titleFontSize: 32px;
  @oneLineHeight: @inputHeight + 4;
  @placeholderColor: #d7d7d7;
  .sameHeightVLineHeight(@value:80px) {
    height: @value;
    line-height: @value;
  }

  .input::-webkit-input-placeholder {
    color: #999;
  }

  .common-part-star {
    vertical-align: middle;
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    color: #f00;
    font-size: @spanFontSize;
  }

  .common-star-icon {
    font-style: normal;
  }

  .common-part-span {
    font-size: @titleFontSize;
    width: 200px;
    line-height: 1.3;
    display: inline-block;
    vertical-align: middle;
  }

  .common-part-item {
    position: relative;
    padding-left: 20px;
    padding-right: 20px;
    height: @oneLineHeight;
    line-height: @oneLineHeight;
    border-bottom: 1px solid #ddd;
    overflow: hidden;

  }

  .common-input {
    float: right;
    height: @inputHeight;
   // line-height: @inputHeight;
    border: none;
    width: 80%;
    text-align: right;
    background: none;
    font-size: @spanFontSize;
    padding-right: 40px;
  }

  .common-input-full {
    height: @inputHeight;
    line-height: @inputHeight;
    border: none;
    width: 100%;
    background: none;
    font-size: @spanFontSize;
    padding-right: 40px;
    padding-left: 30px;
  }

  .common-right-layout {
    width: 70%;
    float: right;
    text-align: right;
  }

  .common-text-select {
    vertical-align: middle;
    height: @inputHeight;
    line-height: @inputHeight;
    border: none;
    width: 70%;
    text-align: right;
  }

  .common-text-img {
    vertical-align: middle;
    width: 26px;
    height: 30px;
  }

  .common-part-right {
    position: absolute;
    right: 0;
    top: 0;
    width: 60%;
    height: inherit;
    padding-right: 10px;
  }
  .income-part-my-text{
    text-align: right;
    padding-right:40px;
    font-size:32px !important;
  }

  input::-webkit-input-placeholder {
    color: @placeholderColor;
  }

  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: @placeholderColor;
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: @placeholderColor;
  }

  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: @placeholderColor;
  }

</style>
