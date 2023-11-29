import { PRIVATE_STORAGE_BUCKET } from '$env/static/private';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

export const PUT = async ({ request, params }) => {
	const db = getFirestore();

	const { organizationId, memberId } = params;
	const formData = await request.formData();

	const name = formData.get('name');
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
	}

	const param = {
		...(name && { name }),
		...(picture && { picture }),
	};

	const docRef = db.doc(`organizations/${organizationId}/members/${memberId}`);
	docRef.update(param);

	return new Response();
};
