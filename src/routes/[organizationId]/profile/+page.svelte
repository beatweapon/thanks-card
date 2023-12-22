<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FloatButton from 'src/lib/components/design/FloatButton.svelte';
	import PlainButton from 'src/lib/components/design/PlainButton.svelte';
	export let data;

	/** @type {boolean} */
	let processing = false;

	/** @type {File} */
	let iconImageFile;

	const me = data.organization.members.find((m) => m.id === data.currentUser.uid);

	let src = me?.picture || data.currentUser.picture;

	/**
	 * ドロップエリアでのファイル選択を処理する関数
	 * @param {DragEvent} event - ドラッグイベント
	 */
	function handleDrop(event) {
		event.preventDefault();
		const dt = event.dataTransfer;

		if (!dt) return;

		const droppedFiles = dt.files;

		if (droppedFiles[0].type.startsWith('image/')) {
			iconImageFile = droppedFiles[0];

			iconPreview();
		}
	}

	/**
	 * ドラッグオーバーイベントを処理する関数
	 * @param {DragEvent} event - ドラッグイベント
	 */
	const handleDragOver = (event) => event.preventDefault();

	/**
	 * @param {Event} event
	 */
	const handleFileInput = (event) => {
		const target = /** @type {HTMLInputElement} */ (event.target);
		const files = target.files;

		if (files) {
			iconImageFile = files[0];

			iconPreview();
		}
	};

	const iconPreview = () => {
		const reader = new FileReader();
		reader.onload = (e) => {
			src = /** @type {string} */ (e?.target?.result); // 画像のソースをセット
		};
		reader.readAsDataURL(iconImageFile); // ファイルを読み込んで画像ソースに変換
	};

	let name = data.organization.members.find((m) => m.id === data.currentUser.uid)?.name;

	/** @type {boolean} */
	$: disabled = !name || processing;

	const changeName = async () => {
		if (disabled) return;

		processing = true;

		const memberId = data.currentUser.uid;

		const formData = new FormData();
		if (iconImageFile) {
			formData.append('iconImageFile', iconImageFile);
		}

		if (name) {
			formData.append('name', name);
		}

		await fetch(`${base}/api/organizations/${$page.params.organizationId}/members/${memberId}`, {
			method: 'PUT',
			body: formData,
		}).finally(() => {
			processing = false;
		});

		goToOrganizationPage();
	};

	const goToOrganizationPage = () => {
		goto(removeLastPathFromURL($page.url.toString()));
	};

	/**
	 * @param {string} url
	 */
	const removeLastPathFromURL = (url) => {
		// 正規表現でURLから最後のスラッシュとその後の文字列を削除
		return url.replace(/\/[^/]+$/, '');
	};
</script>

<div class="center">
	<div>
		<label
			on:drop={handleDrop}
			on:dragover={handleDragOver}
			role="region"
			aria-label="file drop area"
			class="file_drop_area icon_container"
		>
			<img {src} alt="userIcon" />
			<div class="overlay" />
			<span class="edit_icon">
				<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
					<path
						fill="#ffffff"
						fill-rule="evenodd"
						d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm14 .069a1 1 0 01-1 1h-2.931V14a1 1 0 11-2 0v-2.931H6a1 1 0 110-2h3.069V6a1 1 0 112 0v3.069H14a1 1 0 011 1z"
					/>
				</svg>
			</span>

			<input class="file_input" type="file" accept="image/*" on:change={handleFileInput} />
		</label>
		<label>
			あなたの名前: <input bind:value={name} />
		</label>
		<FloatButton on:click={changeName} {disabled}>変更する</FloatButton>
	</div>
	<PlainButton on:click={goToOrganizationPage}>戻る</PlainButton>
</div>

<style>
	.center {
		height: calc(100dvh - 40px);
		margin: 0 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.file_drop_area {
		display: block;
		width: 20rem;
		height: 20rem;
	}

	.file_input {
		display: none;
	}

	img {
		width: 100%;
	}

	.icon_container {
		position: relative;
		cursor: pointer;
		border: 0.3rem dashed #aaa;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.icon_container:hover .overlay,
	.icon_container:hover .edit_icon {
		opacity: 1;
	}

	.edit_icon {
		width: 4rem;
		height: 4rem;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		fill: white;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
</style>
