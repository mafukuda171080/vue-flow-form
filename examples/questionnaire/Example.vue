// Create and setup your form here
 
<template>
  <div>
    <header class="vff-header">
      <div class="f-container">
        <!-- Add custom logo here -->
        <!-- <svg
          class="f-logo"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMinYMid meet"
          viewBox="0 0 35.606 11.211"
        >
          <path d="M.134.837H3.21V8.01h4.203v2.18H.134V.837z" />
          <path
            d="M11.875.59c1.48 0 2.668.448 3.567 1.344s1.35 2.052 1.35 3.47c0 1.48-.445 2.7-1.336 3.632S13.38 10.45 11.9 10.45c-1.678 0-2.954-.54-3.827-1.622-.717-.9-1.08-2.022-1.09-3.397-.01-1.36.39-2.484 1.193-3.374C9.06 1.08 10.292.59 11.875.59zm0 2.283c-.563 0-1.003.222-1.323.662-.338.467-.507 1.124-.507 1.972 0 .865.162 1.524.487 1.978a1.58 1.58 0 0 0 1.369.682c.588 0 1.04-.223 1.355-.668s.474-1.07.474-1.875c0-1.834-.62-2.75-1.855-2.75z"
          />
          <path
            d="M21.565 7.078V5.055h4.217v5.163h-1.986l-.13-.908c-.693.76-1.617 1.142-2.777 1.142-1.383 0-2.488-.437-3.313-1.3s-1.243-2.03-1.252-3.464c-.01-1.462.385-2.65 1.18-3.567.875-1.012 2.11-1.518 3.7-1.518 1.21 0 2.207.303 3 .907s1.264 1.457 1.447 2.556h-2.92c-.207-.787-.73-1.182-1.57-1.182-.553 0-.988.236-1.303.707s-.475 1.153-.475 2.043c0 1.695.652 2.542 1.96 2.542.363 0 .695-.103.998-.306a1.29 1.29 0 0 0 .572-.784h-1.35v.002z"
          />
          <path
            d="M30.556.59c1.48 0 2.668.448 3.568 1.344s1.348 2.052 1.348 3.47c0 1.48-.443 2.7-1.336 3.632S32.06 10.45 30.58 10.45c-1.678 0-2.953-.54-3.826-1.622-.72-.892-1.082-2.022-1.1-3.398-.008-1.357.39-2.48 1.193-3.372C27.74 1.08 28.974.59 30.556.59zm0 2.283c-.563 0-1.002.222-1.322.662-.336.467-.506 1.125-.506 1.972 0 .865.162 1.524.486 1.978s.78.682 1.37.682 1.04-.223 1.355-.668.475-1.07.475-1.875c-.002-1.834-.62-2.75-1.857-2.75z"
          />
        </svg> -->
        <img
            src="https://www.skylark.co.jp/site_resource/common/images/header/logo_skylark_gloup.png"
          />
      </div>
    </header>

    <flow-form
      ref="flowform"
      v-on:complete="onComplete"
      v-on:submit="onSubmit"
      v-bind:questions="questions"
      v-bind:language="language"
      v-bind:standalone="true"
    >
      <!-- Custom content for the Complete/Submit screen slots in the FlowForm component -->
      <!-- We've overriden the default "complete" slot content -->
      <template v-slot:complete>
        <div class="f-section-wrap">
          <p>
            <span class="fh2">ご協力ありがとうございます</span>
            <span class="f-section-text">
              回答を確認するか、送信を押してください
            </span>
          </p>
          <p class="f-description">
            送信後に抽選でクーポンが表示されます。
          </p>
        </div>
      </template>

      <!-- We've overriden the default "completeButton" slot content -->
      <template v-slot:completeButton>
        <div class="f-submit" v-if="!submitted">
          <button
            class="o-btn-action"
            ref="button"
            type="submit"
            href="#"
            v-on:click.prevent="onSendData()"
            aria-label="Press to submit"
          >
            <span>{{ language.submitText }}</span>
          </button>
          <a
            class="f-enter-desc"
            href="#"
            v-on:click.prevent="onSendData()"
            v-html="language.formatString(language.pressEnter)"
          >
          </a>
        </div>

        <p class="text-success" v-if="submitted">
          ありがとうございました。下記のクーポンをご利用ください
        </p>
        <div v-if="submitted">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/firetable-test-1.appspot.com/o/3674.PNG?alt=media&token=36440d42-539d-46ab-8d55-50750c7dcb5f"
          />
        </div>
      </template>
    </flow-form>
  </div>
</template>

<script>
/*
    Copyright (c) 2020 - present, DITDOT Ltd. - MIT Licence
    https://www.ditdot.hr/en
  */

