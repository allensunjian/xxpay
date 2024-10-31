<!--
 * Copyright (c) 2023 by Allen_sun email: Allen_sun_js@hotmail.com, All Rights Reserved.
-->
<style scoped>
.proceed__container {}

.procee__routine {
  position: relative;
  display: flex;
  padding-bottom: 20px;
}

.procee__routine_content {
  padding: 10px;
  border-radius: 10px;
  background: #a1ccf5;
  flex: 1;
  word-break: break-all;
  margin-left: 20px
}

.procee__routine_title {
  background: #1890ff;
  display: inline-block;
  flex: 0 0 100px;
  color: #fff;
  text-align: center;
  border-radius: 20px;
  height: 30px;
  line-height: 30px;
}

.procee__routine::after {
  content: "";
  display: inline-block;
  height: 100%;
  border-left: 1px dotted #1890ff;
  position: absolute;
  left: 50px;
}

.procee__routine:last-child::after {
  display: none;
}
</style>
<template>
  <a-modal v-model:open="cShow" title="订单流转流程" @ok="handleOk" @cancel="handleOk">
    <div class='procee__routine'>
      <span class="procee__routine_title">医院处理成功</span>
      <div class="procee__routine_content">
        医院处理成功
      </div>
    </div>
    <div class='procee__routine'>
      <span class="procee__routine_title">医院处理成功</span>
      <div class="procee__routine_content">
        医院处理成功
      </div>
    </div>
    <div class='procee__routine'>
      <span class="procee__routine_title">医院处理成功</span>
      <div class="procee__routine_content">
        医院处理成功
      </div>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({

  }),
  computed: {
    cShow: function () {
      return this.show
    }
  },
  methods: {
    handleOk() {
      this.$emit('close')
    }
  }
};
</script>