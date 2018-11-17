 <!-- 问卷管理页面 -->
<template>
  <div class="naireManage">
    
    <!-- {{tangList}} -->
    <div class="optionDiv">
        <el-input v-model="search" placeholder="请输入关键字搜索" size="mini"></el-input>
        <el-button size="mini" type="success" @click="batchDelete">批量删除</el-button>
        <el-button size="mini" type="success" @click="add">添加</el-button>
    </div>
    <!-- 表格 -->
    <div class="tableDiv">
        <el-table :height="tableHeight"
          ref="multipleTable"
          :data="tangList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            prop="name"
            label="问卷名称"
            align="center">
          </el-table-column>

          <el-table-column
            prop="description"
            label="问卷简介"
            align="center">
          </el-table-column>

          <el-table-column label="操作"
          align="center">
            <template slot-scope="scope">
              <i class="fa fa-eye fa-2x" title="预览" style="color:blue" @click="handleExpend(scope.$index, scope.row)"></i>
              <i class="fa fa-pencil-square fa-2x" title="编辑" @click="handleEdit(scope.$index, scope.row)"></i>
              <i class="fa fa-trash fa-2x" title="删除" style="color:red" @click="handleDelete(scope.$index, scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
    </div>

    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="问卷名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="问卷描述" :label-width="formLabelWidth" prop="description">
            <template>
              <el-input v-model="form.description" autocomplete="off" type="textarea"></el-input>
            </template>
        </el-form-item>

        <el-form-item label="题目列表" :label-width="formLabelWidth" >
            <el-button size="mini" @click="showTrans">点击选择</el-button>
        </el-form-item>

      </el-form>

      <!-- 卡片 -->
        <div class="mycard">
          <el-card class="box-card" v-for="(item,index) in optionList" :key='index'>
              <div slot="header" class="clearfix">
                <span>序号{{index+1}}: {{item.name}}</span>
              </div>
              <div v-for="(item,index) in item.options" :key="index" class="text item" style="padding-left:40px;">
                <p>{{item.label}}: {{item.name}}</p>
              </div>
          </el-card>
        </div>

      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveTeacher('form')">保 存</el-button>
      </div>
    </el-dialog>
    
    <!-- 穿梭模态框 -->
    <el-dialog :title="dialogTransTitle" :visible.sync="dialogTransVisible">
      <el-transfer v-model="quesIds" :data="quesList"></el-transfer>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTransVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 问卷预览 -->
    <el-dialog :title="nairesById.name" :visible.sync="dialogEyeVisible">
      <!-- {{nairesById}} -->
      <span>{{nairesById.description}}</span>
      <!-- 卡片 -->
        <div class="mycard">
          <el-card class="box-card" v-for="(item,index) in nairesById.questionVMs" :key='index'>
              <div slot="header" class="clearfix">
                <span>序号{{index+1}}: {{item.name}}</span>
              </div>
              <div v-for="(item,index) in item.options" :key="index" class="text item" style="padding-left:40px;">
                <p>{{item.label}}: {{item.name}}</p>
              </div>
          </el-card>
        </div> 
    </el-dialog> 

  </div>

