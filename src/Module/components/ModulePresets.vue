<template>
  <v-container class="module-outcomes">
    <div class="module-outcomes__container">
      <!-- <v-divider class="presets__divider"></v-divider> -->
      <!-- <div class="presets__section-title">General</div> -->
      <v-select
        v-model="adkData.maxQuestions"
        :items="maxQuestionsItems"
        outlined
        rounded
        x-large
        label="Maximum questions each team can ask"
      ></v-select>
      <div class="text-center">
        <v-btn class="mt-8" rounded x-large outlined depressed :loading="loading" @click="process()">Save</v-btn>
      </div>
      <v-alert
        v-if="success || error"
        dense
        class="mt-3 white--text presets__alert"
        :color="success ? 'green' : 'red'"
        >{{ message }}</v-alert
      >
      <!-- <v-divider class="presets__divider"></v-divider>
      <div class="presets__section-title">Instructions</div>
      <Instruct v-model="setupInstructions" />
      <v-divider class="presets__divider"></v-divider>
      <div class="presets__section-title">Defaults</div>

      <v-select
        disabled
        :items="group"
        label="What activity group does this belong to?"
        outlined
      ></v-select>
      <v-select
        disabled
        :items="required"
        label="Is this activity required for participants to complete?"
        outlined
      ></v-select> -->

      <!-- <v-select
        :items="lockOrder"
        label="Lock activity group and placement order?"
        outlined
      ></v-select> -->
      <!-- <v-select disabled :items="deliverable" label="Is this a deliverable?" outlined></v-select> -->
      <!-- <v-select
        :items="accessibility"
        label="Make this activity accessible to participants anytime?"
        outlined
      ></v-select> -->
      <!-- <v-select
        disabled
        :items="endEarly"
        label="Allow participants to end program early after completion of this activity?"
        outlined
      ></v-select> -->
      <!-- POST-ACTIVITY REFLECTION -->
      <!-- <v-text-field
        label="Post-Activity Reflection"
        placeholder="Now that you know the scope of the project, provide a summary of your interpretation."
        outlined
        hide-details
      ></v-text-field>
      <div class="presets__reflection">
        <v-btn class="presets__reflection-buttons" small depressed outlined>Save</v-btn>
        <v-btn class="presets__reflection-buttons" small depressed outlined>Preview</v-btn>
      </div> -->
      <!-- <v-divider class="presets__divider"></v-divider> -->
      <!-- If activity is required, show button below, make tooltip show up while disabled, right now tooltip doesn't show up -->
      <!-- <div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="red" disabled v-bind="attrs" v-on="on">Delete Activity</v-btn>
          </template>
          <span>Required activities cannot be deleted</span>
        </v-tooltip>
      </div> -->
      <!-- Delete break when the two delete buttons above and below have been integrated as one solution -->
      <!-- <br /> -->
      <!-- If activity is optional, show button below -->
      <!-- <div><v-btn color="red" disabled depressed>Delete Activity</v-btn></div> -->
    </div>
  </v-container>
</template>

<script lang="ts">
import { reactive, ref, toRefs, PropType } from '@vue/composition-api';
import { loading, getModAdk, getModMongoDoc } from 'pcv4lib/src';
// import Instruct from './ModuleInstruct.vue';
import { MongoDoc } from '../types';

export default {
  name: 'ModulePresets',
  components: {
    // Instruct
  },
  props: {
    value: {
      required: true,
      type: Object as PropType<MongoDoc>
    }
  },
  setup(props, ctx) {
    const { adkData } = getModAdk(props, ctx.emit, 'forum');
    const programDoc = getModMongoDoc(props, ctx.emit);
    const maxQuestionsItems = [...Array(10).keys()].map(i => i + 1);

    const presets = reactive({
      group: ['Setup', 'Project', 'Screening', 'Internship'],
      required: ['Creator requires this activity', 'Yes', 'No'],
      lockOrder: ['Creator locked activity group and placement order', 'Yes', 'No'],
      deliverable: ['Yes', 'No'],
      notifications: ['Creator turned on by default', 'Turn on', 'Turn off'],
      accessibility: [
        'Creator has turned off accessibility anytime',
        'Creator has turned on accessibility anytime',
        'Yes',
        'No'
      ],
      endEarly: [
        'Creator has not allowed participants to end early after this activity',
        'Creator has allow end early option only at preset order placement',
        'Yes',
        'No'
      ]
    });

    // const initInteractPresets = {
    //   defaultActivity: {
    //     group: 'Project',
    //     requiredActivity: 'No',
    //     deliverableActivity: 'No',
    //     endEarlyActivity: 'No',
    //     required: false
    //   }
    // };

    const setupInstructions = ref({
      description: '',
      instructions: ['', '', '']
    });

    return {
      adkData,
      ...toRefs(presets),
      ...loading(programDoc.value.update, 'Success', 'Try again later'),
      setupInstructions,
      maxQuestionsItems
    };
  }
};
</script>

<style lang="scss">
.presets {
  &__reflection-buttons {
    margin-right: 10px;
    margin-top: 10px;
  }

  &__reflection {
    // margin-left: auto;
  }

  &__divider {
    margin-top: 40px;
    margin-bottom: 40px;
  }

  &__section-title {
    color: #000000;
    font-size: 25px;
    font-weight: 800;
    text-align: center;
    margin-bottom: 40px;
  }

  &__nopresets {
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
}
</style>
