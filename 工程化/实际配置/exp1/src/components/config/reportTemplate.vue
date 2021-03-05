<template>
  <div class="container">
    <div class="public-head-left">
      <div class="public-head">
        <h4>报表模板设置</h4>
        <!-- <el-button>导入模板</el-button> -->
        <div>
          <el-dropdown>
            <el-button>导入</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="downLoadFiles">下载模板</el-dropdown-item>
              <el-upload
                action="/sasac/excelConfigCatalog/importExcel"
                :headers="{ 'Token': exportToken }"
                accept=".xls, .xlsx"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-error="handleError"><el-dropdown-item>导入数据</el-dropdown-item></el-upload>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="public-box flex-bet flex-column">
      <div style="width:100%;align-items: flex-end;" class="flex-bet">
        <el-input v-model="content" style="width: 400px;" placeholder="报表名称" @keydown.enter.native="getData()">
          <template slot="prepend"><i class="el-icon-search"></i></template>
          <template slot="append">
            <el-button @click="getData()">查询</el-button>
          </template>
        </el-input>
        <span>共计：{{allNum}}张</span>
      </div>
      <div ref="unitBox" class="unit-box flex-start list-scroll" v-loading="loading">
        <p style="height:100%;width:100%;" v-if="!Object.keys(tableData).length" class="el-table__empty-text flex-center">暂无数据</p>
        <div v-else v-for="(item,index) in tableData" :key="'tab_'+index" class="flex-start flex-column">
          <p>{{item[0].parentCatalog}}</p>
          <div class="flex-start">
            <ul v-for="items in Math.ceil(item.length/lineNum)||1" :key="'tab_'+index+'_'+items">
              <li @click="openTable(i)" v-for="(i,s) in item" v-if="s>=(items-1)*lineNum&&s<(items*lineNum)" :key="'tab_'+index+'_'+items+'_'+s" :title="i.catalog">{{i.catalog}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <my-dialog :visible.sync="modalVisible" class="dialog" :title="targetTitle" width="80%" top="5vh">
        <div class="iframe">
          <iframe v-if="target" :src="$zhengshiUrl+target" frameborder="0" width="100%" height="100%"></iframe>
        </div>
    </my-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
    name: "standardData",
    data() {
        return {
          content: '',
          tableData: [],
          lineNum: 0,
          dataList:[],
          loading: false,
          modalVisible: false,
          target: null,
          targetTitle: null,
          allNum: 0,
          exportToken: null, //上传文件Token
          flag: true  //文件下载开关
        }
    },
    mounted(){
      this.getData();
      this.lineNum=parseInt((this.$refs.unitBox.offsetHeight - 36 - 34 ) / 36);
      this.exportToken=sessionStorage.getItem("Token");
    },
    methods: {
      getData(mess){
        this.loading=true;
        this.$api.excelConfigCatalog({
          "name": this.content
        }).then(res=>{
          this.loading=false;
          if(res.code==200){
            this.allNum=res.data.dataNum;
            this.tableData=res.data.excelConfigCatalog;
            mess&&this.$nextTick(()=>{this.$message.success(mess)});
          }else{
            this.$message.error(res.description);
          }
        },err=>{this.loading=false})
      },
      openTable(data){
        this.modalVisible=true;
        this.target=data.excelHtmlUrl;
        this.targetTitle=data.catalog;
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
        // if(!this.flag) return false;
        // this.flag=false;
        // axios({
        //     method: "GET",
        //     url: "/sasac/excelConfigCatalog/excelTemplateDownload?ConfigKey=configExcel",
        //     responseType: "blob"
        // })
        // .then(res => {
        //     this.flag=true;
        //     let blob = new Blob([res.data], {
        //         type: "application/octet-stream"
        //     });
        //     let eLink = document.createElement("a");
        //     eLink.download = decodeURI(res.headers['content-disposition'].split("filename=")[1]);
        //     eLink.style.display = "none";
        //     eLink.href = URL.createObjectURL(blob);
        //     document.body.appendChild(eLink);
        //     eLink.click();
        //     URL.revokeObjectURL(eLink.href); // 释放URL 对象
        //     document.body.removeChild(eLink);
        //     this.checkAllGroup = "";
        // })
        // .catch(err => {
        //     this.flag=true;
        //     console.log(err);
        // });
        
        if (!document.getElementById("iframe")) {
          var iframe = document.createElement("iframe");
          document.body.appendChild(iframe);
          iframe.style.display = "none";
          iframe.id = "iframe";
        }
        document.getElementById("iframe").src = "/sasac/company/exportTemp/configExcel";
        let times = null;
        if (times) clearTimeout(times);
        times = setTimeout(() => { document.getElementById("iframe").parentNode.removeChild(document.getElementById("iframe")); }, 1e4)
      }
    }
};
</script>

<style lang="stylus" scoped>
.iframe {
  height: 80vh;
}
.unit-box {
  width:100%;
  margin-top: 30px;
  flex: 1;
  align-items: start;
  height: calc(100% - 30px - 30px);
  padding: 18px 30px;
  box-sizing: border-box;
  overflow-x: auto;
  border: 1px solid #bfbfbf;
  > div {
    flex-shrink: 0;
    height: 100%;
    align-items: start;
    p {
      color: #1d1d1d;
      font-weight: 600;
      height: 34px;
      flex-shrink: 0;
      padding: 0 10px;
    }
    div.flex-start:not(.flex-column) {
      flex: 1;
      width: 100%;
    }
    ul {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 0;
      height: 100%;
      margin-right: 46px;
      li {
        width: 210px;
        height: 36px;
        line-height: 36px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        flex-shrink: 0;
        cursor: pointer;
        box-sizing: border-box;
        padding: 0 10px;
        border-radius: 2px;
        &:hover {
          background-color: #f5f7fa;
          color: #0d4985;
        }
      }
    }
  }
}
</style>