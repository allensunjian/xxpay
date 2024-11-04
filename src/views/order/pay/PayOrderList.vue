<!--
 * Copyright (c) 2023 by Allen_sun email: Allen_sun_js@hotmail.com, All Rights Reserved.
-->
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
            <jeepay-text-up :placeholder="'支付/商户/渠道订单号'" :msg="searchData.unionOrderId"
              v-model="searchData.unionOrderId" />
            <!--            <jeepay-text-up :placeholder="'支付订单号'" :msg="searchData.payOrderId" v-model="searchData.payOrderId" />-->
            <!--            <jeepay-text-up :placeholder="'商户订单号'" :msg="searchData.mchOrderNo" v-model="searchData.mchOrderNo" />-->
            <jeepay-text-up v-if="$store.state.user.sysType === 'MGR'" :placeholder="'商户号'" :msg="searchData.mchNo" v-model="searchData.mchNo" />
            <jeepay-text-up :placeholder="'应用AppId'" :msg="searchData.appId" v-model="searchData.appId" />
            <a-form-item v-if="$access('ENT_PAY_ORDER_SEARCH_PAY_WAY')" label="" class="table-head-layout">
              <a-select v-model="searchData.wayCode" placeholder="支付方式" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option :key="item.wayCode" v-for="item in payWayList" :value="item.wayCode">
                  {{ item.wayName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="" class="table-head-layout">
              <a-select v-model="searchData.state" placeholder="支付状态" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">订单生成</a-select-option>
                <a-select-option value="1">支付中</a-select-option>
                <a-select-option value="2">支付成功</a-select-option>
                <a-select-option value="3">支付失败</a-select-option>
                <a-select-option value="4">已撤销</a-select-option>
                <a-select-option value="5">已退款</a-select-option>
                <a-select-option value="6">订单关闭</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="" class="table-head-layout">
              <a-select v-model="searchData.optType" placeholder="业务类型" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">未发送</a-select-option>
                <a-select-option value="1">已发送</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="" class="table-head-layout">
              <a-select v-model="searchData.orderSource" placeholder="业务来源" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">未发送</a-select-option>
                <a-select-option value="1">已发送</a-select-option>
              </a-select>
            </a-form-item>
            <br/>
            <jeepay-text-up :placeholder="'操作员'" :msg="searchData.operId" v-model="searchData.operId" />
            <jeepay-text-up :placeholder="'姓名'" :msg="searchData.patientName" v-model="searchData.patientName" />
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="queryFunc" :loading="btnLoading">搜索</a-button>
              <a-button style="margin-left: 8px" icon="reload" @click="() => this.searchData = {}">重置</a-button>
            </span>
          </div>
        </a-form>
      </div>

      <!-- 列表渲染 -->
      <JeepayTable @btnLoadClose="btnLoading = false" ref="infoTable" :initData="true"
        :reqTableDataFunc="reqTableDataFunc" :tableColumns="tableColumns" :searchData="searchData" rowKey="payOrderId"
        :tableRowCrossColor="true">

        <template slot="amountSlot" slot-scope="{record}">
          <span style="font-weight: 800;">+¥{{ record.amount / 100 }}</span>
        </template> <!-- 自定义插槽 -->
        <template slot="refundAmountSlot" slot-scope="{record}">￥{{ record.refundAmount / 100 }}</template>
        <template slot="patientInfoSlot" slot-scope="{record}">
            <span > 姓名：</span>{{ record.patientName || '-' }}
            <br/>
            <span > 证件：</span>{{ record.idNo || '-' }}
        </template>
        <template slot="patientUniCodeSlot" slot-scope="{record}">
            <span > 诊号: </span>{{ record?.patientId }}
            <br/>
            <span > 卡号: </span>{{ record.cardNo }}
        </template>
        <template slot="optTypeSlot" slot-scope="{record}">{{ record.optTypeDesc }}</template>
        <template slot="targetSlot" slot-scope="{record}">{{ record.corpName }}</template>
        <template slot="orderSourceResoures" slot-scope="{record}">{{ record.orderSourceDesc }}</template>
        <!-- 自定义插槽 -->
        <template slot="stateSlot" slot-scope="{record}">
          <a-tag :key="record.state"
            :color="record.state === 0 ? 'blue' : record.state === 1 ? 'orange' : record.state === 2 ? 'green' : record.state === 6 ? '' : 'volcano'">
            {{ record.state === 0 ? '订单生成' : record.state === 1 ? '支付中' : record.state === 2 ? '支付成功' : record.state ===
              3 ? '支付失败' : record.state === 4 ? '已撤销' : record.state === 5 ? '已退款' : record.state === 6 ? '订单关闭' : '未知' }}
          </a-tag>
        </template>
        <template slot="divisionStateSlot" slot-scope="{record}">
          <span v-if="record.divisionState == 0"> - </span>
          <a-tag color="orange" v-else-if="record.divisionState == 1">待分账</a-tag>
          <a-tag color="red" v-else-if="record.divisionState == 2">分账处理中</a-tag>
          <a-tag color="green" v-else-if="record.divisionState == 3">任务已结束</a-tag>
          <span v-else>未知</span>
        </template>

        <template slot="notifySlot" slot-scope="{record}">
          <a-badge :status="record.notifyState === 1 ? 'processing' : 'error'"
            :text="record.notifyState === 1 ? '已发送' : '未发送'" />
        </template>
        <template slot="orderSlot" slot-scope="{record}">
          <div class="order-list" style="color:#1890ff">
            <p>
              <a-tag color="#108ee9" style="width: 40px">
                业务
              </a-tag>
              <span style="font-weight:normal;color:#bbb">&nbsp;{{ record.orderNo }}</span>
            </p>
            <p>
              <a-tag color="#779649" style="width: 40px">
                平台
              </a-tag>
              <span style="font-weight:normal;color:#bbb">&nbsp;{{ record.outTradeNo }}</span>
            </p>
            <p>
              <a-tag color="rgb(224, 156, 77)" style="width: 40px">
                三方
              </a-tag>
              <span style="color:#bbb;font-weight:normal">&nbsp;{{ record.outPayNo }}</span>
            </p>
          </div>
        </template>
        <template slot="billDateSlot" slot-scope="{record}">
          <p>
            <a-tag color="#108ee9" style="width: 40px">
              下单
            </a-tag>
            <span style="color:#333;font-weight:normal">&nbsp;{{ record.transTime }}</span>
          </p>
          <p>
            <a-tag color="green" style="width: 40px">
              支付
            </a-tag>
            <span style="color:#333;font-weight:normal">&nbsp;{{ record.paymentTime }}</span>
          </p>
        </template>
        <template slot="opSlot" slot-scope="{record}"> <!-- 操作列插槽 -->
          <JeepayTableColumns>
            <a-button type="link" v-if="$access('ENT_PAY_ORDER_VIEW')"
              @click="detailFunc(record, record.payOrderId)">详情</a-button>
            <a-button type="link" v-if="$access('ENT_PAY_ORDER_REFUND')" style="color: red"
              v-show="(record.state === 2 && record.refundState !== 2)"
              @click="openFunc(record, record.payOrderId)">退款</a-button>
          </JeepayTableColumns>
        </template>
      </JeepayTable>
    </a-card>
    <!-- 退款弹出框 -->
    <refund-modal ref="refundModalInfo" :callbackFunc="searchFunc"></refund-modal>
    <!-- 日志详情抽屉 -->
    <template>
      <a-drawer width="50%" placement="right" :closable="true" :visible="visible"
        :title="visible === true ? '订单详情' : ''" @close="onClose">
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
              <a-descriptions-item label="支付订单号">
                <a-tag color="purple">
                  {{ detailData.payOrderId }}
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
              <a-descriptions-item label="商户订单号">
                {{ detailData.mchOrderNo }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="商户名称">
                {{ detailData.mchName }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="支付金额">
                <a-tag color="green">
                  {{ detailData.amount / 100 }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <!-- <a-col :sm="12">
            <a-descriptions><a-descriptions-item label="手续费"><a-tag color="pink">{{ detailData.mchFeeAmount / 100
                  }}</a-tag></a-descriptions-item></a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions><a-descriptions-item label="商家费率">{{ (detailData.mchFeeRate * 100).toFixed(2)
                }}%</a-descriptions-item></a-descriptions>
          </a-col> -->
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="订单状态">
                <a-tag
                  :color="detailData.state === 0 ? 'blue' : detailData.state === 1 ? 'orange' : detailData.state === 2 ? 'green' : detailData.state === 6 ? '' : 'volcano'">
                  {{ detailData.state === 0 ? '订单生成' : detailData.state === 1 ? '支付中' : detailData.state ===
                    2 ? '支付成功' : detailData.state === 3 ? '支付失败' : detailData.state === 4 ? '已撤销' : detailData.state ===
                      5 ? '已退款' : detailData.state === 6 ? '订单关闭' : '未知' }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="回调状态">
                <a-tag :color="detailData.notifyState === 1 ? 'green' : 'volcano'">
                  {{ detailData.notifyState === 0 ? '未发送' : detailData.notifyState === 1 ? '已发送' : '未知' }}
                </a-tag>
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
              <a-descriptions-item label="支付错误码">
                {{ detailData.errCode }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="支付错误描述">
                {{ detailData.errMsg }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="订单失效时间">
                {{ detailData.expiredTime }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="支付成功时间">
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
              <a-descriptions-item label="商品标题">
                {{ detailData.subject }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="商品描述">
                {{ detailData.body }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
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
              <a-descriptions-item label="支付方式">
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
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="用户标识">
                {{ detailData.channelUser }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="渠道订单号">
                {{ detailData.channelOrderNo }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="异步通知地址">
                {{ detailData.notifyUrl }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="页面跳转地址">
                {{ detailData.returnUrl }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="退款状态">
                <a-tag
                  :color="detailData.refundState === 0 ? 'blue' : detailData.refundState === 1 ? 'orange' : detailData.refundState === 2 ? 'green' : 'volcano'">
                  {{ detailData.refundState === 0 ? '未发起' : detailData.refundState === 1 ? '部分退款' :
                    detailData.refundState ===
                      2 ? '全额退款' : '未知' }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="退款次数">
                {{ detailData.refundTimes }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="退款总额">
                <a-tag color="cyan" v-if="detailData.refundAmount">
                  {{ detailData.refundAmount / 100 }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-divider />
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="患者姓名">
                {{ detailData.row?.patientName }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="证件号">
                <span v-if="detailData.row?.idNo">{{ detailData.row.idNo }}</span>
                <span v-else>{{ detailData.row?.guarderIdNo }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="患者唯一码">
                  (诊号) {{ detailData.row?.patientId }} 
                  <br/>
                  (卡号) {{ detailData.row?.cardNo }} 
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions>
              <a-descriptions-item label="付款账户">
                {{ detailData.row?.buyerAccount }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
          <!-- <a-col :sm="12">
            <a-descriptions><a-descriptions-item label="订单分账模式">
                <span v-if="detailData.divisionMode == 0">该笔订单不允许分账</span>
                <span v-else-if="detailData.divisionMode == 1">支付成功按配置自动完成分账</span>
                <span v-else-if="detailData.divisionMode == 2">商户手动分账(解冻商户金额)</span>
                <span v-else>未知</span>
              </a-descriptions-item></a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions><a-descriptions-item label="分账状态">
                <a-tag color="blue" v-if="detailData.divisionState == 0">未发生分账</a-tag>
                <a-tag color="orange" v-else-if="detailData.divisionState == 1">待分账</a-tag>
                <a-tag color="red" v-else-if="detailData.divisionState == 2">分账处理中</a-tag>
                <a-tag color="green" v-else-if="detailData.divisionState == 3">任务已结束</a-tag>
                <a-tag color="#f50" v-else>未知</a-tag>
              </a-descriptions-item></a-descriptions>
          </a-col>
          <a-col :sm="12">
            <a-descriptions><a-descriptions-item label="最新分账发起时间">{{ detailData.divisionLastTime
                }}</a-descriptions-item></a-descriptions>
          </a-col> -->
        </a-row>
        <!-- <a-divider /> -->
        <a-row justify="start" type="flex">
          <a-col :sm="24">
            <a-form-model-item label="扩展参数">
              <a-input type="textarea" disabled="disabled" style="height: 100px;color: black"
                v-model="detailData.extParam" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-drawer>
      <Proceed :show="ProceedControllerState.show" @close="ProceedControllerGetHide"></Proceed>
    </template>
  </page-header-wrapper>

</template>

<script>
import RefundModal from './RefundModal' // 退款弹出框
import JeepayTextUp from '@/components/JeepayTextUp/JeepayTextUp' // 文字上移组件
import JeepayTable from '@/components/JeepayTable/JeepayTable'
import JeepayTableColumns from '@/components/JeepayTable/JeepayTableColumns'
import { API_URL_PAY_ORDER_INFO, API_URL_PAY_ORDER_LIST, API_URL_PAYWAYS_LIST, req } from '@/api/manage'
import moment from 'moment'
import Proceed from "@/components/GloabalProceed/proceed"
// eslint-disable-next-line no-unused-vars
const tableColumns = [
  { key: 'orderNo', title: '订单号', scopedSlots: { customRender: 'orderSlot' }, width: 240 },
  { key: 'billDate', title: '交易时间', scopedSlots: { customRender: 'billDateSlot' }, width: 200 },
  { key: 'patientInfo', title: '就诊人信息', width: 200, scopedSlots: { customRender: 'patientInfoSlot' } },
  { key: 'patientUni', title: '患者唯一码', width: 140, scopedSlots: { customRender: 'patientUniCodeSlot' } },
  { key: 'amount', title: '金额（元）', ellipsis: true, width: 108, scopedSlots: { customRender: 'amountSlot' } },
  { key: 'divisionState', title: '订单状态', scopedSlots: { customRender: 'stateSlot' }, width: 100 },
  { key: 'optTypeDesc', title: '业务类型', ellipsis: true, width: 108, scopedSlots: { customRender: 'optTypeSlot' } },
  { key: 'subCorpName', title: '所属医院', ellipsis: true, width: 108, scopedSlots: { customRender: 'targetSlot' } },
  { key: 'orderSourceDesc', title: '业务来源', ellipsis: true, width: 108, scopedSlots: { customRender: 'orderSourceResoures' } },


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

const ProceedController = {
  name: 'ProceedController',
  state: {
    show: false
  },
  data: {

  },
  methods: {
    ProceedControllerGetShow() {
      ProceedController.state.show = true
    },
    ProceedControllerGetHide() {
      ProceedController.state.show = false
    }
  }

}

export default {
  name: 'IsvListPage',
  components: { JeepayTable, JeepayTableColumns, JeepayTextUp, RefundModal, Proceed },
  data() {
    return {
      ProceedControllerState: ProceedController.state,
      ProceedControllerData: ProceedController.data,
      btnLoading: false,
      tableColumns: tableColumns,
      searchData: {},
      createdStart: '', // 选择开始时间
      createdEnd: '', // 选择结束时间
      visible: false,
      detailData: {},
      payWayList: []
    }
  },
  computed: {
  },
  mounted() {
    if (this.$access('ENT_PAY_ORDER_SEARCH_PAY_WAY')) {
      this.initPayWay()
    }
  },
  methods: {
    ...ProceedController.methods,
    openProceed(record) {
      console.log(record)
    },
    queryFunc() {
      this.btnLoading = true
      this.$refs.infoTable.refTable(true)
    },
    // 请求table接口数据
    reqTableDataFunc: (params) => {
      return req.list(API_URL_PAY_ORDER_LIST, params)
      // return new Promise((resolve) => {
      //   resolve({
      //     total: 2,
      //     records: payOrderListData.payOrderList.data.rows
      //   })
      // })
    },
    searchFunc: function () { // 点击【查询】按钮点击事件
      this.$refs.infoTable.refTable(false)
    },

    // 打开退款弹出框
    openFunc(record, recordId) {
      if (record.refundState === 2) {
        return this.$infoBox.modalError('订单无可退款金额', '')
      }
      this.$refs.refundModalInfo.show(recordId)
    },
    detailFunc(record, recordId) {
      const that = this
      req.getById(API_URL_PAY_ORDER_INFO, recordId).then(res => {
        that.detailData = res
        that.detailData.row = record
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
    initPayWay: function () {
      const that = this
      req.list(API_URL_PAYWAYS_LIST, { 'pageSize': -1 }).then(res => { // 支付方式下拉列表
        that.payWayList = res.records
      })
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