</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
export default {
  data(){
    return {
    	search:'',
    	dialogTitle:'',
      dialogFormVisible: false,
      dialogTransTitle:'题目列表',
      dialogTransVisible:false,
    	multipleSelection:[],
    	formLabelWidth:'80px',
      dialogEyeVisible:false,
    	form:{
    		name:'',
        description:'',
    	},
      rules:{
	        name:[
	          {required: true, message: '请输入问卷名称', trigger: 'blur'},
	        ],   
	        description:[
	          {required: true, message: '请输入问卷描述', trigger: 'blur'},
	        ],
 
      },
      tableHeight:'500px',
      // 用户选择的key组成的数组
      quesIds:[],
      // 穿梭框左侧的列表数据
      // quesList:[{
      //   key:1,
      //   label:'hello'
      // },{
      //   key:2,
      //   label:'width'
      // }],

    }
  },
  computed:{
    optionList(){
      console.log(this.quesManages);
      return this.quesManages.filter((item,index)=>{
        return this.quesIds.indexOf(item.id)!=-1;
      });
    },
    // 将quesNoOption转化为queList穿梭框格式数据
    quesList(){
      let arr = [];
      this.quesNoOption.forEach((item)=>{
          let obj = {
            key:item.id,
            label:item.name
          };
          arr.push(obj);
      });
      return arr;
    },
  	tangList(){
        let vm = this;
        return this.naires.filter(function(item){
          if(item.name){
          //返回 搜索框内容
            return item.name.indexOf(vm.search)!=-1;
          }else{
            return false;
          }
        });
      },
    	...mapGetters(['naires','quesManages','quesNoOption','nairesById']),
  },
  created(){
  	// 获取所有数据
  	this.findAllQuestionnaire();
    this.findAllQuesNoOption();
    // this.findQuestionnaireVM
    this.findAllQuestionVM();
    this.tableHeight=($(window).height()-185)+'px';
  },
  methods:{
    // 点击显示选择题目 穿梭框
    showTrans(){
      this.dialogTransVisible=true;

    },
  	// 新增
  	add(){
      this.dialogFormVisible = true;
  		this.dialogTitle="创建问卷";
      	this.form = {
        	name:'',
          description:'',
      	};
        this.quesIds=[];
      	
    },
  	// 模态框保存
  	saveTeacher(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              // 向后台发送数据，成功之后，提示用户，关闭模态框，刷新数据
                this.form.questionIds=this.quesIds.join(',');
                this.saveOrUpdateQuestionnaire(this.form).then((data)=>{
                  if(data.stauts==200){
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success'
                    });
                    this.dialogFormVisible = false;
                    this.findAllQuestionnaire();
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
  	batchDelete(){
      // 获取用户选中的复选框对应的对象的id
      let ids = this.multipleSelection.map((item)=>{
        return item.id;
      });
      this.batchDeleteQuestionnaire({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllQuestionnaire();
        }else{
          this.$notify.error({
            title: '失败',
            message: '批量删除失败1'
          });
        }
      }).catch((error)=>{
        this.$notify.error({
          title: '失败',
          message: '批量删除失败2'
        });
      });
    },
    handleExpend(index,row){
      this.findQuestionnaireVMById({id:row.id}).then((data)=>{
        this.dialogEyeVisible = true;
      });
    },
  	// 编辑
  	handleEdit(index,row){
      
  		this.dialogTitle="修改问卷";
	    this.findQuestionnaireVMById({id:row.id}).then((data)=>{
        // data===this.naireWithQues
        this.form = {
          id:data.data.id,
          name:data.data.name,
          description:data.data.description,
        };
        this.quesIds = data.data.questionVMs.map((item)=>{
          return item.id;
        });
        this.dialogFormVisible = true;
      });
    },
  	// 单个删除
  	handleDelete(index,row){
      this.deleteQuestionnaireById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestionnaire();
        }else{
          this.$notify.error({
            title: '失败',
            message: '删除失败1'
          });
        }
      }).catch((error)=>{
        console.log(error);
        this.$notify.error({
          title: '失败',
          message: '删除失败2'
        });
      });
    },
  	handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  	...mapActions(['findAllQuestionnaire','deleteQuestionnaireById','batchDeleteQuestionnaire','saveOrUpdateQuestionnaire','findAllQuesNoOption','findQuestionnaireVMById','findAllQuestionVM']),
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
  .naireManage{
    i{
      cursor: pointer;
      margin-left:5px;
    }  
    .optionDiv{
      button{
        float:right;
        margin-left:10px;
      }
    }
    .mycard{
      height:250px;
      overflow: auto;
      padding: 10px;
      border: 1px solid #777;
    }
    .my-btns{
      float:right;
    }
      
    
  }
</style>