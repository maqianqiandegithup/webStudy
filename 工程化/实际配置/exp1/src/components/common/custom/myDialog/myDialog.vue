<template>
	<transition name="dialog-fade" 
      @after-enter="afterEnter"
      @after-leave="afterLeave">
		<div
			class="dialog-wrapper"
			v-show="visible"
			@click.self="handleWrapperClick"
		>
			<div
				:class="[
					'my-dialog',
					customClass,
					{ 'is-fullscreen': fullscreen, 'my-dialog-center': center },
				]"
				ref="dialog"
				:key="key"
				:style="style"
			>
				<div class="dialog-header">
					<slot name="title">
						<span class="dialog-title">{{title}}</span>
					</slot>
					<button class="dialog-headerbtn" @click="handleClose">
						X
					</button>
				</div>
				<div class="dialog-body" ><slot></slot></div>
				<div class="dialog-footer" >
					<slot name="footer">
						<el-button size="default" @click="handleClose"
							>{{cancleText}}</el-button
						><el-button type="primary" @click="handleOk"
							>{{okText}}</el-button
						>
					</slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
// import myButton from "./myButton.vue"
export default {
	name: "myDialog",
	data() {
		return {
			closed: false,
			key: 0,
			rendered: 0,
		};
	},
	components:{
	},
	props: {
		title: {
			type: String,
			default: "",
		},
		beforeClose: Function,
		visible: Boolean,
		appendToBody: {
			type: Boolean,
			default: false,
		},
		top: {
			type: String,
			default: "34vh",
		},
		width: String,
		destroyOnClose: Boolean,
		customClass: {
			type: String,
			default: "",
		},
		fullscreen: Boolean,
		center: {
			type: Boolean,
			default: false,
        },
        okText:{
			type: String,
			default: '确定',
        },
        cancleText:{
			type: String,
			default: '取消',
        },
	},
	watch: {
		visible(val) {
			if (val) {
				this.closed = false;
				this.$emit("open");
				this.$el.addEventListener("scroll", this.updatePopper);
				this.$nextTick(() => {
					this.$refs.dialog.srollTop = 0;
				});
				if (this.appendToBody) {
					document.body.appendChild(this.$el);
				}
			} else {
				this.$el.removeEventListener("scroll", this.updatePopper);
				if (!this.closed) this.$emit("on-Close");
				if (this.destroyOnClose) {
					this.$nextTick(() => {
						this.key++;
					});
				}
			}
		},
	},
	computed: {
		style() {
			let style = {};
			if (!this.fullscreen) {
				style.marginTop = this.top;
				this.width && (style.width = this.width);
			}
			return style;
		},
	},
	mounted() {
		if (this.visible) {
			this.rendered = true;
			this.$emit("open");
			if (this.appendToBody) {
				document.body.appendChild(this.$el);
			}
		}
	},
	destroyed() {
		if (this.appendToBody && this.$el && this.$el.parentNode) {
			this.$el.parentNode.removeChild(this.$el);
		}
	},
	methods: {
		handleWrapperClick() {
			this.handleClose();
		},
		handleClose() {
			if (typeof this.beforeClose === "function") {
				this.beforeClose(this.hide);
				// 这里参数是回调函数，
			} else {
				this.hide();
			}
		},
		hide(cancel) {
			if (cancel !== false) {
				// 直接更新父组件的visible值。
				// 和.sync配合使用，双向绑定prop值
				this.$emit("update:visible", false);
				this.$emit("on-Close");
				this.closed = true;
			}
		},
		updatePopper() {
			this.broadcast("ElSelectDropdown", "updatePopper");
		},
		handleOk() {
			this.$emit("on-OK");
        },
        afterEnter() {
        this.$emit('opened');
      },
      afterLeave() {
        this.$emit('closed');
      }
	},
};
</script>

<style lang="stylus" scoped>
.dialog-wrapper {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 2000;

	.my-dialog {
		width: 50%;
		margin: 15% auto 50px;
		background: #ffffff;
		box-sizing: border-box;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		//padding: 20px;

		.dialog-header {
			padding 10px 20px
			background #f7f7f7
			.dialog-title {
				font-size: 18px;
				line-height: 24px;
				color: #303133;
			}

			.dialog-headerbtn {
				float: right;
				background: none;
				border: none;
				font-size: 16px;
				cursor: pointer;
				color:#606b75
				&:hover {
					color: #409eff;
				}
			}
		}

		.dialog-body {
			// padding: 10px 20px;
		}

		.dialog-footer {
			padding: 10px 20px;
			text-align: right;

			>>>.el-button--default {
				background: #fff;
				color: #333;
				border-color #bfbfbf
			}
			>>> .el-button{
				margin-left 20px
			}
		}
	}
}
</style>