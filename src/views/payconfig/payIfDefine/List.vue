<template>
  <page-header-wrapper>
    <template>
      <a-card style="width: calc(100% - 24px);margin-bottom: 20px;">
        <a-alert message="" type="info">
          <template #description>
            <!-- <p style="display: flex; justify-content: space-between; margin: 0 0 4px;">
             万安科技已开放支付接口购买渠道，官方团队开发、源码提供、下载后直接使用。<a href="https://docs.jeequan.com/docs/jeepay/jeepay-1ejdnsuhveb16" target="_blank">接口下载、安装说明。</a>
              <a href="https://www.jeequan.com/ifstore/list.html" target="_blank">前往接口市场 ></a>
            </p> -->
          </template>
        </a-alert>
      </a-card>
    </template>
    <JeepayCard ref="infoCard" :reqCardListFunc="reqCardListFunc" :span="jeepayCard.span" :height="jeepayCard.height"
      :name="jeepayCard.name" :addAuthority="jeepayCard.addAuthority" @addJeepayCard="addOrEdit">
      <div slot="cardContentSlot" slot-scope="{record}">
        <div :style="{ 'height': jeepayCard.height + 'px' }" class="jeepay-card-content">
          <!-- 卡片自定义样式 -->
          <div class="jeepay-card-content-header"
            :style="{ backgroundColor: record.bgColor, height: jeepayCard.height / 2 + 'px' }">
            <img v-if="record.icon" :src="record.icon" :style="{ height: jeepayCard.height / 5 + 'px' }">
          </div>
          <div class="jeepay-card-content-body" :style="{ height: (jeepayCard.height / 2 - 50) + 'px' }">
            <div class="title">
              {{ record.ifName }}
            </div>
          </div>
          <!-- 卡片底部操作栏 -->
          <div class="jeepay-card-ops">
            <a-tooltip placement="top" title="编辑">
              <a-icon key="edit" type="edit" @click="addOrEdit(record.ifCode)" />
            </a-tooltip>
            <a-tooltip placement="top" title="删除">
              <a-icon key="delete" type="delete" @click="del(record.ifCode)" />
            </a-tooltip>
          </div>
        </div>
      </div>
    </JeepayCard>

    <!-- 新增页面组件  -->
    <PayIfDefineAddOrEdit ref="payIfDefineAddOrEdit" :callbackFunc="refCardList" />
  </page-header-wrapper>
</template>

