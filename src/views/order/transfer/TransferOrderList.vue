<template>
  <page-header-wrapper>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" class="table-head-ground">
          <div class="table-layer">
            <a-form-item label="" class="table-head-layout" style="max-width:350px;min-width:300px">
              <a-range-picker @change="onChange" :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledDate">
                <a-icon slot="suffixIcon" type="sync" />
              </a-range-picker>
            </a-form-item>
            <jeepay-text-up :placeholder="'转账/商户/渠道订单号'" :msg="searchData.unionOrderId"
              v-model="searchData.unionOrderId" />
            <!--            <jeepay-text-up :placeholder="'转账订单号'" :msg="searchData.transferId" v-model="searchData.transferId" />-->
            <!--            <jeepay-text-up :placeholder="'商户订单号'" :msg="searchData.mchOrderNo" v-model="searchData.mchOrderNo" />-->
            <!--            <jeepay-text-up :placeholder="'渠道支付订单号'" :msg="searchData.channelOrderNo" v-model="searchData.channelOrderNo" />-->
            <jeepay-text-up :placeholder="'商户号'" :msg="searchData.mchNo" v-model="searchData.mchNo" />
            <jeepay-text-up :placeholder="'应用AppId'" :msg="searchData.appId" v-model="searchData.appId" />
            <a-form-item label="" class="table-head-layout">
              <a-select v-model="searchData.state" placeholder="转账状态" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">订单生成</a-select-option>
                <a-select-option value="1">转账中</a-select-option>
                <a-select-option value="2">转账成功</a-select-option>
                <a-select-option value="3">转账失败</a-select-option>
              </a-select>
            </a-form-item>
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="queryFunc" :loading="btnLoading">搜索</a-button>
              <a-button style="margin-left: 8px" icon="reload" @click="() => this.searchData = {}">重置</a-button>
            </span>
          </div>
        </a-form>
      </div>

      <!-- 列表渲染 -->
      <JeepayTable @btnLoadClose="btnLoading = false" ref="infoTable" :initData="true"
        :reqTableDataFunc="reqTableDataFunc" :tableColumns="tableColumns" :searchData="searchData" rowKey="transferId"
        :tableRowCrossColor="true">

        <template slot="amountSlot" slot-scope="{record}"><b>金额：{{ record.amount }}</b></template> <!-- 自定义插槽 -->
        <template slot="refundAmountSlot" slot-scope="{record}">￥{{ record.refundAmount / 100 }}</template>
        <template slot="patientInfoSlot" slot-scope="{record}">
          <div>姓名：{{ record.patientName }}</div>
          <div>证件：{{ record.idNo }}</div>
        </template>
        <template slot="patientUniCodeSlot" slot-scope="{record}">{{ record.corpNo }}</template>
        <template slot="businessTypeSlot" slot-scope="{record}">{{ record.optTypeDesc }}</template>
        <template slot="targetSlot" slot-scope="{record}">{{ record.corpName }}</template>
        <template slot="businessResoures" slot-scope="{record}">{{ record.subject }}</template>
        <template slot="OrderStateSlot" slot-scope="{record}">

          <!-- <a-tag color="orange"></a-tag>
          <a-tag color="red" >分账处理中</a-tag> -->
          <a-tag color="green" @click="ProceedControllerGetShow(record)">医院处理成功</a-tag>

        </template>
        <template slot="transferAmountSlot" slot-scope="{record}"><b>￥{{ record.amount / 100 }}</b></template>
        <!-- 自定义插槽 -->
        <template slot="stateSlot" slot-scope="{record}">
          <a-tag :key="record.state"
            :color="record.state === 0 ? 'blue' : record.state === 1 ? 'orange' : record.state === 2 ? 'green' : 'volcano'">
            {{ record.state === 0 ? '订单生成' : record.state === 1 ? '转账中' : record.state === 2 ? '转账成功' : record.state ===
              3 ? '转账失败' : record.state === 4 ? '任务关闭' : '未知' }}
          </a-tag>
        </template>
        <template slot="orderSlot" slot-scope="{record}">
          <div class="order-list">
            <p><span style="color:#729ED5;background:#e7f5f7">转账</span>{{ record.transferId }}</p>
            <p style="margin-bottom: 0;">
              <span style="color:#56cf56;background:#d8eadf">商户</span>
              <a-tooltip placement="bottom" style="font-weight: normal;"
                v-if="record.mchOrderNo.length > record.transferId.length">
                <template slot="title">
                  <span>{{ record.mchOrderNo }}</span>
                </template>
                {{ changeStr2ellipsis(record.mchOrderNo, record.transferId.length) }}
              </a-tooltip>
              <span style="font-weight: normal;" v-else>{{ record.mchOrderNo }}</span>
            </p>
            <p v-if="record.channelOrderNo" style="margin-bottom: 0;margin-top: 10px">
              <span style="color:#fff;background:#E09C4D">渠道</span>
              <a-tooltip placement="bottom" style="font-weight: normal;"
                v-if="record.channelOrderNo.length > record.transferId.length">
                <template slot="title">
                  <span>{{ record.channelOrderNo }}</span>
                </template>
                {{ changeStr2ellipsis(record.channelOrderNo, record.transferId.length) }}
              </a-tooltip>
              <span style="font-weight: normal;" v-else>{{ record.channelOrderNo }}</span>
            </p>
          </div>
        </template>
        <template slot="opSlot" slot-scope="{record}"> <!-- 操作列插槽 -->
          <JeepayTableColumns>
            <a-button type="link" v-if="$access('ENT_TRANSFER_ORDER_VIEW')"
              @click="detailFunc(record.transferId)">详情</a-button>
          </JeepayTableColumns>
        </template>
      </JeepayTable>
    </a-card>

    <!-- 订单详情 页面组件  -->
    <TransferOrderDetail ref="transferOrderDetail" />

  </page-header-wrapper>
