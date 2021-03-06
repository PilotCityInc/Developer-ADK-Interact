<template>
  <v-expansion-panel-content>
    <v-timeline dense>
      <v-timeline-item fill-dot class="white--text mb-6" color="#ea6764">
        <template v-slot:icon>
          <v-avatar size="34" color="grey lighten-2"
            ><v-img :src="userDoc.data.profile ? userDoc.data.profile.small : ''"
          /></v-avatar>
        </template>
        <v-text-field
          v-model="commentInput"
          :disabled="userType === 'stakeholder'"
          class="module-default__answer-text"
          hide-details
          flat
          placeholder="Answer or comment . . . "
          solo
          @keydown.enter="comment"
        >
          <template v-slot:append>
            <v-btn
              :disabled="userType === 'stakeholder'"
              small
              class="mx-0"
              outlined
              depressed
              @click="comment"
              >Post</v-btn
            >
          </template>
        </v-text-field>
      </v-timeline-item>
      <v-slide-x-transition group>
        <Comment
          v-for="comment in visibleComments"
          :key="comment._id.toString()"
          :student-adk-data="studentAdkData"
          :comment="comment"
          :question-id="question._id"
          :user-type="userType"
          v-on="$listeners"
        />
      </v-slide-x-transition>
    </v-timeline>
    <div v-if="numComments <= question.comments.length" class="text-center">
      <v-btn small depressed outlined @click="numComments += 5">Load more</v-btn>
    </div>
  </v-expansion-panel-content>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import { ObjectId } from 'bson';
import { MongoDoc, Question } from '../types';
import Comment from './Comment.vue';

export default defineComponent({
  components: { Comment },
  name: 'CommentSection',
  props: {
    question: {
      required: true,
      type: Object as PropType<Question>
    },
    studentAdkData: {
      required: true,
      type: Object
    },
    userType: {
      required: true,
      type: String
      // participant: '',
      // organizer: '',
      // stakeholder: ''
    },
    userDoc: {
      required: false,
      type: Object as PropType<MongoDoc>,
      default: () => {}
    }
  },
  setup(props, ctx) {
    const commentInput = ref('');
    const numComments = ref(5);

    const visibleComments = computed(() => {
      const comments = props.question.comments.slice();
      comments.sort((a, b) => b.likes - a.likes);
      return comments.slice(0, numComments.value);
    });

    const comment = () => {
      if (commentInput.value.length > 0) {
        const time = new Date().toTimeString();
        ctx.emit('postComment', props.question._id, {
          _id: new ObjectId(),
          text: commentInput.value,
          time: time.replace(/:\d{2}\sGMT-\d{4}\s\((.*)\)/, (match, contents, offset) => {
            return ` ${contents
              .split(' ')
              .map(v => v.charAt(0))
              .join('')}`;
          }),
          avatar: props.userDoc.data.profile ? props.userDoc.data.profile.small : '',
          likes: 0,
          flags: 0
        });
        commentInput.value = '';
      }
    };

    return {
      commentInput,
      numComments,
      visibleComments,
      comment
    };
  }
});
</script>
