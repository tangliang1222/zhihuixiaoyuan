<!-- 学校信息页面 -->
<template>
  <div class="schoolInfo">
  	<div class="tableDiv">
  		<table>
  			<tr>
	  			<td class="table_fix">校园名称</td>
	  			<td class="table_change"><input v-model="schoolInfos.name" ></input></td>
	  		</tr>
	  		<tr>
	  			<td class="table_fix">校园介绍</td>
	  			<td class="table_change"><input v-model="schoolInfos.logopath" ></input></td>
	  		</tr>
	  		<tr>
	  			<td class="table_fix">校园地址</td>
	  			<td class="table_change"><input v-model="schoolInfos.address"></input></td>
	  		</tr>
	  		<tr>
	  			<td class="table_fix">校园电话</td>
	  			<td class="table_change"><input v-model="schoolInfos.telephone" ></input></td>
	  		</tr>
	  		<tr>
	  			<td class="table_fix">版权信息</td>
	  			<td class="table_change"><input v-model="schoolInfos.copyright" ></input></td>
	  		</tr>
  		</table>		
  	</div>
    <div class="optionDiv">
      <el-button type="success" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {

    }
  },
  computed:{
  	...mapGetters(['schoolInfos']),
  },
  created(){
  	// 获取所有数据
  	let vm = this;
  	this.findschoolInfo({id:3});
  },
  methods:{
  	// 模态框保存
  	save(){
      // 向后台发送数据，成功之后，提示用户，关闭模态框，刷新数据
      	this.form = {
	        id:3,
	        name:this.schoolInfos.name,
	        logopath:this.schoolInfos.logopath,
	        address:this.schoolInfos.address,
	        telephone:this.schoolInfos.telephone,
	        logopath:this.schoolInfos.logopath,
	        copyright:this.schoolInfos.copyright,
	    };
      	this.saveschoolInfo(this.form).then((data)=>{
	        if(data.stauts==200){
	          this.$notify({
	            title: '成功',
	            message: '保存成功',
	            type: 'success'
	          });
	          this.findschoolInfo({id:3});
	        }else{
	          this.$notify.error({
	            title: '失败',
	            message: '保存失败'
	          });
	        }
	    }).catch((error)=>{
	        this.$notify.error({
	          title: '失败',
	          message: '保存失败'
	        });
	      });
    },
  	...mapActions(['findschoolInfo','saveschoolInfo']),
  }
}
</script>

<style scoped>
  .tableDiv table{
  	border-collapse: collapse;
  }
  .tableDiv table td{
  	border:1px solid black;
  	height: 40px;
  }
  .tableDiv table .table_fix{
  	width: 200px;
  	text-align: center;
  }
  .tableDiv table .table_change{
  	width: 700px;
  	text-align: center;
  }
  .tableDiv table .table_change input{
  	width: 80%;
  	height: 30px;
  	border: none;
  }
</style>

<style scoped lang="scss"> 
  .schoolInfo{
  	.optionDiv{
  		button{
        width:100px;
	    	float:right;
	    }
  	}
  	
  }
</style>