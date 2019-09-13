import Vue from 'vue'
import firebase from 'firebase'

import {router} from './router';
import {checkIsAdmin, checkIsUser} from './firebase-helpers';

const FIREBASE_CONFIG = {
  // Config object
};
firebase.initializeApp(FIREBASE_CONFIG);

const initVue = () => {
  new Vue({
    el: '#app',
    template: '<router-view></router-view>',
    router,
  });
}

const STAGING_SITE = 'https://example.com';

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (location.origin === STAGING_SITE) {
      checkIsAdmin().then(isAdmin => {
        if (isAdmin) initVue()
        else document.querySelector('#app').innerHTML = 'Admin only!';
      }).catch(console.error);
    }
    else {
      checkIsUser().then(isUser => {
        if (isUser) initVue()
        else document.querySelector('#app').innerHTML = 'No access permission!';
      }).catch(console.error);
    }
  } else {
    firebase.auth().getRedirectResult().then((result) => {
      if (result.user){
        return result.user;
      }
      else {
        firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
      }
    }).catch(console.error);
  }
});
