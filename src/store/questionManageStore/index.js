// 问卷管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		// 题库管理 问卷管理

		 // 题库管理
		 	quesManages:[],
		 // 问卷管理
		 	naires:[],
		 	quesNoOption:[],
		 	nairesById:[],
	},
	getters:{
		// 题库管理 问卷管理

		 // 题库管理
		 	quesManages:state=>state.quesManages,
		 // 问卷管理
		 	naires:state=>state.naires,
		 	quesNoOption:state=>state.quesNoOption,
		 	nairesById:state=>state.nairesById,
	},
	mutations:{
		// 题库管理 问卷管理

		 // 题库管理
		 	changequesManages(state,data){
				state.quesManages = data;
			},
		 // 问卷管理
		 	changeNaires(state,data){
				state.naires = data;
			},
			changequesNoOption(state,data){
				state.quesNoOption = data;
			},
			changeNairesById(state,data){
				state.nairesById = data;
			},
	},
	actions:{
		// 题库管理 问卷管理

		// 题库管理
		 	// 新增
			saveOrUpdateQuestion(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/question/saveOrUpdateQuestion',qs.stringify((obj),{allowDots:true})).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 批量删除数据
			batchDeleteQuestion(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/question/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 删除单个数据
			deleteQuestionById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/question/deleteQuestionById',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 查找所有数据
			findAllQuestionVM(context){
				return new Promise((resolve,reject)=>{
					axios.get('/question/findAllQuestionVM').then(({data})=>{
						// data就是后台返回的所有的数据  
						context.commit('changequesManages',data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			
			

		// 问卷管理
		 	// 新增
			saveOrUpdateQuestionnaire(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/questionnaire/saveOrUpdateQuestionnaire',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 批量删除数据
			batchDeleteQuestionnaire(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/questionnaire/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 删除单个数据
			deleteQuestionnaireById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/questionnaire/deleteQuestionnaireById',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 查找所有数据
			findAllQuestionnaire(context){
				return new Promise((resolve,reject)=>{
					axios.get('/questionnaire/findAllQuestionnaire').then(({data})=>{
						// data就是后台返回的所有的数据  
						context.commit('changeNaires',data.data);
						// console.log(data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 查找不要选项的问卷题目
			findAllQuesNoOption(context){
				return new Promise((resolve,reject)=>{
					axios.get('/question/findAllQuestion').then(({data})=>{
						// data就是后台返回的所有的数据  
						context.commit('changequesNoOption',data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 根据id查找问卷的具体题目
			findQuestionnaireVMById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/questionnaire/findQuestionnaireVMById',{params:obj}).then(({data})=>{
						context.commit('changeNairesById',data.data);
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},

	}
}