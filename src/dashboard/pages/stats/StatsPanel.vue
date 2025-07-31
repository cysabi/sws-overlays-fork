<template>
    <ipl-space clas="m-b-8">
        <div class="title">Google Sheets Import</div>
        <ipl-input
            v-model="databaseUrl"
            label="Database URL"
            name="databaseUrl"
            class="m-t-8"
        />
        <ipl-input
            v-model="playersUrl"
            label="Player Info URL"
            name="playersUrl"
            class="m-t-8"
        />
        <ipl-button
            label="Import"
            class="m-t-8"
            @click="importData"
        />
    </ipl-space>
    <ipl-space clas="m-b-8">
        <div class="title">Player Select</div>
        <ipl-input
            v-model="playerA"
            label="Left Player"
            name="playerA"
            class="m-t-8"
        />
        <ipl-input
            v-model="playerB"
            label="Right Player"
            name="playerB"
            class="m-t-8"
        />
        <ipl-button
            label="Update"
            class="m-t-8"
            @click="updatePlayers"
        />
    </ipl-space>
    <ipl-space clas="m-b-8">
        <div class="title">Stats Select</div>
        <ipl-input
            v-model="statA"
            label="First Statistic"
            name="statA"
            class="m-t-8"
        />
        <ipl-input
            v-model="statB"
            label="Second Statistic"
            name="statB"
            class="m-t-8"
        />
        <ipl-input
            v-model="statC"
            label="Third Statistic"
            name="statC"
            class="m-t-8"
        />
        <ipl-button
            label="Update"
            class="m-t-8"
            @click="updateStatistics"
        />
    </ipl-space>
</template>

<script setup lang="ts">
import { IplButton, IplInput, IplSpace, IplToggle } from '@iplsplatoon/vue-components';
import { useStatsStore } from 'browser-shared/stores/StatsStore';
import { computed, ref, watch } from 'vue';

const statsStore = useStatsStore();

const databaseUrl = ref('');
const playersUrl = ref('');

const playerA = ref('');
const playerB = ref('');

watch(() => statsStore.statsPlayerA, newValue => { playerA.value = newValue; }, { immediate: true })
watch(() => statsStore.statsPlayerB, newValue => { playerB.value = newValue; }, { immediate: true })

const statA = ref('');
const statB = ref('');
const statC = ref('');

watch(() => statsStore.statsSelected, newValue => {
  statA.value = newValue[0];
  statB.value = newValue[1];
  statC.value = newValue[2];
}, { immediate: true })

function updatePlayers() {
    statsStore.setPlayerA(playerA.value)
    statsStore.setPlayerB(playerB.value)
}

function updateStatistics() {
    statsStore.setSelectedStats([ statA.value, statB.value, statC.value ])
}

async function importSheet(rawUrl: string, cols: number): Promise<Record<string, string>[] | undefined> {
    if (rawUrl === '') return undefined

    const downloadUrl = rawUrl.replace('/edit', '/export').replace(/#.*$/, '') + '&format=csv'
    console.log(downloadUrl)

    const contents = await fetch(downloadUrl, { method: "GET" })
        .then((res) => res.text())

    const rows = contents.split('\n')
        .map((line) => line.split(','))
        .filter((cells) => !!cells[1])
        .map((cells) => cells.slice(0, cols))

    const header = rows.shift()!

    const data = rows.map((row) => {
        const obj: any = {}
        for (let i = 0; i < header.length; i++)
            if (header[i] !== '')
                obj[header[i]] = row[i]
        return obj
    })

    return data
}

async function importData() {
    const [database, players] = await Promise.all([
        importSheet(databaseUrl.value, 7),
        importSheet(playersUrl.value, 22),
    ]);

    console.log(database, players)

    if (database) statsStore.setStatsDatabase(database)
    if (players) statsStore.setStatsData(players)
}
</script>
