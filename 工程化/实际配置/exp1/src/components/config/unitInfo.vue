<template>
  <div class="container">
    <div class="public-head-left">
      <div class="public-head">
        <h4>单位档案</h4>
        <div>          
          <el-dropdown>
            <el-button>导入</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="downLoadFiles">下载模板</el-dropdown-item>
              <el-upload
                action="/sasac/company/importByExcel"
                :headers="{ 'Token': exportToken }"
                accept=".xls, .xlsx"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-error="handleError"><el-dropdown-item>导入数据</el-dropdown-item></el-upload>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button @click="updateCompany">数据同步</el-button> -->
        </div>
      </div>
    </div>
    <div class="public-box flex-bet flex-column">
      <div style="width:100%;" class="flex-bet">
        <el-input v-model="content" style="width: 400px;" placeholder="企业代码/企业名称" @keydown.enter.native="getData()">
          <template slot="prepend"><i class="el-icon-search"></i></template>
          <template slot="append">
            <el-button @click="getData()">查询</el-button>
          </template>
        </el-input>
        <!-- <el-button @click="outerVisible=true"><i class="el-icon-plus"></i>添加风险预警单位</el-button> -->
      </div>
      <div class="unit-box public-from">
        <el-table v-loading="loading" height="a" :data="tableData" :default-sort = "{prop: 'date', order: 'descending'}">
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="企业名称" align="center"></el-table-column>
          <el-table-column prop="companyCode" label="企业代码" align="center"></el-table-column>
          <el-table-column prop="economyType" label="国民经济行业分类" align="center"></el-table-column>
          <el-table-column prop="scaleName" label="经营规模" align="center"></el-table-column>
          <el-table-column prop="reportType" label="报表类型" align="center"></el-table-column>
          <el-table-column prop="companyNature" label="单位性质" align="center"></el-table-column>
          <el-table-column prop="executeNorm" label="执行会计准则" align="center"></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <p class="btn-text btn-primary" @click="getCompanyById(scope.row.id,outerVisible=true)">查看</p>
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
      <el-dialog title="查看单位档案" :visible.sync="outerVisible" @closed="dataInfo=null">
        <div class="dialog-content" v-loading="visibleLoading">
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" :span="12"><span>企业名称：</span><el-input :value="dataInfo&&dataInfo.name" :disabled="true" size="small"></el-input></el-col>
            <el-col class="mb-20" :span="12"><span>企业代码：</span><el-input :value="dataInfo&&dataInfo.companyCode" :disabled="true" size="small"></el-input></el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" :span="12"><span>国民经济行业分类：</span><el-input :value="dataInfo&&dataInfo.economyType" :disabled="true" size="small"></el-input></el-col>
            <el-col class="mb-20" :span="12"><span>经营规模：</span><el-input :value="dataInfo&&dataInfo.scaleName" :disabled="true" size="small"></el-input></el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" :span="12"><span>报表类型：</span><el-input :value="dataInfo&&dataInfo.reportType" :disabled="true" size="small"></el-input></el-col>
            <el-col class="mb-20" :span="12"><span>单位性质：</span><el-input :value="dataInfo&&dataInfo.companyNature" :disabled="true" size="small"></el-input></el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col class="mb-20" :span="12"><span>执行会计准则：</span><el-input :value="dataInfo&&dataInfo.executeNorm" :disabled="true" size="small"></el-input></el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible=false">取 消</el-button>
          <el-button type="primary" @click="outerVisible=false">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
    name: "index",
    data() {
        return {
          content: '',
          loading: false,
          visibleLoading: false,
          tableData: [],
          dataInfo: null,
          page: 1, //当前页数
          pageSize: 10, //每页数据条数
          pageArr: [10, 30, 50],
          total: 0,
          outerVisible: false,
          exportToken: null //上传文件Token
        }
    },
    mounted(){
      this.getData();
      this.exportToken=sessionStorage.getItem("Token");
    },
    methods: {
      getData(page, pageSize, mess){
        page && (this.page = page);
        pageSize && (this.pageSize = pageSize);
        this.loading=true;
        this.$api.getCompany({
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
      getCompanyById(id){
        this.visibleLoading=true;
        this.$api.getCompanyById(id).then(res=>{
          this.visibleLoading=false;
          if(res.code==200){
            this.dataInfo=res.data;
          }else{
            this.$message.error(res.description);
          }
        })
      },
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 50MB');
          return false;
        }
        this.loading=true;
      },
      handleSuccess(res, file, fileList) {
        if(res.code==200){
          this.getData(this.page, this.pageSize, "导入成功")
        }else{
          this.loading=false;
          this.$message.error(res.description);
        }
      },
      handleError(res, file, fileList) {
        this.loading=false;
        this.$message.error("导入失败，请重新上传文件");
      },
      downLoadFiles(){
        if (!document.getElementById("iframe")) {
          var iframe = document.createElement("iframe");
          document.body.appendChild(iframe);
          iframe.style.display = "none";
          iframe.id = "iframe";
        }
        document.getElementById("iframe").src = "/sasac/company/exportTemp/resultWordTemp";
        let times = null;
        if (times) clearTimeout(times);
        times = setTimeout(() => { document.getElementById("iframe").parentNode.removeChild(document.getElementById("iframe")); }, 1e4)
      },
      updateCompany(){
        this.$api.updateCompany().then(res=>{
          if(res.code==200){
          }else{
            this.$message.error(res.description);
          }
        })
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
.dialog-content .el-col {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  span {
    width: 130px;
    flex-shrink: 0;
    text-align: right;
  }
}
</style>