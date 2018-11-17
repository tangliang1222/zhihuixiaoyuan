<!-- 课程管理页面 -->
<template>
  <div class="courseManage">
    <div class="optionDiv">
	      <el-input v-model="search" placeholder="请输入关键字搜索" size="mini" ></el-input>
	      <el-button size="mini" type="success" @click="batchDelete">批量删除</el-button>
	      <el-button size="mini" type="success" @click="add">添加</el-button>
    </div>
  	<!-- 表格 -->
	<div class="tableDiv">
      <el-table height="500px"
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="name"
          label="课程名称"
          align="center">
        </el-table-column>
		
		    <el-table-column
          prop="period"
          label="课程周期"
          align="center">
        </el-table-column>

        <el-table-column
          prop="description"
          label="课程简介"
          align="center">
        </el-table-column>

        <el-table-column label="操作"
        align="center">
          <template slot-scope="scope">
          	<i class="fa fa-pencil-square fa-2x" @click="handleEdit(scope.$index, scope.row)"></i>
          	<i class="fa fa-trash fa-2x" style="color:red" @click="handleDelete(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

	<!-- 模态框 -->
	<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="课程名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

		<el-form-item label="课程周期" :label-width="formLabelWidth" prop="period">
          <el-input v-model.number="form.period" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="课程介绍"  :label-width="formLabelWidth" prop="description">
          <el-input v-model="form.description" autocomplete="off" type="textarea"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save('form')">保 存</el-button>
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
    		
    	},
      rules:{
        name:[
          {required: true, message: '请输入课程名称', trigger: 'blur'},
        ],   
        description:[
          {required: true, message: '请输入课程简介', trigger: 'blur'},
        ],
        period:[
          {required: true, message: '请输入课程周期', trigger: 'blur'},
          {type: 'number', message: '请输入数字', trigger: 'blur'}
        ],
      },
    }
  },
  computed:{
	list(){
      let vm = this;
      return this.courses.filter(function(item){
        if(item.name){
        //返回 搜索框内容
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['courses']),
  },
  created(){
  	// 获取所有数据
  	let vm = this;
  	this.findAllCourse();
  },
  methods:{
  	// 新增
  	add(){
  		this.dialogTitle="添加课程信息";
      	this.form = {

      	};
      	this.dialogFormVisible = true;
    },
  	// 模态框保存
  	save(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              // 向后台发送数据，成功之后，提示用户，关闭模态框，刷新数据
              this.saveOneCourse(this.form).then((data)=>{
                if(data.stauts==200){
                  this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success'
                  });
                  this.dialogFormVisible = false;
                  this.findAllCourse();
                } else{
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
  	batchDelete(){
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
            this.batchCourse({ids:ids.join(',')}).then((data)=>{
              if(data.stauts==200){
                this.$notify({
                  title: '成功',
                  message: '批量删除成功',
                  type: 'success'
                });
                this.findAllCourse();
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
  		this.dialogTitle="修改课程信息";
	    this.form = {
	        name:row.name,
	        period:row.period,
	        description:row.description,
	        id:row.id,
	    };
	    this.dialogFormVisible = true;
    },
  	// 单个删除
  	handleDelete(index,row){
      this.deleteCourseById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllCourse();
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
  	...mapActions(['batchCourse','deleteCourseById','findAllCourse','saveOneCourse']),
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
  .el-dialog .el-dialog__body .el-input{
	width: 50%;
  }
  
</style>

<style scoped lang="scss"> 
  .courseManage{
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

