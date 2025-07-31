import { defineStore } from "pinia";
import { createReplicantStoreInitializer } from "../helpers/StoreHelper";

const data = nodecg.Replicant<Record<string, string>[]>("statsData", {
  defaultValue: [],
});

const database = nodecg.Replicant<Record<string, string>[]>("statsDatabase", {
  defaultValue: [],
});

const playerA = nodecg.Replicant<string>("statsPlayerA", { defaultValue: "" });
const playerB = nodecg.Replicant<string>("statsPlayerB", { defaultValue: "" });

const selectedStats = nodecg.Replicant<[string, string, string]>(
  "statsSelected",
  { defaultValue: ["KA Avg", "Kill Avg", "Assist Avg"] },
);

interface StatsStore {
  statsData: Record<string, string>[];
  statsDatabase: Record<string, string>[];
  statsPlayerA: string;
  statsPlayerB: string;
  statsSelected: [string, string, string];
}

export const useStatsStore = defineStore("statistics", {
  state: (): StatsStore => ({
    statsData: [] as Record<string, string>[],
    statsDatabase: [] as Record<string, string>[],
    statsPlayerA: "",
    statsPlayerB: "",
    statsSelected: [] as unknown as [string, string, string],
  }),
  actions: {
    setStatsData(newValue: Record<string, string>[]) {
      data.value = newValue;
    },
    setStatsDatabase(newValue: Record<string, string>[]) {
      database.value = newValue;
    },
    setPlayerA(newValue: string) {
      console.log("!", newValue);
      playerA.value = newValue;
    },
    setPlayerB(newValue: string) {
      playerB.value = newValue;
    },
    setSelectedStats(newValue: [string, string, string]) {
      selectedStats.value = newValue;
    },
  },
});

export const initStatsStore = createReplicantStoreInitializer(
  [data, database, playerA, playerB, selectedStats],
  useStatsStore,
);
