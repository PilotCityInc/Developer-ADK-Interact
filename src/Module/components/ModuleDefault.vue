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
        <v-text-field rounded class="mr-4" outlined placeholder="You have 2 questions remaining">
        </v-text-field>
        <v-btn color="#f79961" rounded dark depressed x-large>Ask Question</v-btn>
      </div>
      <div class="module-default__row">
        <v-btn class="mr-1 ml-2" color="#f79961" dark depressed small
          ><v-icon color="white" left>mdi-account-supervisor-circle-outline</v-icon>All</v-btn
        >
        <v-btn class="mr-1 ml-2" color="grey" outlined depressed small
          ><v-icon color="grey lighten-1" left>mdi-comment-question</v-icon>My Questions</v-btn
        >
        <v-btn class="mr-1 ml-2" color="grey" outlined depressed small
          ><v-icon color="grey lighten-1" left>mdi-bookmark</v-icon>Bookmarks</v-btn
        >
      </div>
      <div>
        <v-expansion-panels accordion flat class="mb-8">
          <v-expansion-panel>
            <v-expansion-panel-header hide-actions disabled>
              <div class="module-default__question-header">Who will get the internships?</div>
            </v-expansion-panel-header>
            <!-- <v-expansion-panel-content></v-expansion-panel-content> -->
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header hide-actions>
              <div>
                <v-btn small rounded outlined depressed>23 Replies</v-btn>

                <v-btn class="ml-2 mr-1" small depressed rounded color="white"
                  ><v-icon left small color="grey">mdi-thumb-up</v-icon> 96
                </v-btn>
                <v-btn class="ml-2 mr-1" small depressed rounded color="white"
                  ><v-icon left small color="grey">mdi-thumb-down</v-icon> 10
                </v-btn>

                <v-btn class="ml-3 mr-2" small icon
                  ><v-icon small color="grey lighten-2">mdi-flag</v-icon>
                </v-btn>
                <v-btn class="ml-6 mr-3" small icon
                  ><v-icon small color="grey lighten-2">mdi-bookmark</v-icon>
                </v-btn>
              </div>
            </v-expansion-panel-header>
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
                    v-model="input"
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
                    v-for="event in timeline"
                    :key="event.id"
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
                      <v-col
                        class="module-default__answer-text"
                        cols="9"
                        v-text="event.text"
                      ></v-col>
                      <!-- <v-col class="text-right" cols="3" v-text="event.time"></v-col> -->
                      <v-col class="text-right" cols="3">
                        <!-- POSTER, STUDENT PARTICIPANT OR ORGANIZER CAN DELETE POSTS -->
                        <!-- <v-btn small class="module__trash" icon
                          ><v-icon small color="grey" class="module__trash"
                            >mdi-trash-can-outline</v-icon
                          ></v-btn
                        > -->

                        <v-btn class="module__trash" small icon
                          ><v-icon class="module__trash" small color="grey"
                            >mdi-heart</v-icon
                          ></v-btn
                        >
                        <!-- ANYONE CAN FLAG COMMENTS -->
                        <v-btn small class="module__trash" icon
                          ><v-icon small color="grey lighten-2" class="module__trash"
                            >mdi-flag</v-icon
                          ></v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-timeline-item>
                </v-slide-x-transition>
              </v-timeline>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels accordion flat class="mb-8">
          <v-expansion-panel>
            <v-expansion-panel-header hide-actions disabled>
              <div class="module-default__question-header">
                Does anyone know how the human-centered design process works?
              </div>
            </v-expansion-panel-header>
            <!-- <v-expansion-panel-content></v-expansion-panel-content> -->
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header hide-actions>
              <div>
                <v-btn small rounded outlined depressed>18 Replies</v-btn>
                <v-btn class="ml-2 mr-1" small depressed rounded color="white"
                  ><v-icon left small color="grey">mdi-thumb-up</v-icon> 42
                </v-btn>
                <v-btn class="ml-1 mr-2" small depressed rounded color="white"
                  ><v-icon left small color="grey">mdi-thumb-down</v-icon> 5
                </v-btn>
                <v-btn class="ml-3 mr-2" small icon
                  ><v-icon small color="grey lighten-2">mdi-flag</v-icon>
                </v-btn>
                <v-btn class="ml-6 mr-3" small icon
                  ><v-icon small color="grey lighten-2">mdi-bookmark</v-icon>
                </v-btn>
              </div>
            </v-expansion-panel-header>
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
                    v-model="input"
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
                    v-for="event in timeline"
                    :key="event.id"
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
                      <v-col
                        class="module-default__answer-text"
                        cols="9"
                        v-text="event.text"
                      ></v-col>
                      <!-- <v-col class="text-right" cols="3" v-text="event.time"></v-col> -->
                      <v-col class="text-right" cols="3">
                        <!-- POSTER, STUDENT PARTICIPANT OR ORGANIZER CAN DELETE POSTS -->
                        <!-- <v-btn small class="module__trash" icon
                          ><v-icon small color="grey" class="module__trash"
                            >mdi-trash-can-outline</v-icon
                          ></v-btn
                        > -->

                        <v-btn class="module__trash" small icon
                          ><v-icon class="module__trash" small color="grey"
                            >mdi-thumb-up</v-icon
                          ></v-btn
                        >
                        <!-- ANYONE CAN FLAG COMMENTS -->
                        <v-btn small class="module__trash" icon
                          ><v-icon small color="grey lighten-2" class="module__trash"
                            >mdi-flag</v-icon
                          ></v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-timeline-item>
                </v-slide-x-transition>
              </v-timeline>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels accordion flat class="mb-8">
          <v-expansion-panel>
            <v-expansion-panel-header hide-actions disabled>
              <div class="module-default__question-header">Why are there so many posts?</div>
            </v-expansion-panel-header>
            <!-- <v-expansion-panel-content></v-expansion-panel-content> -->
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header hide-actions>
              <div>
                <v-btn small rounded outlined depressed>1 Replies</v-btn>
                <v-btn class="ml-2 mr-1" small depressed rounded color="white"
                  ><v-icon left small color="grey">mdi-thumb-up</v-icon> 10
                </v-btn>
                <v-btn class="ml-1 mr-2" small depressed rounded color="white"
                  ><v-icon left small color="grey">mdi-thumb-down</v-icon> 2
                </v-btn>
                <v-btn class="ml-3 mr-2" small icon
                  ><v-icon small color="grey lighten-2">mdi-flag</v-icon>
                </v-btn>
                <v-btn class="ml-6 mr-3" small icon
                  ><v-icon small color="grey lighten-2">mdi-bookmark</v-icon>
                </v-btn>
              </div>
            </v-expansion-panel-header>
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
                    v-model="input"
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
                    v-for="event in timeline"
                    :key="event.id"
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
                      <v-col
                        class="module-default__answer-text"
                        cols="9"
                        v-text="event.text"
                      ></v-col>
                      <!-- <v-col class="text-right" cols="3" v-text="event.time"></v-col> -->
                      <v-col class="text-right" cols="3">
                        <!-- POSTER, STUDENT PARTICIPANT OR ORGANIZER CAN DELETE POSTS -->
                        <!-- <v-btn small class="module__trash" icon
                          ><v-icon small color="grey" class="module__trash"
                            >mdi-trash-can-outline</v-icon
                          ></v-btn
                        > -->

                        <v-btn class="module__trash" small icon
                          ><v-icon class="module__trash" small color="grey"
                            >mdi-thumb-up</v-icon
                          ></v-btn
                        >
                        <!-- ANYONE CAN FLAG COMMENTS -->
                        <v-btn small class="module__trash" icon
                          ><v-icon small color="grey lighten-2" class="module__trash"
                            >mdi-flag</v-icon
                          ></v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-timeline-item>
                </v-slide-x-transition>
              </v-timeline>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div class="text-center mt-12">
          <v-pagination v-model="page" :length="4" circle></v-pagination>
        </div>
      </div>
      <!-- DESIGN YOUR ACTIVITY HERE / COMMENT OUT WHEN YOU'VE STARTED DESIGNING -->
      <!-- <div class="module-default__none">Design your activity here</div> -->
    </div>
  </v-container>
</template>

<script lang="ts">
import { ref } from '@vue/composition-api';
import Instruct from './ModuleInstruct.vue';

export default {
  name: 'ModuleDefault',
  components: {
    Instruct
  },
  apollo: {},
  // data() {
  //   const setupInstructions = ref({
  //     description: '',
  //     instructions: ['', '', '']
  //   });
  //   const showInstructions = ref(true);
  //   return {
  //     setupInstructions,
  //     showInstructions
  //   };
  // },
  data: () => ({
    events: [],
    input: null,
    nonce: 0
  }),
  computed: {
    timeline() {
      return this.events.slice().reverse();
    }
  },

  methods: {
    comment() {
      const time = new Date().toTimeString();
      this.events.push({
        id: this.nonce,
        text: this.input,
        time: time.replace(/:\d{2}\sGMT-\d{4}\s\((.*)\)/, (match, contents, offset) => {
          return ` ${contents
            .split(' ')
            .map(v => v.charAt(0))
            .join('')}`;
        })
      });
      this.input = null;
    }
  }
};
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
