<script lang="ts">
export let data;
</script>

<h1>Welcome to Open Auth SvelteKit Example</h1>

{#if data.user}
	<p>Logged in as {data.user.username || data.user.email}</p>
{:else}
	<p>Not logged in</p>
{/if}
