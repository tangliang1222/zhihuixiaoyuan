// 基础数据仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		// 校园信息 年级管理 班级管理 课程管理 教师管理

		// 校园信息开始
			schoolInfos:[],
		// 校园结束

		// 年级管理开始
			grades:[],
		// 年级管理结束

		// 班级管理开始
			classes:[],
		// 班级管理结束

		// 课程管理开始
			courses:[],
		// 课程管理结束

		// 教师管理开始
			teachers:[],
		// 教师管理结束
	},
	getters:{
		// 校园信息 年级管理 班级管理 课程管理 教师管理

		// 校园信息开始
			schoolInfos:state=>state.schoolInfos,
		// 校园结束

		// 年级管理开始
			// 过滤schoolId不为3的数据
			grades:state=>state.grades.filter(function(item) {
				return item.schoolId==3;
			}), 
		// 年级管理结束
			
		// 班级管理开始
			// classes:state=>state.classes,
			classes:state=>state.classes.filter(function(item) {
				if (item.grade) {
					return item.grade.schoolId==3;	
				} else{
					return false;
				}
			}), 
		// 班级管理结束

		// 课程管理开始
			courses:state=>state.courses,
		// 课程管理结束

		// 教师管理开始
			teachers:state=>state.teachers,
		// 教师管理结束
	},
	mutations:{
		// 校园信息 年级管理 班级管理 课程管理 教师管理

		// 校园信息开始
			changeschoolInfos(state,data){
				state.schoolInfos = data;
			},
		// 校园结束

		// 年级管理开始
			changeGrades(state,data){
				state.grades = data;
			},
		// 年级管理结束

		// 班级管理开始
			changeClasses(state,data){
				state.classes = data;
			},
		// 班级管理结束

		// 课程管理开始
			changeCourses(state,data){
				state.courses = data;
			},
		// 课程管理结束

		// 教师管理开始
			changeTeachers(state,data){
				state.teachers = data;
			},
		// 教师管理结束
	},
	actions:{
		// 校园信息 年级管理 班级管理 课程管理 教师管理

		// 校园信息开始
			//查询数据 
			findschoolInfo(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/school/findById',{params:obj}).then(({data})=>{
						// data就是后台返回的所有的数据  
						context.commit('changeschoolInfos',data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 保存数据
			saveschoolInfo(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/school/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
		// 校园结束

		// 年级管理开始
			// 新增
			saveOneGrade(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/grade/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);

					});
				})
			},
			// 批量删除数据
			batchGrade(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/grade/batchDelete',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 删除单个数据
			deleteGradeById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/grade/deleteById',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 查找所有数据
			findAllGrade(context){
				return new Promise((resolve,reject)=>{
					axios.get('/grade/findAll').then(({data})=>{
						// data就是后台返回的所有的数据  
						context.commit('changeGrades',data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
		// 年级管理结束

		// 班级管理开始
			// 新增
			saveOneClass(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/clazz/saveOrUpdateClazz',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 批量删除数据
			batchClass(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/clazz/batchDeleteClazz',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 删除单个数据
			deleteClassById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/clazz/deleteClazzById',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 查找年级班级数据
			findGradeClass(context){
				return new Promise((resolve,reject)=>{
					axios.get('/clazz/findAllVM').then(({data})=>{
						// data就是后台返回的所有的数据 
						context.commit('changeClasses',data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
		// 班级管理结束

		// 课程管理开始
			// 新增
			saveOneCourse(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/course/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 批量删除数据
			batchCourse(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/course/batchDelete',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 删除单个数据
			deleteCourseById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/course/deleteById',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 查找所有数据
			findAllCourse(context){
				return new Promise((resolve,reject)=>{
					axios.get('/course/findAllCourse').then(({data})=>{
						// data就是后台返回的所有的数据  
						context.commit('changeCourses',data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
		// 课程管理结束

		// 教师管理开始
			// 新增
			saveOneTeacher(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/user/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 批量删除数据
			batchTeacher(context,obj){
				return new Promise((resolve,reject)=>{
					axios.post('/user/batchDelete',qs.stringify(obj)).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 删除单个数据
			deleteTeacherById(context,obj){
				return new Promise((resolve,reject)=>{
					axios.get('/user/deleteById',{params:obj}).then(({data})=>{
						resolve(data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
			// 查找所有数据
			findAllTeacher(context){
				return new Promise((resolve,reject)=>{
					axios.get('/user/findAll').then(({data})=>{
						// data就是后台返回的所有的数据  
						context.commit('changeTeachers',data.data);
						resolve(data.data);
					}).catch((error)=>{
						reject(error);
					});
				})
			},
		// 教师管理结束
	}
}