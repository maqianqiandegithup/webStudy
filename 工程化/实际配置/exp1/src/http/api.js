// 【 api 接口管理 】

// 引入封装axios
import {
    post,
    get,
    del,
    put
} from "./v_axios";


export default {
    // 登录
    login(data) {
        return post("/sasac/user/login", data);
    },
    // 大屏数据
    riskWarningExec(data) {
        return get("/sasac/riskWarningExec/home");
    },
    // 配置-》用户管理
    getUser(data) {
        return post("/sasac/user/get", data);
    },
    // 配置-》修改用户信息
    updateUser(data) {
        return post("/sasac/user/updateUser", data);
    },
    // 配置-》修改用户密码
    updatePassword(data) {
        return post("/sasac/user/updatePassword", data);
    },
    // 配置-》删除用户
    deleteUserById(data) {
        return post("/sasac/user/deleteById/" + data);
    },
    // 风险预警-》查询项目列表
    getProjectlist() {
        return get('/sasac/riskWarningExec/projectlist')
    },
    // 风险预警执行进度-列表展示页-单位列表
    getCompanyList(id) {
        return get('/sasac/project/company/kv/by/project/' + id)
    },
    // 风险预警执行进度-列表展示页-统计数据
    getProjectStatistics(id) {
        return get('/sasac/project/company/statistics/by/project/' + id)
    },
    // 风险预警执行进度->列表展示
    getProgressList(pa) {
        return post('/sasac/project/company/list/page', pa)
    },
    // 风险预警执行进度->预警报告正文
    getReportText(pa) {
        return post('/sasac/riskWarningReport/reportText', pa)
    },
    // 风险预警执行进度->财务风险详情
    getRiskDetails(pa) {
        return post('/sasac/project/company/riskWarningReportDetails', pa)
    },
    // 配置-》单位档案
    getCompany(data) {
        return post("/sasac/company/get", data);
    },
    // 配置-》单位档案
    getCompanyById(data) {
        return post("/sasac/company/getById/" + data);
    },
    // 配置-》单位档案(同步)
    updateCompany(data) {
        return post("/sasac/company/updateCompany", data);
    },
    // 配置-》预警指标设置
    targetConfig(data) {
        return post("/sasac/targetConfig/get", data);
    },
    // 配置-》预警指标设置
    getTargetById(data) {
        return post("/sasac/targetConfig/getById/" + data);
    },
    // 配置-》修改预警指示
    updateTargetConfig(data) {
        return post("/sasac/targetConfig/updateTargetConfig", data);
    },
    // 配置-》报表模板列表列表
    excelConfigCatalog(data) {
        return post("/sasac/excelConfigCatalog/list", data);
    },
    // 风险预警-》查询项目列表
    getProjectlist() {
        return get('/sasac/riskWarningExec/projectlist')
    },
    // 风险预警-》修改指标
    updateTarge(id, pa) {
        return post('/sasac/riskWarningReport/updateTarget/' + id, pa)
    },
    // 风险预警-》重新分析
    targetAnalysis(pa) {
        return post('/sasac/riskWarningReport/targetAnalysis', pa)
    },
    // 风险预警-》已汇总报表列表
    getReportList(pa) {
        return post('/sasac/excelCatalog/list', pa)
    },
    // 风险预警项目-》风险预警项目列表
    getProjectList(pa) {
        return post('/sasac/projectMain/list', pa)
    },

    // 风险预警项目-》新增和编辑保存项目
    saveProject(pa) {
        return post('/sasac/projectMain/save', pa)
    },
    // 风险预警项目-》删除项目
    delProject(id) {
        return post('/sasac/projectMain/' + id)
    },
    // 风险预警项目-》根据id查询项目明细信息
    getProjectInfo(id) {
        return get('/sasac/projectMain/' + id)
    },
    // 风险预警项目-》启动项目
    startProject(id) {
        return post('/sasac/projectMain/start/' + id)
    },
    // 风险预警项目-》查看报表-》下载模板
    downloadExcel() {
        return get('/sasac/excelCatalog/selectConfig')
    },
    getSelectNum(pa) {
        return get('/sasac/excelCatalog/selectAddressNum', pa)
    },
    getCompanyCanSelect(id, pa) {
        return post('/sasac/project/company/selectNotExist/' + id, pa)
    },
    addCompanyInProject(id, pa) {
        return post('/sasac/project/company/save/' + id, pa)
    },
    getCompanyByProjectId(id, pa) {
        return post('/sasac/project/company/select/' + id, pa)
    },
    delCompanyById(projectId, companyId) {
        return post(`/sasac/project/company/${projectId}/${companyId}`)
    },
    // 风险预警生成报告
    generateReport(pa) {
        return post("/sasac/riskWarningReport/generateReport", pa)
    },
    // 风险预警导出报告
    exportReport(pa) {
        return post("/sasac/riskWarningReport/generateReport", pa)
    },
    // 获取预警报告正文

    reportContent(pa) {
        return post("/sasac/riskWarningReport/reportcontent", pa)
    },
    // 保存编辑的正文
    updateReport(pa) {
        return post("/sasac/riskWarningReport/updatereport", pa)
    },
    // 正文重新生成
    reportRegenerate(pa) {
        return post("/sasac/riskWarningReport/reportregenerate", pa)
    },
}