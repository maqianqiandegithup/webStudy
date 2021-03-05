<template>
    <div class="page flex-end" :class="[{ 'fixed-footer': isFixed }]">
        <el-pagination
            background
            layout="total,sizes, prev, pager, next"
            :total="total"
            :page-size.sync="pageSize"
            :current-page.sync="currenPage"
            :page-sizes="[10, 30, 50]"
            @size-change="changeSize"
            @current-change="changeCurrent"
        >
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: "tablePage",
    data() {
        return {
            currenPage: 1,
            pageSize: 10,
            total: 0,
        };
    },
    props: {
        isFixed: {
            type: Boolean,
            default: true,
        },
        currentTotal:Number
    },
    watch: {
        total(value, old) {
            if(this.currenPage != 1 && this.currentTotal == 0){
                this.currenPage--
                this.$emit("getData");
            }
        },
    },
    methods: {
        changeSize() {
            this.currenPage = 1;
            this.$emit("getData");
        },
        changeCurrent() {
            this.$emit("getData");
        },
    },
};
</script>

<style lang="stylus" scoped>
.page {
    box-sizing: border-box;
    height: 50px;
    background-color: #f4f3f3;
    border: solid 1px #bfbfbf;
    border-top: none;
    padding-right: vw(80);
    font-size: 12px;

    >>> .el-pager li {
        font-size: 12px;
    }

    &.fixed-footer {
        position: fixed;
        left: 'calc(200px + %s)' % vw(20);
        right: vw(20);
        bottom: 20px;
        z-index: 20;
    }
}

>>> .btn-next, >>> .btn-prev, >>> .el-pager li {
    border: solid 1px #bfbfbf !important;
}

>>> .el-pager li:not(.disabled).active {
    background: #f4f3f3 !important;
    color: $themeColor !important;
    border: 1px solid $themeColor !important;
}

>>> .el-pager li:hover {
    color: $themeColor !important;
}

>>> .el-pagination .el-select .el-input .el-input__inner {
    background: #f4f3f3;
    color: #999;
}
</style>