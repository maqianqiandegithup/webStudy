<template>
    <div class="app">
        <div class="container" v-loading="loading">
            <div class="login-box">
                <div class="title">
                    <p class="title-name">国资委财务风险预警系统</p>
                    <p class="title-divider"></p>
                </div>
                <div class="input-box">
                    <div>
                        <p class="input-pre">
                            <img src="../../assets/imgs/name_icon.png" alt="" />
                        </p>
                        <input
                            type="text"
                            class="input-name"
                            v-model="userCode"
                            placeholder="请输入员工号"
                        />
                    </div>
                    <div>
                        <p class="input-pre">
                            <img
                                src="../../assets/imgs/psword_icon.png"
                                alt=""
                            />
                        </p>
                        <input
                            type="password"
                            class="input-psword"
                            v-model="passWord"
                            placeholder="请输入密码"
                            @keydown.enter="login"
                        />
                    </div>
                </div>
                <div class="button-box">
                    <el-button class="login-btn" type="primary" @click="login"
                        >登 录</el-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"login",
    data(){
        return {
            loading: false,
            userCode: null,
            passWord: null
        }
    },
    methods: {
        login() {
            if(!this.userCode||!this.passWord){
                this.$message.error("您输入的用户名 / 密码为空值 ！");
                return false;
            }
            this.loading=true;
            this.$api.login({
                "account": this.userCode,
                "password": this.passWord
            }).then(res=>{
                if(res.code==200){
                    sessionStorage.setItem("Token", res.data.token);
                    sessionStorage.setItem("userName", res.data.userVO.name);
                    sessionStorage.setItem("userAccount", res.data.userVO.account);
                    sessionStorage.setItem("userId", res.data.userVO.id);
                    setTimeout(()=>{this.$router.push("/largeScreen")},700)
                }else{
                    this.loading=false;
                    this.$message.error(res.description);
                }
            },err=>{this.loading=false})
            
        }
    },
};
</script>
<style lang="stylus" scoped>
.app {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    position: relative;
    height: 80%;
    width: 100%;
    background-image: url('../../assets/imgs/login.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    box-sizing: border-box;
}

.login-box {
    background: #ffffff;
    width: 22%;
    text-align: center;
    padding: 4.1% 3.1% 3.1%;
    position: absolute;
    top: 15%;
    right: 4.1%;
}

.title {
    text-align: center;
}

.title-name {
    color: $themeColor;
    font-size: 2.6vh;
}

.title-divider {
    width: vw(380);
    height: 3px;
    background: $themeColor;
    margin-top: 9.6%;
    margin-bottom: 7.1%;
    display: inline-block;
}

.input-box {
    & > div {
        width: 90.1%;
        position: relative;
        display: inline-block;

        &::before {
            content: '';
            position: absolute;
            z-index: 1;
            left: vw(53);
            top: vw(13);
            width: 1px;
            height: vw(26);
            background-color: $borderColor;
        }

        .input-pre {
            position: absolute;
            width: vw(25);
            height: vw(25);
            top: 50%;
            left: vw(14);
            margin-top: -(@height / 2);

            &>img {
                width: vw(25);
                height: vw(25);
            }
        }
    }

    div {
        &:nth-child(2) {
            margin-top: 20px;
        }
    }
}

.input-name, .input-psword {
    width: vw(311);
    height: vw(50);
    margin: 0 auto;
    border: 1px solid $borderColor;
    padding-left: vw(68);
    outline none;
    transition border-color .2s
    &:hover,&:focus{
        border-color $themeColor
    }
    
}
.input-psword{
// -webkit-text-security: disc;
}
.login-btn {
    width: vw(380);
    padding vw(16) 0 !important 
    margin-top: vw(70);
}
</style>
