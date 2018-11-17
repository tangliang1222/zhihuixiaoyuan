<!-- 题目管理页面 -->
<template>
  <div class="quesManage">
    <!-- {{tangList}} -->
    <!-- <br>
    <br>
    {{quesManages}} -->
    <!-- {{selected}} -->
    <div class="headDiv">
    	<el-select size="mini" clearable v-model="choice.questionType" placeholder="请选择" >
	        <el-option
	            v-for="(item,index) in options_questionType"
	            :key="index"
	            :label="item"
	            :value="item">
          	</el-option>
        </el-select>
	    <el-input v-model="choice.search" placeholder="请输入关键字搜索" size="mini"></el-input>
	    <el-button size="mini" type="success" @click="batchDelete">批量删除</el-button>
	    <el-button size="mini" type="success" @click="add">添加</el-button>
    </div>

  	<!-- 内容 -->
	<div class="questionDiv">
		<!-- 卡片 -->
		<el-card class="box-card" v-for="(item,index) in tangList" :key='index'>
		  	<div slot="header" class="clearfix">
		  		<!-- 绑定了item.id的input框 -->
		  		<input type="checkbox" class="my_checkbox" v-model="selected" :value="item.id">
		    	<span>序号{{index+1}}: {{item.name}}</span>
		 	  </div>
		  	<div v-for="(item,index) in item.options" :key="index" class="text item" style="padding-left:40px;">
		    	<p>{{item.label}}: {{item.name}}</p>
		 	  </div>
		    <div  class="card_foot">
					  <i class="fa fa-pencil-square fa-2x " @click="handleEdit(item)" ></i>
	          <i class="fa fa-trash fa-2x " @click="handleDelete(item)" style="color:red"></i>
			 </div>
		</el-card>
      
    </div>

	<!-- 模态框 -->
	<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" class="my_el-dialog">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="题目名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="题目类型" :label-width="formLabelWidth" prop="questionType">
        <!-- 绑定change事件 -->
    			<el-select v-model="form.questionType" placeholder="请选择" @change="selecteChange">
    			    <el-option
    			      v-for="(item,index) in options_questionType"
    			      :key="index"
    			      :label="item"
    			      :value="item">
    			    </el-option>
    			</el-select>
        </el-form-item>

        <el-form-item label="题目选项" :label-width="formLabelWidth" v-show='showTable'>

        <!-- 表格 -->
         	<el-table @row-click="showSpan=false"
             height='300px'

		        :data="form.options"
          >
              <el-table-column
                type="index"
                label="序号"
                width="55">
              </el-table-column>
    		      <el-table-column
    		        prop="label"
    		        label="label"
    		        align="center">
                <template slot-scope="scope">
                  <span v-if="showSpan">{{scope.row.label}}</span>
                  <el-input v-else size="mini" v-model="scope.row.label"></el-input>
                </template>
    		      </el-table-column>
    		      <el-table-column
    		        prop="name"
    		        label="选项"
    		        align="center">
                <template slot-scope="scope">
                  <span v-if="showSpan">{{scope.row.name}}</span>
                  <el-input v-else size="mini" v-model="scope.row.name"></el-input>
                </template>
    		      </el-table-column>
    		      <el-table-column
    		        prop="score"
    		        label="分值"
    		        align="center">
                <template slot-scope="scope">
                  <span v-if="showSpan">{{scope.row.score}}</span>
                  <el-input v-else size="mini" v-model="scope.row.score"></el-input>
                </template>
    		      </el-table-column><el-table-column
    		        label="操作"
    		        align="center">
                <template slot-scope="scope">
                  <i class="fa fa-trash fa-2x" @click="handleOptions(scope.$index, scope.row)"></i>
                </template>
    		      </el-table-column>
        	</el-table> 
	        <div>
            <i class="fa fa-plus fa-2x addTr"  @click="addOption" title="添加选项"></i> 
          </div>
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
    	dialogTitle:'',
    	dialogFormVisible: false,
    	formLabelWidth:'80px',
	    rules:{
	       	name:[
	          {required: true, message: '请输入题目名称', trigger: 'blur'},
	        ],   
	        questionType:[
	          {required: true, message: '请选择题目类型', trigger: 'blur'},
	        ],
	    },
	    selected:[],
	    choice:{
	        questionType:'',
	        search:'',
	      },
	    options_questionType:['单选题','多选题','简答题'],
	    form:{
    		options:[],
        name:'',
        questionType:'单选题',
    	},
      showTable:true,
      showSpan:true,
    }
  },
  computed:{
  	tangList(){
        let vm = this;
        return this.quesManages.filter(function(item){
          if(item.name){
          //当select内有内容时返回搜索框内容
            	if (item.questionType&&vm.choice.questionType) {
              	return item.name.indexOf(vm.choice.search)!=-1 && (item.questionType==vm.choice.questionType);
            	}
            //返回 搜索框内容
            return item.name.indexOf(vm.choice.search)!=-1;
          }else{
            return false;
          }
        });
      },
    	...mapGetters(['quesManages']),
  },
  created(){
  	// 获取所有数据
  	let vm = this;
  	this.findAllQuestionVM();
  },
  methods:{
    // 给模态框中的表格增加tr
    addOption(){
      this.form.options.push({
        name:'',
        label:'',
        score:'',
      });
    },
    // 模态框的下拉列表更改
    selecteChange(val){
      // val 用户更改后的值
      if(val=='单选题'||val=='多选题'){
        this.showTable=true;
      } else{
        this.showTable=false;
      }
    },
    // 删除选项
    handleOptions(index,row){
      // this.form.options 
      // {name:'',lable:'',score:3}
      // 通过index来删除数组中的对应位置上的对象
      // alert(index);
      this.form.options.splice(index,1);
    },
  	// 新增
  	add(){
    		this.dialogTitle="添加题目信息";
        this.dialogFormVisible = true;
      	this.form = {
          options:[],
        	name:'',
          questionType:'单选题',
      	};
        this.showTable=true;
    },
  	// 模态框保存
  	save(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              // 向后台发送数据，成功之后，提示用户，关闭模态框，刷新数据
                this.saveOrUpdateQuestion(this.form).then((data)=>{
                  if(data.stauts==200){
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success'
                    });
                    this.dialogFormVisible = false;
                    this.findAllQuestionVM();
                  }else{
                    this.dialogFormVisible = false;
                    this.$notify.error({
                      title: '失败',
                      message: '保存失败1'
                    });
                  }
                }).catch((error)=>{
                    this.dialogFormVisible = false;
                      this.$notify.error({
                        title: '失败',
                        message: '保存失败2'
                      });
                });
          } else {
              return false;
            }
          }); 
    },
  	// 多个删除
  	batchDelete(){
      // 获取用户选中的复选框对应的对象的id来批量删除
        if(this.selected.length==0){
          this.$notify.error({
                title: '失败',
                message: '请选择要删除项'
            });
        } else{
          this.batchDeleteQuestion({ids:this.selected.join(',')}).then((data)=>{
              if(data.stauts==200){
                this.$notify({
                  title: '成功',
                  message: '批量删除成功',
                  type: 'success'
              });
              this.findAllQuestionVM();
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
  	handleEdit(question){
  		this.dialogTitle="修改题目信息";
  		this.form = {
  			// options:question.options?question.options:'',
        options:JSON.parse(JSON.stringify(question.options)),
        // 经过json字符串的转化，页面显示的选项和模态框的数据不一样，不会出现级联问题
  			id:question.id,
  			name:question.name,
  			questionType:question.questionType,
	    };
       if(question.questionType=='单选题'||question.questionType=='多选题'){
        this.showTable=true;
      } else{
        this.showTable=false;
      }
	    this.dialogFormVisible = true;
    },
  	// 单个删除
  	handleDelete(question){
      this.deleteQuestionById({id:question.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestionVM();
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
  	...mapActions(['saveOrUpdateQuestion','deleteQuestionById','batchDeleteQuestion','findAllQuestionVM']),
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
  .el-dialog .el-form .el-table td, .el-table th{
    padding: 2px 0 !important;

  }

</style>


<style scoped lang="scss"> 

  .quesManage{
    i{
      cursor: pointer;
    }
  	.headDiv{
  		margin-bottom:20px;
  		button{
	    	float:right;
	        margin-left:10px;
	    }
  	}
  	.questionDiv{
  		height:500px;
  		overflow: auto;
  		border: 1px solid #777777;
  		.box-card{
  			margin:15px;
  			.clearfix{
  				.my_checkbox{
  					width:20px;
  					height:20px;
  					float:left;
  					margin:0px 15px 10px 0;
  				}
  			}
  			.card_foot{
  				float: right;
  			}
  		}
			
  	}
  	.my_el-dialog{
  		.el-table td, .el-table th{
	    	padding: 2px 0;
	    }
  	}
    .addTr{
      float:right;
    }
  }
</style>