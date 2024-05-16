import { writable } from 'svelte/store';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebase_client';

/**
 * メンバーグループの情報
 * @type {import('svelte/store').Writable<import('src/types/organization/memberGroup').MemberGroup[]>}
 */
export const memberGroups = writable([]);

/** @type {import("firebase/firestore").Unsubscribe | undefined} */
let unsubscribe;

/**
 * メンバーグループを監視、更新する
 * @param {string} organizationId
 */
export const watchMemberGroupCollection = (organizationId) => {
  if (unsubscribe) {
    return;
  }

  const collectionRef = collection(db, `organizations/${organizationId}/memberGroup/`);

  unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const newGroupe = /** @type {import('src/types/organization/memberGroup').MemberGroup} */ (
          change.doc.data()
        );
        newGroupe.id = change.doc.id;
        memberGroups.update((arr) => [newGroupe, ...arr]);
      }
      if (change.type === 'modified') {
        memberGroups.update((arr) => {
          const index = arr.findIndex((a) => a.id === change.doc.id);
          const newGroupe =
            /** @type {import('src/types/organization/memberGroup').MemberGroup} */ (
              change.doc.data()
            );

          arr[index] = newGroupe;
          return arr;
        });
      }
      if (change.type === 'removed') {
        memberGroups.update((arr) => {
          const index = arr.findIndex((a) => a.id === change.doc.id);
          const newArray = [...arr.slice(0, index), ...arr.slice(index + 1)];
          return newArray;
        });
      }
    });
  });
};
