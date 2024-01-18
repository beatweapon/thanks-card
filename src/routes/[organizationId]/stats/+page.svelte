<script>
	import { stats } from '$lib/stores/memberStats';

	$: lastSentMessageAt = $stats?.lastSentMessageAt
		? $stats?.lastSentMessageAt.toDate().toLocaleString('ja-JP')
		: 'なし';

	$: lastReceivedMessageAt = $stats?.lastReceivedMessageAt
		? $stats?.lastReceivedMessageAt.toDate().toLocaleString('ja-JP')
		: 'なし';
</script>

<ul>
	<li>所持ポイント: {$stats?.point || 0}</li>
	<li>贈ったカード数: {$stats?.sentMessage || 0}</li>
	<li>受け取ったカード数: {$stats?.receivedMessage || 0}</li>
	<li>削除したカード数: {$stats?.deletedMessage || 0}</li>
	<li>贈ったリアクション: {$stats?.sentReaction || 0}</li>
	<li>貰ったリアクション: {$stats?.receivedReaction || 0}</li>
	<li>最後にカードを贈った日時: {lastSentMessageAt}</li>
	<li>
		最後にカードを貰った日時: {lastReceivedMessageAt}
	</li>
</ul>