</template>
<script>
import JeepayTable from '@/components/JeepayTable/JeepayTable'
import JeepayTextUp from '@/components/JeepayTextUp/JeepayTextUp' // 文字上移组件
import JeepayTableColumns from '@/components/JeepayTable/JeepayTableColumns'
import TransferOrderDetail from './TransferOrderDetail'
import { API_URL_TRANSFER_ORDER_LIST, req } from '@/api/manage'
import payOrderListData from "../../../utils/data/payOrderList"
import moment from 'moment'

// // eslint-disable-next-line no-unused-vars
// const tableColumns = [
//   { title: '转账金额', scopedSlots: { customRender: 'transferAmountSlot' }, width: 108 },
//   { title: '商户名称', dataIndex: 'mchName' },
//   { key: 'orderNo', title: '订单号', scopedSlots: { customRender: 'orderSlot' }, width: 260 },
//   // { title: '渠道订单号', dataIndex: 'channelOrderNo' },
//   { title: '收款账号', dataIndex: 'accountNo', width: 200 },
//   { title: '收款人姓名', dataIndex: 'accountName' },
//   { title: '转账备注', dataIndex: 'transferDesc' },
//   { title: '状态', scopedSlots: { customRender: 'stateSlot' }, width: 100 },
//   { title: '创建日期', dataIndex: 'createdAt' },
//   { title: '操作', width: '100px', fixed: 'right', align: 'center', scopedSlots: { customRender: 'opSlot' } }
// ]
const tableColumns = [
  { key: 'orderNo', title: '订单号', scopedSlots: { customRender: 'orderSlot' }, width: 210 },
  { key: 'billDate', title: '交易时间', scopedSlots: { customRender: 'billDateSlot' }, width: 200 },
  { key: 'refundAmount', title: '就诊人信息', width: 200, scopedSlots: { customRender: 'patientInfoSlot' } },
  { key: 'patientUni', title: '患者唯一码', width: 120, scopedSlots: { customRender: 'patientUniCodeSlot' } },
  { key: 'amount', title: '金额（元）', ellipsis: true, width: 108, scopedSlots: { customRender: 'amountSlot' } },
  { key: 'divisionState', title: '订单状态', scopedSlots: { customRender: 'OrderStateSlot' }, width: 100 },
  { key: 'optTypeDesc', title: '业务类型', ellipsis: true, width: 108, scopedSlots: { customRender: 'businessTypeSlot' } },
  { key: 'subCorpName', title: '所属医院', ellipsis: true, width: 108, scopedSlots: { customRender: 'targetSlot' } },
  { key: 'orderSourceDesc', title: '业务来源', ellipsis: true, width: 108, scopedSlots: { customRender: 'businessResoures' } },

  // { key: 'refundAmount', title: '退款金额', width: 108, scopedSlots: { customRender: 'refundAmountSlot' } },
  // { key: 'refundAmount', title: '退款金额', width: 108, scopedSlots: { customRender: 'refundAmountSlot' } },
  // // { key: 'mchFeeAmount', dataIndex: 'mchFeeAmount', title: '手续费', customRender: (text) => '￥' + (text / 100).toFixed(2), width: 100 },
  // { key: 'mchName', title: '所属医院', dataIndex: 'mchName', ellipsis: true, width: 100 },

  // // { key: 'payOrderId', title: '支付订单号', dataIndex: 'payOrderId' },
  // // { key: 'mchOrderNo', title: '商户订单号', dataIndex: 'mchOrderNo' },
  // // { key: 'wayName', title: '支付方式', dataIndex: 'wayName', width: 120 },
  // { key: 'state', title: '支付状态', scopedSlots: { customRender: 'stateSlot' }, width: 100 },
  // // { key: 'notifyState', title: '回调状态', scopedSlots: { customRender: 'notifySlot' }, width: 100 },
  // // { key: 'divisionState', title: '分账状态', scopedSlots: { customRender: 'divisionStateSlot' }, width: 100 },

  // { key: 'createdAt', dataIndex: 'createdAt', title: '创建日期', width: 120 },
  { key: 'op', title: '操作', width: 120, fixed: 'right', align: 'center', scopedSlots: { customRender: 'opSlot' } }
]