// Import necessary components and classes
import FlowForm from "../../src/components/FlowForm.vue";
import QuestionModel, {
  QuestionType,
  ChoiceOption,
  LinkOption,
} from "../../src/models/QuestionModel";
import LanguageModel from "../../src/models/LanguageModel";
// If using the npm package, use the following line instead of the ones above.
// import FlowForm, { QuestionModel, QuestionType, ChoiceOption, LanguageModel } from '@ditdot-dev/vue-flow-form'
import firebase from "firebase";
import "firebase/firestore";

export default {
  name: "example",
  components: {
    FlowForm,
  },
  data() {
    return {
      submitted: false,
      completed: false,
      language: new LanguageModel(),
      db: "",

      questions: [
        new QuestionModel({
          id: "store_name",
          tagline: "アンケートにようこそ！ 😊",
          title: "ご利用の店舗はどちらですか？",
          type: QuestionType.Text,
          required: true,
          placeholder: "入力してください",
          
        }),
        new QuestionModel({
          id: "sex",
          // tagline: "Nice to meet you 👀, let's continue",
          title: "性別を選択してください。",
          type: QuestionType.MultipleChoice,
          options: [
            new ChoiceOption({
              label: "男性",
              value: "男性",
            }),
            new ChoiceOption({
              label: "女性",
              value: "女性",
            }),
            new ChoiceOption({
              label: "その他",
              value: "その他",
            }),
          ],
          required: true,
          placeholder: "選択してください",
        }),
        new QuestionModel({
          id: "old",
          // tagline: 'FYI, You can always go back 👈, use the up arrow on the bottom.',
          title: "年齢を選択してください。",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: false,
          required: true,
          options: [
            new ChoiceOption({
              label: "10代",
            }),
            new ChoiceOption({
              label: "20代",
            }),
            new ChoiceOption({
              label: "30代",
            }),
            new ChoiceOption({
              label: "40代",
            }),
            new ChoiceOption({
              label: "50代",
            }),
            new ChoiceOption({
              label: "60代以上",
            }),
          ],
        }),
        new QuestionModel({
          id: "freecoment",
          title:
            "今回ご利用いただいた店舗はいかがでしたか？ぜひご意見・ご感想をお聞かせください。  ",
          type: QuestionType.LongText,
          required: false,
          description: "",
          placeholder: "記入してください",
        }),
        new QuestionModel({
          id: "box_score",
          // tagline: 'FYI, You can always go back 👈, use the up arrow on the bottom.',
          title: "総合満足度",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "非常に満足",
              value: "非常に満足",
            }),
            new ChoiceOption({
              label: "やや満足",
            }),
            new ChoiceOption({
              label: "どちらともいえない",
            }),
            new ChoiceOption({
              label: "やや不満",
            }),
            new ChoiceOption({
              label: "非常に不満",
            }),
          ],
          jump: {
            非常に満足: 'box_speedy',
          },
        }),
        new QuestionModel({
          id: "detail",
          title: "非常に満足を選ばなかった一番の理由をお聞かせください ",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "満足従業員の応対",
            }),
            new ChoiceOption({
              label: "スピーディーなサービス",
            }),
            new ChoiceOption({
              label: "お店の清潔さ",
            }),
            new ChoiceOption({
              label: "商品の品質",
            }),
            new ChoiceOption({
              label: "メニュー",
            }),
            new ChoiceOption({
              label: "価格",
            }),
          ]
        }),
        new QuestionModel({
          id: "box_speedy",
          title: "サービスのスピーディーさの満足度",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "非常に満足",
              value: "非常に満足",
            }),
            new ChoiceOption({
              label: "やや満足",
            }),
            new ChoiceOption({
              label: "どちらともいえない",
            }),
            new ChoiceOption({
              label: "やや不満",
            }),
            new ChoiceOption({
              label: "非常に不満",
            }),
          ],
          jump: {
            非常に満足: "box_crew",
          },
        }),
        new QuestionModel({
          id: "detail_speedy",
          title: "非常に満足を選ばなかった一番の理由をお聞かせください ",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "席に座るまでに時間がかかった",
            }),
            new ChoiceOption({
              label: "料理が運ばれてくるまでに時間がかかった",
            }),
            new ChoiceOption({
              label: "食べ終わった食器を下げてもらえなかった（言うまで下げなかった）",
            }),
          ]
        }),
        new QuestionModel({
          id: "box_crew",
          title: "従業員の笑顔、対応の満足度",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "非常に満足",
              value: "非常に満足",
            }),
            new ChoiceOption({
              label: "やや満足",
            }),
            new ChoiceOption({
              label: "どちらともいえない",
            }),
            new ChoiceOption({
              label: "やや不満",
            }),
            new ChoiceOption({
              label: "非常に不満",
            }),
          ],
          jump: {
            非常に満足: "box_clean",
          },
        }),
        new QuestionModel({
          id: "detail_crew",
          title: "非常に満足を選ばなかった一番の理由をお聞かせください ",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "挨拶がなかった",
            }),
            new ChoiceOption({
              label: "笑顔がなかった",
            }),
            new ChoiceOption({
              label: "言葉遣いが悪かった",
            }),
             new ChoiceOption({
              label: "好意的でなかった",
            }),
           new ChoiceOption({
              label: "しっかりと聞いていなかった",
            }),
            new ChoiceOption({
              label: "気配りがなかった",
            }),
            new ChoiceOption({
              label: "礼儀正しくなかった",
            }),
          ]
        }),
        new QuestionModel({
          id: "box_clean",
          title: "お店の清潔さの満足度",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "非常に満足",
              value: "非常に満足",
            }),
            new ChoiceOption({
              label: "やや満足",
            }),
            new ChoiceOption({
              label: "どちらともいえない",
            }),
            new ChoiceOption({
              label: "やや不満",
            }),
            new ChoiceOption({
              label: "非常に不満",
            }),
          ],
          jump: {
            非常に満足: "box_quality",
          },
        }),
        new QuestionModel({
          id: "detail_clean",
          title: "非常に満足を選ばなかった一番の理由をお聞かせください",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "店舗周り（屋外）",
            }),
            new ChoiceOption({
              label: "入り口周辺",
            }),
            new ChoiceOption({
              label: "客席テーブル周辺",
            }),
             new ChoiceOption({
              label: "客席床",
            }),
           new ChoiceOption({
              label: "ドリンクコーナー",
            }),
            new ChoiceOption({
              label: "トイレの便器",
            }),
            new ChoiceOption({
              label: "トイレの床",
            }),
            new ChoiceOption({
              label: "トイレの洗面台",
            }),
            new ChoiceOption({
              label: "店員の服装",
            }),
          ]
        }),
        new QuestionModel({
          id: "box_quality",
          title: "品質の満足度",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "非常に満足",
              value: "非常に満足",
            }),
            new ChoiceOption({
              label: "やや満足",
            }),
            new ChoiceOption({
              label: "どちらともいえない",
            }),
            new ChoiceOption({
              label: "やや不満",
            }),
            new ChoiceOption({
              label: "非常に不満",
            }),
          ],
          jump: {
            非常に満足: "box_delicious",
          },
        }),
        new QuestionModel({
          id: "detail_quality",
          title: "非常に満足を選ばなかった一番の理由をお聞かせください",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "温度",
            }),
            new ChoiceOption({
              label: "味",
            }),
            new ChoiceOption({
              label: "見た目",
            }),
             new ChoiceOption({
              label: "量",
            }),
           new ChoiceOption({
              label: "新鮮さ",
            }),
          ]
        }),
        new QuestionModel({
          id: "box_delicious",
          title: "美味しさの満足度",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "非常に満足",
              value: "非常に満足",
            }),
            new ChoiceOption({
              label: "やや満足",
            }),
            new ChoiceOption({
              label: "どちらともいえない",
            }),
            new ChoiceOption({
              label: "やや不満",
            }),
            new ChoiceOption({
              label: "非常に不満",
            }),
          ],
        }),
        new QuestionModel({
          id: "box_emotion",
          title: "今回の店舗体験で、どれくらい大切なお客様として扱われたと感じましたか？",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: false,
          required: true,
          options: [
            new ChoiceOption({
              label: "非常にそう感じた",
            }),
            new ChoiceOption({
              label: "やや感じた",
            }),
            new ChoiceOption({
              label: "どちらともいえない",
            }),
            new ChoiceOption({
              label: "あまり感じなかった",
            }),
            new ChoiceOption({
              label: "全く感じなかった",
            }),
          ],
        }),
        new QuestionModel({
          id: "box_problem",
          title: "今回ご利用いただいた店舗での体験で何か問題だったことはありますか？",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: false,
          required: true,
          nextStepOnAnswer:true,
          options: [
            new ChoiceOption({
              label: "ない",
            }),
            new ChoiceOption({
              label: "ある",
            }),
          ],
          jump: {
            ない: "detail_reason",
          },
        }),
        new QuestionModel({
          id: "detail_problem",
          title: "問題があった体験にあてはまるものを全て選択してください。",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: true,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "従業員の応対",
            }),
            new ChoiceOption({
              label: "店舗の清潔さ",
            }),
            new ChoiceOption({
              label: "サービスのスピーディーさ",
            }),
            new ChoiceOption({
              label: "お会計",
            }),
            new ChoiceOption({
              label: "商品の品質",
            }),
            new ChoiceOption({
              label: "品切れで注文できない商品があった",
            }),
          ],
        }),
        new QuestionModel({
          id: "detail_reason",
          title: "今回このお店を選んだ理由はなんですか？当てはまるものを全て選択してください。",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: true,
          allowOther: true,
          required: true,
          options: [
            new ChoiceOption({
              label: "サービスのスピーディーさ",
            }),
            new ChoiceOption({
              label: "従業員の対応",
            }),
            new ChoiceOption({
              label: "従業員との会話",
            }),
            new ChoiceOption({
              label: "商品の品質",
            }),
            new ChoiceOption({
              label: "食べたいメニューがある",
            }),
            new ChoiceOption({
              label: "価格の満足度",
            }),
            new ChoiceOption({
              label: "お店の雰囲気",
            }),
            new ChoiceOption({
              label: "お店の利便性",
            }),
          ],
        }),
        new QuestionModel({
          id: "detail_retry",
          title: "当店をまた利用したいと思いますか？",
          helpTextShow: false,
          type: QuestionType.MultipleChoice,
          multiple: false,
          allowOther: false,
          required: true,
          options: [
            new ChoiceOption({
              label: "ぜひ利用したい",
            }),
            new ChoiceOption({
              label: "まあ利用したい",
            }),
            new ChoiceOption({
              label: "どちらともいえない",
            }),
            new ChoiceOption({
              label: "あまり利用したくない",
            }),
            new ChoiceOption({
              label: "全く利用したくない",
            }),
          ],
        }),
        new QuestionModel({
          id: "recomend",
          subtitle: "10～1で入力してください",
          title: "当店を家族、知人に勧めたいと思いますか？",
          type: QuestionType.Number,
          multiple: false,
          inline: true,
          required: true,
          jump: {
            _other: "_submit",
          },
        }),
      ],
    };
  },
  mounted() {
    document.addEventListener("keyup", this.onKeyListener);
    const firebaseConfig = {
      apiKey: "AIzaSyBbFlPZ4_bTMZ3tfyq75S39u3gTypJrMSM",
      authDomain: "firetable-test-1.firebaseapp.com",
      projectId: "firetable-test-1",
      storageBucket: "firetable-test-1.appspot.com",
      messagingSenderId: "269340196065",
      appId: "1:269340196065:web:9456501488767d71bb8ba0",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.onKeyListener);
  },
  methods: {
    onKeyListener($event) {
      // We've overriden the default "complete" slot so
      // we need to implement the "keyup" listener manually.

      if ($event.key === "Enter" && this.completed && !this.submitted) {
        this.onSendData();
      }
    },

    /* eslint-disable-next-line no-unused-vars */
    onComplete(completed, questionList) {
      // This method is called whenever the "completed" status is changed.
      this.completed = completed;
    },

    /* eslint-disable-next-line no-unused-vars */
    onSubmit(questionList) {
      // This method will only be called if you don't override the
      // completeButton slot.
      this.onSendData();
    },

    onSendData() {
      // Set `submitted` to true so the form knows not to allow back/forward
      //submitted`をtrueに設定して、フォームがバック/フォワードを許可しないことを認識できるようにします
      // navigation anymore.
      this.$refs.flowform.submitted = true;

      this.submitted = true;

      /* eslint-disable-next-line no-unused-vars */
      const data = this.getData();
      /*
          You can use Fetch API to send the data to your server, eg.:
          Fetch APIを使用して、データをサーバーに送信できます。例：

          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
        */

      this.db = firebase.firestore().collection("test").add(data)
      
    },

    getData() {
      this.date = new Date()
      const data = {
        questions: [],
        answers: [],
        timeStamp:this.date
      };

      this.questions.forEach((question) => {
        if (question.title) {
          let answer = question.answer;
          if (Array.isArray(answer)) {
            answer = answer.join(", ");
          }

          data.questions.push(question.title);
          data.answers.push(answer);
        }
      });

      return data;
    },
  },
};
</script>

<style lang="css">
@import "../../src/assets/css/themes/theme-minimal.css";
/* If using the npm package, use the following lines instead of the one above */
/* @import '~@ditdot-dev/vue-flow-form/dist/vue-flow-form.css'; */
/* @import '~@ditdot-dev/vue-flow-form/dist/vue-flow-form.theme-minimal.css'; */
</style>