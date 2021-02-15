<template>
  <v-container class="module-default__container">
    <div class="module-default__instructions">
      <v-expansion-panels v-model="showInstructions" class="module-default__instructions" flat>
        <v-expansion-panel>
          <v-expansion-panel-header
            v-show="showInstructions"
            hide-actions
            class="pa-0"
            @click="showInstructions = true"
          >
            <template v-slot="{ open }">
              <v-scroll-y-transition hide-on-leave>
                <div v-if="!open" class="d-flex flex-column justify-center">
                  <v-icon color="grey lighten-2" class="d-flex justify-center">
                    mdi-chevron-down
                  </v-icon>
                  <div color="grey lighten-2" class="module-default__collapse-title">
                    INSTRUCTIONS
                  </div>
                </div>
              </v-scroll-y-transition>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <Instruct readonly />
            <div @click="showInstructions = true">
              <div class="module-default__collapse-title">CLOSE</div>
              <!-- <div class="hr"/> OPTIONAL -->
              <v-icon color="grey lighten-2" class="d-flex justify-center"> mdi-chevron-up </v-icon>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <v-progress-linear
      class="module-default__collapse-divider"
      color="#dedede"
      height="2"
      value="100"
      buffer-value="100"
      stream
    />
    <div class="module-edit__container">
      <!-- ENTER CONTENT HERE -->
      <div class="module-default__row">
        <v-text-field
          rounded
          class="mr-4"
          v-model="questionInput"
          outlined
          placeholder="You have 2 questions remaining"
        >
        </v-text-field>
        <v-btn color="#f79961" rounded dark depressed x-large @click="postQuestion"
          >Ask Question</v-btn
        >
      </div>
      <div class="module-default__row">
        <v-btn
          v-for="option in filterOptions"
          :key="option.label"
          class="mr-1 ml-2"
          :color="filter === option.label ? '#f79961' : 'grey'"
          :dark="filter === option.label ? true : null"
          :outlined="filter === option.label ? false : true"
          depressed
          small
          @click="
            filter = option.label;
            page = 1;
          "
          ><v-icon :color="filter === option.label ? 'white' : 'grey lighten-1'" left>{{
            `mdi-${option.icon}`
          }}</v-icon
          >{{ option.label }}</v-btn
        >
      </div>
      <div>
        <div v-if="timeline.length > 0">
          <Question
            v-for="question in timeline"
            :key="question.id"
            :question="question"
            @likeQuestion="likeQuestion"
            @dislikeQuestion="dislikeQuestion"
            @bookmarkQuestion="bookmarkQuestion"
            @flagQuestion="flagQuestion"
            @likeComment="likeComment"
            @flagComment="flagComment"
          />
        </div>
        <div v-else class="text-center module-default__question-header">No questions yet!</div>

        <div v-if="timeline.length > 0" class="text-center mt-12">
          <v-pagination v-model="page" :length="numPages" circle></v-pagination>
        </div>
      </div>
      <!-- DESIGN YOUR ACTIVITY HERE / COMMENT OUT WHEN YOU'VE STARTED DESIGNING -->
      <!-- <div class="module-default__none">Design your activity here</div> -->
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import { Question as QuestionType, MongoDoc } from '../types';
import Instruct from './ModuleInstruct.vue';
import Question from './Question.vue';

const filterOptions = [
  {
    icon: 'account-supervisor-circle-outline',
    label: 'All'
  },
  {
    icon: 'comment-question',
    label: 'My Questions'
  },
  {
    icon: 'bookmark',
    label: 'Bookmarks'
  }
];

const MAX_QUESTIONS_PER_PAGE = 10;

const dummyQuestions = new Array(42).fill().map((e, i) => {
  return {
    id: i,
    author: 2,
    text: `question ${i}?`,
    events: [
      {
        text: 'a comment',
        id: 1,
        time: 'test',
        likes: 0,
        liked: false,
        flagged: false,
        flags: 0
      }
    ],
    likes: 0,
    dislikes: 0,
    liked: false,
    disliked: false,
    bookmarked: false,
    flags: 0,
    flagged: false
  };
});

[...new Array(20)].map((_, i) => {
  dummyQuestions[41].events.push({
    text: `comment ${i}`,
    id: i,
    time: 'test',
    likes: 0,
    liked: false,
    flagged: false,
    flags: 0
  });
  return 'done';
});