export default {
  name: 'IsvListPage',
  components: { JeepayTable, JeepayTableColumns, JeepayTextUp, TransferOrderDetail },
  data() {
    return {
      btnLoading: false,
      tableColumns: tableColumns,
      searchData: {},
      createdStart: '', // 选择开始时间
      createdEnd: '' // 选择结束时间
    }
  },
  methods: {
    queryFunc() {
      this.btnLoading = true
      this.$refs.infoTable.refTable(true)
    },
    // 请求table接口数据
    reqTableDataFunc: (params) => {
      req.list(API_URL_TRANSFER_ORDER_LIST, params)
      return new Promise((resolve) => {
        resolve({
          total: 2,
          records: payOrderListData.payOrderList.data.rows
        })
      })
    },
    searchFunc: function () { // 点击【查询】按钮点击事件
      this.$refs.infoTable.refTable(true)
    },
    detailFunc: function (recordId) {
      this.$refs.transferOrderDetail.show(recordId)
    },
    moment,
    onChange(date, dateString) {
      this.searchData.createdStart = dateString[0] // 开始时间
      this.searchData.createdEnd = dateString[1] // 结束时间
    },
    disabledDate(current) { // 今日之后日期不可选
      return current && current > moment().endOf('day')
    },
    changeStr2ellipsis(orderNo, baseLength) {
      const halfLengh = parseInt(baseLength / 2)
      return orderNo.substring(0, halfLengh - 1) + '...' + orderNo.substring(orderNo.length - halfLengh, orderNo.length)
    }
  }
}
</script>
<style lang="less" scoped>
.order-list {
  -webkit-text-size-adjust: none;
  font-size: 12px;
  display: flex;
  flex-direction: column;

  p {
    white-space: nowrap;

    span {
      display: inline-block;
      font-weight: 800;
      height: 16px;
      line-height: 16px;
      width: 35px;
      border-radius: 5px;
      text-align: center;
      margin-right: 2px;
    }
  }
}
</style>
