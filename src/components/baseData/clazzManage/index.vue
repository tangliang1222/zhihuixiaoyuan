<!-- 班级管理页面 -->
<template>
  <div class="clazzManage">
    <div class="optionDiv">
        <el-select size="mini" clearable v-model="choice.gradeId" placeholder="请选择" >
          <el-option
            v-for="(item,index) in grades"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
	      <el-input v-model="choice.search" placeholder="请输入关键字搜索" size="mini" ></el-input>
	      <el-button size="mini" type="success" @click="batchDelete">批量删除</el-button>
	      <el-button size="mini" type="success" @click="add">添加</el-button>
    </div>
  	<!-- 表格 -->
	<div class="tableDiv">
      <el-table height="500px"
        ref="multipleTable"
        :data="classlist"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="name"
          label="班级名称"
          align="center">
        </el-table-column>
		
		    <el-table-column
          prop="description"
          label="班级简介"
          align="center">
        </el-table-column>
        
        <el-table-column
          prop="grade.name"
          label="所属年级"
          align="center">
        </el-table-column>

        <el-table-column
          prop="charge.name"
          label="班主任"
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

        <el-form-item label="班级名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="所属年级" :label-width="formLabelWidth" prop="gradeId">
         <el-select v-model="form.gradeId" placeholder="请选择">
            <el-option
              v-for="(item,index) in grades"
              :key="index"
              :value="item.id"
              :label="item.name"  
            >
          </el-option>
         </el-select>
        </el-form-item>

        <el-form-item label="班主任" :label-width="formLabelWidth" prop="chargeId">
			     <el-select v-model="form.chargeId" placeholder="请选择">
			       <el-option
			         v-for="(item,index) in teachers"
			         :key="index"
			         :value="item.id"
			         :label="item.name">
			       </el-option>
			     </el-select>
        </el-form-item>

		    <el-form-item label="班级简介" :label-width="formLabelWidth" prop="description">
          <el-input v-model="form.description" autocomplete="off"></el-input>
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
      choice:{
        gradeId:'',
        search:'',
      },
    	dialogTitle:'',
    	multipleSelection:[],
    	dialogFormVisible: false,
    	formLabelWidth:'250px',
    	form:{
    		
    	},
      rules:{
        name:[
          {required: true, message: '请输入班级名称', trigger: 'blur'},
        ],   
        gradeId:[
          {required: true, message: '请选择年级名称', trigger: 'blur'},
        ],
        chargeId:[
          {required: true, message: '请选择教师名称', trigger: 'blur'},
        ],   
        description:[
          {required: true, message: '请输入班级简介', trigger: 'blur'},
        ],

      },
    }
  },
  computed:{
	classlist(){
      let vm = this;
      return this.classes.filter(function(item){
        if(item.name){
          if (item.grade.id&&vm.choice.gradeId) {
            return item.name.indexOf(vm.choice.search)!=-1 && (item.grade.id==vm.choice.gradeId);
          }
          //返回 搜索框内容
          return item.name.indexOf(vm.choice.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['classes','grades','teachers']),
  },
  created(){
  	// 获取所有数据
  	let vm = this;
  	// 重新获取年级、老师、班级
  	this.findGradeClass();
  	this.findAllTeacher();
  	this.findAllGrade();
  },
  methods:{
  	// 新增
  	add(){
  		this.dialogTitle="添加班级信息";
      	this.form = {

      	};
      	this.dialogFormVisible = true;
    },
  	// 模态框保存
  	save(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
              // 向后台发送数据，成功之后，提示用户，关闭模态框，刷新数据
                this.saveOneClass(this.form).then((data)=>{
                  if(data.stauts==200){
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success'
                    });
                    this.dialogFormVisible = false;
                    this.findGradeClass();
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
        this.batchClass({ids:ids.join(',')}).then((data)=>{
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success'
            });
            this.findGradeClass();
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
  		// console.log(row);
  		this.dialogTitle="修改班级信息";
	    this.form = {
	        name:row.name,
	        description:row.description,
	        chargeId:row.charge.id?row.charge.id:'',
	        id:row.id,
	        gradeId:row.grade.id?row.grade.id:'',
	    };
	    this.dialogFormVisible = true;
    },
  	// 单个删除
  	handleDelete(index,row){
      this.deleteClassById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findGradeClass();
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
  	...mapActions(['batchClass','deleteClassById','saveOneClass','findGradeClass','findAllGrade','findAllTeacher']),
  }
}
</script>

<style scoped>
  /*div.el-input>input*/
  .el-input{
    width:200px;
  }
  .el-dialog .el-dialog__body .el-input{
	width: 70%;
  }
  
</style>

<style scoped lang="scss"> 
  .clazzManage{
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