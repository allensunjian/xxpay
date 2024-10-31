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
            <jeepay-text-up :placeholder="'支付/退款列订单号'" :msg="searchData.unionOrderId"
              v-model="searchData.unionOrderId" />
            <!--            <jeepay-text-up :placeholder="'退款订单号'" :msg="searchData.refundOrderId" v-model="searchData.refundOrderId" />-->
            <!--            <jeepay-text-up :placeholder="'支付订单号'" :msg="searchData.payOrderId" v-model="searchData.payOrderId" />-->
            <!--            <jeepay-text-up :placeholder="'渠道支付订单号'" :msg="searchData.channelPayOrderNo" v-model="searchData.channelPayOrderNo" />-->
            <jeepay-text-up :placeholder="'商户号'" :msg="searchData.mchNo" v-model="searchData.mchNo" />
            <jeepay-text-up :placeholder="'服务商号'" :msg="searchData.isvNo" v-model="searchData.isvNo" />
            <jeepay-text-up :placeholder="'应用AppId'" :msg="searchData.appId" v-model="searchData.appId" />
            <a-form-item label="" class="table-head-layout">
              <a-select v-model="searchData.state" placeholder="退款状态" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">订单生成</a-select-option>
                <a-select-option value="1">退款中</a-select-option>
                <a-select-option value="2">退款成功</a-select-option>
                <a-select-option value="3">退款失败</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="" class="table-head-layout">
              <a-select v-model="searchData.mchType" placeholder="商户类型" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">普通商户</a-select-option>
                <a-select-option value="2">特约商户</a-select-option>
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
        :reqTableDataFunc="reqTableDataFunc" :tableColumns="tableColumns" :searchData="searchData"
        rowKey="refundOrderId" :tableRowCrossColor="true">
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
        <template slot="payAmountSlot" slot-scope="{record}"><b>￥{{ record.payAmount / 100 }}</b></template>
        <!-- 自定义插槽 -->
        <template slot="refundAmountSlot" slot-scope="{record}"><b>￥{{ record.refundAmount / 100 }}</b></template>
        <!-- 自定义插槽 -->
        <template slot="stateSlot" slot-scope="{record}">
          <a-tag :key="record.state"
            :color="record.state === 0 ? 'blue' : record.state === 1 ? 'orange' : record.state === 2 ? 'green' : 'volcano'">
            {{ record.state === 0 ? '订单生成' : record.state === 1 ? '退款中' : record.state === 2 ? '退款成功' : record.state ===
              3 ? '退款失败' : record.state === 4 ? '任务关闭' : '未知' }}
          </a-tag>
        </template>

        <template slot="payOrderSlot" slot-scope="{record}">
          <div class="order-list">
            <p><span style="color:#729ED5;background:#e7f5f7">支付</span>{{ record.payOrderId }}</p>
            <p v-if="record.channelPayOrderNo" style="margin-bottom: 0;">
              <span style="color:#fff;background:#E09C4D">渠道</span>
              <a-tooltip placement="bottom" style="font-weight: normal;"
                v-if="record.channelPayOrderNo.length > record.payOrderId.length">
                <template slot="title">
                  <span>{{ record.channelPayOrderNo }}</span>
                </template>
                {{ changeStr2ellipsis(record.channelPayOrderNo, record.payOrderId.length) }}
              </a-tooltip>
              <span style="font-weight: normal;" v-else>{{ record.channelPayOrderNo }}</span>
            </p>
          </div>
        </template>

        <template slot="refundOrderSlot" slot-scope="{record}">
          <div class="order-list">
            <p><span style="color:#729ED5;background:#e7f5f7">退款</span>{{ record.refundOrderId }}</p>
            <p style="margin-bottom: 0;">
              <span style="color:#56cf56;background:#d8eadf">商户</span>
              <a-tooltip placement="bottom" style="font-weight: normal;"
                v-if="record.mchRefundNo.length > record.payOrderId.length">
                <template slot="title">
                  <span>{{ record.mchRefundNo }}</span>
                </template>
                {{ changeStr2ellipsis(record.mchRefundNo, record.refundOrderId.length) }}
              </a-tooltip>
              <span style="font-weight: normal;" v-else>{{ record.mchRefundNo }}</span>
            </p>
          </div>
        </template>
        <template slot="opSlot" slot-scope="{record}"> <!-- 操作列插槽 -->
          <JeepayTableColumns>
            <a-button type="link" v-if="$access('ENT_REFUND_ORDER_VIEW')"
              @click="detailFunc(record.refundOrderId)">详情</a-button>
          </JeepayTableColumns>
        </template>
      </JeepayTable>
    </a-card>
    <!-- 日志详情抽屉 -->
    <template>
      <a-drawer width="50%" placement="right" :closable="true" :visible="visible"
        :title="visible === true ? '退款订单详情' : ''" @close="onClose">
        <a-row justify="space-between" type="flex">
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="所属系统">
                {{ detailData.mchType === 1 ? '普通商户' : detailData.mchType === 2 ? '特约商户' : '未知' }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="服务商号">
                {{ detailData.isvNo }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="退款订单号">
                <a-tag color="purple">
                  {{ detailData.refundOrderId }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="商户号">
                {{ detailData.mchNo }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="支付订单号">
                {{ detailData.payOrderId }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="商户退款单号">
                {{ detailData.mchRefundNo }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="渠道支付订单号">
                {{ detailData.channelPayOrderNo }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="应用APPID">
                {{ detailData.appId }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="支付金额">
                <a-tag color="green">
                  {{ detailData.payAmount / 100 }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="退款金额">
                <a-tag color="green">
                  {{ detailData.refundAmount / 100 }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="订单状态">
                <a-tag
                  :color="detailData.state === 0 ? 'blue' : detailData.state === 1 ? 'orange' : detailData.state === 2 ? 'green' : 'volcano'">
                  {{ detailData.state === 0 ? '订单生成' : detailData.state === 1 ? '退款中' : detailData.state ===
                    2 ? '退款成功' : detailData.state === 3 ? '退款失败' : detailData.state === 4 ? '任务关闭' : '未知' }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="退款成功时间">
                {{ detailData.successTime }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="创建时间">
                {{ detailData.createdAt }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="更新时间">
                {{ detailData.updatedAt }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-divider />
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="接口代码">
                {{ detailData.ifCode }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="货币代码">
                {{ detailData.currency }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="方式代码">
                {{ detailData.wayCode }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="客户端IP">
                {{ detailData.clientIp }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="24">
            <a-descriptions>
              <a-descriptions-item label="异步通知地址">
                {{ detailData.notifyUrl }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
        <a-divider />
        <a-col :sm="12">
          <a-descriptions>
            <a-descriptions-item label="渠道订单号">
              {{ detailData.channelOrderNo }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col :sm="12">
          <a-descriptions>
            <a-descriptions-item label="渠道错误码">
              {{ detailData.errCode }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col :sm="12">
          <a-descriptions>
            <a-descriptions-item label="渠道错误描述">
              {{ detailData.errMsg }}
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item label="渠道额外参数">
            <a-input type="textarea" disabled="disabled" style="height: 100px;color: black"
              v-model="detailData.channelExtra" />
          </a-form-model-item>
        </a-col>
        <a-divider />
        <a-col :sm="24">
          <a-form-model-item label="扩展参数">
            <a-input type="textarea" disabled="disabled" style="height: 100px;color: black"
              v-model="detailData.extParam" />
          </a-form-model-item>
        </a-col>
        <a-col :sm="24">
          <a-form-model-item label="备注">
            <a-input type="textarea" disabled="disabled" style="height: 100px;color: black"
              v-model="detailData.remark" />
          </a-form-model-item>
        </a-col>
      </a-drawer>
    </template>
  </page-header-wrapper>
</template>
<script>
import JeepayTable from '@/components/JeepayTable/JeepayTable'
import JeepayTextUp from '@/components/JeepayTextUp/JeepayTextUp' // 文字上移组件
import JeepayTableColumns from '@/components/JeepayTable/JeepayTableColumns'
import { API_URL_REFUND_ORDER_LIST, req } from '@/api/manage'
import moment from 'moment'
import payOrderListData from "../../../utils/data/payOrderList"
// // eslint-disable-next-line no-unused-vars
const tableColumns = [
  { key: 'refund', title: '支付订单号', scopedSlots: { customRender: 'payOrderSlot' }, width: 220 },
  { key: 'pay', title: '退款订单号', scopedSlots: { customRender: 'refundOrderSlot' }, width: 220 },
  { key: 'payAmount', title: '支付金额', ellipsis: true, scopedSlots: { customRender: 'payAmountSlot' }, width: 100 },
  { key: 'refundAmount', title: '退款金额', ellipsis: true, scopedSlots: { customRender: 'refundAmountSlot' }, width: 100 },
  // { key: 'payOrderId', title: '支付订单号', dataIndex: 'payOrderId' },
  // { key: 'mchRefundNo', title: '商户退款单号', dataIndex: 'mchRefundNo' },
  { key: 'state', title: '状态', scopedSlots: { customRender: 'stateSlot' }, width: 100 },
  { key: 'createdAt', dataIndex: 'createdAt', title: '创建日期', width: 120 },
  { key: 'op', title: '操作', width: 100, fixed: 'right', scopedSlots: { customRender: 'opSlot' } }
]
// const tableColumns = [
//   { key: 'orderNo', title: '订单号', scopedSlots: { customRender: 'orderSlot' }, width: 210 },
//   { key: 'billDate', dataIndex: 'billDate', title: '交易时间', width: 120 },
//   { key: 'refundAmount', title: '就诊人信息', width: 200, scopedSlots: { customRender: 'patientInfoSlot' } },
//   { key: 'patientUni', title: '患者唯一码', width: 108, scopedSlots: { customRender: 'patientUniCodeSlot' } },
//   { key: 'amount', title: '金额（元）', ellipsis: true, width: 108, scopedSlots: { customRender: 'amountSlot' } },
//   { key: 'divisionState', title: '订单状态', scopedSlots: { customRender: 'OrderStateSlot' }, width: 100 },
//   { key: 'amount', title: '业务类型', ellipsis: true, width: 108, scopedSlots: { customRender: 'businessTypeSlot' } },
//   { key: 'amount', title: '所属医院', ellipsis: true, width: 108, scopedSlots: { customRender: 'targetSlot' } },
//   { key: 'amount', title: '业务来源', ellipsis: true, width: 108, scopedSlots: { customRender: 'businessResoures' } },


//   // { key: 'refundAmount', title: '退款金额', width: 108, scopedSlots: { customRender: 'refundAmountSlot' } },
//   // { key: 'refundAmount', title: '退款金额', width: 108, scopedSlots: { customRender: 'refundAmountSlot' } },
//   // // { key: 'mchFeeAmount', dataIndex: 'mchFeeAmount', title: '手续费', customRender: (text) => '￥' + (text / 100).toFixed(2), width: 100 },
//   // { key: 'mchName', title: '所属医院', dataIndex: 'mchName', ellipsis: true, width: 100 },

//   // // { key: 'payOrderId', title: '支付订单号', dataIndex: 'payOrderId' },
//   // // { key: 'mchOrderNo', title: '商户订单号', dataIndex: 'mchOrderNo' },
//   // // { key: 'wayName', title: '支付方式', dataIndex: 'wayName', width: 120 },
//   // { key: 'state', title: '支付状态', scopedSlots: { customRender: 'stateSlot' }, width: 100 },
//   // // { key: 'notifyState', title: '回调状态', scopedSlots: { customRender: 'notifySlot' }, width: 100 },
//   // // { key: 'divisionState', title: '分账状态', scopedSlots: { customRender: 'divisionStateSlot' }, width: 100 },

//   // { key: 'createdAt', dataIndex: 'createdAt', title: '创建日期', width: 120 },
//   { key: 'op', title: '操作', width: 120, fixed: 'right', align: 'center', scopedSlots: { customRender: 'opSlot' } }
// ]

export default {
  name: 'IsvListPage',
  components: { JeepayTable, JeepayTableColumns, JeepayTextUp },
  data() {
    return {
      btnLoading: false,
      tableColumns: tableColumns,
      searchData: {},
      selectedIds: [], // 选中的数据
      createdStart: '', // 选择开始时间
      createdEnd: '', // 选择结束时间
      visible: false,
      detailData: {}
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    queryFunc() {
      this.btnLoading = true
      this.$refs.infoTable.refTable(true)
    },
    // 请求table接口数据
    reqTableDataFunc: (params) => {
      return req.list(API_URL_REFUND_ORDER_LIST, params)
      // return new Promise((resolve) => {
      //   resolve({
      //     total: 2,
      //     records: payOrderListData.payOrderList.data.rows
      //   })
      // })
    },
    searchFunc: function () { // 点击【查询】按钮点击事件
      this.$refs.infoTable.refTable(true)
    },
    detailFunc: function (recordId) {
      const that = this
      req.getById(API_URL_REFUND_ORDER_LIST, recordId).then(res => {
        that.detailData = res
      })
      this.visible = true
    },
    moment,
    onChange(date, dateString) {
      this.searchData.createdStart = dateString[0] // 开始时间
      this.searchData.createdEnd = dateString[1] // 结束时间
    },
    disabledDate(current) { // 今日之后日期不可选
      return current && current > moment().endOf('day')
    },
    onClose() {
      this.visible = false
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
