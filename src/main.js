// Import vue component
import FlowForm from './components/FlowForm.vue'
import QuestionModel, { QuestionType, ChoiceOption, LinkOption, MaskPresets } from './models/QuestionModel'
import LanguageModel from './models/LanguageModel'
// import firebase from 'firebase'

// const firebaseConfig = {
//   apiKey: "AIzaSyBbFlPZ4_bTMZ3tfyq75S39u3gTypJrMSM",
//   authDomain: "firetable-test-1.firebaseapp.com",
//   projectId: "firetable-test-1",
//   storageBucket: "firetable-test-1.appspot.com",
//   messagingSenderId: "269340196065",
//   appId: "1:269340196065:web:9456501488767d71bb8ba0"
// };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


// IE11 Object.assign polyfill
import 'es6-object-assign/auto'

// Declare install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('FlowForm', FlowForm)
}

// Create module definition for Vue.use()
const plugin = {
  install
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

// To allow use as module (npm/webpack/etc.) export component
export default FlowForm

export {
  QuestionModel,
  QuestionType,
  ChoiceOption,
  LinkOption,
  LanguageModel,
  MaskPresets,
}