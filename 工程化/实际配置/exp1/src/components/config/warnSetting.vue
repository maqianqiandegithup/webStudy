<template>
  <div class="container">
    <div class="public-head-left">
      <div class="public-head">
        <h4>预警指标设置</h4>
      </div>
    </div>
    <div class="public-box flex-bet flex-column">
      <div style="width:100%;" class="flex-bet">
        <el-input v-model="content" style="width: 400px;" placeholder="指标名称" @keydown.enter.native="getData()">
          <template slot="prepend"><i class="el-icon-search"></i></template>
          <template slot="append">
            <el-button @click="getData()">查询</el-button>
          </template>
        </el-input>
      </div>
      <div class="unit-box public-from">
        <el-table height="a" :data="tableData" :default-sort = "{prop: 'date', order: 'descending'}">
          <el-table-column prop="targetCode" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="targetName" label="指标名称" align="center"></el-table-column>
          <el-table-column prop="targetTypeName" label="指标类" align="center"></el-table-column>
          <el-table-column prop="mateAccountName" label="涉及科目" align="center"></el-table-column>
          <el-table-column prop="targetFormulaRemark" label="指标计算公式说明" min-width="160" align="center"></el-table-column>
          <el-table-column label="重点关注指标" min-width="100" align="center">
            <template slot-scope="scope">{{scope.row.isRiskIndex==1?"是":""}}</template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <p class="btn-text btn-primary" @click="getTargetById(dataInfo.id=scope.row.id,outerVisible=true)">查看</p>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="getData(page,$event)"
          @current-change="getData($event,pageSize)"
          :current-page="page"
          :page-sizes="pageArr"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div v-if="outerVisible" class="warnInfo-box container">
      <div class="public-head-left">
        <div class="public-head">
          <div @click="outerVisible=false">
            <i class="el-icon-back">报表模板设置</i>
          </div>
          <div>
            <el-button @click="updateTargetConfig">{{editStatus?"修改":"保存"}}</el-button>
            <el-button  type="primary" @click="outerVisible=false">返回</el-button>
          </div>
        </div>
      </div>
      <div class="public-box" v-loading="visibleLoading">
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" :span="8"><span>指标名称：</span><el-input v-model="dataInfo.targetName" :disabled="true" size="small"></el-input></el-col>
            <el-col class="mb-20" :span="8">
              <span>指标类：</span>
              <el-select v-model="dataInfo.targetTypeId" :disabled="true" placeholder="请选择">
                <el-option :value="dataInfo.targetTypeId" :label="dataInfo.targetTypeName"></el-option>
              </el-select>
            </el-col>
            <el-col class="mb-20" :span="8">
              <span>风险倾向：</span>
              <el-select v-model="dataInfo.tendencyId" :disabled="editStatus" placeholder="请选择">
                <el-option :value="0" label="较低值 优"></el-option>
                <el-option :value="1" label="较高值 优"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" :span="8"><span>涉及科目：</span><el-input v-model="dataInfo.mateAccountName" :disabled="true" size="small"></el-input></el-col>
            <el-col class="mb-20" :span="8"><span>序号：</span><el-input v-model="dataInfo.targetCode" :disabled="true" size="small"></el-input></el-col>
            <el-col class="mb-20" :span="8"><span>取值标记：</span><el-input v-model="dataInfo.riskIndexCode" :disabled="true" size="small"></el-input></el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" style="line-height: 30px;" :span="8"><span>重点关注指标：</span><el-checkbox :true-label="1" :false-label="0" v-model="dataInfo.isRiskIndex" :disabled="editStatus" size="medium"></el-checkbox></el-col>
            <el-col class="mb-20" style="line-height: 30px;" :span="8"><span>非报告项：</span><el-checkbox :true-label="1" :false-label="0" v-model="dataInfo.noReportedItem" :disabled="editStatus" size="medium"></el-checkbox></el-col>
          </el-row>
          <el-divider></el-divider>
          <h4 class="title">取值条件</h4>
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" :span="12"><span>指标计算公式：</span><el-input v-model="dataInfo.targetFormula" :disabled="editStatus" type="textarea" size="small"></el-input></el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" :span="12"><span>指标计算公式说明：</span><el-input v-model="dataInfo.targetFormulaRemark" :disabled="editStatus" type="textarea" size="small"></el-input></el-col>
          </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "standardData",
    data() {
        return {
          content: '',
          loading: false,
          tableData: [],
          page: 1, //当前页数
          pageSize: 10, //每页数据条数
          pageArr: [10, 30, 50],
          total: 0,
          outerVisible: false,
          editStatus: true,
          visibleLoading: false,
          dataInfo: {
            id: null,
            targetName: null,
            targetTypeId: null,
            targetTypeName: null,
            tendencyId: 0,
            mateAccountName: null,
            targetCode: null,
            riskIndexCode: null,
            isRiskIndex: 0,
            noReportedItem: 0,
            targetFormula: null,
            targetFormulaRemark: null,
            updateTime: "",
            updateUser: ""
          }
        }
    },
    watch:{
      outerVisible(val){
        !val&&(this.editStatus=true,this.dataInfo={
            id: null,
            targetName: null,
            targetTypeId: null,
            targetTypeName: null,
            tendencyId: 0,
            mateAccountName: null,
            targetCode: null,
            riskIndexCode: null,
            isRiskIndex: 0,
            noReportedItem: 0,
            targetFormula: null,
            targetFormulaRemark: null,
            updateTime: "",
            updateUser: ""
        })
      }
    },
    mounted(){
      this.getData();
    },
    methods: {
      getData(page, pageSize, mess){
        page && (this.page = page);
        pageSize && (this.pageSize = pageSize);        
        this.loading=true;
        this.$api.targetConfig({
          "page": this.page,
          "limit": this.pageSize,
          "content": this.content
        }).then(res=>{
          this.loading=false;
          if(res.code==200){
            this.total=res.paging.total;
            this.tableData=res.data;
            mess&&this.$nextTick(()=>{this.$message.success(mess)});
          }else{
            this.$message.error(res.description);
          }
        },err=>{this.loading=false})
      },
      getTargetById(){
        this.visibleLoading=true;
        this.$api.getTargetById(this.dataInfo.id).then(res=>{
          this.visibleLoading=false;
          if(res.code==200){
            this.dataInfo=res.data;
          }else{
            this.$message.error(res.description);
          }
        })
      },
      updateTargetConfig(){
        if(!this.editStatus) {
          this.$api.updateTargetConfig({
            "id": this.dataInfo.id,
            "isRiskIndex": this.dataInfo.isRiskIndex,
            "targetFormula": this.dataInfo.targetFormula,
            "targetFormulaRemark": this.dataInfo.targetFormulaRemark,
            "tendencyId": this.dataInfo.tendencyId
          }).then(res=>{
            if(res.code==200) {
              this.editStatus=true;
              this.outerVisible=false;
              this.getData(this.page,this.pageSize,"修改成功")
            }else {
              this.$message.error(res.description);
            }
          })
        }else this.editStatus=false;
      }
    }
};
</script>

<style lang="stylus" scoped>
.unit-box {
  width:100%;
  margin-top: 30px;
  flex:1;
  height: calc(100% - 30px - 30px);
}
.warnInfo-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
   .el-icon-back {
     font-size: 18px;
     cursor: pointer;
     font-weight: 600;
     &::before {
        padding: 5px;
        border: 1px solid #5f717d;
        margin-right: 10px;
      }
    }
    .public-box {
      padding: 34px 20px;
      position: relative;
      .el-col {
        display: flex;
        justify-content: flex-start;
        align-items: start;
        span {
          width: 130px;
          flex-shrink: 0;
          text-align: right;
          line-height: 30px;
        }
        .el-select {
          width: 100%;  
        }
      }
      .title {
        margin: 40px 0 24px;
        font-size: 18px;  
      }
    }
}
</style>