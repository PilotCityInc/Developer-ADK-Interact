<template>
  <v-timeline-item class="mb-3" color="#f79961" fill-dot small>
    <template v-slot:icon>
      <v-avatar size="20"
        ><img
          src="https://media-exp1.licdn.com/dms/image/C5603AQEq9BL9NuOBAQ/profile-displayphoto-shrink_400_400/0/1603066536315?e=1616025600&v=beta&t=e0AFzZqk1mQEHUMcwpSSb1_egDOI5sAJ-wUK0VY3hmc"
      /></v-avatar>
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
          class="module__trash"
          small
          icon
          @click="$emit('likeComment', questionId, comment.id)"
          ><v-icon class="module__trash" small :color="comment.liked ? 'red' : 'grey'"
            >mdi-heart</v-icon
          ></v-btn
        >
        <!-- ANYONE CAN FLAG COMMENTS -->
        <v-btn
          small
          class="module__trash"
          icon
          @click="$emit('flagComment', questionId, comment.id)"
          ><v-icon small :color="comment.flagged ? 'red' : 'grey lighten-2'" class="module__trash"
            >mdi-flag</v-icon
          ></v-btn
        >
      </v-col>
    </v-row>
  </v-timeline-item>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import { Comment } from '../types';

export default defineComponent({
  name: 'Comment',
  props: {
    questionId: {
      required: true,
      type: Number
    },
    comment: {
      required: true,
      type: Object as PropType<Comment>
    }
  }
});
</script>
