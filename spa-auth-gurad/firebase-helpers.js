import firebase from 'firebase';
import 'firebase/firestore';

const getAdmins = () => {
  const adminList = [
    'liyangguangcn@gmail.com',  // Hard coded admins here.
  ];
  // Additional admin list saved in firestore (or any other places)
  return firebase.firestore().collection('admins').get().then(docs => {
    docs.forEach(doc => adminList.push(doc.id))  // `doc.id` is the email
    return adminList;
  });
};

const getUsers = () => {
  const userList = [];
  return firebase.firestore().collection('users').get().then(docs => {
    docs.forEach(doc => adminList.push(doc.id))  // `doc.id` is the email
    return userList;
  });
};

export const checkIsAdmin = () => {
  return getAdmins().then(admins => {
    const user = firebase.auth().currentUser;
    return admins.includes(user.email);
  });
}

export const checkIsUser = () => {
  return getUsers().then(users => {
    const user = firebase.auth().currentUser;
    return users.includes(user.email);
  });
}
