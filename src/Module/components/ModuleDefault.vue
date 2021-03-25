<template>
  <v-container class="module-default pa-0">
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
            <Instruct v-model="setupInstructions" readonly />
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
      class="mt-3"
      color="#dedede"
      height="2"
      value="100"
      buffer-value="100"
      stream
    />
    <div class="forum__question justify-center d-flex flex-column pa-5 mt-12">
      <!-- ENTER CONTENT HERE -->
      <div class="d-flex flex-row justify-center mb-8">
        <div>
          <v-text-field
            v-model="questionInput"
            rounded
            class="module-default__text-field"
            outlined
            :disabled="questionsRemaining <= 0 || userType === 'stakeholder'"
            :placeholder="`You have ${questionsRemaining} questions remaining`"
          >
          </v-text-field>
        </div>
        <div>
          <v-btn
            :disabled="userType === 'stakeholder'"
            color="#ea6764"
            rounded
            dark
            class="module-default__log-btn"
            depressed
            x-large
            @click="postQuestion"
            >Ask Question</v-btn
          >
        </div>
      </div>
      <div class="d-flex flex-row justify-center">
        <div>
          <v-btn
            v-for="option in filterOptions"
            :key="option.label"
            class="mr-1 ml-2"
            :color="filter === option.label ? '#ea6764' : 'grey'"
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
      </div>
      <div class="justify-center">
        <div v-if="timeline.length > 0 && studentDoc">
          <Question
            v-for="question in timeline"
            :key="question._id.toString()"
            :student-adk-data="studentAdkData"
            :question="question"
            @likeQuestion="likeQuestion"
            @dislikeQuestion="dislikeQuestion"
            @bookmarkQuestion="bookmarkQuestion"
            @flagQuestion="flagQuestion"
            @postComment="postComment"
            @likeComment="likeComment"
            @flagComment="flagComment"
          />
        </div>
        <div v-else class="text-center module-default__question-header">No questions yet!</div>

        <div v-if="timeline.length > 0" class="text-center mt-12">
          <v-pagination v-model="page" :length="numPages" circle @input="scrollUp"></v-pagination>
        </div>
      </div>
      <!-- DESIGN YOUR ACTIVITY HERE / COMMENT OUT WHEN YOU'VE STARTED DESIGNING -->
      <!-- <div class="module-default__none">Design your activity here</div> -->
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, reactive, toRefs } from '@vue/composition-api';
import { getModAdk, getModMongoDoc } from 'pcv4lib/src';
import { Db, ObjectId } from 'mongodb';
import { Question as QuestionType, MongoDoc } from '../types';
import {
  questionIsBookmarked,
  questionIsDisliked,
  questionIsFlagged,
  questionIsLiked,
  commentIsLiked,
  commentIsFlagged,
  removeId
} from './helpers';
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
    },
    userType: {
      required: true,
      type: String
      // participant: '',
      // organizer: '',
      // stakeholder: ''
    },
    teamDoc: {
      required: false,
      type: Object as PropType<MongoDoc>,
      default: () => {}
    },
    studentDoc: {
      required: false,
      type: Object as PropType<MongoDoc>,
      default: () => {}
    },
    userDoc: {
      required: false,
      type: Object as PropType<MongoDoc>,
      default: () => {}
    },
    db: {
      required: false,
      type: Object as PropType<Db>,
      default: () => {}
    }
  },
  setup(props, ctx) {
    const state = reactive({
      page: 1,
      filter: 'All',
      questionInput: '',
      questions: [] as QuestionType[],
      programDoc: getModMongoDoc(props, ctx.emit),
      teamDocument: props.teamDoc
        ? getModMongoDoc(props, ctx.emit, {}, 'teamDoc', 'inputTeamDoc')
        : null,
      studentDocument: props.studentDoc
        ? getModMongoDoc(props, ctx.emit, {}, 'studentDoc', 'inputStudentDoc')
        : null,
      studentAdkData: null as null | Record<string, any>,
      teamAdkData: null as null | Record<string, any>,
      showInstructions: true,
      setupInstructions: {
        description: '',
        instructions: ['', '', '']
      }
    });

    const { adkData, adkIndex } = getModAdk(props, ctx.emit, 'forum');

    if (props.studentDoc) {
      const { adkData: studentAdkData } = getModAdk(
        props,
        ctx.emit,
        'forum',
        {},
        'studentDoc',
        'inputStudentDoc'
      );
      state.studentAdkData = studentAdkData.value;
    }

    if (props.teamDoc) {
      const { adkData: teamAdkData } = getModAdk(
        props,
        ctx.emit,
        'forum',
        {},
        'teamDoc',
        'inputTeamDoc'
      );
      state.teamAdkData = teamAdkData.value;
    }

    const fetchQuestions = async () => {
      const questions = await props.db
        .collection('Question')
        .find({ programId: props.value!.data._id });
      // ignore these warnings, the main repo returns an array instead of a Cursor
      questions.sort((a: QuestionType, b: QuestionType) => (a.likes > b.likes ? 1 : -1));
      state.questions = questions;
      // ! can't figure this out
      // .aggregate([{$search: {equals: {path: 'programId', value: props.value!.data._id }}}, {$sort: {likes: -1}}])
    };
    fetchQuestions();

    const scrollUp = () => {
      window.scrollTo(0, 300);
    };

    // Filter and Pagination logic
    // ! use db Find here
    const filteredQuestions = computed(() =>
      state.questions
        .filter(question => {
          if (state.filter === 'Bookmarks')
            return questionIsBookmarked(state.studentAdkData!, question);
          if (state.filter === 'My Questions')
            return question.author.equals(props.userDoc?.data._id);
          return true;
        })
        .reverse()
    );

    const timeline = computed(() =>
      filteredQuestions.value.slice(
        (state.page - 1) * MAX_QUESTIONS_PER_PAGE,
        (state.page - 1) * MAX_QUESTIONS_PER_PAGE + MAX_QUESTIONS_PER_PAGE
      )
    );

    const numPages = computed(() =>
      Math.ceil(filteredQuestions.value.length / MAX_QUESTIONS_PER_PAGE)
    );

    const questionsRemaining = computed(() => {
      const teamQuestions = state.teamAdkData ? state.teamAdkData.questionsAsked : [];
      const ret = adkData.value.maxQuestions - teamQuestions.length;
      if (ret <= 0) {
        // When the user has asked enough questions, we will unlock the next module.
        adkData.value.update(() => ({
          isComplete: true,
          adkIndex
        }));
      }
      return ret;
    });

    // Question and Comments Actions

    const likeQuestion = async (_id: ObjectId) => {
      const question = await props.db.collection('Question').findOne({ _id });
      if (!questionIsLiked(state.studentAdkData!, question)) {
        if (questionIsDisliked(state.studentAdkData!, question)) question.dislikes -= 1;
        question.likes += 1;
        state.studentAdkData!.likedQuestions.push(_id.toString()); // question.liked = true
        state.studentAdkData!.dislikedQuestions = removeId(
          state.studentAdkData!.dislikedQuestions,
          _id
        );
      } else {
        question.likes -= 1;
        state.studentAdkData!.likedQuestions = removeId(state.studentAdkData!.likedQuestions, _id); // question.liked = false
      }
      await props.db
        .collection('Question')
        .updateOne({ _id }, { $set: { likes: question.likes, dislikes: question.dislikes } });
      state.studentDocument!.update();
      fetchQuestions();
    };

    const dislikeQuestion = async (_id: ObjectId) => {
      const question = await props.db.collection('Question').findOne({ _id });
      if (!questionIsDisliked(state.studentAdkData!, question)) {
        if (questionIsLiked(state.studentAdkData!, question)) question.likes -= 1;
        question.dislikes += 1;
        state.studentAdkData!.likedQuestions = removeId(state.studentAdkData!.likedQuestions, _id);
        state.studentAdkData!.dislikedQuestions.push(_id.toString());
      } else {
        question.dislikes -= 1;
        state.studentAdkData!.dislikedQuestions = removeId(
          state.studentAdkData!.dislikedQuestions,
          _id
        );
      }
      await props.db
        .collection('Question')
        .updateOne({ _id }, { $set: { likes: question.likes, dislikes: question.dislikes } });
      state.studentDocument!.update();
      fetchQuestions();
    };

    const bookmarkQuestion = (_id: ObjectId) => {
      if (state.studentAdkData!.bookmarkedQuestions.some((id: string) => id === _id.toString()))
        state.studentAdkData!.bookmarkedQuestions = removeId(
          state.studentAdkData!.bookmarkedQuestions,
          _id
        );
      else state.studentAdkData!.bookmarkedQuestions.push(_id.toString());
      state.studentDocument!.update();
    };

    const flagQuestion = async (_id: ObjectId) => {
      const question = await props.db.collection('Question').findOne({ _id });
      if (questionIsFlagged(state.studentAdkData!, question)) {
        question.flags -= 1;
        state.studentAdkData!.flaggedQuestions = removeId(
          state.studentAdkData!.flaggedQuestions,
          _id
        );
      } else {
        question.flags += 1;
        state.studentAdkData!.flaggedQuestions.push(_id.toString());
      }
      await props.db.collection('Question').updateOne({ _id }, { $set: { flags: question.flags } });
      state.studentDocument!.update();
      fetchQuestions();
    };

    const getCommentIndex = (question: QuestionType, id: ObjectId) =>
      question.comments.findIndex(comment => comment._id.equals(id));

    const flagComment = async (questionID: ObjectId, commentID: ObjectId) => {
      const question = await props.db.collection('Question').findOne({ _id: questionID });
      const commentIndex = getCommentIndex(question, commentID);
      const comment = question.comments[commentIndex];
      if (commentIsFlagged(state.studentAdkData!, comment)) comment.flags -= 1;
      else comment.flags += 1;
      await props.db
        .collection('Question')
        .updateOne(
          { _id: questionID, 'comments._id': commentID },
          { $set: { 'comments.$.flags': comment.flags } }
        );
      if (state.studentAdkData!.flaggedComments.some((id: string) => id === commentID.toString()))
        state.studentAdkData!.flaggedComments = removeId(
          state.studentAdkData!.flaggedComments,
          commentID
        );
      else state.studentAdkData!.flaggedComments.push(commentID.toString());
      state.studentDocument!.update();
      fetchQuestions();
    };

    const likeComment = async (questionID: ObjectId, commentID: ObjectId) => {
      const question = await props.db.collection('Question').findOne({ _id: questionID });
      const commentIndex = getCommentIndex(question, commentID);
      const comment = question.comments[commentIndex];
      if (!commentIsLiked(state.studentAdkData!, comment)) comment.likes += 1;
      else comment.likes -= 1;
      await props.db
        .collection('Question')
        .updateOne(
          { _id: questionID, 'comments._id': commentID },
          { $set: { 'comments.$.likes': comment.likes } }
        );
      if (state.studentAdkData!.likedComments.some((id: string) => id === commentID.toString()))
        state.studentAdkData!.likedComments = removeId(
          state.studentAdkData!.likedComments,
          commentID
        );
      else state.studentAdkData!.likedComments.push(commentID.toString());
      state.studentDocument!.update();
      fetchQuestions();
    };

    const postQuestion = async () => {
      if (state.questionInput.length > 0) {
        const question = {
          author: props.userDoc?.data._id,
          programId: props.value!.data._id,
          text: state.questionInput,
          comments: [],
          likes: 0,
          dislikes: 0,
          flags: 0
        };
        const { insertedId } = await props.db.collection('Question').insertOne(question);
        fetchQuestions();
        state.teamAdkData?.questionsAsked.push(insertedId);
        state.teamDocument!.update();
        state.questionInput = '';
      }
    };

    const postComment = async (questionID: ObjectId, comment: Record<string, any>) => {
      await props.db
        .collection('Question')
        .updateOne({ _id: questionID }, { $push: { comments: comment } });
      fetchQuestions();
    };

    return {
      questionsRemaining,
      ...toRefs(state),
      scrollUp,
      numPages,
      filterOptions,
      postQuestion,
      timeline,
      likeQuestion,
      dislikeQuestion,
      bookmarkQuestion,
      flagQuestion,
      postComment,
      likeComment,
      flagComment,
      questionIsFlagged
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
  // left: calc(18px - 1px) !important;
}

.v-timeline-item__divider {
  // min-width: 38px !important;
}

.v-timeline-item__body {
  // max-width: 100% !important;
}

// .v-timeline--dense .v-timeline-item__body {
//   max-width: 100% !important;
// }
.forum__question {
  width: 100%;
}
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
    width: 100%;
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
    // margin-bottom: 75px;
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
