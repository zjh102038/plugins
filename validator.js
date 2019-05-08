/*
 * @Description: Have A Nice Day! Validate Plugin
 * @Author: Jacky
 * @LastEditors: Jacky
 * @Date: 2019-04-22 09:37:11
 * @LastEditTime: 2019-04-22 14:09:31
 * @Use: 错误信息会通过warning提示
 * @custom: {
            modifier:'custom validation',
            validFn(value){
                return typeof value==='string'
            } 
        } 
 */
let validator=(Vue,options)=>{
    let {
            errorClass,//验证错误样式
            successClass,//验证通过样式
            eventTriggler='blur',//事件名
            customValidRules=[]//自定义规则数组
        } = options

    let defaulModifiers=[{//默认定义的规则
        modifier:'string',//规则名
        msg:"data must be string",//错误提示
        valueFn(value){//验证规则方法
            return typeof value=='string'
        }
    },{
        modifier:'required',
        valueFn(value){
            return value!=null && value!='' && value!=undefined
        }
    }]
    let finalModifiers = customValidRules.concat(defaulModifiers)
    let eventHandler=(el, binding, vnode)=>{
        let tobechecked=Object.keys(binding.modifiers)
       let res=tobechecked.map(item=>{
           let obj=finalModifiers.find(items=>items.modifier==item)
           if(obj){
                return {
                    flag:obj.valueFn(el.value),
                    msg:obj.valueFn(el.value)?'':obj.msg
                }
           }
           return {
              flag:false,
           }
        })
        if(res.every(item=>item.flag)){//验证成功
            el.style.border="none"
        }else{//验证失败
            el.style.border="1px solid red"
            res.forEach(item=>{
                if(!item.flag){
                    setTimeout(()=>{
                        Vue.prototype.warning.open(item.msg)  //自己封装的全局warning警告
                    },200)
                }
            })
           
        }
    }
    Vue.directive('validate',{
        bind(el, binding, vnode){//绑定
            el.addEventListener(eventTriggler,()=>{//添加已定义的事件  及事件回调
                eventHandler.apply(el,[el, binding, vnode])
            })
        },
        unbind(el){//解绑时删除对应的绑定事件
            el.removeEventListener(eventTriggler,eventHandler)
        }
    })
}
export default validator