<template>
  <v-expansion-panel-content>
    <v-timeline dense>
      <v-timeline-item fill-dot class="white--text mb-6" color="#f79961">
        <template v-slot:icon>
          <v-avatar size="34"
            ><img
              src="https://media-exp1.licdn.com/dms/image/C5603AQEq9BL9NuOBAQ/profile-displayphoto-shrink_400_400/0/1603066536315?e=1616025600&v=beta&t=e0AFzZqk1mQEHUMcwpSSb1_egDOI5sAJ-wUK0VY3hmc"
          /></v-avatar>
        </template>
        <v-text-field
          v-model="commentInput"
          class="module-default__answer-text"
          hide-details
          flat
          placeholder="Answer or comment . . . "
          solo
          @keydown.enter="comment"
        >
          <template v-slot:append>
            <v-btn small class="mx-0" outlined depressed @click="comment">Post</v-btn>
          </template>
        </v-text-field>
      </v-timeline-item>
      <v-slide-x-transition group>
        <v-timeline-item
          v-for="comment in visibleComments"
          :key="comment.id"
          class="mb-3"
          color="#f79961"
          fill-dot
          small
        >
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
                @click="$emit('likeComment', question.id, comment.id)"
                ><v-icon class="module__trash" small :color="comment.liked ? 'red' : 'grey'"
                  >mdi-heart</v-icon
                ></v-btn
              >
              <!-- ANYONE CAN FLAG COMMENTS -->
              <v-btn
                small
                class="module__trash"
                icon
                @click="$emit('flagComment', question.id, comment.id)"
                ><v-icon
                  small
                  :color="comment.flagged ? 'red' : 'grey lighten-2'"
                  class="module__trash"
                  >mdi-flag</v-icon
                ></v-btn
              >
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>
    </v-timeline>
    <div v-if="numComments <= question.events.length" class="text-center">
      <v-btn small depressed outlined @click="numComments += 5">Load more</v-btn>
    </div>
  </v-expansion-panel-content>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import { Question } from '../types';

export default defineComponent({
  name: 'CommentSection',
  props: {
    question: {
      required: true,
      type: Object as PropType<Question>
    }
  },
  setup(props) {
    const commentInput = ref('');
    const numComments = ref(5);

    const visibleComments = computed(() =>
      props.question.events.slice().reverse().slice(0, numComments.value)
    );

    const comment = () => {
      if (commentInput.value.length > 0) {
        const time = new Date().toTimeString();
        props.question.events.push({
          id: Math.random() * 20,
          text: commentInput.value,
          time: time.replace(/:\d{2}\sGMT-\d{4}\s\((.*)\)/, (match, contents, offset) => {
            return ` ${contents
              .split(' ')
              .map(v => v.charAt(0))
              .join('')}`;
          }),
          liked: false,
          likes: 0,
          flagged: false,
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
