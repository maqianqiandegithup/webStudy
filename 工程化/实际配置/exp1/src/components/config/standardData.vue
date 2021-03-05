<template>
  <div class="container">
    <div class="public-head-left">
      <div class="public-head">
        <h4>用户管理</h4>
        <el-button @click="outerVisible=true,optionStatus=0">新增用户</el-button>
      </div>
    </div>
    <div class="public-box flex-bet flex-column">
      <div style="width:100%;" class="flex-bet">
        <el-input v-model="content" style="width: 400px;" placeholder="账户/姓名" @keydown.enter.native="getData()">
          <template slot="prepend"><i class="el-icon-search"></i></template>
          <template slot="append">
            <el-button @click="getData()">查询</el-button>
          </template>
        </el-input>
      </div>
      <div class="unit-box public-from">
        <el-table v-loading="loading" height="a" :data="tableData" :default-sort = "{prop: 'date', order: 'descending'}">
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="account" label="账户" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="type" label="操作" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.account!='admin'">
                <p class="btn-text btn-primary" @click="showInfo(scope,optionStatus=1)">编辑信息</p>
                <p class="divider"></p>
                <p class="btn-text btn-primary" @click="showInfo(scope,optionStatus=2)">修改密码</p>
                <p class="divider"></p>
                <p class="btn-text btn-error" @click="delUser(scope.row.id)">删除</p>
              </div>
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
      <el-dialog width="440px" :title="dialogTitle" :visible.sync="outerVisible" @closed="resetData">
        <div class="dialog-content">
          <el-row  v-if="optionStatus==0||optionStatus==1" type="flex" class="row-bg">
            <el-col class="mb-20" :span="24"><span>账户：</span><el-input v-model="userAccount" size="small"></el-input></el-col>
          </el-row>
          <el-row  v-if="optionStatus==0||optionStatus==1" type="flex" class="row-bg">
            <el-col class="mb-20" :span="24"><span>姓名：</span><el-input v-model="userName" size="small"></el-input></el-col>
          </el-row>
          <el-row v-if="optionStatus==2" type="flex" class="row-bg">
            <el-col class="mb-20" :span="24"><span style="width:100px;">输入密码：</span><el-input v-model="password" size="small"></el-input></el-col>
          </el-row>
          <el-row v-if="optionStatus==2" type="flex" class="row-bg">
            <el-col class="mb-20" :span="24"><span style="width:100px;">再次输入密码：</span><el-input v-model="rpassword" size="small"></el-input></el-col>
          </el-row>
          <el-row v-if="optionStatus==0" type="flex" class="row-bg">
            <el-col class="mb-20" :span="24"><span>初始密码：123456</span></el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible=false">取 消</el-button>
          <el-button type="primary" @click="upDataUser">确定</el-button>
        </div>
      </el-dialog>
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
          userId: null,
          userAccount: null,
          userName: null,
          password: null,
          rpassword: null,
          optionStatus: null
        }
    },
    computed:{
      dialogTitle(){
        return this.optionStatus==0||this.optionStatus==1?this.optionStatus==0?"新建用户":"编辑用户信息":"修改用户密码";
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
        this.$api.getUser({
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
      resetData(){
        this.userId=null;
        this.userAccount=null;
        this.userName=null;
        this.password=null;
        this.rpassword=null;
        this.optionStatus=null;
      },
      showInfo(data){
        this.outerVisible=true;
        this.userId=data.row.id;
        this.userAccount=data.row.account;
        this.userName=data.row.name;
      },
      upDataUser(){
        if((this.optionStatus==0||this.optionStatus==1)&&(!this.userAccount||!this.userName)) {
          this.$message.error("您输入的用户名 / 密码为空值 ！");
          return false;
        }
        this.$api[this.optionStatus==0||this.optionStatus==1?"updateUser":"updatePassword"]({
          "id": this.userId,
          "password": this.password,
          "rePassword": this.rpassword,
          "account": this.userAccount,
          "name": this.userName
        }).then(res=>{
          this.outerVisible=false;
          if(res.code==200){
            this.getData(this.page,this.pageSize,this.optionStatus==0?"新建成功":"修改成功");
          }else{
            this.$message.error(res.description);
          }
        })
      },
      delUser(id){
        this.$confirm('删除当前用户？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.deleteUserById(id).then(res=>{
            if(res.code==200){
              this.getData(this.page,this.pageSize,"删除成功");
            }else{
              this.$message.error(res.description);
            }
          })
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
  justify-content: flex-start;
  align-items: center;
  padding: 0 40px;
  span {
    width: 50px;
    flex-shrink: 0;
    text-align: right;
    white-space: nowrap;
  }
}
.divider {
  background: #e5e5e5;
  display: inline-block;
  height: 14px;
  width: 2px;
  margin: 0 15px;
}
</style>