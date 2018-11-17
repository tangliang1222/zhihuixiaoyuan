// 课调管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		// 课调管理 课调监控 课调审核

		 // 课调管理
		 	sManages:[],

	},
	getters:{
		// 课调管理 课调监控 课调审核

		 // 课调管理
		 	sManages:state=>state.sManages,
		 	passSurvey:state=>{
			return state.sManages.filter((item)=>{
				return item.status=="审核通过";
			});
		},

	},
	mutations:{
		// 课调管理 课调监控 课调审核

		 // 课调管理
		 	changesManages(state,data){
				state.sManages = data;
			},
	},
	actions:{
		// 课调管理 课调监控 课调审核

		// 课调管理
		 	// 新增或修改
			saveOrUpdateSurvey(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/survey/saveOrUpdateSurvey',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 批量删除数据
			batchDeleteSurveyById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/survey/batchDeleteSurveyById',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 删除单个数据
			deleteSurveyById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/survey/deleteSurveyById',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 查找所有数据
			findAllSurveyVM(context){
				return new Promise((resolve,reject)=>{
					axios.get('/survey/findAllSurveyVM').then(({data})=>{
						// data就是后台返回的所有的数据
						context.commit('changesManages',data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
						console.log(error);
					});
				})
			},

		// 课调监控
		 	// 关闭课调
			stopSurvey(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/survey/stopSurvey',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 开启课调
			beginSurvey(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/survey/beginSurvey',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},

		// 课调审核
			// 去审核课调 返回课调的信息以及课调下所有答卷信息
			checkSurvey(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/survey/checkSurvey',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
	}
}