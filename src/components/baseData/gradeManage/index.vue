<!-- 年级管理页面 -->
<template>
  <div class="gradeManage">
    <!-- {{gradesList}} -->
    <div class="optionDiv">
	      <el-input v-model="search" placeholder="请输入关键字搜索" size="mini"></el-input>
	      <el-button size="mini" type="success" @click="batchDeleteGrade">批量删除</el-button>
	      <el-button size="mini" type="success" @click="addGrade">添加</el-button>
    </div>
  	<!-- 表格 -->
	<div class="tableDiv">
      <el-table height="500px"
        ref="multipleTable"
        :data="gradeList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="descriptioin"
          label="简介"
          align="center">
        </el-table-column>
        <el-table-column label="操作"
        align="center">
          <template slot-scope="scope">
            <i class="fa fa-pencil-square fa-2x " @click="handleEdit(scope.$index, scope.row)"></i>
          	<i class="fa fa-trash fa-2x " style="color:red" @click="handleDelete(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

	<!-- 模态框 -->
	<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="年级名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级介绍" :label-width="formLabelWidth" prop="descriptioin">
          <el-input v-model="form.descriptioin" autocomplete="off" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGrade('form')">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
    	search:'',
    	dialogTitle:'',
    	multipleSelection:[],
    	dialogFormVisible: false,
    	formLabelWidth:'250px',
    	form:{
    		schoolId:3,
    	},
      rules:{
        name:[
          {required: true, message: '请输入年级名称', trigger: 'blur'},
        ],   
        descriptioin:[
          {required: true, message: '请输入年级简介', trigger: 'blur'},
        ],
      },
    }
  },
  computed:{
	gradeList(){
      let vm = this;
      return this.grades.filter(function(item){
        if(item.name){
        //返回 搜索框内容
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['grades']),
  },
  created(){
  	// 获取所有数据
  	let vm = this;
  	this.findAllGrade();
  },
  methods:{
  	// 新增
  	addGrade(){
  		this.dialogTitle="添加年级信息";
      	this.form = {
        	schoolId:3,
      	};
      	this.dialogFormVisible = true;
    },
  	// 模态框保存
  	saveGrade(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              // 向后台发送数据，成功之后，提示用户，关闭模态框，刷新数据
                this.saveOneGrade(this.form).then((data)=>{
                  if(data.stauts==200){
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success'
                    });
                    this.dialogFormVisible = false;
                    this.findAllGrade();
                  }else{
                    this.dialogFormVisible = false;
                    this.$notify.error({
                      title: '失败',
                      message: '保存失败'
                    });
                  }
                }).catch((error)=>{
                    this.dialogFormVisible = false;
                      this.$notify.error({
                        title: '失败',
                        message: '保存失败'
                      });
                });
          } else {
              return false;
            }
          }); 
    },
  	// 多个删除
  	batchDeleteGrade(){
      // 获取用户选中的复选框对应的对象的id
      let ids = this.multipleSelection.map((item)=>{
        return item.id;
      });
      if(ids.length==0){
          this.$notify.error({
                title: '失败',
                message: '请选择要删除项'
            });
      } else{
        this.batchGrade({ids:ids.join(',')}).then((data)=>{
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success'
            });
            this.findAllGrade();
          }else{
            this.$notify.error({
              title: '失败',
              message: '批量删除失败'
            });
          }
        }).catch((error)=>{
          this.$notify.error({
            title: '失败',
            message: '批量删除失败'
          });
        });
      }
      
    },
  	// 编辑
  	handleEdit(index,row){
  		this.dialogTitle="修改年级信息";
	    this.form = {
	        schoolId:3,
	        name:row.name,
	        descriptioin:row.descriptioin,
	        id:row.id
	    };
	    this.dialogFormVisible = true;
    },
  	// 单个删除
  	handleDelete(index,row){
      this.deleteGradeById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllGrade();
        }else{
          this.$notify.error({
            title: '失败',
            message: '删除失败'
          });
        }
      }).catch((error)=>{
        this.$notify.error({
          title: '失败',
          message: '删除失败'
        });
      });
    },
  	handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  	...mapActions(['findAllGrade','deleteGradeById','batchGrade','saveOneGrade']),
  }
}
</script>

<style scoped>
  /*div.el-input>input*/
  .el-input{
    width:200px;
  }
  .el-textarea{
    width: 60%;
  }
  .el-dialog .el-dialog__header{
	background-color: #515151;
  }
  .el-dialog .el-dialog__body .el-input{
	  width: 50%;
  }
  
</style>

<style scoped lang="scss"> 
  .gradeManage{
    i{
      cursor: pointer;
    }
  	.optionDiv{
  		button{
	    	float:right;
	        margin-left:10px;
	    }
  	}
  }
</style>