console.log(dummyQuestions[41].events);

export default defineComponent({
  name: 'ModuleDefault',
  components: {
    Instruct,
    Question
  },
  props: {
    value: {
      required: true,
      type: Object as PropType<MongoDoc>
    }
  },
  setup() {
    const userID = 1;
    const page = ref(1);
    const filter = ref('All');
    const questions = ref(dummyQuestions);
    const questionInput = ref('');

    // Filter and Pagination logic
    const filteredQuestions = computed(() =>
      questions.value
        .filter(question => {
          if (filter.value === 'Bookmarks') return question.bookmarked;
          if (filter.value === 'My Questions') return question.author === userID;
          return true;
        })
        .reverse()
    );

    const timeline = computed(() =>
      filteredQuestions.value.slice(
        (page.value - 1) * MAX_QUESTIONS_PER_PAGE,
        (page.value - 1) * MAX_QUESTIONS_PER_PAGE + MAX_QUESTIONS_PER_PAGE
      )
    );

    const numPages = computed(() =>
      Math.ceil(filteredQuestions.value.length / MAX_QUESTIONS_PER_PAGE)
    );

    // Question and Comments Actions
    const getQuestionIndex = (id: number) =>
      questions.value.findIndex(question => question.id === id);

    const likeQuestion = (id: number) => {
      const index = getQuestionIndex(id);
      const question = questions.value[index];
      if (!question.liked) {
        if (question.disliked) question.dislikes -= 1;
        question.likes += 1;
        question.liked = true;
        question.disliked = false;
      } else {
        question.likes -= 1;
        question.liked = false;
      }
    };

    const dislikeQuestion = (id: number) => {
      const index = getQuestionIndex(id);
      const question = questions.value[index];
      if (!question.disliked) {
        if (question.likes) question.likes -= 1;
        question.dislikes += 1;
        question.liked = false;
        question.disliked = true;
      } else {
        question.dislikes -= 1;
        question.disliked = false;
      }
    };

    const bookmarkQuestion = (id: number) => {
      const index = getQuestionIndex(id);
      const question = questions.value[index];
      question.bookmarked = !question.bookmarked;
    };

    const flagQuestion = (id: number) => {
      const index = getQuestionIndex(id);
      const question = questions.value[index];
      if (question.flagged) question.flags -= 1;
      else question.flags += 1;
      question.flagged = !question.flagged;
    };

    const getCommentIndex = (question: QuestionType, id: number) =>
      question.events.findIndex(comment => comment.id === id);

    const flagComment = (questionID: number, commentID: number) => {
      const index = getQuestionIndex(questionID);
      const question = questions.value[index];
      const commentIndex = getCommentIndex(question, commentID);
      const comment = question.events[commentIndex];
      if (comment.flagged) comment.flags -= 1;
      else comment.flags += 1;
      comment.flagged = !comment.flagged;
    };

    const likeComment = (questionID: number, commentID: number) => {
      const index = getQuestionIndex(questionID);
      const question = questions.value[index];
      const commentIndex = getCommentIndex(question, commentID);
      const comment = question.events[commentIndex];
      if (!comment.liked) comment.likes += 1;
      else question.likes -= 1;
      comment.liked = !comment.liked;
    };

    const postQuestion = () => {
      if (questionInput.value.length > 0) {
        questions.value.push({
          id: Math.floor(Math.random() * 100 + 42),
          author: userID,
          text: questionInput.value,
          events: [],
          likes: 0,
          dislikes: 0,
          liked: false,
          disliked: false,
          bookmarked: false,
          flags: 0,
          flagged: false
        });
        questionInput.value = '';
      }
    };

    return {
      page,
      numPages,
      filterOptions,
      filter,
      postQuestion,
      timeline,
      questionInput,
      likeQuestion,
      dislikeQuestion,
      bookmarkQuestion,
      flagQuestion,
      likeComment,
      flagComment
    };
  }
});
</script>

