<template>
  <div>
    <a @click.prevent="$router.push({ name: 'media-view', params: { id: result.id } })" style="cursor:pointer;">
      <div class="list-entry">
        <img class="entry-image no-select" :src="result.img.large">
        <span class="entry-title">{{ result.title.userPreferred }}</span>
        <span class="entry-icons">
          <i :class="'material-icons entry-icon ' + (!result.mediaListEntry || result.mediaListEntry.status === 'PLANNING' ? 'enabled' : '')"
             v-if="result.status !== 'NOT_YET_RELEASED'"
             :title="!result.mediaListEntry || result.mediaListEntry.status === 'PLANNING' ? 'Add to current' : 'Already listed'"
             @click.prevent="handleCurrent(result)"
             ref="current"
          >library_add</i>

          <i :class="'material-icons entry-icon ' + (!result.mediaListEntry ? 'enabled' : '')"
             :title="!result.mediaListEntry ? 'Add to planning' : 'Already listed'"
             @click.prevent="handlePlanning(result)"
             ref="planning"
          >library_books</i>

          <a
             title="Detailed view"
             target="_blank"
             @click.prevent="openUrl(result.url)"
          >
            <i class="material-icons entry-icon enabled">open_in_new</i>
          </a>
        </span>
      </div>
    </a>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import updateViewingStatus from "../../../assets/graphql/update_viewing_status.graphql";

  export default {
    name: "SearchResults",
    props: [
      "result"
    ],
    methods: {
      openUrl(url) {
        window.open(url, "_blank");
      },
      handlePlanning(media) {
        if (!this.$refs.planning.classList.contains("enabled"))
          return;

        const _self = this;
        this.$browser.storage.local.get({ access_token: ""}).then(value => {
          if (value.access_token === "")
            return;
          queryAL(updateViewingStatus, { mediaId: media.id, status: "PLANNING" }, value.access_token).then(res => {
            setListed(_self.$refs.planning);
          });
        });
      },
      handleCurrent(media) {
        if (!this.$refs.current.classList.contains("enabled"))
          return;

        const _self = this;
        this.$browser.storage.local.get({ access_token: ""}).then(value => {
          if (value.access_token === "")
            return;
          queryAL(updateViewingStatus, { mediaId: media.id, status: "CURRENT" }, value.access_token).then(res => {
            setListed(_self.$refs.current);
            setListed(_self.$refs.planning);
          });
        });
      }
    }
  }

  function setListed(element) {
    element.title = "Already listed";
    element.classList.remove("enabled");
  }
</script>

<style scoped>
  .list-entry {
    color: rgb(var(--color-text));
    background-color: rgb(var(--color-foreground-blue-dark));
    display: flex;
    border-radius: 5px;
    height: 35px;
    margin-bottom: 5px;
    transition: .3s;
  }

  .list-entry:hover {
    color: rgb(var(--color-accent));
  }

  .entry-image {
    width: 25px;
    height: inherit;
    object-fit: cover;
    padding-right: 5px;
    border-radius: 5px;
  }

  .entry-title {
    display: flex;
    margin-top: auto;
    margin-bottom: auto;
  }

  .entry-icons {
    display: flex;
    margin-left: auto;
    margin-top: auto;
    margin-bottom: auto;
    padding-right: 5px;
  }

  .entry-icon {
    color: rgb(var(--color-red));
    font-size: 16px;
    cursor: not-allowed;
    transition: .3s;
  }

  .enabled {
    color: rgb(var(--color-text));
    cursor: pointer;
  }

  .enabled:hover {
    color: rgb(var(--color-green));
    font-size: 16px;
  }

  .detail {
    padding-left: 5px;
  }

  .detail:after {
    content: '\2807';
  }
</style>