<script>
import JeepayCard from '@/components/JeepayCard/JeepayCard'
import { API_URL_IFDEFINES_LIST, req } from '@/api/manage'
import PayIfDefineAddOrEdit from './AddOrEdit'
const proxyTableData = [

  {
    "ifCode": "alipay",
    "normalMchParams": "[{\"name\":\"sandbox\",\"desc\":\"环境配置\",\"type\":\"radio\",\"verify\":\"\",\"values\":\"1,0\",\"titles\":\"沙箱环境,生产环境\",\"verify\":\"required\"},{\"name\":\"appId\",\"desc\":\"应用App ID\",\"type\":\"text\",\"verify\":\"required\"},{\"name\":\"privateKey\", \"desc\":\"应用私钥\", \"type\": \"textarea\",\"verify\":\"required\",\"star\":\"1\"},{\"name\":\"alipayPublicKey\", \"desc\":\"支付宝公钥(不使用证书时必填)\", \"type\": \"textarea\",\"star\":\"1\"},{\"name\":\"signType\",\"desc\":\"接口签名方式(推荐使用RSA2)\",\"type\":\"radio\",\"verify\":\"\",\"values\":\"RSA,RSA2\",\"titles\":\"RSA,RSA2\",\"verify\":\"required\"},{\"name\":\"useCert\",\"desc\":\"公钥证书\",\"type\":\"radio\",\"verify\":\"\",\"values\":\"1,0\",\"titles\":\"使用证书（请使用RSA2私钥）,不使用证书\"},{\"name\":\"appPublicCert\",\"desc\":\"应用公钥证书（.crt格式）\",\"type\":\"file\",\"verify\":\"\"},{\"name\":\"alipayPublicCert\",\"desc\":\"支付宝公钥证书（.crt格式）\",\"type\":\"file\",\"verify\":\"\"},{\"name\":\"alipayRootCert\",\"desc\":\"支付宝根证书（.crt格式）\",\"type\":\"file\",\"verify\":\"\"}]",
    "isIsvMode": 1,
    "ifName": "支付宝官方",
    "icon": "http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/alipay.png",
    "remark": "支付宝官方通道",
    "configPageType": 2,
    "isMchMode": 1,
    "createdAt": "2024-10-13 12:12:43",
    "wayCodes": [
      {
        "wayCode": "ALI_JSAPI"
      },
      {
        "wayCode": "ALI_WAP"
      },
      {
        "wayCode": "ALI_BAR"
      },
      {
        "wayCode": "ALI_APP"
      },
      {
        "wayCode": "ALI_PC"
      },
      {
        "wayCode": "ALI_QR"
      },
      {
        "wayCode": "ALI_OC"
      }
    ],
    "isvsubMchParams": "[{\"name\":\"appAuthToken\", \"desc\":\"子商户app_auth_token\", \"type\": \"text\",\"readonly\":\"readonly\"},{\"name\":\"refreshToken\", \"desc\":\"子商户刷新token\", \"type\": \"hidden\",\"readonly\":\"readonly\"},{\"name\":\"expireTimestamp\", \"desc\":\"authToken有效期（13位时间戳）\", \"type\": \"hidden\",\"readonly\":\"readonly\"}]",
    "bgColor": "#1779FF",
    "isvParams": "[{\"name\":\"sandbox\",\"desc\":\"环境配置\",\"type\":\"radio\",\"verify\":\"\",\"values\":\"1,0\",\"titles\":\"沙箱环境,生产环境\",\"verify\":\"required\"},{\"name\":\"pid\",\"desc\":\"合作伙伴身份（PID）\",\"type\":\"text\",\"verify\":\"required\"},{\"name\":\"appId\",\"desc\":\"应用App ID\",\"type\":\"text\",\"verify\":\"required\"},{\"name\":\"privateKey\", \"desc\":\"应用私钥\", \"type\": \"textarea\",\"verify\":\"required\",\"star\":\"1\"},{\"name\":\"alipayPublicKey\", \"desc\":\"支付宝公钥(不使用证书时必填)\", \"type\": \"textarea\",\"star\":\"1\"},{\"name\":\"signType\",\"desc\":\"接口签名方式(推荐使用RSA2)\",\"type\":\"radio\",\"verify\":\"\",\"values\":\"RSA,RSA2\",\"titles\":\"RSA,RSA2\",\"verify\":\"required\"},{\"name\":\"useCert\",\"desc\":\"公钥证书\",\"type\":\"radio\",\"verify\":\"\",\"values\":\"1,0\",\"titles\":\"使用证书（请使用RSA2私钥）,不使用证书\"},{\"name\":\"appPublicCert\",\"desc\":\"应用公钥证书（.crt格式）\",\"type\":\"file\",\"verify\":\"\"},{\"name\":\"alipayPublicCert\",\"desc\":\"支付宝公钥证书（.crt格式）\",\"type\":\"file\",\"verify\":\"\"},{\"name\":\"alipayRootCert\",\"desc\":\"支付宝根证书（.crt格式）\",\"type\":\"file\",\"verify\":\"\"}]",
    "state": 1,
    "updatedAt": "2024-10-13 12:12:43"
  },
  {
    "ifCode": "pppay",
    "normalMchParams": "[{\"name\":\"sandbox\",\"desc\":\"环境配置\",\"type\":\"radio\",\"verify\":\"required\",\"values\":\"1,0\",\"titles\":\"沙箱环境, 生产环境\"},{\"name\":\"clientId\",\"desc\":\"Client ID（客户端ID）\",\"type\":\"text\",\"verify\":\"required\"},{\"name\":\"secret\",\"desc\":\"Secret（密钥）\",\"type\":\"text\",\"verify\":\"required\",\"star\":\"1\"},{\"name\":\"refundWebhook\",\"desc\":\"退款 Webhook id\",\"type\":\"text\",\"verify\":\"required\"},{\"name\":\"notifyWebhook\",\"desc\":\"支付 Webhook id\",\"type\":\"text\",\"verify\":\"required\"}]",
    "isIsvMode": 0,
    "ifName": "PayPal支付",
    "icon": "http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png",
    "remark": "PayPal官方通道",
    "configPageType": 1,
    "isMchMode": 1,
    "createdAt": "2024-10-13 12:12:43",
    "wayCodes": [
      {
        "wayCode": "PP_PC"
      }
    ],
    "bgColor": "#005ea6",
    "state": 1,
    "updatedAt": "2024-10-13 12:12:43"
  },
  {
    "ifCode": "wxpay",
    "normalMchParams": "[{\"name\":\"mchId\", \"desc\":\"微信支付商户号\", \"type\": \"text\",\"verify\":\"required\"},{\"name\":\"appId\",\"desc\":\"应用App ID\",\"type\":\"text\",\"verify\":\"required\"},{\"name\":\"appSecret\",\"desc\":\"应用AppSecret\",\"type\":\"text\",\"verify\":\"required\",\"star\":\"1\"},{\"name\":\"oauth2Url\", \"desc\":\"oauth2地址（置空将使用官方）\", \"type\": \"text\"},{\"name\":\"apiVersion\", \"desc\":\"微信支付API版本\", \"type\": \"radio\",\"values\":\"V2,V3\",\"titles\":\"V2,V3\",\"verify\":\"required\"},{\"name\":\"key\", \"desc\":\"APIv2密钥\", \"type\": \"textarea\",\"verify\":\"required\",\"star\":\"1\"},{\"name\":\"apiV3Key\", \"desc\":\"APIv3密钥（V3接口必填）\", \"type\": \"textarea\",\"verify\":\"\",\"star\":\"1\"},{\"name\":\"serialNo\", \"desc\":\"序列号（V3接口必填）\", \"type\": \"textarea\",\"verify\":\"\",\"star\":\"1\" },{\"name\":\"cert\", \"desc\":\"API证书(apiclient_cert.p12)\", \"type\": \"file\",\"verify\":\"\"},{\"name\":\"apiClientCert\", \"desc\":\"证书文件(apiclient_cert.pem) \", \"type\": \"file\",\"verify\":\"\"},{\"name\":\"apiClientKey\", \"desc\":\"私钥文件(apiclient_key.pem)\", \"type\": \"file\",\"verify\":\"\"}]",
    "isIsvMode": 1,
    "ifName": "微信支付官方",
    "icon": "http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/wxpay.png",
    "remark": "微信官方通道",
    "configPageType": 2,
    "isMchMode": 1,
    "createdAt": "2024-10-13 12:12:43",
    "wayCodes": [
      {
        "wayCode": "WX_APP"
      },
      {
        "wayCode": "WX_H5"
      },
      {
        "wayCode": "WX_NATIVE"
      },
      {
        "wayCode": "WX_JSAPI"
      },
      {
        "wayCode": "WX_BAR"
      },
      {
        "wayCode": "WX_LITE"
      }
    ],
    "isvsubMchParams": "[{\"name\":\"subMchId\",\"desc\":\"子商户ID\",\"type\":\"text\",\"verify\":\"required\"},{\"name\":\"subMchAppId\",\"desc\":\"子账户appID(线上支付必填)\",\"type\":\"text\",\"verify\":\"\"}]",
    "bgColor": "#04BE02",
    "isvParams": "[{\"name\":\"mchId\", \"desc\":\"微信支付商户号\", \"type\": \"text\",\"verify\":\"required\"},{\"name\":\"appId\",\"desc\":\"应用App ID\",\"type\":\"text\",\"verify\":\"required\"},{\"name\":\"appSecret\",\"desc\":\"应用AppSecret\",\"type\":\"text\",\"verify\":\"required\",\"star\":\"1\"},{\"name\":\"oauth2Url\", \"desc\":\"oauth2地址（置空将使用官方）\", \"type\": \"text\"},{\"name\":\"apiVersion\", \"desc\":\"微信支付API版本\", \"type\": \"radio\",\"values\":\"V2,V3\",\"titles\":\"V2,V3\",\"verify\":\"required\"},{\"name\":\"key\", \"desc\":\"APIv2密钥\", \"type\": \"textarea\",\"verify\":\"required\",\"star\":\"1\"},{\"name\":\"apiV3Key\", \"desc\":\"APIv3密钥（V3接口必填）\", \"type\": \"textarea\",\"verify\":\"\",\"star\":\"1\"},{\"name\":\"serialNo\", \"desc\":\"序列号（V3接口必填）\", \"type\": \"textarea\",\"verify\":\"\",\"star\":\"1\"},{\"name\":\"cert\", \"desc\":\"API证书(apiclient_cert.p12)\", \"type\": \"file\",\"verify\":\"\"},{\"name\":\"apiClientCert\", \"desc\":\"证书文件(apiclient_cert.pem) \", \"type\": \"file\",\"verify\":\"\"},{\"name\":\"apiClientKey\", \"desc\":\"私钥文件(apiclient_key.pem)\", \"type\": \"file\",\"verify\":\"\"}]",
    "state": 1,
    "updatedAt": "2024-10-13 12:12:43"
  },
]
export default {
  name: 'IfDefinePage',
  components: {
    JeepayCard,
    PayIfDefineAddOrEdit
  },
  data() {
    return {
      jeepayCard: {
        name: '支付接口',
        height: 200,
        span: { xxl: 8, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 },
        addAuthority: this.$access('ENT_PC_IF_DEFINE_ADD')
      }
    }
  },
  methods: {
    // 请求支付接口定义数据
    reqCardListFunc() {
      // return req.list(API_URL_IFDEFINES_LIST)
      return new Promise((resolve) => {
        resolve({
          total: 3,
          records: proxyTableData
        })
      })
    },
    // 刷新card列表
    refCardList() {
      this.$refs.infoCard.refCardList()
    },
    addOrEdit(ifCode) {
      this.$refs.payIfDefineAddOrEdit.show(ifCode)
    },
    del(ifCode) {
      const that = this
      this.$infoBox.confirmDanger('确认删除？', '', () => {
        req.delById(API_URL_IFDEFINES_LIST, ifCode).then(res => {
          that.$message.success('删除成功！')
          that.refCardList()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.jeepay-card-content {
  width: 100%;
  position: relative;
  background-color: @jee-card-back;
  border-radius: 6px;
  overflow: hidden;
}

.jeepay-card-ops {
  width: 100%;
  height: 50px;
  background-color: @jee-card-back;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid @jee-back;
  position: absolute;
  bottom: 0;
}

.jeepay-card-content-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.jeepay-card-content-body {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.title {
  font-size: 13px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 1px;
}
</style>
