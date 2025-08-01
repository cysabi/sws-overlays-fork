<template>
    <ipl-space class="m-b-8">
        <input id="jpm" type="checkbox" v-model="jpMode" @change="updateJP" />
        <label for="jpm">Japanese Mode</label>
    </ipl-space>
    <ipl-space class="m-b-8">
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
    <ipl-space class="m-b-8">
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

        <select class="dropdown" v-model="playerA">
            <option disabled value="">Team A: {{ dataStore.activeRound.teamA.name }}</option>
            <option v-for="[team, val] in teamA" :key="team" :value="val">{{ team }}</option>
            <option disabled value="">Team B: {{ dataStore.activeRound.teamB.name }}</option>
            <option v-for="[team, val] in teamB" :key="team" :value="val">{{ team }}</option>
        </select>

        <select class="dropdown" v-model="playerB">
            <option disabled value="">Team A: {{ dataStore.activeRound.teamA.name }}</option>
            <option v-for="[team, val] in teamA" :key="team" :value="val">{{ team }}</option>
            <option disabled value="">Team B: {{ dataStore.activeRound.teamB.name }}</option>
            <option v-for="[team, val] in teamB" :key="team" :value="val">{{ team }}</option>
        </select>

        <ipl-button
            label="Update"
            class="m-t-8"
            @click="updatePlayers"
        />
    </ipl-space>
    <ipl-space class="m-b-8">
        <div class="title">Stats Select</div>

        <select class="dropdown" v-model="statA">
            <option disabled value="">Please select one</option>
            <option v-for="stat in availableStats" :key="stat" :value="stat">{{ stat }}</option>
        </select>
        <select class="dropdown" v-model="statB">
            <option disabled value="">Please select one</option>
            <option v-for="stat in availableStats" :key="stat" :value="stat">{{ stat }}</option>
        </select>
        <select class="dropdown" v-model="statC">
            <option disabled value="">Please select one</option>
            <option v-for="stat in availableStats" :key="stat" :value="stat">{{ stat }}</option>
        </select>

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
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { computed, ref, watch } from 'vue';

const statsStore = useStatsStore();
const dataStore = useActiveRoundStore();

const databaseUrl = ref('');
const playersUrl = ref('');

const playerA = ref('');
const playerB = ref('');
const jpMode = ref(false);

watch(() => statsStore.statsPlayerA, newValue => { playerA.value = newValue; }, { immediate: true })
watch(() => statsStore.statsPlayerB, newValue => { playerB.value = newValue; }, { immediate: true })
watch(() => statsStore.statsJP, newValue => { jpMode.value = newValue; }, { immediate: true })

const statA = ref('');
const statB = ref('');
const statC = ref('');

watch(() => statsStore.statsSelected, newValue => {
  statA.value = newValue[0];
  statB.value = newValue[1];
  statC.value = newValue[2];
}, { immediate: true })

const NOT_STATS = [
    'Team', 'Player', 'Country', 'X Power', 'Weapons',
    'Build Link', 'XP', 'Role', 'Region', 'Flag', 'Team ID',
    'Alt Name', 'JP'
]

const availableStats = computed(
    () => Object.keys((statsStore.statsData ?? [])[0] ?? {}).filter(k => !NOT_STATS.includes(k))
)

const teamA = computed(
    () => (statsStore.statsData ?? [])
        .filter(k => k['Team ID'] === dataStore.activeRound.teamA.id)
        .map(k => jpMode.value ? [k.JP, k.Player] : [k.Player, k.Player])
)

const teamB = computed(
    () => (statsStore.statsData ?? [])
        .filter(k => k['Team ID'] === dataStore.activeRound.teamB.id)
        .map(k => jpMode.value ? [k.JP, k.Player] : [k.Player, k.Player])
)

function updatePlayers() {
    statsStore.setPlayerA(playerA.value)
    statsStore.setPlayerB(playerB.value)
}

function updateJP() {
    statsStore.setJP(jpMode.value)
    console.log('jp set')
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
        importSheet(playersUrl.value, 26),
    ]);

    console.log(database, players)

    if (database) statsStore.setStatsDatabase(database)
    if (players) statsStore.setStatsData(players)
}
</script>

<style scoped lang="scss">
.dropdown {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-bottom: 10px;
    width: 100%;
}
</style>
