<!-- 课调管理页面 -->
<template>
  <div class="sManage">
    <!-- {{tangList}} -->
    <div class="optionDiv">
      <el-select @change="typeChange" clearable size="mini" v-model="choice.type" placeholder="请选择">
          <el-option
            v-for="(item,index) in typeArr"
            :key="index"
            :label="item.name"
            :value="item.value">
          </el-option>
      </el-select>
      <el-input :disabled="Boolean(choice.type?0:1)" size="mini" v-model="choice.search" placeholder="请输入内容"></el-input> 
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
          prop="clazzVM.grade.name"
          label="年级"
          align="center">
        </el-table-column>

        <el-table-column
          prop="clazzVM.name"
          label="班级"
          align="center">
        </el-table-column>

        <el-table-column
          prop="course.name"
          label="课程"
          align="center">
        </el-table-column>

        <el-table-column
          prop="qnVM.name"
          label="问卷"
          align="center">
        </el-table-column>

        <el-table-column
          prop="user.name"
          label="讲师"
          align="center">
        </el-table-column>

        <el-table-column
          prop="surveydate"
          label="课调时间"
          align="center">
          <template slot-scope="scope">
            <!-- let str = '2018-09-09 09:09:09';
            str = str.split(' ')[0] -->
            <span>{{scope.row.surveydate?scope.row.surveydate.split(' ')[0]:'--'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"
        align="center">
          <template slot-scope="scope">
            <i class="fa fa-expand fa-2x" style="color:blue" @click="handleExpend(scope.$index, scope.row)"></i>
            <i class="fa fa-pencil-square fa-2x" @click="handleEdit(scope.$index, scope.row)"></i>
            <i class="fa fa-trash fa-2x" style="color:red" @click="handleDelete(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">

        <el-form-item label="年级" :label-width="formLabelWidth">
          <el-select @change="gradeChange" v-model="gradeId" placeholder="请选择年级">
            <el-option
              v-for="(item,index) in grades"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-select :disabled='Boolean(gradeId?0:1)' v-model="form.clazzId" placeholder="请选择班级">
            <el-option
              v-for="(item,index) in clazzList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>v
        <el-form-item label="课程" :label-width="formLabelWidth">
          <el-select v-model="form.courseId" placeholder="请选择课程">
            <el-option
              v-for="(item,index) in courses"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="讲师" :label-width="formLabelWidth">
          <el-select v-model="form.userId" placeholder="请选择讲师">
            <el-option
              v-for="(item,index) in teachers"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问卷" :label-width="formLabelWidth">
          <el-select v-model="form.questionnaireId" placeholder="请选择问卷">
            <el-option
              v-for="(item,index) in naires"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save('form')">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 预览 -->
    <el-dialog :title="currentSurvey.qnVM.name" :visible.sync="dialogEyeVisible">
      <table class="eyeTable">
        <tr>
          <td><span>班级：{{currentSurvey.clazzVM.name}}</span></td>
          <td><span>讲师：{{currentSurvey.user.name}}</span></td>
          <td><span>时间：{{currentSurvey.surveydate}}</span></td>
          <td><span>课程：{{currentSurvey.course.name}}</span></td>
        </tr>
      </table>
      <div class="contentDiv">
        <div class="itemDiv" v-for="(item,index) in currentSurvey.qnVM.questionVMs">
          <ul>
            <li>
              序号{{index+1}}:&nbsp;&nbsp;{{item.name}}
            </li>
            <li style="padding-left:30px;" v-for="(option,num) in item.options">
              {{option.label}}.&nbsp;{{option.name}}
            </li>
          </ul>
        </div>
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
      dialogTitle:'',
      multipleSelection:[],
      dialogFormVisible: false,
      formLabelWidth:'250px',
      tableHeight:'500',
      form:{
        clazzId:'',
        courseId:'',
        userId:'',
        questionnaireId:''
      },
      gradeId:'',
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
      choice:{
        type:'',
        search:'',
      },
      typeArr:[{
        name:'年级',
        value:'grade'
      },{
        name:'班级',
        value:'clazz'
      },{
        name:'课程',
        value:'course'
      },{
        name:'讲师',
        value:'user'
      },{
        name:'问卷',
        value:'qn'
      }],
      // 当前要预览的课调对象的信息
      currentSurvey:{
        qnVM:{},
        clazzVM:{},
        user:{},
        course:{},
        qnVM:{
          questionVMs:[]
        },
      },
      dialogEyeVisible:false,
    }
  },
  computed:{
  clazzList(){
    let vm = this;
    return this.classes.filter((item,index)=>{
      if(item.grade){
        return item.grade.id == vm.gradeId;
      }
    });
  },  
  tangList(){
      let vm = this;
      return this.sManages.filter((item)=>{
        if(vm.choice.type){
          if(vm.choice.type=='grade'&&item.clazzVM&&item.clazzVM.grade){
            // 根据用户选择不同的选项，对数据进行过滤
            return item.clazzVM.grade.name.indexOf(vm.choice.search)!=-1;
          }else if(vm.choice.type=='clazz'&&item.clazzVM){
            return item.clazzVM.name.indexOf(vm.choice.search)!=-1;
          }else if(vm.choice.type=='course'&&item.course){
            return item.course.name.indexOf(vm.choice.search)!=-1;
          }else if(vm.choice.type=='user'&&item.user){
            return item.user.name.indexOf(vm.choice.search)!=-1;
          }else if(vm.choice.type=='qn'&&item.qnVM){
            return item.qnVM.name.indexOf(vm.choice.search)!=-1;
          }else{
            return false;
          }
        }else{
          return true;
        }
      });
  },
    ...mapGetters(['sManages','teachers','courses','classes','grades','naires']),
  },
  created(){
    // 获取所有数据
    this.findAllSurveyVM();
    this.findAllQuestionnaire();
    this.findAllTeacher();
    this.findAllCourse();
    this.findGradeClass();
    this.findAllGrade();
    this.tableHeight = $(window).height()-190;
  },
  methods:{
    // 但select框改变时清空搜索框
    typeChange(){
      this.choice.search = '';
    },
    // 新增
    add(){
      this.dialogTitle="添加课调信息";
      this.dialogFormVisible = true;
        this.form = {
          clazzId:'',
          courseId:'',
          userId:'',
          questionnaireId:''
        };
        this.gradeId = '';
        
    },
    // 模态框保存
    save(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              // 向后台发送数据，成功之后，提示用户，关闭模态框，刷新数据
                this.form.status = '未开启';
                this.saveOrUpdateSurvey(this.form).then((data)=>{
                  if(data.stauts==200){
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success'
                    });
                    this.dialogFormVisible = false;
                    this.findAllSurveyVM();
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
      if(ids.length==0){
          this.$notify.error({
                title: '失败',
                message: '请选择要删除项'
            });
      } else{
        this.batchDeleteSurveyById({ids:ids.join(',')}).then((data)=>{
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success'
            });
            this.findAllSurveyVM();
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
    // 预览
    handleExpend(index,row){
      this.currentSurvey = row;
      this.dialogEyeVisible = true;
    },
    // 编辑
    handleEdit(index,row){
      this.dialogTitle="修改课调信息";
      this.form = {
        id:row.id,
        clazzId:row.clazzVM?row.clazzVM.id:'',
        courseId:row.course?row.course.id:'',
        userId:row.user?row.user.id:'',
        questionnaireId:row.qnVM?row.qnVM.id:'',
        surveydate:this.getCurrentDate(),
        // "surveydate": "2018-11-07 14:26:53",
      };
      this.gradeId = (row.clazzVM&&row.clazzVM.grade)?row.clazzVM.grade.id:'';
      this.dialogFormVisible = true;
    },
    // 单个删除
    handleDelete(index,row){
      this.deleteSurveyById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllSurveyVM();
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
    gradeChange(){
      // 在年级发生更改的时候。重置班级选中的值
      this.form.clazzId = '';
    },
    getCurrentDate(){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      month = month<10?('0'+month):month;
      let day = date.getDate();
      day = day<10?('0'+day):day;
      let hour = date.getHours();
      hour = hour<10?('0'+hour):hour;
      let minutes = date.getMinutes();
      minutes = minutes<10?('0'+minutes):minutes;
      let seconds = date.getSeconds();
      seconds = seconds<10?('0'+seconds):seconds;
      return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
  /*非IE底下   
    new Date('2018-11-07 08:06:03');
  IE底下    
    new Date('2018/11/07 08:06:03');*/
    //获取时间戳   date.getTime();
    },
    ...mapActions(['findAllSurveyVM','saveOrUpdateSurvey','batchDeleteSurveyById','deleteSurveyById','findAllQuestionnaire','findAllTeacher','findAllCourse','findGradeClass','findAllGrade']),
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
  .sManage{
    i{
      cursor: pointer;
    }
    .optionDiv{
      button{
        float:right;
          margin-left:10px;
      }
    }
    .itemDiv{
      border:1px solid #777777;
      padding:3px 0px;
      border-top:none;
      ul{
        list-style:none;
        padding-left:10px;
        margin-bottom:0;
        margin-top:0;
      }
    }
    .eyeTable{
      width:100%;
      line-height:40px;
      text-align:center;
      border-collapse:collapse;
      td{
        border:1px solid #777777;
      }
    }
  }
</style>