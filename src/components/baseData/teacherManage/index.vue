<!-- 教师管理页面 -->
<template>
  <div class="teacherManage">
    <div class="optionDiv">
	      <el-input v-model="search" placeholder="请输入关键字搜索" size="mini"></el-input>
	      <el-button size="mini" type="success" @click="batchDeleteTeacher">批量删除</el-button>
	      <el-button size="mini" type="success" @click="addTeacher">添加</el-button>
    </div>
  	<!-- 表格 -->
	<div class="tableDiv">
      <el-table height="500px"
        ref="multipleTable"
        :data="teacheList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="name"
          label="教师姓名"
          align="center">
        </el-table-column>

        <el-table-column
          prop="gender"
          label="性别"
          align="center">
        </el-table-column>
		
		<el-table-column
          prop="birth"
          label="出生日期"
          align="center">
        </el-table-column>

        <el-table-column
          prop="hiredate"
          label="入职时间"
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
        <el-form-item label="教师信息" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="教师性别" :label-width="formLabelWidth" prop="gender">
          	<template>
			  <el-radio v-model="form.gender" label="男">男</el-radio>
			  <el-radio v-model="form.gender" label="女">女</el-radio>
			</template>
        </el-form-item>

		<el-form-item label="出生日期" :label-width="formLabelWidth" prop="birth">
		    <el-date-picker type="date" placeholder="选择日期" v-model="form.birth" value-format="yyyy-MM-dd"></el-date-picker>
		</el-form-item>

		<el-form-item label="入职时间" :label-width="formLabelWidth" prop="hiredate">
		    <el-date-picker type="date" placeholder="选择日期" v-model="form.hiredate" value-format="yyyy-MM-dd"></el-date-picker>
		</el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTeacher('form')">保 存</el-button>
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
          {required: true, message: '请输入教师名称', trigger: 'blur'},
        ],   
        gender:[
          {required: true, message: '请选择教师性别', trigger: 'blur'},
        ],
        birth:[
          {required: true, message: '请输入教师出生日期', trigger: 'blur'},
        ],   
        hiredate:[
          {required: true, message: '请输入教师入职时间', trigger: 'blur'},
        ],

      },
    }
  },
  computed:{
	teacheList(){
      let vm = this;
      return this.teachers.filter(function(item){
        if(item.name){
        //返回 搜索框内容
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['teachers']),
  },
  created(){
  	// 获取所有数据
  	let vm = this;
  	this.findAllTeacher();
  },
  methods:{
  	// 新增
  	addTeacher(){
  		this.dialogTitle="添加教师信息";
      	this.form = {
        	type:null
      	};
      	this.dialogFormVisible = true;
    },
  	// 模态框保存
  	saveTeacher(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              // 向后台发送数据，成功之后，提示用户，关闭模态框，刷新数据
                this.saveOneTeacher(this.form).then((data)=>{
                  if(data.stauts==200){
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success'
                    });
                    this.dialogFormVisible = false;
                    this.findAllTeacher();
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
  	batchDeleteTeacher(){
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
        this.batchTeacher({ids:ids.join(',')}).then((data)=>{
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success'
            });
            this.findAllTeacher();
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
  		this.dialogTitle="修改教师信息";
	    this.form = {
	        type:null,
	        name:row.name,
	        gender:row.gender,
	        birth:row.birth,
	        hiredate:row.hiredate,
	        id:row.id
	    };
	    this.dialogFormVisible = true;
    },
  	// 单个删除
  	handleDelete(index,row){
      this.deleteTeacherById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllTeacher();
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
  	...mapActions(['findAllTeacher','deleteTeacherById','batchTeacher','saveOneTeacher']),
  }
}
</script>

<style scoped>
  /*div.el-input>input*/
  .el-input{
    width:200px;
  }
  .el-dialog .el-dialog__body .el-input{
	width: 50%;
  }
  
</style>

<style scoped lang="scss"> 
  .teacherManage{
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