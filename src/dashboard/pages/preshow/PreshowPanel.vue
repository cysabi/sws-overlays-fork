<template>
    <ipl-space class="m-b-8">
        <ipl-input
            v-model="topic"
            name="topic"
            label="Topic"
            class="m-b-8"
        />
        <ipl-button
            :color="topicChanged ? 'red' : 'blue'"
            label="Update"
            class="m-t-8"
            @click="updateTopic"
        />
    </ipl-space>
    <ipl-space>
        <div class="title">Large video display</div>
        <ipl-toggle
            :model-value="preshowStore.preshowLargeVideoVisible"
            @update:model-value="preshowStore.setPreshowLargeVideoVisible($event)"
        />
        <ipl-input
            v-model="largeVideoUrl"
            label="Video URL"
            name="largeVideoUrl"
            class="m-t-8"
        />
        <ipl-button
            :color="videoUrlChanged ? 'red' : 'blue'"
            label="Update"
            class="m-t-8"
            @click="updateVideoUrl"
        />
    </ipl-space>
</template>

<script setup lang="ts">
import { IplButton, IplInput, IplSpace, IplToggle } from '@iplsplatoon/vue-components';
import { usePreshowStore } from 'browser-shared/stores/PreshowStore';
import { computed, ref, watch } from 'vue';

const preshowStore = usePreshowStore();

const topic = ref('');
watch(() => preshowStore.preshowTopic, newValue => {
    topic.value = newValue;
}, { immediate: true });
const largeVideoUrl = ref('');
watch(() => preshowStore.preshowLargeVideoUrl, newValue => {
    largeVideoUrl.value = newValue;
}, { immediate: true });

function updateTopic() {
    preshowStore.setPreshowTopic(topic.value);
}
function updateVideoUrl() {
    preshowStore.setPreshowLargeVideoUrl(largeVideoUrl.value);
}

const topicChanged = computed(() => preshowStore.preshowTopic !== topic.value);
const videoUrlChanged = computed(() => preshowStore.preshowLargeVideoUrl !== largeVideoUrl.value);
</script>
