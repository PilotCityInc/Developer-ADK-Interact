<template>
  <v-timeline-item class="mb-3" color="#ea6764" fill-dot small>
    <template v-slot:icon>
      <v-avatar size="20" color="grey lighten-2"><v-img :src="comment.avatar" /></v-avatar>
    </template>
    <v-row justify="space-between">
      <v-col class="module-default__answer-text" cols="9" v-text="comment.text"></v-col>
      <!-- <v-col class="text-right" cols="3" v-text="event.time"></v-col> -->
      <v-col class="text-right" cols="3">
        <!-- POSTER, STUDENT PARTICIPANT OR ORGANIZER CAN DELETE POSTS -->
        <!-- <v-btn small class="module__trash" icon
													><v-icon small color="grey" class="module__trash"
														>mdi-trash-can-outline</v-icon
													></v-btn
												> -->

        <v-btn
          :disabled="userType === 'stakeholder'"
          class="module__trash"
          small
          icon
          @click="$emit('likeComment', questionId, comment._id)"
          ><v-icon
            :disabled="userType === 'stakeholder'"
            class="module__trash"
            small
            :color="commentIsLiked(studentAdkData, comment) ? 'red' : 'grey'"
            >mdi-heart</v-icon
          ></v-btn
        >
        <!-- ANYONE CAN FLAG COMMENTS -->
        <v-btn
          small
          class="module__trash"
          icon
          @click="$emit('flagComment', questionId, comment._id)"
          ><v-icon
            small
            :color="commentIsFlagged(studentAdkData, comment) ? 'red' : 'grey lighten-2'"
            class="module__trash"
            >mdi-flag</v-icon
          ></v-btn
        >
      </v-col>
    </v-row>
  </v-timeline-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { ObjectId } from 'bson';
import { commentIsFlagged, commentIsLiked } from './helpers';
import { Comment } from '../types';

export default defineComponent({
  name: 'Comment',
  props: {
    questionId: {
      required: true,
      type: Object as PropType<ObjectId>
    },
    comment: {
      required: true,
      type: Object as PropType<Comment>
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
    }
  },
  setup() {
    return { commentIsFlagged, commentIsLiked };
  }
});
</script>
