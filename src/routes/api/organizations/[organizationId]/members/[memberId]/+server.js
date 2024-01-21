import { PRIVATE_STORAGE_BUCKET } from '$env/static/private';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';
import { achieve } from '$lib/server/organizationMemberAchievement';

export const PUT = async ({ request, params }) => {
  const db = getFirestore();

  const { organizationId, memberId } = params;
  const formData = await request.formData();

  const name = formData.get('name');
  const frame = formData.get('frame');
  const iconImageFile = /** @type {File} */ (formData.get('iconImageFile'));

  let picture = '';

  if (iconImageFile) {
    const storage = getStorage();
    const bucket = storage.bucket(PRIVATE_STORAGE_BUCKET);
    const file = bucket.file(`images/${organizationId}/users/${memberId}/icon`);

    const fileBuffer = await iconImageFile.arrayBuffer();
    await file.save(Buffer.from(fileBuffer), {
      metadata: {
        contentType: iconImageFile.type,
      },
    });

    picture = await getDownloadURL(file);
    picture += `?timestamp=${Date.now()}`;
  }

  const param = {
    ...(name && { name }),
    ...(frame && { frame }),
    ...(picture && { picture }),
  };

  const docRef = db.doc(`organizations/${organizationId}/members/${memberId}`);
  await docRef.update(param);

  await achieve(organizationId, memberId, 'updateProfile');

  return new Response();
};
