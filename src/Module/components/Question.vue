<template>
  <v-expansion-panels v-model="openPanels" flat readonly class="mb-8">
    <v-expansion-panel>
      <v-expansion-panel-header hide-actions disabled>
        <div class="module-default__question-header">{{ question.text }}</div>
      </v-expansion-panel-header>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header hide-actions>
        <div>
          <v-btn small rounded outlined depressed @click="toggleComments"
            >{{ question.events.length }} Replies</v-btn
          >

          <v-btn
            class="ml-2 mr-1"
            small
            depressed
            rounded
            color="white"
            @click="$emit('likeQuestion', question.id)"
            ><v-icon left small :color="question.liked ? 'green' : 'grey'">mdi-thumb-up</v-icon>
            {{ question.likes }}
          </v-btn>
          <v-btn
            class="ml-2 mr-1"
            small
            depressed
            rounded
            color="white"
            @click="$emit('dislikeQuestion', question.id)"
            ><v-icon left small :color="question.disliked ? 'red' : 'grey'">mdi-thumb-down</v-icon>
            {{ question.dislikes }}
          </v-btn>

          <v-btn class="ml-3 mr-2" small icon @click="$emit('flagQuestion', question.id)"
            ><v-icon small :color="question.flagged ? 'red' : 'grey lighten-2'">mdi-flag</v-icon>
          </v-btn>
          <v-btn class="ml-6 mr-3" small icon @click="$emit('bookmarkQuestion', question.id)"
            ><v-icon small :color="question.bookmarked ? 'black' : 'grey lighten-2'"
              >mdi-bookmark</v-icon
            >
          </v-btn>
        </div>
      </v-expansion-panel-header>
      <CommentSection :question="question" v-on="$listeners" />
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import CommentSection from './CommentSection.vue';
import { Question } from '../types';

export default defineComponent({
  name: 'Question',
  components: { CommentSection },
  props: {
    question: {
      required: true,
      type: Object as PropType<Question>
    }
  },
  setup(props) {
    const openPanels = ref<number | null>(null);

    const toggleComments = () => {
      if (openPanels.value) openPanels.value = null;
      else openPanels.value = 1;
    };

    return {
      openPanels,
      toggleComments
    };
  }
});
</script>
