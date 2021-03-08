<template>
  <v-app>
    <Module
      v-model="programDocStub"
      :db="db"
      :team-doc="teamDoc"
      :student-doc="studentDoc"
      @inputTeamDoc="teamDoc = $event"
      @inputStudentDoc="studentDoc = $event"
    />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';
import { Db } from 'mongodb';
import { ObjectId } from 'bson';
import Module from './Module/Module.vue';
import { MongoDoc } from './Module/types';

const dummyQuestions = new Array(42).fill().map((e, i) => {
  return {
    _id: new ObjectId(i),
    author: new ObjectId(2),
    text: `question ${i}?`,
    comments: [
      {
        text: 'a comment',
        _id: new ObjectId(1),
        time: 'test',
        likes: 0,
        flags: 0
      }
    ],
    likes: 0,
    dislikes: 0,
    flags: 0
  };
});

[...new Array(20)].map((_, i) => {
  dummyQuestions[41].comments.push({
    text: `comment ${i}`,
    _id: new ObjectId(i),
    time: 'test',
    likes: 0,
    flags: 0
  });
  return 'done';
});

export default defineComponent({
  name: 'App',
  components: {
    Module
  },
  setup() {
    const questions = ref(dummyQuestions);
    const db: Db = ({
      collection(name) {
        return {
          find(query) {
            return {
              toArray() {
                return new Promise((resolve, reject) => resolve(questions.value));
              }
            };
          },
          findOne({ _id }) {
            return new Promise((resolve, reject) =>
              resolve(questions.value.filter(obj => obj._id.equals(_id))[0])
            );
          },
          insertOne(doc) {
            const _id = new ObjectId(Math.floor(Math.random() * 100 + 42));
            questions.value.push({ _id, ...doc });
            return new Promise((resolve, reject) => resolve({ insertedId: _id }));
          },
          updateOne({ _id }, query) {
            return new Promise((resolve, reject) => {
              console.log(_id);
              const question = questions.value.filter(obj => obj._id.equals(_id))[0];
              // update
              if (query.$push) question.comments.push(query.$push.comments);
              resolve(true);
            });
          },
          deleteOne({ _id }) {
            return new Promise((resolve, reject) => {
              questions.value = questions.value.filter(obj => !obj._id.equals(_id));
              resolve(true);
            });
          }
        };
      }
    } as unknown) as Db;

    const programDocStub: Ref<MongoDoc> = ref({
      data: {
        adks: []
      },
      update: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
            // reject(new Error('REJECTED'));
          }, 3000);
        });
      },
      changeStream: {}
    });
    const myTeamOwner = new ObjectId(3);
    const teamID = new ObjectId(1);
    const teamDoc: Ref<MongoDoc> = ref({
      data: {
        name: 'Team Cool',
        _id: teamID,
        owner: myTeamOwner,
        password: '123',
        members: [
          {
            _id: new ObjectId(1),
            firstName: 'Team member 1',
            lastName: 'awesome'
          },
          {
            _id: myTeamOwner,
            firstName: 'kanye',
            lastName: 'east'
          },
          {
            _id: new ObjectId(4),
            firstName: 'travis',
            lastName: 'scott'
          }
        ]
      },
      update: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
            // reject(new Error('REJECTED'));
          }, 3000);
        });
      },
      changeStream: {}
    });

    const studentDoc: Ref<MongoDoc> = ref({
      data: {
        firstName: 'me',
        lastName: 'test',
        _id: new ObjectId(1),
        team: teamID,
        adks: []
      },
      update: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
            // reject(new Error('REJECTED'));
          }, 3000);
        });
      },
      changeStream: {}
    });
    return {
      programDocStub,
      studentDoc,
      teamDoc,
      db
    };
  }
});
</script>