<style lang="scss">
.col-xl,
.col-xl-auto,
.col-xl-12,
.col-xl-11,
.col-xl-10,
.col-xl-9,
.col-xl-8,
.col-xl-7,
.col-xl-6,
.col-xl-5,
.col-xl-4,
.col-xl-3,
.col-xl-2,
.col-xl-1,
.col-lg,
.col-lg-auto,
.col-lg-12,
.col-lg-11,
.col-lg-10,
.col-lg-9,
.col-lg-8,
.col-lg-7,
.col-lg-6,
.col-lg-5,
.col-lg-4,
.col-lg-3,
.col-lg-2,
.col-lg-1,
.col-md,
.col-md-auto,
.col-md-12,
.col-md-11,
.col-md-10,
.col-md-9,
.col-md-8,
.col-md-7,
.col-md-6,
.col-md-5,
.col-md-4,
.col-md-3,
.col-md-2,
.col-md-1,
.col-sm,
.col-sm-auto,
.col-sm-12,
.col-sm-11,
.col-sm-10,
.col-sm-9,
.col-sm-8,
.col-sm-7,
.col-sm-6,
.col-sm-5,
.col-sm-4,
.col-sm-3,
.col-sm-2,
.col-sm-1,
.col,
.col-auto,
.col-12,
.col-11,
.col-10,
.col-9,
.col-8,
.col-7,
.col-6,
.col-5,
.col-4,
.col-3,
.col-2,
.col-1 {
  padding-left: 20px !important;
  padding-top: 3px !important;
  padding-bottom: 3px !important;
}

.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
  > .v-input__control
  > .v-input__slot,
.v-text-field.v-text-field--enclosed .v-text-field__details {
  padding-right: 0px !important;
}

.v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse):before {
  left: calc(18px - 1px) !important;
}

.v-timeline-item__divider {
  min-width: 38px !important;
}

.v-timeline-item__body {
  max-width: 100% !important;
}

// .v-timeline--dense .v-timeline-item__body {
//   max-width: 100% !important;
// }

.module-default {
  &__answer-text {
    font-family: Raleway;
    font-size: 12px;
    font-weight: 600;
  }
  &__question-header {
    font-family: Raleway;
    font-size: 17px;
    font-weight: 800;
    line-height: 25px;
  }
  &__row {
    display: flex;
    flex-direction: row;
    // text-align: center;
    justify-content: center;
    margin-bottom: 7%;
    // margin-top: 5%;
  }
  &__none {
    border-radius: 5px;
    // border: 1px solid #dedede;
    height: 100px;
    text-align: center;
    background-color: #dedede;
    font-weight: 700;
    color: #ffffff;
    font-size: 18px;
    padding-top: 35px;
  }

  &__collapse-divider {
    margin-top: 15px;
    margin-bottom: 75px;
    margin-right: none;
    margin-left: none;
    padding-right: none;
    padding-left: none;
    width: 100%;
  }

  &__collapse-title {
    color: #dedede;
    text-align: center;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 1px;
    font-size: 13px;
    //  text-uppercase font-weight-bold text-subtitle-2 text-center
  }

  &__container {
    // width: 100%;
    // padding: none;
    // margin: none;
    margin-top: 0px;
    padding: 0px;
  }
  &__employer-title {
    font-size: 25px;
    font-weight: 700;
  }

  &__scope {
    font-size: 22px;
    font-weight: 800;
    text-align: center;
    max-width: 95%;
    margin: auto;
  }
  &__youtube {
    height: 400px;
    width: 95%;
    border-radius: 25px;
    // margin: 0px;
    background-color: #dedede;

    // text-align: center;
    // justify-content: center;
    // align-items: center;
    // padding-top: auto;
    // padding-bottom: auto;
  }
  &__about {
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    max-width: 90%;
    margin: auto;
    line-height: 30px;
  }

  &__faq {
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    max-width: 90%;
    margin: auto;
    line-height: 30px;
  }

  &__faq-chat {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-bottom: 5%;
  }
  &__faq-chat-line {
    margin: 5px;
  }

  &__faq-avatar {
    margin: 5px;
  }

  &__faq-question {
    // text-align: left;
    font-family: 'Raleway';
    font-size: 16px;
    font-weight: 800;
    color: #404142;
  }

  &__faq-answer {
    text-align: left;
    font-family: 'Raleway';
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0px;
    color: white;
    font-style: italic;
  }

  &__faq-answer-dark {
    text-align: left;
    font-family: 'Raleway';
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0px;
    color: #404142;
    font-style: italic;
  }

  &__faq-answer-dark-highlight {
    text-align: left;
    font-family: 'Raleway';
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0px;
    color: #404142;
  }

  &__specs-title {
    font-weight: 800;
  }
}
</style>
