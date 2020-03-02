import Vue from 'vue'

/**
 * @Description: 输入框只能输入数字指令

 * @date 2019/4/8  11:40
 */
Vue.directive('enterNumber', {
  inserted: function (el) {
    el.addEventListener('keypress', function (e) {
      e = e || window.event
      let charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode
      let re = /\d/
      if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
    })
  }
})
