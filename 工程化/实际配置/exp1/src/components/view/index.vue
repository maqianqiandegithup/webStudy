<template>
    <div class="app">
        <div class="head">
            <div class="logo">国资委财务风险预警系统</div>
            <div class="menu">
                <router-link
                    class="mune-item"
                    v-for="(item, index) in mData"
                    to=""
                    :key="item.code"
                    @click.native="changeMenu(index)"
                >
                    <span :class="[{'active':item.show}]">
                        {{ item.name }}
                    </span>
                    <span class="menu-bbs" v-if="$route.matched[1].path==item.path"></span>
                </router-link>
            </div>
            <div class="mans">
                <span class="mans-icon"></span>
                <span class="mans-role">{{userName}}</span
                ><el-dropdown class="manstc">
                    <span class="el-dropdown-link">
                        <span class="mans-name">{{userCode}}</span><i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            icon="el-icon-orange"
                            @click.native="goBigpage()"
                            >&nbsp;前往大屏</el-dropdown-item
                        >
                        <el-dropdown-item
                            icon="el-icon-document"
                            v-if="userCode!='admin'"
                            @click.native="modalVisible = true"
                            >&nbsp;修改密码</el-dropdown-item
                        >
                        <el-dropdown-item
                            icon="el-icon-switch-button"
                            @click.native="sign_out()"
                            >&nbsp;退出</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <!-- 修改密码 -->
        </div>
        <el-dialog :visible.sync="modalVisible" title="修改用户密码" width="440px" @closed="firstPassword=null,secondPassword=null">
            <div class="dialog-content">
                <el-row type="flex" class="row-bg">
                    <el-col class="mb-20" :span="24"><span style="width:100px;">输入密码：</span><el-input v-model="firstPassword" size="small"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col class="mb-20" :span="24"><span style="width:100px;">再次输入密码：</span><el-input v-model="secondPassword" size="small"></el-input></el-col>
                </el-row>
             </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modalVisible=false">取 消</el-button>
                <el-button type="primary" @click="upDataUser">确定</el-button>
            </div>
		</el-dialog>
        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    name: "index",
    data() {
        return {
            userName: null,
            userCode: null,
            modalVisible:false,
            firstPassword:null,
            secondPassword:null,
            mData: [
                {
                    name: "风险预警",
                    code: 1,
                    path:"/riskPage",
                    show:false
                },
                {
                    name: "配置",
                    code: 2,
                    path: "/configPage",
                    show:false
                },
            ],
        };
    },
    created() {
        this.userName=sessionStorage.getItem("userName");
        this.userCode=sessionStorage.getItem("userAccount");
    },
    methods: {
        changeMenu(index) {
            if (this.mData[index].show) {
                return;
            }
            this.mData.forEach((ele) => {
                ele.show = false;
            });
            this.mData[index].show = true;
            this.$router.push(this.mData[index].path);
        },
        sign_out() {
            sessionStorage.setItem("Token","")
            this.$router.push("/");
        },
        goBigpage(){
            this.$router.push('/largeScreen');
        },
        upDataUser(){
            if(!this.firstPassword||!this.secondPassword) {
                this.$message.error("您输入的密码 / 再次输入密码为空值 ！");
                return false;
            }
            if(this.firstPassword!=this.secondPassword) {
                this.$message.error("两次输入密码不同，请确认！");
                return false;
            }
            this.$api.updatePassword({
                "id": sessionStorage.getItem("userId"),
                "password": this.firstPassword,
                "rePassword": this.secondPassword
            }).then(res=>{
                if(res.code==200){
                    this.modalVisible=false;
                    this.$message.success({
                        message: "用户密码修改成功，请重新登陆",
                        onClose: this.sign_out()
                    });
                }else{
                    this.$message.error(res.description);
                }
            })
        }
    },
};
</script>

<style lang="stylus" scoped>
.app {
    height: 100%;
}

.head {
    height: $headerHeight;
    line-height: $headerHeight;
    background: #ffffff;
    width: 100%;
    border-bottom: 1px solid #bfbfbf;
    box-sizing: border-box;

    .logo {
        width: $leftWidth;
        text-align: center;
        font-size: 16px;
        color: $fontColor;
        float: left;
    }

    .menu {
        flex: 1;
        float: left;
        margin-left: $marginWidth;
        font-size: 16px;

        a {
            display: inline-block;
            position: relative;
            height: $headerHeight;
            width: 64px;
            text-align: center;
            span {
                font-size 16px
            }
        }

        a:nth-child(2) {
            margin-left: 50px;
        }

        .menu-item {
            display: inline-block;
            font-size: 16px;
        }

        .active {
            color: $themeColor;
        }

        .menu-bbs {
            display: inline-block;
            height: 3px;
            background: $themeColor;
            width: 100%;
            position: absolute;
            border-radius: 18px;
            bottom: 0;
            left: 0;
        }
    }

    .mans {
        float: right;
        margin-right: $marginWidth;

        .manstc span {
            display: inline-block;
        }
        >>> .manstc .el-icon--right{
            font-size 18px
            color #999
        }
        .mans-name {
            margin-right: 20px;
        }

        .mans-role {
            margin-right: 10px;
        }

        .mans-icon {
            display: inline-block;
            // margin auto 0;
            vertical-align: middle;
            margin-right: 10px;
            height: 30px;
            width: 30px;
            background: url('../../assets/imgs/icon_all.png') no-repeat left top;
            background-position: -2px -20px;
        }
    }
    
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
.container {
    height: calc(100% - 60px);
}
.inputbox{
    -webkit-text-security: disc;
}
</style>