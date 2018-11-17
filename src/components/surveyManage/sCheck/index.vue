<!-- 课调审核页面 -->
<template>
  <div class="sCheck">
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
    </div>
    <!-- 表格 -->
    <div class="tableDiv">
      <el-table :height="tableHeight"
        :data="tangList">
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
        </el-table-column>

		    <el-table-column
          prop="status"
          label="状态"
          align="center">
        </el-table-column>

        <el-table-column label="操作" align="center" >
          <template slot-scope="scope">
            <i v-if="scope.row.status=='未审核'" class="fa fa-check" title="审核通过" style="color:blue" @click="handleCheck(scope.$index, scope.row,1)"></i>
            <i v-if="scope.row.status=='未审核'" class="fa fa-times" title="审核不通过" style="color:green" @click="handleCheck(scope.$index, scope.row,0)"></i>
            
          </template>
       </el-table-column>

      </el-table>
    </div>

    
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
import Highcharts from 'highcharts';
export default {
  data(){
    return {
      formLabelWidth:'250px',
      choice:{
        type:'',
        search:'',
      },
      tableHeight:'500',
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
    }
  },
  computed:{
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
    ...mapGetters(['sManages']),
  },
  created(){
    // 获取所有数据
    this.tableHeight = $(window).height()-190;
    this.findAllSurveyVM();
  },
  methods:{
    // 进行审核
    handleCheck(index,row,value){
        let obj = {
          id:row.id,
          status:value
        };
        this.checkSurvey(obj).then((data)=>{
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '审核成功',
              type: 'success'
            });
            this.findAllSurveyVM();
          }else{
            this.$notify.error({
              title: '失败',
              message: '审核失败'
            });
          }
        }).catch((error)=>{
          this.$notify.error({
            title: '失败',
            message: '审核失败'
          });
        });
    },
    typeChange(){
      this.choice.search = '';
    },
    ...mapActions(['findAllSurveyVM','checkSurvey']),
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
  .sCheck{
    i{
      cursor: pointer;
      margin:0 5px;
    }
    .optionDiv{
      button{
        float:right;
          margin-left:10px;
      }
    }
  }
</style>