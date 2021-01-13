function SingleManage(manage) {
    this.name = manage.name
}
SingleManage.getInstance = function(manage) {
    if (!this.instance) {
        this.instance = new SingleManage(manage)
    }
    return this.instance
}